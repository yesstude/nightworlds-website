import { and, gt, isNull, lt, or } from "drizzle-orm";
import { headers } from "next/headers";
import { getServerStatus } from "~/server/api/servers";
import { db } from "~/server/db";
import { serversTable } from "~/server/db/schema";

export async function GET() {
  headers();

  const servers = await db
    .select({ id: serversTable.id, worldId: serversTable.worldId })
    .from(serversTable)
    .where(
      and(
        lt(serversTable.startedAt, new Date()),
        or(gt(serversTable.closedAt, new Date()), isNull(serversTable.closedAt))
      )
    );
  let result: { id: string; status: string }[] = [];
  for (const { id, ...server } of servers) {
    const status = await getServerStatus(id);
    result.push({ ...server, id, status });
  }
  return Response.json(result, { status: 200 });
}
