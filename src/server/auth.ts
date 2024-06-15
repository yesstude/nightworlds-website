import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  User,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { env } from "../env/server.mjs";
import crypto from "crypto-js";
import Prisma from "@prisma/client";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth/core/types" {
  interface User extends Prisma.User {
    id: string;
    regState: "start" | "finished";
    // ...other properties
    // role: UserRole;
  }
  interface Session extends DefaultSession {
    user: User;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 604800,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (
        ![
          "nouskopdanila@gmail.com",
          "painkille53@gmail.com",
          "sasaplotnikov2008@gmail.com",
          "plotnikovartem2005@mail.ru",
          "moyaozvucka@gmail.com",
          "themineboy99@gmail.com",
          "fictivgund@gmail.com",
          "ruslan.gulid@gmail.com",
        ].includes((token as any).email.toLowerCase())
      )
        throw new Error();

      session.user.id = token.id as string;

      const dbuser = await prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
      });
      if (!dbuser) return session;

      if (dbuser.passwordHash) session.user.regState = "finished";

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_ID,
      clientSecret: env.DISCORD_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds.join",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "",
          placeholder: "Nickname",
          type: "text",
        },
        password: {
          label: "",
          placeholder: "Password",
          type: "password",
        },
      },
      async authorize(c, req) {
        const user = await prisma.user.findUnique({
          where: {
            nickname: c!.username,
          },
        });
        if (!user) return null;
        const passwordHash = crypto.SHA256(c!.password).toString();
        if (!user.passwordHash!.match(passwordHash)) return null;
        return user as User;
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
