import React from "react";
import { LandingAppBar } from "../(landing)/appbar";
import LandingFooter from "../(landing)/footer";
import { getTranslations } from "next-intl/server";

export default async function WikiLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("wiki");

  return (
    <>
      <LandingAppBar logoCaption="Wiki" />
      <div className="flex flex-col items-center mx-auto w-full max-w-[1200px] flex-col gap-1 md:px-8 md:py-8 text-foreground/80 md:px-20">
      <article className="mx-auto px-4 py-8 md:px-8 md:py-10 rounded-b-[32px] md:rounded-[32px] lg:px-16 lg:py-20 lg:rounded-[48px] bg-foreground/5">
        {children}
        <p className="text-sm mt-12 text-muted-foreground">
          {t("fantasy_disclaimer")}
        </p>
      </article>
      </div>
      <div className="w-full flex flex-col items-center">
        <LandingFooter />
      </div>
    </>
  );
} 