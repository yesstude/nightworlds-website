import { NextRequest, NextResponse } from "next/server";
import { serverProtected } from "../auth";
import { getWorld } from "~/server/api/worlds";

export function GET(req: NextRequest) {
  return serverProtected(async (server) => {
    const world =
      server.worldId === "proxy" ? undefined : await getWorld(server.worldId);

    return NextResponse.json({
      id: server.id,
      worldId: server.worldId,
      worldName: server.overwriteWorldName ?? world?.name ?? server.worldId,
    });
  });
}
