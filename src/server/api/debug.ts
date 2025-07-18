"use server";

import { env } from "~/env/server.mjs";

export async function isDevelopment() {
  return env.NODE_ENV != "production";
}
