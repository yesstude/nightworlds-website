import { GameserverIP } from "./gameserver-ip";
import serverinfopic from "./serverinfo.webp";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "~/components/transition/link";
import { getMeUnsafe } from "~/server/api/sessions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная — Панель управления | NightWorlds",
  description: "Добро пожаловать в панель управления NightWorlds. Здесь вы можете выбрать мир, узнать как подключиться и управлять своим аккаунтом.",
  openGraph: {
    type: "website",
    siteName: "NightWorlds",
    title: "Главная — Панель управления | NightWorlds",
    description: "Добро пожаловать в панель управления NightWorlds. Здесь вы можете выбрать мир, узнать как подключиться и управлять своим аккаунтом.",
    url: "https://nightworlds.pick-me.ru/dashboard",
    images: [
      {
        url: "https://nightworlds.pick-me.ru/medium_banner.jpg",
        width: 1200,
        height: 630,
        alt: "NightWorlds Minecraft city screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nightworlds_mc",
    title: "Главная — Панель управления | NightWorlds",
    description: "Добро пожаловать в панель управления NightWorlds. Здесь вы можете выбрать мир, узнать как подключиться и управлять своим аккаунтом.",
    images: ["https://nightworlds.pick-me.ru/medium_banner.jpg"],
  },
  alternates: {
    canonical: "https://nightworlds.pick-me.ru/dashboard",
  },
};

export default async function DashboardHome() {
  const user = await getMeUnsafe();

  const t = await getTranslations();

  return (
    <div className="flex flex-col py-4 lg:p-8">
      <div className="flex w-full flex-col gap-16 gap-y-4 md:grid md:grid-cols-2">
        <div className="col-span-1 flex h-full flex-col justify-center">
          <span className="text-[16px] font-bold leading-tight tracking-normal text-foreground">
            {t("dashboard.homepage.welcome", { name: user!.nickname })}
          </span>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            {t("dashboard.homepage.howtoplay.title")}
          </h1>
          <ol className="list-inside list-decimal leading-relaxed [&_li]:mb-2">
            <li><Link href="/dashboard/worlds" className="underline text-primary">{t("dashboard.homepage.howtoplay.select_world")}</Link></li>
            <li>
              {t("dashboard.homepage.howtoplay.minecraft", {
                version: "1.21.4",
              })}
            </li>
            <li>{t("dashboard.homepage.howtoplay.multiplayer")}</li>
            <li>{t("dashboard.homepage.howtoplay.add_server")}</li>
            <li>{t("dashboard.homepage.howtoplay.add_server_menu")}</li>
          </ol>
          <GameserverIP ip="nw.pick-me.ru" />
        </div>
        <div className="relative col-span-1 flex h-full flex-row place-items-start justify-center sm:justify-start lg:justify-end">
          <Image
            loading="eager"
            className="relative block h-auto max-h-[480px] w-auto min-w-[0px] max-w-full rounded-[24px] shadow-xl lg:max-w-[640px]"
            alt="tutorial screenshot"
            src={serverinfopic}
          />
        </div>
      </div>
    </div>
  );
}
