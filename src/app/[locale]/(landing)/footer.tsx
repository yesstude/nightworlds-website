import Link, { LinkButton } from "~/components/transition/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default async function LandingFooter() {
  return (
    <div className="flex w-full max-w-[1200px] flex-col gap-1 px-8 py-8 text-foreground/80 md:px-20">
      <div className="flex flex-col gap-2 rounded-t-[24px] bg-foreground/5 px-6 py-6 shadow-sm">
        <Logo />
        <p className="max-w-[600px] pl-1">
          Сеть приватных Minecraft-серверов, направленных на режим выживания.
          Равные права игроков и неограниченные возможности.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="https://discord.gg/jtSnBy3Wsf" target="_blank">
            <Button variant="text" size="sm">
              Discord
              <Icon icon="arrow_outward" size={12} className="-mr-1" />
            </Button>
          </Link>
          <Link href="https://t.me/nilicom" target="_blank">
            <Button variant="text" size="sm">
              Telegram
              <Icon icon="arrow_outward" size={12} className="-mr-1" />
            </Button>
          </Link>
          <LinkButton href="/documents" variant="text" size="sm">
            Публичная оферта
          </LinkButton>
          <LinkButton href="/documents" variant="text" size="sm">
            Политика конфиденциальности
          </LinkButton>
        </div>
      </div>
      <div className="flex rounded-b-[24px] bg-foreground/5 px-6 py-4 shadow-sm">
        <span>ИНН 434584407807</span>
        <div className="grow" />
        <span>© 2024</span>
      </div>
    </div>
  );
}
