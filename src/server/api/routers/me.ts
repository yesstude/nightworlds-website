import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const meRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    let user = await prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        avatarCharacter: true,
      },
    });
    if (!user) return null;
    if (!user.avatarCharacter) {
      const lastCharacter = await prisma.character.findFirst({
        where: {
          ownerId: ctx.session.user.id,
          headImage: {
            not: null,
          },
        },
        take: 1,
      });
      if (lastCharacter)
        user = await prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            avatarCharacterId: lastCharacter.id,
          },
          include: {
            avatarCharacter: true,
          },
        });
    }
    let avatar = user.avatarCharacter?.headImage;
    if (!avatar) avatar = `https://minotar.net/helm/${user.nickname}/128.png`;
    return {
      id: ctx.session.user.id,
      nickname: user.nickname || ctx.session.user.name,
      avatar,
    };
  }),
  balance: protectedProcedure.query(async ({ ctx }) => {
    if (env.NODE_ENV != "development") return null;

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return {
      galaxyshards: user!.galaxyShards,
    };
  }),
  lastplayed: protectedProcedure.query(async ({ ctx }) => {
    if (env.NODE_ENV != "production")
      return {
        server: "Medium",
        started: new Date(1679923977),
        stopped: null, //new Date(1679924102),
      };
    return null;
  }),
  friendsOnline: protectedProcedure.query(async ({ ctx }) => {
    if (env.NODE_ENV != "development") return null;

    return [
      {
        avatar: "https://minotar.net/helm/Im_God_Boy228/32.png",
        nickname: "Im_God_Boy228",
        server: "MiniRuSCh",
      },
      {
        avatar: "https://minotar.net/helm/CooLMan458/32.png",
        nickname: "CooLMan458",
        server: "Medium",
      },
      {
        avatar: "https://minotar.net/helm/Rimrunner/32.png",
        nickname: "Rimrunner",
        server: "Hardcore",
      },
      {
        avatar: "https://minotar.net/helm/Oscidium/32.png",
        nickname: "Oscidium",
        server: "MiniRuSCh",
      },
    ];
  }),
});
