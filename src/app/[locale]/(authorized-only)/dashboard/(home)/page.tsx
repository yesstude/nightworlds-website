import { getMe, getMySessions } from "~/server/api/sessions";
import { GameserverIP } from "./gameserver-ip";

import serverinfopic from "./serverinfo.webp";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { usersTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardHome() {
  const user = await getMe();

  const sessions = await getMySessions();

  return (
    <div className="flex flex-col lg:p-8">
      <div className="flex w-full flex-col gap-16 gap-y-4 lg:grid lg:grid-cols-2">
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
        <div>
          <form
            action={async () => {
              "use server";

              const me = await getMe();

              await db
                .update(usersTable)
                .set({
                  isSetUp: false,
                  nickname: null,
                  licenseType: null,
                  passwordHash: null,
                })
                .where(eq(usersTable.id, me!.id));
            }}
          >
            <Button variant="outlined" type="submit">
              Сброс учётки
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
