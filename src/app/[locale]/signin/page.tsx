import TelegramWidget from "./tgwidget";

export default async function SignInPage() {
  return (
    <div className="flex min-h-[100vh] flex-col place-items-center bg-primary/10">
      <div className="m-8 flex w-max min-w-[260px] max-w-[480px] flex-col rounded-[48px] bg-background p-16">
        <div>
          <h1 className="text-2xl font-bold text-primary">Авторизация</h1>
          <p className="font-bold text-primary">
            В связи с изменениями в конституции Российской Федерации,
            авторизация в NightWorlds возможна только с помощью Telegram. Мы не
            считаем использование паролей безопасным.
          </p>
        </div>
        <div>
          <TelegramWidget />
        </div>
      </div>
    </div>
  );
}
