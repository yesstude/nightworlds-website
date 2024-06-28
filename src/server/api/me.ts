"use server";

import { prisma } from "../db";
import { getProfile } from "./auth";

export async function getLastPlayed() {
  const user = (await getProfile())!;

  const session = await prisma.playSession.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      start: "desc",
    },
    take: 1,
    include: {
      server: {
        include: {
          world: true,
        },
      },
    },
  });

  if (!session) return null;
  return {
    server: session.server.world!.displayName,
    started: session.start,
    stopped: session.end,
  };
}
