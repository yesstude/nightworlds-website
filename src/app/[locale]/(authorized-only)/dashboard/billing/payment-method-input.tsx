"use client";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { useAwait } from "~/hooks/use-await";
import { ClientPaymentMethod } from "~/server/models/PaymentMethod";
import { getPaymentMethods } from "./actions";
import { MouseEventHandler, useEffect, useState } from "react";

export function PaymentMethodInput({
  className,
  name,
  onChange,
}: {
  className?: string;
  name?: string;
  onChange?: (value?: string) => any;
}) {
  const methods = useAwait(getPaymentMethods) || [];
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    onChange?.(selected);
  }, [selected]);

  return (
    <div className={"flex flex-wrap gap-2 " + className}>
      <input type="hidden" name={name} value={selected} />
      <Method
        key="new"
        selected={!selected}
        onClick={() => setSelected(undefined)}
      />
      {methods.map((method) => (
        <Method
          key={method.id}
          method={method}
          selected={selected === method.id}
          onClick={() => setSelected(method.id)}
        />
      ))}
    </div>
  );
}

function Method({
  method,
  onClick,
  selected,
}: {
  method?: ClientPaymentMethod;
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}) {
  return (
    <Card
      key={method?.id ?? "new"}
      variant={selected ? "elevated" : method ? "filled" : "outlined"}
      className="h-full min-w-[220px] max-w-[220px] cursor-pointer [&_button]:opacity-0 [&_button]:hover:opacity-100"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row place-items-center justify-between pt-2">
        <Icon className="mt-2" icon={method ? "credit_card" : "add_card"} />
        {selected && <Icon icon="check_circle" filled />}
      </CardHeader>
      <CardContent>
        <div className="flex place-items-center gap-2">
          {method ? (
            <>
              <Icon icon="asterisk" />
              <span className="mt-1 font-mono text-[26px] font-bold">
                {method.card?.last4}
              </span>
            </>
          ) : (
            <span className="mt-1 font-mono text-[26px] font-bold">Новый</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
