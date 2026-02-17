import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { matchParticipant, rematchParticipant } from "~/server/methods";
import { TRPCError } from "@trpc/server";

export const giftingRouter = createTRPCRouter({
  // Get participant's wishlist
  getParticipant: protectedProcedure
    .input(
      z.object({
        participantId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
        console.log(`Fetching wishlist for participant ${input.participantId}`);
      const participant = await ctx.db.participant.findUnique({
        where: { id: input.participantId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Participant not found",
        });
      }

      return participant;
    }),

  // Update participant's wishlist
  updateParticipantWishlist: protectedProcedure
    .input(
      z.object({
        participantId: z.string(),
        eventId: z.string(),
        wishlist: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const participant = await ctx.db.participant.findUnique({
        where: { id: input.participantId },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Participant not found",
        });
      }

      // Verify the user owns this participant record
      if (participant.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only update your own wishlist",
        });
      }

      const updated = await ctx.db.participant.update({
        where: { id: input.participantId },
        data: {
          wishlist: input.wishlist,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return updated;
    }),

  // Get current match for a participant
  getCurrentMatch: protectedProcedure
    .input(
      z.object({
        participantId: z.string(),
        activityId: z.string(),
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const match = await ctx.db.match.findFirst({
        where: {
          activityId: input.activityId,
          giverId: input.participantId,
        },
        include: {
          receiver: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  username: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      // Get match history to calculate attempts remaining
      const participant = await ctx.db.participant.findUnique({
        where: { id: input.participantId },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Participant not found",
        });
      }

      const matchHistoryCount = await ctx.db.matchHistory.count({
        where: {
          eventId: input.eventId,
          giverUserId: participant.userId,
        },
      });

      const attemptsRemaining = Math.max(0, 3 - matchHistoryCount);

      return {
        match,
        attemptsRemaining,
        attemptsUsed: matchHistoryCount,
      };
    }),

  // Generate a new match for participant
  generateMatch: protectedProcedure
    .input(
      z.object({
        participantId: z.string(),
        activityId: z.string(),
        eventId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const participant = await ctx.db.participant.findUnique({
        where: { id: input.participantId },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Participant not found",
        });
      }

      // Verify the user owns this participant record
      if (participant.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only generate matches for yourself",
        });
      }

      // Check if participant already has a match
      const existingMatch = await ctx.db.match.findFirst({
        where: {
          activityId: input.activityId,
          giverId: input.participantId,
        },
      });

      // If they have an existing match, use rematch instead
      if (existingMatch) {
        return await rematchParticipant({
          db: ctx.db,
          eventId: input.eventId,
          participant,
        });
      }

      // Otherwise create a new match
      return await matchParticipant({
        db: ctx.db,
        eventId: input.eventId,
        participant,
      });
    }),

  // Get match history
  getMatchHistory: protectedProcedure
    .input(
      z.object({
        participantId: z.string(),
        eventId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const participant = await ctx.db.participant.findUnique({
        where: { id: input.participantId },
      });

      if (!participant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Participant not found",
        });
      }

      const history = await ctx.db.matchHistory.findMany({
        where: {
          eventId: input.eventId,
          giverUserId: participant.userId,
        },
        include: {
          receiver: {
            select: {
              id: true,
              firstName: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          matchedAt: "desc",
        },
      });

      return history;
    }),
});
