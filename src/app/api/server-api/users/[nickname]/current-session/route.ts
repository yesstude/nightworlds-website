import { NextRequest, NextResponse } from "next/server";
import { serverProtected } from "../../../auth";
import { db } from "~/server/db";
import { sessionsTable, usersTable } from "~/server/db/schema";
import { and, eq, gt, isNull, or } from "drizzle-orm";

export function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  return serverProtected(async (server) => {
    const { nickname } = await params;
    const ip = req.nextUrl.searchParams.get("ip");
    if (!ip)
      return NextResponse.json(
        {
          code: 400,
          message: "IP is required",
        },
        { status: 400 }
      );
    const [result] = await db
      .select()
      .from(usersTable)
      .rightJoin(sessionsTable, eq(sessionsTable.userId, usersTable.id))
      .where(
        and(
          eq(sessionsTable.type, "game"),
          eq(sessionsTable.ipAddress, ip),
          or(
            isNull(sessionsTable.expiresAt),
            gt(sessionsTable.expiresAt, new Date())
          ),
          eq(usersTable.nickname, nickname)
        )
      );
    if (!result?.session)
      return NextResponse.json(
        { code: 404, message: "Session not found", valid: false },
        { status: 404 }
      );
    return NextResponse.json({
      code: 200,
      valid: true,
      session: result.session,
    });
  });
}
