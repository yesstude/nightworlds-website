import { LandingBanner } from "./landing-banner";
import { Metadata } from "next";
import { getTranslations } from "~/i18n";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import TelegramPosts from "~/components/telegram-posts/posts";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

import clientmods from "~/assets/homepage/clientmods.webp";
import orbital_cannon from "~/assets/homepage/orbital-cannon.webp";
import pushable_block_entities from "~/assets/homepage/pushable-block-entities.webp";
import currencies from "~/assets/homepage/currencies.webp";
import special_recipes from "~/assets/homepage/crafts.webp";
import ping from "~/assets/homepage/ping.webp";
import simplicity from "~/assets/homepage/simplicity.webp";
import communicate from "~/assets/homepage/communicate.webp";
import { LinkButton } from "~/components/transition/link";

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
      <div className="flex w-full flex-col place-items-center px-4 -my-2">
        <LandingBanner />
      </div>
      <div className="flex max-w-full xl:max-w-[1280px] flex-col gap-16 px-8 py-8 md:px-20">
        <TelegramPosts />
        <FeatureBox img={clientmods} alt="Some client modifications icons" reverse>
          <h2>{t("features.clientmods.title")}</h2>
          <p>{t("features.clientmods.description")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="https://modrinth.com/plugin/plasmo-voice" target="_blank">
              <Button type="button" variant="outlined">
                Plasmovoice
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
            <Link href="https://modrinth.com/plugin/emotecraft" target="_blank">
              <Button type="button" variant="outlined">
                Emotecraft
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
            <Link href="https://modrinth.com/mod/distanthorizons" target="_blank">
              <Button type="button" variant="outlined">
                Distant Horizons
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
            <Link href="https://modrinth.com/mod/what-are-they-up-to" target="_blank">
              <Button type="button" variant="outlined">
                WATUT
                <Icon icon="arrow_outward" size={16} className="-mr-2" />
              </Button>
            </Link>
          </div>
        </FeatureBox>
        <FeatureBox img={orbital_cannon} alt="Minecraft orbital strike cannon built by cubicmetre">
          <h2>{t("features.mechanics.title")}</h2>
          <p>{t("features.mechanics.description")}</p>
        </FeatureBox>
        <FeatureBox img={pushable_block_entities} alt="A Minecraft chest being pushed by a piston" reverse>
          <h2>{t("features.pushable_block_entities.title")}</h2>
          <p>{t("features.pushable_block_entities.description")}</p>
        </FeatureBox>
        <FeatureBox img={currencies} alt="An Estenmarck crown and an Estenmarck cent">
          <h2>{t("features.currencies.title")}</h2>
          <p>{t("features.currencies.description")}</p>
        </FeatureBox>
        <FeatureBox img={special_recipes} alt="Recipes for sand and clay" reverse>
          <h2>{t("features.special_recipes.title")}</h2>
          <p>{t("features.special_recipes.description")}</p>
        </FeatureBox>
        <FeatureBox img={ping} alt="Minecraft ping indicator">
          <h2>{t("features.proxies.title")}</h2>
          <p>{t("features.proxies.description")}</p>
        </FeatureBox>
        <FeatureBox img={simplicity} alt="A minimalistic building" reverse>
          <h2>{t("features.automated_whitelist.title")}</h2>
          <p>{t("features.automated_whitelist.description")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <LinkButton href="/dashboard/worlds">
              {t("actionbutton_short")}
              <Icon icon="arrow_right_alt" size={16} className="-mr-2" />
            </LinkButton>
          </div>
        </FeatureBox>
        <FeatureBox img={communicate} alt="A Minecraft server running for 5 years">
          <h2>{t("features.long_term_support.title")}</h2>
          <p>{t("features.long_term_support.description")}</p>
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
