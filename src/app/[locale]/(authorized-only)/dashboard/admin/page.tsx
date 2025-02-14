import Link, { LinkButton } from "~/components/transition/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { getProxy, getUsers, setProxyRemoteData } from "./actions";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { powerServer } from "~/server/api/servers";
import { revalidatePath } from "next/cache";
import { Input } from "~/components/ui/input";

export default async function AdminDashboard() {
  const users = await getUsers(0, 50);
  const proxy = await getProxy();

  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Администрирование
      </h1>
      <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
        {!!proxy && (
          <Card variant="filled">
            <CardHeader>
              <span className="pt-1 text-[24px] font-medium text-foreground">
                NWProxy
              </span>
              <p className="text-muted-foreground">
                Статус и управление прокси игровых серверов
              </p>
            </CardHeader>
            <CardContent className="h-full">
              <div className="flex flex-col gap-4">
                <span>
                  Статус:{" "}
                  {proxy.status == "running"
                    ? "Запущен"
                    : proxy.status == "stopped"
                    ? "Остановлен"
                    : proxy.status == "starting"
                    ? "Запуск"
                    : proxy.status == "stopping"
                    ? "Остановка"
                    : "Удалённый доступ недоступен"}
                </span>
                {proxy.status != "remote-down" && (
                  <div className="flex gap-4">
                    <form
                      action={async () => {
                        "use server";

                        await powerServer(proxy.id, "start");
                        revalidatePath("/dashboard/admin");
                      }}
                    >
                      <Button variant="outlined" type="submit">
                        Запустить
                      </Button>
                    </form>
                    <form
                      action={async () => {
                        "use server";

                        await powerServer(proxy.id, "stop");
                        revalidatePath("/dashboard/admin");
                      }}
                    >
                      <Button variant="outlined" type="submit">
                        Остановить
                      </Button>
                    </form>
                  </div>
                )}
                {proxy.status == "remote-down" && (
                  <form
                    action={async (fd: FormData) => {
                      "use server";

                      const code = fd.get("fetch") as string;

                      if (await setProxyRemoteData(code))
                        revalidatePath("/dashboard/admin");
                    }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      placeholder="Удаленный доступ fetch (Node.js)"
                      required
                      name="fetch"
                    />
                    <Button type="submit">Обновить</Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        <Card variant="filled">
          <CardHeader>
            <span className="pt-1 text-[24px] font-medium text-foreground">
              Пользователи
            </span>
            <p className="text-muted-foreground">Новые пользователи:</p>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex flex-col">
              {users.map((u, i) => (
                <div
                  // href={`/dashboard/admin/users/${u.id}`}
                  key={u.id}
                  className="flex place-items-center gap-4 rounded-[8px] px-4 py-2 hover:bg-primary/5"
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.nickname ?? "user avatar"}
                    loading="eager"
                    width={40}
                    height={40}
                    className="rounded-[4px]"
                  />
                  <div className="flex flex-col [&_span]:leading-tight">
                    <span className="text-[18px] font-medium text-foreground">
                      {u.nickname ?? "--"} #{i + 1}
                    </span>
                    <span className="text-muted-foreground">{u.account}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {/* <CardFooter className="justify-end">
            <LinkButton variant="outlined" href="/dashboard/admin/users">
              Управление
            </LinkButton>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  );
}
