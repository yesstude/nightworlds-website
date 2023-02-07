import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email(),
      nickname: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      try {
        await ctx.prisma.emailsub.delete({ where: { email: input.email } });
      } catch (error) { }
      await ctx.prisma.emailsub.create({
        data: {
          email: input.email,
          nickname: input.nickname,
        }
      });
      return true;
    })
});
