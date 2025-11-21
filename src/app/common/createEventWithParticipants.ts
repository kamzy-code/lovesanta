"server-only";
import { type User, type Event,} from "@prisma/client";
import { db } from "~/server/db";

interface EventPayload {
  eventId: string;
  userId: string;
  wishlist: string | null;
  region: string;
  budget: number;
  hasJoined: boolean;
}

export async function CreateEventAndEnrollParticipans(data: {
  event: {
    name: string;
    year: number;
    description: string;
    status?: "ACTIVE" | "ENDED" | "UPCOMING";
  };
  usersList: Pick<User, "name" | "username" | "passcode" | "region" | "bio">[];
}) {
  const { name, description, year, status } = data.event;

  const createdUsers = await createUsers(data.usersList);
  const createdEvent = await createEvent({
    name,
    description,
    year,
    status: status!,
  });
  const eventCreatePayload: EventPayload[] = await createEventPayload(
    createdEvent.id,
    createdUsers,
  );
  const enrolledParticipants = await enrollUsers(eventCreatePayload);

  return {
    createdUsers,
    eventCreatePayload,
    enrolledParticipants,
  };
}

async function createUsers(
  users: Pick<User, "name" | "username" | "passcode" | "region" | "bio">[],
) {
  return await db.user.createManyAndReturn({
    data: users.map((user) => ({
      ...user,
      username: user.username?.toLowerCase(),
    })),
    // Optional: skips records that conflict with unique constraints
    skipDuplicates: true,
  });
}

async function createEvent({
  name,
  year,
  description,
  status = "ACTIVE",
}: Pick<Event, "name" | "year" | "description" | "status">) {
  return await db.event.create({
    data: {
      name,
      year,
      description,
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      status,
    },
  });
}

async function createEventPayload(eventId: string, createdUsers: User[]) {
  return createdUsers.map((user) => ({
    eventId,
    userId: user.id,
    wishlist: user.bio,
    region: user.region,
    budget: 100,
    hasJoined: true,
  }));
}

async function enrollUsers(eventCreatePayload: EventPayload[]) {
  return await db.participant.createMany({
    data: eventCreatePayload,
    skipDuplicates: true,
  });
}
