import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Theme from "./theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NightWorlds",
  applicationName: "NightWorlds",
  creator: "NightWorlds",
  publisher: "NightWorlds",
  description: "Сервер Minecraft с неограниченными возможностями",
  icons: [{ url: "/favicon.svg" }],
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Theme>{children}</Theme>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
