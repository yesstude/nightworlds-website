import { GameserverIP } from "../(home)/gameserver-ip";
import { cookies } from "next/headers";

export default function SkindrobePoCPage() {
  const cs = cookies();
  const session = cs.get("session");

  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Skindrobe Alpha
      </h1>
      <p>
        Система Skindrobe ещё находится в очень ранней стадии тестирования. Для
        подключения скопируйте токен сессии в приложение, поддерживающее
        Skindrobe. Не разглашайте и не показывайте этот токен
      </p>
      <div>
        <GameserverIP ip={session?.value ?? "не работает :("} />
      </div>
    </div>
  );
}
