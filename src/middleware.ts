import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ru", "uk"];

export default (req: NextRequest) => {
  req.headers.set("x-url", req.url);
  req.headers.set("x-pathname", req.nextUrl.pathname);

  if (
    !req.nextUrl.pathname.includes("/auth/") &&
    locales.find((l) => req.nextUrl.pathname.startsWith(`/${l}`))
  ) {
    const callbackUrl = req.cookies.get("auth.callback-url");
    if (callbackUrl && callbackUrl.value.startsWith("/")) {
      const url = new URL(req.url);
      url.pathname = decodeURIComponent(callbackUrl.value);
      const res = NextResponse.redirect(url.toString());
      res.cookies.delete(callbackUrl.name);
      return res;
    }
  }

  if (
    !["api", "_next", "favicon"].find((v) =>
      new URL(req.url).pathname.startsWith(`/${v}`)
    )
  )
    return createMiddleware({
      locales,

      defaultLocale: "en",
    })(req);
};
