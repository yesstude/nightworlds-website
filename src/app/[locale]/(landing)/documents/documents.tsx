"use client";

import { Spoiler, SpoilerGroup } from "~/components/ui/spoiler";

import PublicOffer from "./public-offer.mdx";
import PrivacyPolicy from "./privacy-policy.mdx";
import { ReactNode } from "react";

export default function Documents() {
  return (
    <div className="my-4 flex flex-col">
      <SpoilerGroup>
        <Spoiler title="Договор-оферта" key="public-offer">
          <Formatted>
            <PublicOffer />
          </Formatted>
        </Spoiler>
        <Spoiler title="Политика конфиденциальности" key="privacy-policy">
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
