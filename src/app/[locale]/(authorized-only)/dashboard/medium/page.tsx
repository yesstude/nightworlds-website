import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import banner from "./banner.png";

export default async function MediumDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <div className="flex justify-between">
        <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
          Medium
        </h1>
        <div className="flex flex-row gap-2">
          <img
            src={`https://mineskin.eu/helm/${"yesstude"}`}
            loading="eager"
            className="max-h-[40px] rounded-[8px] pb-1"
          />
          <span className=" text-[24px] font-medium text-foreground">
            {"yesstude"}
          </span>
        </div>
      </div>
      <div className="flex grid-cols-[repeat(auto-fill,_minmax(480px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
        <Card variant="filled" className="flex flex-col [&_>_div]:p-8">
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
                alt="Флаг Мадесеи"
                className="h-[96px] w-[54px] rounded-[8px]"
                style={{
                  imageRendering: "pixelated",
                }}
              />
              <div>
                <h2 className="text-[24px] font-bold text-foreground">
                  Мадесея
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
      </div>
    </div>
  );
}
