import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

type World = {
  available: boolean;
};

const worlds: { [key: string]: World } = {
  medium: {
    available: false,
  },
};

export const worldsRouter = createTRPCRouter({
  info: publicProcedure.input(z.string()).query((ctx) => {
    const name = ctx.input;
    return worlds[name] || null;
  }),
});
