import { NextRequest, NextResponse } from "next/server";
import { serverProtected } from "../../auth";
import { db } from "~/server/db";
import { usersTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nickname: string }> },
) {
  return serverProtected(async (server) => {
    const { nickname } = await params;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.nickname, nickname));
    if (!user)
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 },
      );
    return NextResponse.json({
      id: user.id,
      nickname: user.nickname,
      isSetUp: user.isSetUp,
      licenseType: user.licenseType,
      isAdmin: user.isAdmin,
    });
  });
}
