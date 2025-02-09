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
import { useLocale } from "next-intl";
import { Icon } from "~/components/ui/icon";
import { useDebounce } from "use-debounce";

export function WorldSubscriptionSheet({
  children,
  worldId,
  ...props
}: {
  children?: ReactNode;
  worldId: WorldId;
} & Parameters<typeof Sheet>[0]) {
  const locale = useLocale();

  const [input, setInput] = useState<WorldSubscriptionPaymentInput>({
    worldId,
    giftToUserId: "ui9doajp8rtuxwcaonocclaq",
  });
  const [preview, setPreview] = useState<WorldSubscriptionPaymentPreview>();

  const [rawDonation, setDonation] = useState(0);
  const [donation] = useDebounce(rawDonation, 1000);

  useEffect(() => {
    setPreview(undefined);
    previewWorldSubscription({ ...input, donation }).then(setPreview);
  }, [input, donation]);

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
          <div className="flex flex-col gap-4">
            <div className="flex h-14 cursor-pointer place-items-center gap-3 rounded-[4px] px-4 outline outline-1 outline-border transition-[outline] duration-500 hover:outline-2 hover:outline-primary hover:duration-0 [&_>*]:select-none">
              <img
                src={`https://minotar.net/helm/Squaryyy/128.png`}
                loading="eager"
                className="relative -ml-1 block h-7 w-7 rounded-[4px]"
              />
              <span className="flex-grow truncate font-medium text-foreground">
                Squaryyy
              </span>
              <Icon icon="edit" />
              {/* <span className="mt-1 flex-grow truncate font-medium text-foreground">
                Выберите игрока
              </span> */}
            </div>
            <Input
              placeholder="Поддержка, ₽ (необязательно)"
              type="number"
              // className="bg-primary/10"
              min={0}
              max={5000000}
              value={input.donation}
              onInput={(e) =>
                setDonation(
                  Number(
                    e.currentTarget.value.length > 0 ? e.currentTarget.value : 0
                  )
                )
              }
            />
          </div>
          {!preview ? (
            <Skeleton className="shadow-none h-full w-full rounded-[24px]" />
          ) : (
            <div className="h-full rounded-[24px] bg-primary/5 p-6">
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
                <span className="text-center text-[24px] font-bold text-primary">
                  {preview.prolongation.period == "monthly" ? "30" : "0"}
                </span>
                <span className="text-[24px] font-bold text-foreground">
                  дней
                </span>
                {preview.prolongation.to && (
                  <>
                    <span className="col-span-2 pl-4 text-[16px] font-normal text-foreground/60">
                      до
                    </span>
                    <span className="text-center text-[24px] font-bold text-primary">
                      {preview.prolongation.to.getDate()}
                    </span>
                    <span className="text-[24px] font-bold text-foreground">
                      {preview.prolongation.to
                        .toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "long",
                        })
                        .replaceAll(/\d/g, "")
                        .trim()}
                    </span>
                  </>
                )}
                {preview.willBeFrozen && (
                  <>
                    <span className="col-span-2 pl-4 text-[16px] font-normal text-foreground/60">
                      заморожена по причине
                    </span>
                    <span className="mr-1 pt-1 text-center text-[24px] font-bold text-primary">
                      <Icon icon="ac_unit" size={24} />
                    </span>
                    <span className="text-[24px] font-bold text-foreground">
                      {preview.willBeFrozen.reason == "preorder"
                        ? "Предзаказ"
                        : "Неизвестно"}
                    </span>
                  </>
                )}
                {preview.donation ? (
                  <>
                    <span className="col-span-2 pl-4 text-[16px] font-normal text-foreground/60">
                      вы поддерживаете нас на
                    </span>
                    <span className="pt-1 text-center text-[24px] font-bold text-primary">
                      <Icon icon="heart_plus" size={24} />
                    </span>
                    <span className="text-[24px] font-bold text-foreground">
                      {preview.donation.toFixed(2)}₽
                    </span>
                  </>
                ) : undefined}
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button size="extended_fab" className="w-full" disabled={!preview}>
            Оплатить {preview?.price ? `${preview.price.toFixed(2)}₽` : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
