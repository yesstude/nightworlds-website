import { getMeUnsafe } from "~/server/api/sessions";
import { GameserverIP } from "./gameserver-ip";

import Image from "next/image";
import serverinfopic from "./serverinfo.webp";

export default async function DashboardHome() {
  const user = await getMeUnsafe();

  return (
    <div className="flex flex-col py-4 lg:p-8">
      <div className="flex w-full flex-col gap-16 gap-y-4 md:grid md:grid-cols-2">
        <div className="col-span-1 flex h-full flex-col justify-center">
          <span className="text-[16px] font-bold leading-tight tracking-normal text-foreground">
            Добрый день{user?.nickname && `, ${user.nickname}`}!
          </span>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            Как начать игру?
          </h1>
          <ol className="list-inside list-decimal leading-relaxed [&_li]:mb-2">
            <li>
              Запустите Minecraft Java Edition (рекомендуем версию 1.21.4)
            </li>
            <li>Выберите вариант "Сетевая игра"</li>
            <li>Нажмите кнопку "Добавить"</li>
            <li>Введите любое имя и добавьте следующий адрес:</li>
          </ol>
          <GameserverIP ip="nw.ni-li.com" />
        </div>
        <div className="relative col-span-1 flex h-full flex-row place-items-start justify-center sm:justify-start lg:justify-end">
          <Image
            loading="eager"
            className="relative block h-auto max-h-[480px] w-auto min-w-[0px] max-w-full rounded-[24px] shadow-xl lg:max-w-[640px]"
            alt="tutorial screenshot"
            src={serverinfopic}
          />
        </div>
      </div>
    </div>
  );
}
