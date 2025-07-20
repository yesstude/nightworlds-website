"use client";

import PrivacyPolicy from "./privacy-policy.mdx";
import PublicOffer from "./public-offer.mdx";
import SubscriptionOffer from "./subscription-offer.mdx";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Spoiler, SpoilerGroup } from "~/components/ui/spoiler";

export default function Documents() {
  const t = useTranslations();

  return (
    <div className="my-4 flex flex-col">
      <SpoilerGroup>
        <Spoiler title={t("documents.names.publicoffer")} key="public-offer">
          <Formatted>
            <PublicOffer />
          </Formatted>
        </Spoiler>
        <Spoiler
          title={t("documents.names.subscriptionoffer")}
          key="subscription-offer"
        >
          <Formatted>
            <SubscriptionOffer />
          </Formatted>
        </Spoiler>
        <Spoiler
          title={t("documents.names.privacypolicy")}
          key="privacy-policy"
        >
          <Formatted>
            <PrivacyPolicy />
          </Formatted>
        </Spoiler>
      </SpoilerGroup>
    </div>
  );
}

function Formatted(props: { children: ReactNode }) {
  return (
    <div className="text-[14px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_*]:mt-2 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-normal [&_h2]:text-foreground [&_ul]:mb-3 [&_ul]:list-inside [&_ul]:list-disc">
      {props.children}
    </div>
  );
}
