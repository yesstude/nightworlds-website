import { LinkButton } from "~/components/transition/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { getUsers } from "./actions";

export default async function AdminDashboard() {
  const users = await getUsers(0, 50);

  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Администрирование
      </h1>
      <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
        <Card variant="filled" className="flex flex-col">
          <CardHeader>
            <span className="pt-1 text-[24px] font-medium text-foreground">
              Серверы
            </span>
            <p className="text-muted-foreground">
              Статус и управление игровыми серверами
            </p>
          </CardHeader>
          <CardContent className="flex-grow" />
          <CardFooter>
            <LinkButton variant="outlined" href="/dashboard/admin/worlds">
              Перейти
            </LinkButton>
          </CardFooter>
        </Card>
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
