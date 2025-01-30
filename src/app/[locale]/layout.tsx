import {
  createSessionIfNone,
  getCurrentSession,
} from "../../server/api/sessions";
import { cookies, headers } from "next/headers";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import cygre from "../../fonts/cygre/cygre";

import "~/styles/globals.css";
import { MaterialSymbolsProvider } from "./material-symbols-provider";
import { env } from "~/env/server.mjs";
import { TransitionProvider } from "~/components/transition/transition-provider";

export const metadata: Metadata = {
  title: "NightWorlds - сервера по выживанию",
  applicationName: "NightWorlds",
  authors: { name: "NightLight Communities" },
  creator: "NightLight Communities",
  publisher: "NightLight Communities",
  description: "Сеть Minecraft серверов, направленных на выживание",
  keywords: [
    "NW",
    "NightWorld",
    "НВ",
    "найтворлд",
    "найтворлдс",
    "НВм",
    "майнкрафт",
    "выживание",
    "приватный сервер",
  ],
  other: {
    "theme-color": "#542369",
  },
  icons: [
    { url: "/favicon-96x96.png", sizes: "96x96" },
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.ico", rel: "shortcut icon" },
    { url: "/apple-touch-icon.png", rel: "apple-touch-icon", sizes: "180x180" },
  ],
  openGraph: {
    type: "website",
    siteName: "NightWorlds",
    title: "NightWorlds",
    description: "Сеть Minecraft серверов, направленных на выживание",
  },
};

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
      hs.get("user-agent") ?? undefined
    );
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <MaterialSymbolsProvider>
        <html lang={locale}>
          <body className={`${cygre.className}`}>
            <TransitionProvider>{children}</TransitionProvider>
          </body>
        </html>
      </MaterialSymbolsProvider>
    </NextIntlClientProvider>
  );
}
