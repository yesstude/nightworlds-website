import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const newsRouter = createTRPCRouter({
  preview: publicProcedure.query(async ({ ctx }) => {
    if (env.NODE_ENV != "development") return [];

    const news = [
      {
        image: {
          src: "https://cataas.com/cat?width=600&height=400",
          width: 600,
          height: 400,
        },
        title: "NightWorld Medium is now open for everyone!",
        preview:
          "NightWorld Medium is being opening today for every player in out Discord community. This means a lot for us. Thanks for being with us all of this time!",
        author: "EcStud",
        date: new Date(1680182874000),
      },
      {
        image: {
          src: "https://cataas.com/cat?width=500&height=400",
          width: 500,
          height: 400,
        },
        title: "Early access of NightWorlds v2 is open!",
        preview:
          "If you are in the waiting list of NightWorlds v2, you already can play such in worlds as NightWorld Medium or MiniRuSCh. Hope you enjoy it!",
        author: "EcStud",
        date: new Date(1679102874000),
      },
    ];
    return news;
  }),
});
