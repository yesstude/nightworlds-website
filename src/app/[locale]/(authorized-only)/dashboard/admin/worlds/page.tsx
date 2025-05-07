"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  getServer,
  getServers,
  powerServer,
  resetApiKey,
  setServerRemoteData,
} from "./actions";
import { Input } from "~/components/ui/input";
import { ReactNode, useState } from "react";
import { useAwait } from "~/hooks/use-await";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Icon } from "~/components/ui/icon";
import { useLocale } from "next-intl";

export default function AdminServersPage() {
  const servers = useAwait(getServers) ?? [];

  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Серверы
      </h1>
      <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
        {servers.map((s) => (
          <ServerCard key={s.id} server={s} />
        ))}
      </div>
    </div>
  );
}

type Server = Awaited<ReturnType<typeof getServers>>[number];

function ServerCard({ server: originalServer }: { server: Server }) {
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [server, setServer] = useState<Server | undefined>(originalServer);

  function refetchAfter(ms: number = 0) {
    setIsLoading(true);
    setTimeout(async () => {
      setServer(await getServer(server!.id));
      setIsLoading(false);
    }, ms);
  }

  if (!server) return <></>;

  return (
    <Card variant="filled" className="flex flex-col">
      <CardHeader>
        <span className="pt-1 text-[24px] font-medium text-foreground">
          {server.overwriteWorldName ?? server.worldId}
        </span>
        <p className="text-muted-foreground">ID: {server.id}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-4">
          <span>
            Статус:{" "}
            {server.status == "running"
              ? "Запущен"
              : server.status == "stopped"
                ? "Остановлен"
                : server.status == "starting"
                  ? "Запуск"
                  : server.status == "stopping"
                    ? "Остановка"
                    : "Удалённый доступ недоступен"}
          </span>
          <span>
            Доступно с {server.startedAt.toLocaleString(locale)}
            {server.isPreOrderable && " (предзаказ)"}
          </span>
          {server.closedAt && (
            <span>Закрыто с {server.closedAt.toLocaleString(locale)}</span>
          )}
          {server.status == "remote-down" && (
            <form
              action={(fd: FormData) => {
                const code = fd.get("fetch") as string;

                setServerRemoteData(server.id, code);
                refetchAfter(3000);
              }}
              className="flex flex-col gap-4"
            >
              <Input
                placeholder="Удаленный доступ fetch (Node.js)"
                required
                name="fetch"
                autoComplete="off"
              />
              <Button type="submit" disabled={isLoading}>
                Обновить
              </Button>
            </form>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-4">
          {server.status == "stopped" && (
            <Button
              disabled={isLoading}
              onClick={() => {
                powerServer(server.id, "start");
                refetchAfter(3000);
              }}
              variant="outlined"
              type="submit"
            >
              Запустить
            </Button>
          )}
          {server.status == "running" && (
            <Button
              disabled={isLoading}
              onClick={() => {
                powerServer(server.id, "stop");
                refetchAfter(3000);
              }}
              variant="outlined"
              type="submit"
            >
              Остановить
            </Button>
          )}
          <KeyResetSheet server={server}>
            <Button variant="outlined">Сброс ключа</Button>
          </KeyResetSheet>
        </div>
      </CardFooter>
    </Card>
  );
}

function KeyResetSheet({
  server,
  children,
}: {
  server: Server;
  children: ReactNode;
}) {
  const [newKey, setNewKey] = useState<string | undefined>();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Сброс ключа</SheetTitle>
          <SheetDescription>
            После нажатия на кнопку текущий API-ключ "
            {server.overwriteWorldName ?? server.worldId}" перестанет
            действовать. Это значит, что до смены ключа сервер не сможет
            взаимодействовать с оркестратором.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-grow flex-col gap-4 pt-4">
          <Button
            size="extended_fab"
            disabled={!!newKey}
            onClick={() => {
              resetApiKey(server.id).then(setNewKey);
            }}
          >
            Сбросить ключ
          </Button>
          <Input value={newKey} placeholder="Новый ключ" readOnly>
            <Button
              variant="text"
              size="icon"
              className="translate-x-1"
              disabled={!newKey}
              onClick={() => {
                navigator.clipboard.writeText(newKey!);
              }}
            >
              <Icon icon="content_copy" />
            </Button>
          </Input>
        </div>
      </SheetContent>
    </Sheet>
  );
}
