import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { setPasswordSchema } from "~/schemas";

export const userRouter = createTRPCRouter({
  // how the current user can sign in
  getSignInMethods: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        email: true,
        password: true,
        accounts: { select: { provider: true } },
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return {
      email: user.email,
      hasPassword: !!user.password,
      providers: user.accounts.map((a) => a.provider),
    };
  }),

  // add a password (OAuth-only accounts) or change an existing one
  setPassword: protectedProcedure
    .input(setPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { id: true, password: true, emailVerified: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (user.password) {
        const isCurrentValid =
          !!input.currentPassword &&
          (await bcrypt.compare(input.currentPassword, user.password));

        if (!isCurrentValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Your current password is incorrect.",
          });
        }
      }

      await ctx.db.user.update({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash(input.password, 10),
          // OAuth sign-in already proved ownership of the email, so the
          // credentials login's verification check shouldn't block them
          emailVerified: user.emailVerified ?? new Date(),
        },
      });

      return { success: true, hadPassword: !!user.password };
    }),
});
