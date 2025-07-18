import cygre from "../../fonts/cygre/cygre";
import { createSessionIfNone } from "../../server/api/sessions";
import { MaterialSymbolsProvider } from "./material-symbols-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { TransitionProvider } from "~/components/transition/transition-provider";
import { env } from "~/env/server.mjs";
import "~/styles/globals.css";
import Providers from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: "NightWorlds",
    applicationName: "NightWorlds",
    authors: { name: "NightLight Communities" },
    creator: "NightLight Communities",
    publisher: "NightLight Communities",
    description: t("meta.description"),
    keywords: t("meta.keywords"),
    other: {
      "theme-color": "#542369",
    },
    icons: [
      { url: "/favicon-96x96.png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", rel: "shortcut icon" },
      {
        url: "/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
    ],
    openGraph: {
      type: "website",
      siteName: "NightWorlds",
      title: "NightWorlds",
      description: t("meta.description"),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const cs = await cookies();

  if (cs.has("session")) {
    const hs = await headers();
    const forwarded =
      env.NODE_ENV == "production"
        ? hs.get("x-forwarded-for")
        : "162.158.154.215"; // Some random Cloudflare IP for testing
    const ip = forwarded ? forwarded.split(/, /)[0] : undefined;

    await createSessionIfNone(
      cs.get("session")!.value,
      "web",
      undefined,
      ip,
      hs.get("user-agent") ?? undefined,
    );
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${cygre.className}`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <MaterialSymbolsProvider>
              <TransitionProvider>{children}</TransitionProvider>
            </MaterialSymbolsProvider>
            <GoogleAnalytics gaId="G-R2NPRT0L4W" />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
