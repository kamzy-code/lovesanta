import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./config";
import { db } from "../db";
import { encode } from "next-auth/jwt";
import { nanoid } from "nanoid";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "~/schemas";
import { getUserByEmail, getUserById } from "~/lib/db/users";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(db);

// Override the createUser method to handle name -> firstName/lastName mapping
const customAdapter = {
  ...adapter,
  createUser: async (data: any) => {
    // Split name into firstName and lastName if present
    const { name, ...rest } = data;
    if (name) {
      const nameParts = name.split(" ");
      return adapter.createUser!({
        ...rest,
        lastName: nameParts[0],
        firstName: nameParts.slice(1).join(" ") || undefined,
      });
    }
    return adapter.createUser!(rest);
  },
};

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  providers: [
    ...authConfig.providers,
    Credentials({
      id: "credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@mail.com",
        },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          try {
            const { email, password, rememberMe } = validatedFields.data;

            const user = await getUserByEmail(email, true);
            if (!user?.password) return null;

            const isPasswordValid = await bcrypt.compare(
              password,
              user.password,
            );
            if (isPasswordValid) return user;

            return null;
          } catch (error) {
            throw new Error("Error during Authentication");
          }
        }

        return null;
      },
    }),
  ],
  adapter: customAdapter,
  session: { strategy: "jwt" },
  events: {
    /**
     * @note
     * This event is redundant, as the session is already deleted when the user signs out.
     * thanks to the Prisma adapter. However, it's been kept here for reference purposes
     * and learning.
     *
     */
    async signOut(message) {
      console.log({ message, from: "[signOut event]" });

      if ("session" in message && message.session?.sessionToken) {
        await db.session.deleteMany({
          where: {
            sessionToken: message.session?.sessionToken,
          },
        });
      }
    },

    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },

  // debug: env.NODE_ENV === "development",

  // jwt: {
  //   maxAge: 1 * 24 * 60 * 60,
  //   async encode(arg) {
  //     return (arg.token?.sessionId as string) ?? encode(arg);
  //   },
  // },

  callbacks: {
    /**
     *
     * @jwt callback
     * invoked when a user signs in or signs up, we can add a session token to the JWT payload.
     * This session token is used to identify the user's session when they make requests to the server.
     *
     * We also use the prisma adapter to persist the session to the database.
     * See @event for the signOut cleanup method.
     * @
     */

    async jwt({ token, user, account }) {
      console.log({ token, user, account, from: "[jwt callback]" });

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },

    /**
     *
     * This callback is invoked everything our app frontend makes a request for the server
     * to retrieve a user session, we simply return back the user and their session token.
     * @returns User & Session
     */
    async session({ token, session, user }) {
      console.log({ session, token, user, from: "[session callback]" });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // prevent signin without email verification
      if (!existingUser?.emailVerified) return false;

      //TODO: Add 2FA Check

      return true;
    },
  },
});

// const auth = cache(uncachedAuth);

export { uncachedAuth as auth, handlers, signIn, signOut };
