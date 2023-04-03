import sharp from "sharp";
import axios from "axios";
import { z } from "zod";
import Skin from "../../skins/Skin";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const skinRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        skin: z.string(),
        clothes: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      let skin = new Skin(
        (await axios({ url: input.skin, responseType: "arraybuffer" }))
          .data as Buffer
      );
      for (let i = 0; i < input.clothes.length; i++) {
        const clothUrl = input.clothes[i] as string;
        skin.wear({
          async getBuffer() {
            return (await axios({ url: clothUrl, responseType: "arraybuffer" }))
              .data as Buffer;
          },
        });
      }
      return await skin.getDataUrl();
    }),
  preview: publicProcedure.query(async () => {
    let skin = await Skin.fromUrl(
      "https://storage.yandexcloud.net/nightworlds-media/skinlike/1680306707330/6c4a66ad9de199c9.png"
    );
    return await skin.getProfilePicture(256);
  }),
});
