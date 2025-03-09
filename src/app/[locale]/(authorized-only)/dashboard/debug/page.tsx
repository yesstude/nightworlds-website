import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { revalidatePath, revalidateTag } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { getMeUnsafe } from "~/server/api/sessions";
import { getAllWorldIds } from "~/server/api/worlds";
import { db } from "~/server/db";
import {
  notificationsTable,
  paymentMethodsTable,
  paymentsTable,
  serversTable,
  subscriptionsTable,
  usersTable,
} from "~/server/db/schema";

export const metadata: Metadata = {
  title: "Отладка",
};

export default async function DashboardDebugPage() {
  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Отладка
      </h1>
      <div>
        <h2 className="mb-3 text-[24px] font-bold leading-tight tracking-normal text-foreground">
          Быстрые кнопки
        </h2>
        <div className="flex flex-wrap gap-4">
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .update(usersTable)
                .set({
                  isSetUp: false,
                  nickname: null,
                  licenseType: null,
                  passwordHash: null,
                })
                .where(eq(usersTable.id, me!.id));

              return redirect("/dashboard");
            }}
          >
            Сброс учётки
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .delete(paymentsTable)
                .where(eq(paymentsTable.userId, me!.id));
              await db
                .delete(subscriptionsTable)
                .where(eq(subscriptionsTable.userId, me!.id));
              await db
                .delete(paymentMethodsTable)
                .where(eq(paymentMethodsTable.userId, me!.id));

              return redirect("/dashboard/debug");
            }}
          >
            Сброс платёжных данных
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .update(usersTable)
                .set({
                  isAdmin: !me!.isAdmin,
                })
                .where(eq(usersTable.id, me!.id));

              return redirect("/dashboard/debug");
            }}
          >
            Вкл/выкл админку
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db.insert(paymentMethodsTable).values({
                userId: me!.id,
                provider: "admin",
              });

              return redirect("/dashboard/billing");
            }}
          >
            Выдать золотую карту
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .delete(notificationsTable)
                .where(eq(notificationsTable.userId, me!.id));

              return redirect("/dashboard/debug");
            }}
          >
            Очистить уведомления
          </FastButton>
        </div>
      </div>
      <Servers />
      <Players />
    </div>
  );
}

async function Players() {
  const players = await db.select().from(usersTable);

  return (
    <div>
      <h2 className="mb-3 text-[24px] font-bold leading-tight tracking-normal text-foreground">
        Игроки
      </h2>
      <div className="flex flex-wrap gap-4">
        {players.map((p) => (
          <div>
            <img
              src={`https://minotar.net/helm/${
                p.nickname ?? "MHF_Steve"
              }/48.png`}
              alt={`${p.nickname}'s avatar`}
            />
            <span>
              #{p.id}, @{p.nickname}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function Servers() {
  const entries = Object.entries(serversTable).filter((v) => !!v[1].columnType);
  const servers = Object.entries(await db.select().from(serversTable));

  return (
    <div>
      <h2 className="mb-3 text-[24px] font-bold leading-tight tracking-normal text-foreground">
        Сервера миров
      </h2>
      <form
        className="grid grid-flow-col place-items-center gap-4"
        action={async (fd: FormData) => {
          "use server";

          const values = Object.fromEntries(fd.entries()) as {
            [key in keyof typeof serversTable.$inferInsert]: string;
          };

          await db.insert(serversTable).values({
            worldId: values.worldId as any,
            isPreOrderable: Boolean(values.isPreOrderable),
            overwriteWorldName:
              values.overwriteWorldName!.length > 0
                ? values.overwriteWorldName
                : undefined,
            startedAt: new Date(Number(values.startedAt)),
          });
          revalidateTag("debug");
        }}
      >
        <select name="worldId" id="worldId">
          <option value="proxy">proxy (not a world)</option>
          {(await getAllWorldIds()).map((v) => (
            <option value={v}>{v}</option>
          ))}
        </select>
        <Input name="overwriteWorldName" placeholder="overwriteWorldName" />
        <div>
          <input type="checkbox" name="isPreOrderable" id="isPreOrderable" />
          <label htmlFor="isPreOrderable">isPreOrderable</label>
        </div>
        <Input
          name="startedAt"
          placeholder="startedAt"
          defaultValue={Date.now()}
        />
        <Button type="submit">Создать</Button>
      </form>
      <table className="[&_td]:px-6 [&_td]:py-2">
        <thead>
          <tr>
            {entries.map((v) => (
              <td>
                {v[0]} ({v[1].columnType})
              </td>
            ))}
            <td>delete</td>
          </tr>
        </thead>
        <tbody>
          {servers.map((s) => (
            <tr>
              {Object.entries(s[1]).map((v) => {
                // try {
                //   const c = JSON.stringify(v[1]);
                //   return <td>{c}</td>;
                // } catch (error) {
                return <td>{v[1]?.toString()}</td>;
                // }
              })}
              <td>
                <form
                  action={async () => {
                    "use server";

                    await db
                      .delete(serversTable)
                      .where(eq(serversTable.id, s[1].id));
                    revalidateTag("debug");
                  }}
                >
                  <Button variant="outlined" size="fab">
                    <Icon icon="delete" />
                  </Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FastButton({
  action,
  children,
}: {
  action?: string | ((formData: FormData) => void | Promise<void>);
  children: ReactNode;
}) {
  return (
    <form action={action}>
      <Button type="submit">{children}</Button>
    </form>
  );
}
