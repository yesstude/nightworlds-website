import { LandingBanner } from "./landing-banner";
import { Metadata } from "next";
import { getTranslations } from "~/i18n";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import build from "~/assets/homepage/build.webp";
import communicate from "~/assets/homepage/communicate.webp";
import simplicity from "~/assets/homepage/simplicity.webp";
import TelegramPosts from "~/components/telegram-posts/posts";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations("landing");

  const baseUrl = "https://nightworlds.pick-me.ru";
  return {
    title: t("description"),
    description: t("long_description"),
    openGraph: {
      type: "website",
      siteName: "NightWorlds",
      title: t("description"),
      description: t("long_description"),
      url: baseUrl,
      images: [
        {
          url: baseUrl + "/medium_banner.jpg",
          width: 1200,
          height: 630,
          alt: "NightWorlds Minecraft city screenshot",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("description"),
      description: t("long_description"),
      images: [baseUrl + "/medium_banner.jpg"],
    },
    alternates: {
      canonical: baseUrl,
    },
    other: {
      "json-ld": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NightWorlds",
          url: baseUrl,
          logo: baseUrl + "/favicon-96x96.png",
          sameAs: [
            "https://discord.gg/jtSnBy3Wsf",
            "https://t.me/nightworlds_channel",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: baseUrl,
          name: "NightWorlds",
        },
      ]),
    },
  };
}

export default async function HomePage() {
  const { t } = await getTranslations("landing");

  return (
    <>
      <LandingBanner />
      <div className="flex max-w-full xl:max-w-[1280px] flex-col gap-16 px-8 py-8 md:px-20">
        <TelegramPosts />
        <FeatureBox img={build} alt="Two players building a tower" reverse>
          <h2>{t("features.build.title")}</h2>
          <p>{t("features.build.description")}</p>
        </FeatureBox>
        <FeatureBox img={communicate} alt="Two players trading">
          <h2>{t("features.communicate.title")}</h2>
          <p>{t("features.communicate.description")}</p>
          <div className="mt-6 flex gap-2">
            <Link href="https://discord.gg/jtSnBy3Wsf" target="_blank">
              <Button type="button" variant="filled">
                Discord
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
            <Link href="https://t.me/nightworlds_channel" target="_blank">
              <Button type="button" variant="text">
                Telegram
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
          </div>
        </FeatureBox>
        <FeatureBox img={simplicity} alt="Minimalistic building" reverse>
          <h2>{t("features.simplicity.title")}</h2>
          <p>{t("features.simplicity.description")}</p>
        </FeatureBox>
      </div>
    </>
  );
}

function FeatureBox(props: {
  img: StaticImport;
  alt: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="w-full grid-cols-7 lg:grid">
      <Image
        loading="eager"
        className={`col-span-3 mb-8 lg:mb-0 ${props.reverse ? "order-2" : ""}`}
        src={props.img}
        alt={props.alt}
      />
      <div className={props.reverse ? "order-1" : ""} />
      <div className="col-span-3 flex flex-col justify-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_h2]:mb-4 [&_h2]:text-[32px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-normal [&_h2]:text-foreground">
        {props.children}
      </div>
    </div>
  );
}
