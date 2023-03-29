import sharp from "sharp";
import { z } from "zod";
import Skin from "../../skins/Skin";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const skinRouter = createTRPCRouter({
    generate: publicProcedure
        .input(z.object({
            skin: z.string(),
            clothes: z.array(z.string())
        }))
        .query(async ({input}) => {
            let skin = new Skin(input.skin);
            for (let i = 0; i < input.clothes.length; i++) {
                const clothUrl = input.clothes[i] as string;
                skin.wear({
                    getBuffer() {
                        return sharp(clothUrl).toBuffer({resolveWithObject: false});
                    }
                });
            }
            return await skin.getDataUrl();
        })
});
