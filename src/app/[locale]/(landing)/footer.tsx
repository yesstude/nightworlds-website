import { getTranslations } from "next-intl/server";
import { Logo } from "~/components/logo";
import Link, { LinkButton } from "~/components/transition/link";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default async function LandingFooter() {
  const t = await getTranslations();

  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-1 px-8 py-8 text-foreground/80 md:px-20">
      <div className="flex flex-col gap-2 rounded-t-[24px] bg-foreground/5 px-6 py-6 shadow-sm">
        <Logo />
        <p className="max-w-[600px] pl-1">{t("footer.description")}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="https://discord.gg/jtSnBy3Wsf" target="_blank">
            <Button variant="text" size="sm">
              Discord
              <Icon icon="arrow_outward" size={12} className="-mr-1" />
            </Button>
          </Link>
          <Link href="https://t.me/nightworlds_channel" target="_blank">
            <Button variant="text" size="sm">
              Telegram
              <Icon icon="arrow_outward" size={12} className="-mr-1" />
            </Button>
          </Link>
          <LinkButton href="/documents" variant="text" size="sm">
            {t("footer.buttons.documents")}
          </LinkButton>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-b-[24px] bg-foreground/5 px-6 py-4 shadow-sm">
        <div className="flex gap-2">
          <span>{t("footer.tin")} 434584407807</span>
          <div className="grow" />
          <span>© 2025</span>
        </div>
        <span className="text-sm">
          Not an official Minecraft product. We are in no way affiliated with or
          endorsed by Mojang Synergies AB, Microsoft Corporation or other
          rightsholders.
        </span>
      </div>
    </div>
  );
}
