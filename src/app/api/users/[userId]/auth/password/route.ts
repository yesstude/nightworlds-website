import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../server/db";
import { SHA256 } from "crypto-js";

type ErrorName = "invalid-body" | "invalid-password";
function error(name: ErrorName, code?: number) {
  return NextResponse.json({ error: { name } }, { status: code || 200 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const rawbody = await req.json();
  const zodbody = z
    .object({
      password: z.string(),
    })
    .safeParse(rawbody);
  if (zodbody.error) return error("invalid-body", 400);

  const { password } = zodbody.data!;

  const user = await prisma.user.findFirst({
    where: {
      id: params.userId,
    },
  });

  const hash = SHA256(password).toString();
  if (user!.passwordHash !== hash) return error("invalid-password");

  return NextResponse.json({ success: true });
}
