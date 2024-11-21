import { getCurrentSession } from "../../server/api/sessions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import cygre from "../../fonts/cygre/cygre";

import "~/styles/globals.css";
import { MaterialSymbolsProvider } from "./material-symbols-provider";

export const metadata: Metadata = {
  title: "NightWorlds",
  applicationName: "NightWorlds",
  creator: "NightWorlds",
  publisher: "NightWorlds",
  description: "Сеть Minecraft серверов, направленных на выживание",
  other: {
    "theme-color": "#542369",
  },
  icons: [{ url: "/favicon.svg" }],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(await getCurrentSession()).session) {
    const url = (await headers()).get("x-url") ?? "/";
    return redirect(
      "/api/generate-session?redirect=" + encodeURIComponent(url)
    );
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <MaterialSymbolsProvider>
        <html lang={locale}>
          <body className={`${cygre.className}`}>
            {children}
            <p className="mt-8 text-center text-foreground/50">
              <span>ИНН 434584407807</span>
              {/* <span>| Договор-оферта, политика конфиденциальности, документы</span> */}
              <span> | © 2024</span>
            </p>
          </body>
        </html>
      </MaterialSymbolsProvider>
    </NextIntlClientProvider>
  );
}
