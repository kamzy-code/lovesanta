import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { unstable_cache } from "next/cache";

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
        },
      });
      return event;
    }),

  //PRIVATE PROCEDURES
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

  // Fetch all events a user belongs to
  fetchAlEvents: protectedProcedure.query(async ({ ctx }) => {
    return unstable_cache(
      async () => {
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
      },
      [`user-events-${ctx.session.user.id}`],
      { revalidate: 60 }, // Revalidate every 60 seconds
    )();
  }),

  //
});
