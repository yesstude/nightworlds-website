import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../server/db";

type ErrorName = "invalid-body" | "not-found";
function error(name: ErrorName, code?: number) {
  return NextResponse.json({ error: { name } }, { status: code || 200 });
}

export async function POST(req: NextRequest) {
  const rawbody = await req.json();
  const zodbody = z
    .object({
      nickname: z.string(),
    })
    .safeParse(rawbody);
  if (zodbody.error) return error("invalid-body", 400);

  const body = zodbody.data!;

  const user = await prisma.user.findFirst({
    where: {
      nickname: body.nickname,
    },
  });
  if (!user) return error("not-found");

  return NextResponse.json({
    id: user.id,
    nickname: user.nickname,
    name: user.name,
  });
}
