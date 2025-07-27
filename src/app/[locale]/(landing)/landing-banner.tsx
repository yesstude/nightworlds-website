"use client";

import medium from "../(authorized-only)/dashboard/worlds/nwm37.svg";
import photo from "./medium_banner.webp";
import { useTranslations } from "~/i18n/client";
import Image from "next/image";
import { LinkButton } from "~/components/transition/link";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Icon } from "~/components/ui/icon";

export function LandingBanner() {
  const { t } = useTranslations("landing");

  return (
    <div className="overflow-none relative mb-[64px] mt-2 flex w-full max-w-[1400px] flex-col-reverse rounded-[32px] bg-primary/5 shadow-md sm:rounded-none sm:bg-transparent sm:p-[8px] sm:shadow-transparent md:px-[48px]">
      <div className="sm:dark inset-0 z-10 flex flex-col justify-end gap-4 p-[20px] sm:absolute sm:p-[32px] md:px-[96px] md:py-[56px]">
        <div className="max-w-[520px] p-1 text-[14px] font-medium leading-relaxed tracking-wide text-foreground sm:text-[18px] lg:max-w-[720px] lg:text-[24px] ">
          <Image
            src={medium}
            alt="Letter M cuboid logo"
            loading="eager"
            className="mb-2 hidden w-[80px] rounded-[24px] bg-foreground p-2 brightness-[125%] md:block lg:mb-6 lg:w-[128px] lg:rounded-[32px] lg:p-3"
          />
          <h1
            className="text-[18px] font-bold leading-tight tracking-normal sm:text-[32px] lg:text-[48px]"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,0.18), 0 1px 0 rgba(0,0,0,0.12)",
            }}
          >
            NightWorld Medium 3.7
          </h1>
          <p
            className="mb-2 max-w-[520px]"
            style={{
              textShadow:
                "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            {t("banner.description")}
          </p>
        </div>
        <LinkButton
          className="transition-shadow hover:bg-primary/95 hover:shadow-xl sm:h-[50px] sm:shadow-lg lg:h-[72px] lg:px-[28px] lg:text-[24px] [&_.icon]:hover:translate-x-1 lg:[&_.icon]:hover:translate-x-2"
          href="/dashboard/worlds"
        >
          {t("actionbutton_short")}
          <Icon
            icon="arrow_right_alt"
            weight={200}
            size={32}
            className="icon -mr-2 transition-transform lg:translate-x-1"
          />
        </LinkButton>
      </div>
      <AspectRatio ratio={16 / 9}>
        <Image
          src={photo}
          alt="Minecraft city screenshot"
          loading="eager"
          className="h-full w-full rounded-t-[32px] object-cover sm:rounded-[32px] sm:shadow-xl lg:rounded-[86px] sm:brightness-[40%] md:brightness-[70%]"
        />
      </AspectRatio>
    </div>
  );
}
