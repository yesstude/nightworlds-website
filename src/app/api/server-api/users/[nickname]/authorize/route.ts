import { serverProtected } from "../../../auth";
import { SHA256, enc } from "crypto-js";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, generateSessionToken } from "~/server/api/sessions";
import { db } from "~/server/db";
import { usersTable } from "~/server/db/schema";

export function POST(
  req: NextRequest,
  { params }: { params: Promise<{ nickname: string }> },
) {
  return serverProtected(async (server) => {
    try {
      var unparsed = await req.json();
    } catch (e) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid request body, expected JSON",
        },
        { status: 400 },
      );
    }
    const parsed = z
      .union([
        z.object({
          type: z.literal("license").optional().default("license"),
          license: z.boolean(),
        }),
        z.object({
          type: z.literal("password").optional().default("password"),
          password: z.string(),
        }),
      ])
      .and(
        z.object({
          ip: z.string(),
          userAgent: z.string(),
        }),
      )
      .safeParse(unparsed);
    if (!parsed.success)
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid request body",
          errors: parsed.error.formErrors.fieldErrors,
        },
        { status: 400 },
      );
    const body = parsed.data;

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

    if (
      (user.licenseType == "offline" && body.type == "license") ||
      (user.licenseType == "online" && body.type == "password")
    )
      return NextResponse.json(
        {
          code: 400,
          message: `License type "${
            user.licenseType
          }" requires authorization type "${
            user.licenseType == "offline" ? "password" : "license"
          }"`,
        },
        { status: 400 },
      );

    if (body.type == "license" && !body.license)
      return NextResponse.json(
        {
          code: 401,
          message: "Authorization unsuccessful",
        },
        {
          status: 401,
        },
      );
    if (body.type == "password") {
      const hash = enc.Base64.stringify(SHA256(enc.Utf8.parse(body.password)));
      if (user.passwordHash != hash)
        return NextResponse.json(
          {
            code: 401,
            message: "Invalid password",
          },
          {
            status: 401,
          },
        );
    }

    const token = await generateSessionToken();
    const session = await createSession(
      token,
      "game",
      user.id,
      body.ip,
      body.userAgent,
    );

    return NextResponse.json(
      {
        code: 200,
        token,
        session,
      },
      {
        status: 200,
      },
    );
  });
}
