import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const locales = ["en", "ru", "uk"];

export default (req: NextRequest) => {
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
