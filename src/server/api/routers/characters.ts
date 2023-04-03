import { Character } from "@prisma/client";
import { S3 } from "aws-sdk";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../db";
import Skin from "../../skins/Skin";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
      const list = result.map(
        ({ id, displayname, previewImage }: Character) => {
          return {
            id,
            displayname,
            previewImage,
          };
        }
      );
      return list;
    }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const character = await prisma.character.findUnique({
      where: {
        id: input,
      },
    });
    if (character?.ownerId != ctx.session.user.id) return null;
    const { id, displayname, skin } = character;
    return {
      id,
      displayname,
      skin,
    };
  }),
  create: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user || user.email != "ruslan.gulid@gmail.com") return false;

      const targetUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!targetUser) return false;

      const s3 = new S3({
        apiVersion: "2006-03-01",
        endpoint: "https://storage.yandexcloud.net",
      });

      const Key = `temp/${Date.now()}/${Date.now()}.png`;
      const fileurl = `${s3.endpoint.href}${env.BUCKET_NAME}/${Key}`;

      const skin = await Skin.fromUrl(input.url);

      const preview = await fetch(await skin.getProfilePicture(256));

      const req = s3.putObject({
        Bucket: env.BUCKET_NAME,
        Key,
        Body: Buffer.from(await preview.arrayBuffer()),
      });
      const res = await req.promise();

      await prisma.character.create({
        data: {
          ownerId: targetUser.id,
          displayname: input.name,
          skin: input.url,
          previewImage: fileurl,
        },
      });
      return true;
    }),
});
