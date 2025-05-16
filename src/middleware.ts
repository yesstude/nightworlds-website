import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export default async (req: NextRequest) => {
  // URL and Pathname providers
  req.headers.set("x-url", req.url);
  req.headers.set("x-pathname", req.nextUrl.pathname);

  // Localization redirects
  if (
    !["api", "_next", "favicon", "sitemap", "robots", "mcbanners"].find((v) =>
      new URL(req.url).pathname.startsWith(`/${v}`)
    )
  ) {
    const res = createMiddleware(routing)(req);

    if (!req.cookies.has("session")) {
      const token = await generateSessionToken();

      res.cookies.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        path: "/",
      });
    }

    return res;
  }
};

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
