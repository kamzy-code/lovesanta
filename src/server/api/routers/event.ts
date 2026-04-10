import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

export const eventRouter = createTRPCRouter({
  //PUBLIC PROCEDURES
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(3, "Invalid URL"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { slug: input.slug },
        include: {
          creator: { select: { firstName: true, username: true, image: true } },
          participants: {
            include: {
              user: {
                select: { firstName: true, username: true, image: true },
              },
            },
          },
          activities: true,
        },
      });
      return event;
    }),

  //PRIVATE PROCEDURES
  //get event by id
  getById: protectedProcedure
    .input(
      z.object({
        eventId: z.string().min(3, "Invalid ID"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
        include: {
          creator: { select: { firstName: true, username: true, image: true } },
        },
      });
      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }
      return event;
    }),

  // create a new event
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().optional(),
        date: z.date(),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const slugBase = input.title.toLowerCase().replace(/ /g, "-");
      const slug = `${slugBase}-${nanoid(4)}`;
      const event = await ctx.db.event.create({
        data: {
          ...input,
          creatorId: ctx.session.user.id,
          slug,
        },
      });
      return event;
    }),

  // Delete an event
  deleteEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }

      if (event.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete events you created.",
        });
      }

      // Get all participant IDs for this event
      const participants = await ctx.db.participant.findMany({
        where: { eventId: input.eventId },
        select: { id: true },
      });

      const participantIds = participants.map((p) => p.id);

      // Delete all matches where any participant is the giver
      if (participantIds.length > 0) {
        await ctx.db.match.deleteMany({
          where: {
            OR: [
              { giverId: { in: participantIds } },
              { receiverId: { in: participantIds } },
            ],
          },
        });
      }

      // Delete all activities for this event
      await ctx.db.activity.deleteMany({
        where: { eventId: input.eventId },
      });

      // Delete all participants
      await ctx.db.participant.deleteMany({
        where: { eventId: input.eventId },
      });

      // Finally delete the event
      await ctx.db.event.delete({
        where: { id: input.eventId },
      });

      return { success: true };
    }),

  // Join an event
  joinEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const participant = await ctx.db.participant.create({
          data: {
            eventId: input.eventId,
            userId: ctx.session.user.id,
          },
        });
        return participant;
      } catch (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already joined this event.",
        });
      }
    }),

  // Leave an event
  leaveEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First, find the participant to get their ID
      const participant = await ctx.db.participant.findFirst({
        where: {
          eventId: input.eventId,
          userId: ctx.session.user.id,
        },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not a participant in this event.",
        });
      }

      // Delete all matches where this participant is the giver
      await ctx.db.match.deleteMany({
        where: {
          OR: [{ giverId: participant.id }, { receiverId: participant.id }],
        },
      });

      // Now delete the participant
      const result = await ctx.db.participant.delete({
        where: {
          id: participant.id,
        },
      });

      return result;
    }),

  // edit an event
  editEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z.date().optional(),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.eventId },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found.",
        });
      }

      if (event.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only edit events you created.",
        });
      }

      const updatedEvent = await ctx.db.event.update({
        where: { id: input.eventId },
        data: {
          title: input.title,
          description: input.description,
          date: input.date,
          location: input.location,
        },
      });

      return updatedEvent;
    }),

  // Fetch all events a user belongs to
  fetchAlEvents: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const events = await ctx.db.event.findMany({
      where: {
        OR: [
          { creatorId: id }, // Events I created
          { participants: { some: { userId: id } } }, // Events I joined
        ],
      },
      include: {
        participants: true,
        creator: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return events;
  }),

  //
});
