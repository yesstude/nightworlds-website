"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ClientSafeResident } from "./actions";
import banner from "./banner.png";
import Image from "next/image";
import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";

export function ResidenceCard({
  resident,
  className,
}: {
  resident: ClientSafeResident;
  className?: string;
}) {
  const locale = useLocale();

  const statename = resident.state.localizedName[locale];

  return (
    <Card
      variant="filled"
      className={cn("flex flex-col [&_>_div]:p-8", className)}
    >
      <CardHeader className="!pb-0">
        <CardTitle className="text-[24px] font-bold text-foreground">
          Гражданство
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 !pt-4">
        <div className="flex gap-4">
          {/* <Skeleton className="shadow-none h-[96px] w-[54px] rounded-[8px]" /> */}
          <Image
            src={banner}
            alt={`Флаг государства ${statename}`}
            className="h-[96px] w-[54px] rounded-[8px]"
            style={{
              imageRendering: "pixelated",
            }}
          />
          <div>
            <h2 className="text-[24px] font-bold text-foreground">
              {statename}
            </h2>
            <p>Президент, мэр Писоцка</p>
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
