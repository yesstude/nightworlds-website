import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { env } from "./env/server.mjs";

const locales = ["en", "ru", "uk"];

export default async (req: NextRequest) => {
  // CSRF Protection
  if (req.method !== "GET") {
    const originHeader = req.headers.get("Origin");
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = req.headers.get("Host");
    if (originHeader === null || hostHeader === null) {
      return new NextResponse(null, {
        status: 403,
      });
    }
    let origin: URL;
    try {
      origin = new URL(originHeader);
    } catch {
      return new NextResponse(null, {
        status: 403,
      });
    }
    if (origin.host !== hostHeader) {
      return new NextResponse(null, {
        status: 403,
      });
    }
  }

  // URL and Pathname providers
  req.headers.set("x-url", req.url);
  req.headers.set("x-pathname", req.nextUrl.pathname);

  // Localization redirects
  if (
    !["api", "_next", "favicon"].find((v) =>
      new URL(req.url).pathname.startsWith(`/${v}`)
    )
  )
    return createMiddleware(routing)(req);
};
