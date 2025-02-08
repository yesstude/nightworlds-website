"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import {
  WorldSubscriptionPaymentInput,
  WorldSubscriptionPaymentPreview,
} from "~/server/api/billing";
import { previewWorldSubscription } from "~/app/[locale]/(authorized-only)/dashboard/billing/world-subscriptions";
import { WorldId } from "~/server/api/worlds";
import Image from "next/image";
import { worldLogo } from "../../worlds/worlds-logos";
import { Input } from "~/components/ui/input";

export function WorldSubscriptionSheet({
  children,
  worldId,
  ...props
}: {
  children?: ReactNode;
  worldId: WorldId;
} & Parameters<typeof Sheet>[0]) {
  const [input, setInput] = useState<WorldSubscriptionPaymentInput>({
    worldId,
    giftToUserId: "ui9doajp8rtuxwcaonocclaq",
  });
  const [preview, setPreview] = useState<WorldSubscriptionPaymentPreview>();

  useEffect(() => {
    setPreview(undefined);
    previewWorldSubscription(input).then(setPreview);
  }, [input]);

  const logo = worldLogo(preview?.world.id as any);

  return (
    <Sheet {...props}>
      {children}
      <SheetContent className="flex min-w-[340px] flex-col overflow-x-hidden rounded-l-[32px] p-10">
        <SheetHeader>
          <SheetTitle>Оплата подписки</SheetTitle>
          <SheetDescription>
            Старт/продление подписки на доступ к игровому миру
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-grow flex-col gap-4">
          <div>
            <Input
              placeholder="Поддержка, ₽ (необязательно)"
              type="number"
              className="bg-primary/10"
            />
          </div>
          {!preview ? (
            <Skeleton className="shadow-none h-full w-full rounded-[24px]" />
          ) : (
            <div className="min-h-full rounded-[24px] bg-primary/5 p-6">
              <div className="grid grid-cols-[42px,_auto] gap-2">
                <span className="col-span-2 pb-1 text-[20px] font-medium text-foreground">
                  Вы оплачиваете:
                </span>
                <Image
                  src={logo.logo}
                  alt={logo.alt}
                  width={42}
                  loading="eager"
                  className="logo mx-auto"
                />
                <span className="pt-1 text-[24px] font-bold text-foreground">
                  {preview.world.name}
                </span>
                {preview.giftToUser && (
                  <>
                    <span className="col-span-2 pl-4 text-[16px] font-normal text-foreground/60">
                      как подарок
                    </span>
                    <img
                      src={preview.giftToUser.avatarUrl}
                      width={32}
                      loading="eager"
                      className="mx-auto rounded-[4px]"
                    />
                    <span className=" text-[24px] font-bold text-foreground">
                      {preview.giftToUser.nickname}
                    </span>
                  </>
                )}
                <span className="col-span-2 pl-4 text-[16px] font-normal text-foreground/60">
                  на срок
                </span>
                <span className=" text-center text-[24px] font-bold text-primary">
                  {preview.prolongation.period == "monthly" ? "30" : "0"}
                </span>
                <span className=" text-[24px] font-bold text-foreground">
                  дней
                </span>
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button size="extended_fab" className="w-full" disabled={!preview}>
            Оплатить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
