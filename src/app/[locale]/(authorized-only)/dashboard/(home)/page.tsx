import { getMe, getMySessions } from "~/server/api/sessions";
import { GameserverIP } from "./gameserver-ip";

import serverinfopic from "./serverinfo.webp";
import Image from "next/image";

export default async function DashboardHome() {
  const user = await getMe();

  const sessions = await getMySessions();

  return (
    <div className="flex flex-col lg:p-8">
      <div className="w-full grid-cols-2 gap-16 lg:grid">
        <div className="col-span-1 flex h-full flex-col justify-center">
          <span className="text-[16px] font-bold leading-tight tracking-normal text-foreground">
            Добрый день{user?.nickname && `, ${user.nickname}`}!
          </span>
          <h2 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            Как начать игру?
          </h2>
          <ol className="list-inside list-decimal leading-relaxed [&_li]:mb-2">
            <li>
              Запустите Minecraft Java Edition (рекомендуем версию 1.21.1)
            </li>
            <li>Выберите вариант "Сетевая игра"</li>
            <li>Нажмите кнопку "Добавить"</li>
            <li>Введите любое имя и добавьте следующий адрес:</li>
          </ol>
          <GameserverIP ip="nw.ni-li.com" className="mt-4" />
        </div>
        <div className="relative col-span-1 hidden h-full flex-row place-items-start justify-end lg:flex">
          <Image
            loading="eager"
            className="relative block h-auto max-h-[480px] w-auto min-w-[0px] max-w-[640px] rounded-[24px] shadow-xl"
            alt="tutorial screenshot"
            src={serverinfopic}
          />
        </div>
      </div>
    </div>
  );
}
