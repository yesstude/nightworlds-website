import Image from "next/image";
import { LandingAppBar } from "./appbar";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import build from "~/assets/homepage/build.webp";
import communicate from "~/assets/homepage/communicate.webp";
import simplicity from "~/assets/homepage/simplicity.webp";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Metadata } from "next";
import { LandingBanner } from "./landing-banner";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("landing.description"),
    description: t("landing.long_description"),
    openGraph: {
      type: "website",
      siteName: "NightWorlds",
      title: t("landing.description"),
      description: t("landing.long_description"),
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <>
      <LandingBanner />
      <div className="flex max-w-[1400px] flex-col gap-16 px-8 py-8 md:px-20">
        <FeatureBox img={build} alt="Two players building a tower" reverse>
          <h1>{t("landing.features.build.title")}</h1>
          <p>{t("landing.features.build.description")}</p>
        </FeatureBox>
        <FeatureBox img={communicate} alt="Two players trading">
          <h1>{t("landing.features.communicate.title")}</h1>
          <p>{t("landing.features.communicate.description")}</p>
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
          <h1>{t("landing.features.simplicity.title")}</h1>
          <p>{t("landing.features.simplicity.description")}</p>
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
      <div className="col-span-3 flex flex-col justify-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_h1]:mb-4 [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-normal [&_h1]:text-foreground">
        {props.children}
      </div>
    </div>
  );
}
