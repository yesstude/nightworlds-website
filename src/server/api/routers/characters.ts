import { Character } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";
import Skin from "../../skins/Skin";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { uploadFile } from "../../utils/uploadFile";

const PAGE_LENGTH = 20;

export const charactersRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    const res = await prisma.character.count({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
    return {
      characters: res,
      pages: Math.ceil(res / PAGE_LENGTH),
    };
  }),
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const result: any = await prisma.character.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
        take: PAGE_LENGTH,
        skip: PAGE_LENGTH * input.page,
      });
      const list = result.map((c: Character) => {
        if (!c.headImage)
          (async () => {
            const skin = await Skin.fromUrl(c.skin);
            const headImage = await uploadFile(
              "previews",
              await skin.getHeadPicture(256),
              "avatar.png"
            );
            await prisma.character.update({
              where: {
                id: c.id,
              },
              data: {
                headImage,
              },
            });
          })();
        return {
          id: c.id,
          displayname: c.displayname,
          previewImage: c.previewImage,
        };
      });
      return list;
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const character = await prisma.character.findUnique({
      where: {
        id: input,
      },
      include: {
        whoSetAvatar: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    if (!character || character?.ownerId != ctx.session.user.id) return null;
    const { id, displayname, skin } = character;
    return {
      id,
      displayname,
      whoSetAvatar: character.whoSetAvatar,
      isYourAvatar: character.whoSetAvatar.map((u) => u.id).includes(userId),
      skin,
    };
  }),
  setAvatar: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const character = await prisma.character.findUnique({
        where: {
          id: input,
        },
      });
      if (!character || character?.ownerId != ctx.session.user.id) return false;
      if (character.headImage) {
        const skin = await Skin.fromUrl(character.skin);
        const headImage = await uploadFile(
          "previews",
          await skin.getHeadPicture(256),
          "avatar.png"
        );
        await prisma.character.update({
          where: {
            id: character.id,
          },
          data: {
            headImage,
          },
        });
      }
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarCharacterId: character.id,
        },
      });
      if (user) return true;
      return false;
    }),
});
