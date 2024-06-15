"use server";

import { env } from "../../env/server.mjs";

export async function getLastPlayed() {
  if (env.NODE_ENV != "production")
    return {
      server: "Medium",
      started: new Date(1679923977),
      stopped: null, //new Date(1679924102),
    };
  return null;
}
