import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const meRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (!user) return null;
    return {
      id: ctx.session.user.id,
      nickname: user.nickname || ctx.session.user.name,
    };
  }),
  lastplayed: protectedProcedure.query(async ({ ctx }) => {
    if (env.NODE_ENV != "production")
      return {
        server: "Medium",
        started: new Date(1679923977),
        stopped: new Date(1679924102),
      };
    return null;
  }),
});
