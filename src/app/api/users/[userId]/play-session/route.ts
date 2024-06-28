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
      online: z.boolean(),
    })
    .safeParse(rawbody);
  if (zodbody.error) return error("invalid-body", 400);

  const body = zodbody.data!;
  const { userId } = params;

  if (!(await prisma.server.findUnique({ where: { name: body.server } })))
    return error("unknown-server");

  const lastSession = await prisma.playSession.findFirst({
    where: { userId },
    orderBy: { start: "desc" },
    take: 1,
  });

  if (body.online) {
    if (lastSession && !lastSession.end)
      await prisma.playSession.update({
        where: { id: lastSession.id },
        data: { end: new Date() },
      });
    await prisma.playSession.create({
      data: {
        userId,
        serverName: body.server,
        start: new Date(),
      },
    });
  } else {
    if (lastSession && !lastSession.end)
      await prisma.playSession.update({
        where: { id: lastSession.id },
        data: {
          end: new Date(),
        },
      });
  }
  return NextResponse.json({ success: true });
}
