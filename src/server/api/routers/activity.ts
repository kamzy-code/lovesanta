import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { unstable_cache } from "next/cache";
import { ActivityType } from "@prisma/client";

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

      return {
        ...activity,
        currentUserParticipantId: currentUserParticipant?.id || null,
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

      return await ctx.db.activity.create({ data: input });
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

      if (activity?.event.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to complete this action.",
        });
      }

      return await ctx.db.activity.update({
        where: { id: input.activityId },
        data: { status: "ACTIVE" },
      });
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
