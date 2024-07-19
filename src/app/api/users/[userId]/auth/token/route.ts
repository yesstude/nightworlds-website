import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../server/db";
import CryptoJS from "crypto-js";
import { env } from "../../../../../../env/server.mjs";

type ErrorName = "invalid-body" | "invalid-token";
function error(name: ErrorName, code?: number) {
  console.log(name);
  return NextResponse.json({ error: { name } }, { status: code || 200 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const rawbody = await req.json();
  const zodbody = z
    .object({
      token: z.string(),
    })
    .safeParse(rawbody);
  if (zodbody.error) return error("invalid-body", 400);
  const { token: rawtoken } = zodbody.data!;

  console.log({ rawtoken });

  let zodtoken: any = {};
  try {
    const mess = CryptoJS.AES.decrypt(
      rawtoken,
      CryptoJS.enc.Utf8.parse(env.TOKEN_ENCRYPTION_KEY),
      { iv: CryptoJS.enc.Utf8.parse(env.TOKEN_ENCRYPTION_KEY) }
    ).toString(CryptoJS.enc.Utf8);
    console.log(mess);
    zodtoken = z
      .object({
        id: z.string(),
        passwordHash: z.string(),
        issuedAt: z.number(),
      })
      .safeParse(JSON.parse(mess));
  } catch {
    return error("invalid-token");
  }
  if (zodtoken.error) return error("invalid-token");
  const { id, passwordHash } = zodtoken.data!;

  console.log(zodtoken!.data);

  const user = await prisma.user.findFirst({
    where: {
      id: params.userId,
    },
  });

  if (user!.id !== id || user!.passwordHash !== passwordHash)
    return error("invalid-token");

  return NextResponse.json({ success: true });
}
