import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../server/db";

type ErrorName = "invalid-body" | "unknown-server";
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
      server: z.string(),
    })
    .safeParse(rawbody);
  if (zodbody.error) return error("invalid-body", 400);

  const { server: serverName } = zodbody.data!;
  const { userId } = params;

  const server = await prisma.server.findFirst({
    where: {
      name: serverName,
    },
    include: {
      world: true,
    },
  });
  if (!server) return error("unknown-server");
  const { world } = server;
  const user = (await prisma.user.findFirst({
    where: {
      id: userId,
    },
  }))!;

  return NextResponse.json({ access: true });
}
