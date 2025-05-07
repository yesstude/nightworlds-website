import { NextRequest, NextResponse } from "next/server";
import { serverProtected } from "../../../../auth";
import { db } from "~/server/db";
import { usersTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { WorldId, getAllWorldIds, getWorld } from "~/server/api/worlds";
import { getCurrentSubscription } from "~/server/api/billing";

export function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nickname: string; worldId: WorldId }> },
) {
  return serverProtected(async (server) => {
    const { nickname, worldId } = await params;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.nickname, nickname));
    if (!user)
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 },
      );

    if (!(await getAllWorldIds()).includes(worldId))
      return NextResponse.json(
        {
          code: 404,
          message: "World not found",
        },
        { status: 404 },
      );

    const world = await getWorld(worldId);
    if (world.accessPolicy.type == "free")
      return NextResponse.json({
        code: 200,
        available: true,
      });
    if (world.accessPolicy.type == "server-dependent")
      return NextResponse.json({
        code: 200,
        available: user.isAdmin,
      });

    const subscription = await getCurrentSubscription(
      world.accessPolicy,
      user.id,
    );

    return NextResponse.json({
      code: 200,
      available: !!subscription,
      message: !subscription
        ? "Для доступа к этому миру требуется подписка"
        : undefined,
    });
  });
}
