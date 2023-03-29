import { SHA256 } from "crypto-js";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const setupRouter = createTRPCRouter({
  discordLinked: protectedProcedure.query(async ({ ctx }) => {
    const discord = await prisma.account.findFirst({
      where: {
        userId: ctx.session.user.id,
        provider: "discord",
      },
    });

    if (discord) return true;
    return false;
  }),
  nicknameAvailable: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          nickname: input,
        },
      });
      if (!user) return true;
      return false;
    }),
  setNickname: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      const taken = await prisma.user.findFirst({
        where: {
          nickname: input,
          id: {
            not: ctx.session.user.id,
          },
        },
      });
      if (taken || !user) return false;
      if (!input.match(/^[A-Za-z_\d]*$/)) return false;
      if (!(input.length >= 3 && input.length <= 16)) return false;

      const newuser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          nickname: input,
          name: input,
        },
      });

      if (newuser) return true;
      return false;
    }),
  setPassword: protectedProcedure
    .input(z.string().min(8))
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user || user.passwordHash) return false;

      const newuser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash: SHA256(input).toString(),
        },
      });

      if (newuser) return true;
      return false;
    }),
});
