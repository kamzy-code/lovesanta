import { type Event } from "@prisma/client";

export type EventWithCount = Event & {
  participantCount: number;
};

export const events: EventWithCount[] = [
  {
    id: "xhcd9j2v",
    title: "Secret Santa 2023",
    status: "ENDED",
    date: new Date("2023-12-02T00:00:00.000Z"),
    description: "Our annual Secret Santa event",
    location: "Virtual",
    participantCount: 22,
    slug: "secret-santa-2023-ab12",
    creatorId: "user_12345",
    createdAt: new Date("2023-11-01T10:00:00.000Z"),
    updatedAt: new Date("2023-11-15T12:00:00.000Z"),
  },
  {
    id: "xhcd9j6v",
    title: "Secret Santa 2024",
    status: "ENDED",
    date: new Date("2024-12-02T00:00:00.000Z"),
    description: "Our annual Secret Santa event",
    location: "Virtual",
    participantCount: 30,
    slug: "secret-santa-2024-cd34",
    creatorId: "user_12345",
    createdAt: new Date("2024-11-01T10:00:00.000Z"),
    updatedAt: new Date("2024-11-15T12:00:00.000Z"),
  },
];
