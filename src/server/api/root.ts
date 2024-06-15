import { charactersRouter } from "./routers/characters";
import { meRouter } from "./routers/me";
import { newsRouter } from "./routers/news";
import { settingsRouter } from "./routers/settings";
import { setupRouter } from "./routers/setup";
import { skinRouter } from "./routers/skin";
import { subscriptionRouter } from "./routers/subscription";
import { worldsRouter } from "./routers/worlds";
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
  settings: settingsRouter,
  worlds: worldsRouter,
  characters: charactersRouter,
  setup: setupRouter,
  news: newsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
