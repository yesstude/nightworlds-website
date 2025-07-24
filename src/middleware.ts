import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { cookieName, headerName } from "./i18n/settings";
import acceptLanguage from "accept-language";

export default async (req: NextRequest) => {
  req.headers.set("x-url", req.url);
  req.headers.set("x-pathname", new URL(req.url).pathname);

  acceptLanguage.languages(routing.locales);

  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)!.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = routing.defaultLocale;

  const lngInPath = routing.locales.find((loc) =>
    new URL(req.url).pathname.startsWith(`/${loc}`),
  );
  req.headers.set(headerName, lngInPath || lng);

  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  if (
    !lngInPath &&
    !["api", "_next", "favicon", "sitemap", "robots"].find((v) =>
      new URL(req.url).pathname.startsWith(`/${v}`),
    )
  ) {
    return NextResponse.redirect(
      new URL(
        `/${lng}${new URL(req.url).pathname}${new URL(req.url).search}`,
        req.url,
      ),
    );
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer")!);
    const lngInReferer = routing.locales.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    if (lngInReferer) res.cookies.set(cookieName, lngInReferer);
  }

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
};

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}
