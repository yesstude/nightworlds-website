import { and, gt, isNull, lt, or } from "drizzle-orm";
import { getServerStatus } from "~/server/api/servers";
import { db } from "~/server/db";
import { serversTable } from "~/server/db/schema";

export async function GET() {
  const servers = await db
    .select({ id: serversTable.id })
    .from(serversTable)
    .where(
      and(
        lt(serversTable.startedAt, new Date()),
        or(gt(serversTable.closedAt, new Date()), isNull(serversTable.closedAt))
      )
    );
  for (const { id } of servers) {
    await getServerStatus(id);
  }
  return new Response(undefined, { status: 200 });
}
