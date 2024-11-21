import { type Config } from "drizzle-kit";

import { env } from "./src/env/server.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["nw_*"],
} satisfies Config;
