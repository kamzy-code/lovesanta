import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { unstable_cache } from "next/cache";
import {
  ActivityType,
  type ActivityStatus,
  type PrismaClient,
} from "@prisma/client";
import { giftingSettingsSchema } from "~/lib/common/gifting";

/**
 * @function getActivityAsCreator
 * Loads an activity and verifies the current user created its event
 */
async function getActivityAsCreator(
  db: PrismaClient,
  activityId: string,
  userId: string,
) {
  const activity = await db.activity.findUnique({
    where: { id: activityId },
    include: { event: true },
  });

  if (!activity) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Activity not found",
    });
  }

  if (activity.event.creatorId !== userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't have permission to complete this action.",
    });
  }

  return activity;
}

/**
 * @function setActivityStatus
 * Moves an activity between statuses, only from the allowed `from` states
 */
async function setActivityStatus(
  db: PrismaClient,
  activityId: string,
  userId: string,
  from: ActivityStatus[],
  to: ActivityStatus,
) {
  const activity = await getActivityAsCreator(db, activityId, userId);

  if (!from.includes(activity.status)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Activity is ${activity.status.toLowerCase()}, so it can't be moved to ${to.toLowerCase()}.`,
    });
  }

  return db.activity.update({
    where: { id: activityId },
    data: { status: to },
  });
}

export const activityRouter = createTRPCRouter({
  //PUBLIC PROCEDURES

  //PRIVATE PROCEDURES
  //get event activities
  getEventActivities: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(`fetching atcivities for ${input.eventId}`);
      return await ctx.db.activity.findMany({
        where: {
          eventId: input.eventId,
        },
      });
    }),

  // get activity by ID
  getActivityById: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.findUnique({
        where: { id: input.activityId },
        include: {
          event: {include: {
            participants: true
          }},
        },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      // Get current logged-in user's participant ID for this event
      const currentUserParticipant = await ctx.db.participant.findFirst({
        where: {
          eventId: activity.eventId,
          userId: ctx.session.user.id,
        },
      });

      const matchedCount = await ctx.db.match.count({
        where: { activityId: activity.id },
      });

      return {
        ...activity,
        currentUserParticipantId: currentUserParticipant?.id || null,
        unmatchedCount: Math.max(
          0,
          activity.event.participants.length - matchedCount,
        ),
      };
    }),

  // add a new activity to an event
  addActivity: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        type: z.nativeEnum(ActivityType),
        settings: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (event?.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can add activities to an event.",
        });
      }

      if (input.type === "GIFTING") {
        const settings = giftingSettingsSchema.safeParse(input.settings);
        if (!settings.success) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: settings.error.issues[0]?.message ?? "Invalid budget",
            cause: settings.error,
          });
        }
        return await ctx.db.activity.create({
          data: { ...input, settings: settings.data },
        });
      }

      return await ctx.db.activity.create({ data: input });
    }),

  // update the gifting budget
  updateGiftingSettings: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        settings: giftingSettingsSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await getActivityAsCreator(
        ctx.db,
        input.activityId,
        ctx.session.user.id,
      );

      const current =
        activity.settings && typeof activity.settings === "object"
          ? (activity.settings as Record<string, unknown>)
          : {};

      return await ctx.db.activity.update({
        where: { id: input.activityId },
        data: { settings: { ...current, ...input.settings } },
      });
    }),

  // start an activity
  startActivity: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.findUnique({
        where: { id: input.activityId },
        include: { event: { include: { participants: true } } },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      const event = await ctx.db.event.findUnique({
        where: { id: activity?.eventId },
        include: { participants: true },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      if (activity?.event.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to complete this action.",
        });
      }

      if (activity.type === "GIFTING") {
        if (event.participants.length < 3) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "At least 3 participants are required to start the gifting activity.",
          });
        }
      }

      return await ctx.db.activity.update({
        where: { id: input.activityId },
        data: { status: "ACTIVE" },
      });
    }),

  // pause pairing; people can still join and edit wishlists
  pauseActivity: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return setActivityStatus(
        ctx.db,
        input.activityId,
        ctx.session.user.id,
        ["ACTIVE"],
        "PAUSED",
      );
    }),

  // resume a paused activity
  resumeActivity: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return setActivityStatus(
        ctx.db,
        input.activityId,
        ctx.session.user.id,
        ["PAUSED"],
        "ACTIVE",
      );
    }),

  // end activity
  endActivity: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.findUnique({
        where: { id: input.activityId },
        include: { event: { include: { participants: true } } },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      if (activity?.event.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to complete this action.",
        });
      }

      return await ctx.db.activity.update({
        where: { id: input.activityId },
        data: { status: "COMPLETED" },
      });
    }),

  // delete an activity
  deleteActivity: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.activity.findUnique({
        where: { id: input.activityId },
        include: { event: { include: { participants: true } } },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      if (activity?.event.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to complete this action.",
        });
      }

      return await ctx.db.activity.delete({
        where: { id: input.activityId },
      });
    }),
});
