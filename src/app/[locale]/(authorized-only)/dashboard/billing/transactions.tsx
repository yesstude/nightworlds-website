"use client";

import { getPayments } from "./actions";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Icon, IconName } from "~/components/ui/icon";
import { Skeleton } from "~/components/ui/skeleton";

type ClientPayment = Awaited<ReturnType<typeof getPayments>>[number];

function TransactionItem({ payment }: { payment: ClientPayment }) {
  let statusIcon: IconName;
  let statusText: string;
  let statusColor: string;

  switch (payment.result) {
    case "succeeded":
      statusIcon = "check_circle";
      statusText = "Оплачено";
      statusColor = "text-green-500";
      break;
    case "canceled":
      statusIcon = "cancel";
      statusText = "Отменено";
      statusColor = "text-red-500";
      break;
    default:
      statusIcon = "timer";
      statusText = "Обрабатывается";
      statusColor = "text-yellow-500";
      break;
  }

  const paymentTypeText =
    payment.type === "subscription" ? "Оплата подписки" : "Платёж";

  return (
    <Card
      key={payment.id}
      className="flex w-full max-w-[640px] flex-col rounded-[24px] bg-primary/5"
    >
      <CardContent className="flex gap-4 pt-5">
        <div className={statusColor}>
          <Icon icon={statusIcon} className={statusColor} />
        </div>
        <div className="flex grow flex-col gap-1">
          <span className={statusColor}>{statusText}</span>
          <span className="text-xl font-semibold text-foreground">
            {paymentTypeText}
          </span>
          <span className="text-muted-foreground">{payment.description}</span>
          <span className="text-bold mt-2 text-xl text-foreground">
            {payment.amount.toFixed(2)} ₽
          </span>
        </div>
      </CardContent>
      {!!payment.closedAt && payment.closedAt?.getTime() < Date.now() && (
        <CardFooter>
          <span className="text-muted-foreground">
            {`Завершён ${new Date(payment.closedAt).toLocaleString("ru", {
              dateStyle: "short",
              timeStyle: "short",
            })}.`}
            {payment.isGifted &&
              ` Вы видите этот платёж, потому что оплаченный товар принадлежит вам.`}
          </span>
        </CardFooter>
      )}
    </Card>
  );
}

// Component for displaying the list of transactions
export default function TransactionsBlock() {
  const [page, setPage] = useState(0);
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPayments().then((payments) => {
      setPayments(payments);
      setLoading(false);
    });
  }, [page]);

  return (
    <div>
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Платежи
      </h1>
      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <Skeleton className="h-[180px] w-[640px] rounded-[32px]" />
            <Skeleton className="h-[180px] w-[640px] rounded-[32px]" />
            <Skeleton className="h-[180px] w-[640px] rounded-[32px]" />
          </>
        ) : payments.length === 0 ? (
          <p>На этом аккаунте ещё не было транзакций.</p>
        ) : (
          payments.map((payment) => (
            <TransactionItem key={payment.id} payment={payment} />
          ))
        )}
      </div>
    </div>
  );
}
