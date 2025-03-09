import { Metadata } from "next";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "~/components/ui/icon";
import { PersonalizedWorld, getPersonalizedWorlds } from "./actions";
import { worldLogo } from "./worlds-logos";
import { WorldSubscriptionSheet } from "../billing/world-subscription-sheet";
import { LinkButton } from "~/components/transition/link";
import { SheetTrigger } from "~/components/ui/sheet";

export const metadata: Metadata = {
  title: "Миры",
};

export default async function DashboardWorldsPage() {
  const worlds = await getPersonalizedWorlds();
  const availableWorlds = worlds.filter((w) => w.isAvailable);
  const unavailableWorlds = worlds.filter((w) => !w.isAvailable);

  return (
    <div className="flex flex-col gap-12 lg:p-8">
      {availableWorlds.length > 0 && (
        <div>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            Миры
          </h1>
          <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
            {availableWorlds.map((w) => (
              <WorldCard
                logo={worldLogo(w.id).logo}
                logoAlt={worldLogo(w.id).alt}
                world={w}
                key={w.id}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
          Недоступные миры
        </h1>
        <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
          {unavailableWorlds.map((w) => (
            <WorldCard
              logo={worldLogo(w.id).logo}
              logoAlt={worldLogo(w.id).alt}
              world={w}
              key={w.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WorldCard({
  world,
  logo,
  logoAlt,
}: {
  logo: string | StaticImport;
  logoAlt: string;
  world: PersonalizedWorld;
}) {
  return (
    <Card variant="filled" className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex h-full place-items-center gap-2">
          <Image
            src={logo}
            alt={logoAlt}
            width={42}
            loading="eager"
            className="logo"
          />
          <span className=" text-[24px] font-bold text-foreground">
            {world.name}
          </span>
        </CardTitle>

        <CardDescription>{world.techDesc}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-2 font-medium">
        <p>{world.description}</p>
      </CardContent>
      <CardFooter className="justify-start gap-2">
        <span className="flex-grow">
          {!!world.subscription
            ? `${world.subscription.price}₽ / месяц`
            : world.isFree
            ? "Бесплатно"
            : ""}
        </span>
        {/* <Button variant="text">
          Подробнее
          <Icon icon="arrow_outward" size={12} className="-mr-1" />
        </Button> */}
        <div className="flex place-items-center gap-[2px]">
          {world.isAvailable &&
          (world.isFree || world.subscription?.isPaid) &&
          !world.subscription?.isRenewable ? (
            <LinkButton
              variant="outlined"
              className="rounded-r-none [&_>div]:pr-5"
              href="/dashboard"
            >
              Играть
            </LinkButton>
          ) : !!world.subscription ? (
            <WorldSubscriptionSheet worldId={world.id}>
              <SheetTrigger asChild>
                <Button
                  variant={
                    world.subscription.isRenewable ? "filled" : "outlined"
                  }
                  className="rounded-r-none [&_>div]:pr-5"
                >
                  {world.subscription.isRenewable
                    ? "Продлить"
                    : world.isPreOrderable
                    ? "Предзаказ"
                    : "Купить"}
                </Button>
              </SheetTrigger>
            </WorldSubscriptionSheet>
          ) : (
            <Button
              variant="outlined"
              className="rounded-r-none [&_>div]:pr-5"
              disabled
            >
              Недоступно
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outlined"
                className="rounded-l-none [&_>div]:pl-1 [&_>div]:pr-2"
                disabled={!world.isAvailable}
              >
                <Icon icon="more_vert" />
              </Button>
            </DropdownMenuTrigger>
            <WorldSubscriptionSheet
              worldId={world.subscription ? world.id : (undefined as any)}
              isGift
            >
              <DropdownMenuContent align="end">
                {/* {!!world.subscription?.isPaid && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Icon icon="calendar_clock" />
                      <span className="flex-grow">Автопродление</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value="card1">
                          <DropdownMenuRadioItem value="off">
                            Отключено
                          </DropdownMenuRadioItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioItem value="card1">
                            *1234
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="card2">
                            *5678
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="card3">
                            *9012
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )} */}
                {!!world.subscription && (
                  <SheetTrigger asChild>
                    <DropdownMenuItem>
                      <Icon icon="featured_seasonal_and_gifts" />
                      Подарить
                    </DropdownMenuItem>
                  </SheetTrigger>
                )}
                {/* <DropdownMenuItem>
                  <Icon icon="bug_report" />
                  Сервер не работает
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </WorldSubscriptionSheet>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
