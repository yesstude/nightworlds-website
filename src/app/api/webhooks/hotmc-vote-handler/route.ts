import { NextRequest } from "next/server";
import { env } from "~/env/server.mjs";
import { hotmcVotesTable } from "~/server/db/schema";
import { db } from "~/server/db";

const SECRET = env.HOTMC_VOTE_SECRET;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const nick = form.get("nick");
  const time = form.get("time");
  const sign = form.get("sign");

  if (!nick || !time || !sign) {
    return new Response("Не переданы необходимые данные.", { status: 400 });
  }

  const crypto = await import("crypto");
  const expectedSign = crypto.createHash("sha1").update(String(nick) + String(time) + SECRET).digest("hex");
  if (sign !== expectedSign) {
    return new Response("Переданные данные не прошли проверку.", { status: 403 });
  }

  await db.insert(hotmcVotesTable).values({ nickname: String(nick) });

  return new Response("ok", { status: 200 });
} 