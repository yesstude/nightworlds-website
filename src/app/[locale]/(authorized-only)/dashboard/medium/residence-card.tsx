"use client";

import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { ClientSafeResident } from "./actions";
import Image from "next/image";
import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";
import { useFlagFace } from "./use-flag";
import { Skeleton } from "~/components/ui/skeleton";

export function ResidenceCard({
  resident,
  className,
}: {
  resident: ClientSafeResident;
  className?: string;
}) {
  const locale = useLocale();
  const flagUrl = useFlagFace(resident.state.flag);

  const statename = resident.state.localizedName[locale];

  return (
    <Card
      variant="filled"
      className={cn("flex flex-col [&_>_div]:p-8", className)}
    >
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-4">
          {flagUrl ? (
            <Image
              src={flagUrl}
              width={54}
              height={96}
              alt={`Флаг государства ${statename}`}
              className="rounded-[4px]"
              style={{
                imageRendering: "pixelated",
              }}
            />
          ) : (
            <Skeleton className="shadow-none h-[96px] w-[54px] rounded-[4px]" />
          )}
          <div>
            <CardTitle className="text-[24px] font-bold text-foreground">
              Гражданство
            </CardTitle>
            <h2 className="text-[24px] font-bold text-foreground grow">
              {statename}
            </h2>
            <p className="text-[20px]">Паспорт: #259613</p>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="!pt-4">
            <Button variant="outlined">Редактировать</Button>
            <Button variant="text">Wiki</Button>
          </CardFooter> */}
    </Card>
  );
}
