"use client";

import Image from "next/image";
import photo from "./medium_banner.jpg";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { LinkButton } from "~/components/transition/link";
import { Icon } from "~/components/ui/icon";

export function LandingBanner() {
  return (
    <div className="overflow-none relative mb-[64px] mt-2 flex w-full max-w-[1400px] flex-col-reverse rounded-[32px] bg-primary/5 shadow-md sm:rounded-none sm:bg-transparent sm:p-[8px] sm:shadow-transparent md:px-[48px]">
      <div className="sm:dark inset-0 z-10 flex flex-col justify-end gap-4 p-[20px] sm:absolute sm:p-[32px] md:px-[96px] md:py-[56px]">
        <div className="max-w-[520px] p-1 text-[14px] font-medium leading-relaxed tracking-wide text-foreground sm:text-[18px] lg:max-w-[720px] lg:text-[24px]">
          <h1 className="text-[18px] font-bold leading-tight tracking-normal sm:text-[32px] lg:text-[48px]">
            NightWorld Medium 3.7
          </h1>
          <p className="mb-2">
            Что если совместить Майнкрафт-сервер с современными технологиями?
          </p>
          <p>16 февраля в 19:00 МСК</p>
        </div>
        <LinkButton
          className="hover:bg-primary sm:h-[50px] sm:shadow-lg lg:h-[72px] lg:px-[28px] lg:text-[24px]"
          href="/dashboard/worlds"
        >
          Предзаказ
          <Icon
            icon="arrow_right_alt"
            weight={200}
            size={32}
            className="-mr-2 md:translate-x-1"
          />
        </LinkButton>
      </div>
      <AspectRatio ratio={16 / 9}>
        <Image
          src={photo}
          alt="Minecraft city screenshot"
          loading="eager"
          className="h-full w-full rounded-t-[32px] object-cover brightness-[25%] sm:rounded-[32px] sm:shadow-xl lg:rounded-[86px]"
        />
      </AspectRatio>
    </div>
  );
}
