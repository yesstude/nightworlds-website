import { meRouter } from "./routers/me";
import { setupRouter } from "./routers/setup";
import { skinRouter } from "./routers/skin";
import { subscriptionRouter } from "./routers/subscription";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  subscription: subscriptionRouter,
  skin: skinRouter,
  me: meRouter,
  setup: setupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
