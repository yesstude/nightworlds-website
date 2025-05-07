import { Metadata } from "next";
import {
  getPaymentMethods,
  getSubscriptions,
  unlinkPaymentMethod,
} from "./actions";
import TransactionsBlock from "./transactions";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Button } from "~/components/ui/button";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Платежи",
};

export default async function DashboardDebugPage() {
  const methods = await getPaymentMethods();
  const subscriptions = await getSubscriptions();

  return (
    <div className="flex w-full flex-col gap-12 pt-8 lg:p-8">
      {methods.length > 0 && (
        <div>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            Привязанные карты
          </h1>
          <div className="flex flex-wrap gap-2">
            {methods.map((m) => (
              <Card
                key={m.id}
                variant="filled"
                className="w-[220px] [&_button]:opacity-0 [&_button]:hover:opacity-100"
              >
                <CardHeader className="flex flex-row place-items-center justify-between pt-2">
                  <Icon className="mt-2" icon="credit_card" />
                  <form
                    action={async (fd: FormData) => {
                      "use server";

                      const id = fd.get("id") as string;

                      await unlinkPaymentMethod(id);
                      revalidatePath("/dashboard/billing");
                    }}
                  >
                    <input type="hidden" name="id" value={m.id} />
                    <Button
                      variant="text"
                      size="icon"
                      className="duration-400 transition-opacity"
                      type="submit"
                    >
                      <Icon className="text-foreground" icon="delete" />
                    </Button>
                  </form>
                </CardHeader>
                <CardContent>
                  <div className="flex place-items-center gap-2">
                    <Icon
                      icon={
                        m.provider == "admin" ? "all_inclusive" : "asterisk"
                      }
                    />
                    <span className="mt-1 font-mono text-[26px] font-bold">
                      {m.provider == "admin"
                        ? "GOLDEN"
                        : (m.card?.last4 ?? "bug")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {subscriptions.length > 0 ? (
        <div>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            Подписки
          </h1>
          <div>
            {subscriptions.map((s) => (
              <Card key={s.id} variant="filled">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-[20px] font-medium">{s.tag}</span>
                    <span className="text-[20px] font-medium">
                      {s.shouldEndAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {s.freezeReason && (
                    <div className="flex items-center gap-2">
                      <Icon icon="ac_unit" />
                      <span className="text-[16px] font-medium text-muted-foreground">
                        Заморожена по причине: {s.freezeReason}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      <TransactionsBlock />
    </div>
  );
}
