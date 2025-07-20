import { routing } from "./i18n/routing";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export default async (req: NextRequest) => {
  // // CSRF Protection
  // if (req.method !== "GET") {
  //   const originHeader = req.headers.get("Origin");
  //   // NOTE: You may need to use `X-Forwarded-Host` instead
  //   const hostHeader = req.headers.get("Host");
  //   if (originHeader === null || hostHeader === null) {
  //     return new NextResponse(null, {
  //       status: 403,
  //     });
  //   }
  //   let origin: URL;
  //   try {
  //     origin = new URL(originHeader);
  //   } catch {
  //     return new NextResponse(null, {
  //       status: 403,
  //     });
  //   }
  //   if (origin.host !== hostHeader) {
  //     return new NextResponse(null, {
  //       status: 403,
  //     });
  //   }
  // }

  // URL and Pathname providers
  req.headers.set("x-url", req.url);
  req.headers.set("x-pathname", req.nextUrl.pathname);

  // Localization redirects
  if (
    !["api", "_next", "favicon", "sitemap", "robots"].find((v) =>
      new URL(req.url).pathname.startsWith(`/${v}`),
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
