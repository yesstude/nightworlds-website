import { getMe } from "~/server/api/sessions";
import TelegramWidget from "./tgwidget";
import { redirect } from "next/navigation";
import { Icon } from "~/components/ui/icon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Авторизация",
  description:
    "Войдите в свой аккаунт, чтобы получить доступ к полному функционалу веб-сайта и игровых серверов NightWorlds",
  openGraph: {
    type: "website",
    siteName: "NightWorlds",
    title: "Авторизация в NightWorlds",
    description:
      "Войдите в свой аккаунт, чтобы получить доступ к полному функционалу веб-сайта и игровых серверов NightWorlds",
  },
};

export default async function SignInPage() {
  const user = await getMe();
  if (user) return redirect("/dashboard");

  return (
    <div className="relative flex min-h-full flex-col place-items-center sm:min-h-[unset]">
      <div className="flex w-max max-w-[100vw] grow flex-col place-items-center gap-8 bg-foreground/5 px-4 py-16 sm:m-8 sm:min-w-[260px] sm:max-w-[480px] sm:grow-0 sm:rounded-[48px] sm:p-16">
        <Icon icon="person" size={48} />
        <div className="text-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_h1]:mb-4 [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-normal [&_h1]:text-foreground">
          <h1>Авторизация</h1>
          <p>
            В связи с изменениями в конституции Российской Федерации,
            авторизация в NightWorlds возможна только с помощью Telegram. Мы не
            считаем использование паролей безопасным.
          </p>
        </div>
        <div className="grow sm:grow-0" />
        <div>
          <TelegramWidget />
        </div>
      </div>
    </div>
  );
}
