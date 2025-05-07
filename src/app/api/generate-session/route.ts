import { NextRequest } from "next/server";
import {
  createSession,
  generateSessionToken,
} from "../../../server/api/sessions";
import { env } from "../../../env/server.mjs";
import { setSessionTokenCookie } from "../../../server/api/cookies";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const token = await generateSessionToken();

  const hs = req.headers;
  const forwarded =
    env.NODE_ENV == "production"
      ? hs.get("x-forwarded-for")
      : "162.158.154.215"; // Some random Cloudflare IP for testing
  const ip = forwarded ? forwarded.split(/, /)[0] : undefined;

  await createSession(
    token,
    "web",
    undefined,
    ip,
    hs.get("user-agent") ?? undefined,
  );

  await setSessionTokenCookie(token);

  return redirect(
    decodeURIComponent(req.nextUrl.searchParams.get("redirect") ?? "/"),
  );
}
