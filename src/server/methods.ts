import { type Participant, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getRandomNode } from "~/lib/common/helpers";

interface MatchParticipantOptions {
  db: PrismaClient;
  eventId: string;
  participant: Participant;
}

/**
 *
 * @function matchParticipant
 *
 *
 * @description
 * This function matches a participant with another participant in an event
 * factors like region, wishlist, and budget are considered when matching
 *
 */
export async function matchParticipant({
  db,
  eventId,
  participant,
}: MatchParticipantOptions) {
  try {
    // Get the gifting activity for this event
    const giftingActivity = await db.activity.findFirst({
      where: {
        eventId,
        type: "GIFTING",
      },
    });

    if (!giftingActivity) {
      throw new Error("Gifting activity not found for this event");
    }

    // Get participants who are giving to this participant (their givers)
    const myGivers = await db.match.findMany({
      where: {
        activityId: giftingActivity.id,
        receiverId: participant.id,
      },
      select: {
        giverId: true,
      },
    });

    const myGiverIds = myGivers.map((m) => m.giverId);

    // Get all participants except the giver and their givers
    const participants = await db.participant.findMany({
      where: {
        eventId,
        NOT: { id: participant.id },
      },
      include: {
        receivingFrom: {
          where: {
            activityId: giftingActivity.id,
          },
        },
      },
    });

    // Filter out participants who:
    // 1. Already have a gift giver for this activity
    // 2. Are giving to the current participant (circular gifting prevention)
    const availableReceivers = participants.filter(
      (p) => p.receivingFrom.length === 0 && !myGiverIds.includes(p.id),
    );

    if (availableReceivers.length === 0) {
      throw new Error("No available receivers");
    }

    // Randomly select a receiver
    const receiver = getRandomNode(availableReceivers) as { id: string };

    return db.match.create({
      data: {
        activityId: giftingActivity.id,
        giverId: participant.id,
        receiverId: receiver.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new TRPCError({
      code: "CONFLICT",
      message:
        error instanceof Error
          ? error.message
          : "Failed to match participant",
    });
  }
}

/**
 *
 * @function rematchParticipant
 *
 * @description
 *
 * This function allows a participant to rematch with a new participant
 *
 * @param {MatchParticipantOptions} options
 *
 * The logic is a combination of the matchParticipant effect with a couple
 * of additional steps to ensure that the participant is not matched with
 * the same person they were previously matched or any individual who
 * already has a match
 *
 * We also keep track of the number of times a participant has attempted
 * to rematch and also keep a record of the previous matches
 *
 * @returns {Promise<Match>}
 *
 * @throws {Error}
 *
 */
export async function rematchParticipant({
  db,
  eventId,
  participant,
}: MatchParticipantOptions) {
   // Get the gifting activity for this event
    const giftingActivity = await db.activity.findFirst({
      where: {
        eventId,
        type: "GIFTING",
      },
    });

    if (!giftingActivity) {
      throw new Error("Gifting activity not found for this event");
    }

  // Get match history count
  const matchAttempts = await db.matchHistory.count({
    where: {
      eventId,
      giverUserId: participant.userId,
    },
  });

  if (matchAttempts >= 3) {
    throw new Error("Maximum rematch attempts reached");
  }

  // Get previous receivers from history
  const previousMatches = await db.matchHistory.findMany({
    where: {
      eventId,
      giverUserId: participant.userId,
    },
    select: {
      receiverUserId: true,
    },
  });

  const previousReceivers = previousMatches.map((m) => m.receiverUserId);

  /**
   * @operation
   *
   * Get the current pair that our particpant
   * has been matched with
   */
  const currentMatch = await db.match.findFirst({
    where: {
      activityId: giftingActivity.id,
      giverId: participant.id,
    },
    include: {
      receiver: true,
    },
  });

  if (!currentMatch) {
    throw new Error("You can no longer perform this operation");
  }

  /**
   * @operation
   *
   * Get participants who are giving to this participant (their givers)
   */
  const myGivers = await db.match.findMany({
    where: {
      activityId: giftingActivity.id,
      receiverId: participant.id,
    },
    select: {
      giverId: true,
    },
  });

  const myGiverIds = myGivers.map((m) => m.giverId);

  /**
   * @operation
   *
   * Search for new pairs
   * We filter out participants who:
   * 1. Are the same as the giver
   * 2. Have been matched before with this giver
   * 3. Already have a gift giver for this gifting activity
   * 4. Are giving to this participant (circular gifting prevention)
   */
  const availableReceivers = await db.participant.findMany({
    where: {
      eventId,
      NOT: {
        OR: [{ id: participant.id }, { userId: { in: previousReceivers } }, { id: { in: myGiverIds } }],
      },
      receivingFrom: {
        none: {
          activityId: giftingActivity.id,
        },
      },
    },
    include: {
      user: true,
    },
  });

  if (availableReceivers.length === 0) {
    throw new Error("No available receivers for rematch");
  }

  /**
   * @operation
   *
   *
   * We create a new history record of the
   * individual who has been matched with out participant
   *
   * This is important for tracking purposes
   * !!!We also delete the current match record
   */
  if (currentMatch) {
    await db.matchHistory.create({
      data: {
        eventId,
        giverUserId: participant.userId,
        receiverUserId: currentMatch.receiver.userId,
        attemptNo: matchAttempts + 1,
        matchedAt: currentMatch.createdAt,
      },
    });

    // Delete current match
    await db.match.delete({
      where: {
        id: currentMatch.id,
      },
    });
  }

  const receiver = getRandomNode(availableReceivers)!;

  /**
   *
   * @operation
   *
   * We don't update our current match record.
   * We essentially create an entirely new entry with the updated
   *
   * records, however in the future, it might be better to simply update
   * the "receiverId" field in the current match record
   */
  return db.match.create({
    data: {
      activityId: giftingActivity.id,
      giverId: participant.id,
      receiverId: receiver.id,
    },
  });
}
