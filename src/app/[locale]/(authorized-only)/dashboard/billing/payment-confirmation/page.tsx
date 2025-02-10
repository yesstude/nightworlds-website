"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, IconName } from "~/components/ui/icon";
import { BasePayment } from "~/server/db/schema";
import { checkPaymentStatus } from "./actions";
import { LinkButton } from "~/components/transition/link";

type PaymentStatus = BasePayment["result"];

export default function PaymentConfirmationPage() {
  const params = useSearchParams();
  const paymentId = params.get("id");

  const [status, setStatus] = useState<PaymentStatus>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    async function check() {
      const res = await checkPaymentStatus(paymentId || "");
      setStatus(res.status);
      setMessage(res.message);
      if (res.status != null) clearInterval(interval);
    }
    check();

    const interval = setInterval(check, 5000);
  }, [paymentId]);

  let icon: IconName = "timer";
  let title = "Обработка платежа...";
  let statusColor = "text-yellow-500";
  let subtitle =
    "Это может занять время. Вы можете покинуть страницу, мы всё равно найдем ваш платёж.";

  switch (status) {
    case "succeeded":
      icon = "check_circle";
      title = "Оплачено";
      statusColor = "text-green-500";
      subtitle = "Спасибо за покупку!";
      break;
    case "canceled":
      icon = "cancel";
      title = "Отменено";
      statusColor = "text-red-500";
      subtitle = "Платеж был отменен.";
      break;
  }

  return (
    <div className="flex w-full flex-col place-items-center gap-6 pt-8 lg:p-8">
      <Icon icon="timer" className={"mb-8 " + statusColor} size={48} />
      <div className="max-w-[560px] text-center text-[18px] font-medium leading-relaxed tracking-wide text-foreground/80 subpixel-antialiased [&_h1]:mb-4 [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-normal">
        <h1 className={statusColor}>{title}</h1>
        <p>{message ?? subtitle}</p>
      </div>
      <div className="mt-6 flex gap-2">
        <LinkButton href="/dashboard/billing" variant="text">
          <Icon icon="arrow_left_alt" size={20} className="-ml-2" />К платежам
        </LinkButton>
      </div>
    </div>
  );
}
