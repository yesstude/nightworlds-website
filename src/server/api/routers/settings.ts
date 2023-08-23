import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { SHA256 } from "crypto-js";

export const settingsRouter = createTRPCRouter({
  changeIngamePassword: protectedProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.password.length < 8) return false;
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          passwordHash: SHA256(input.password).toString(),
        },
      });

      if (user) return true;
      return false;
    }),
});
