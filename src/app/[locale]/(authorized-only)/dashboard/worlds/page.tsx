import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  PersonalizedWorld,
  getPersonalizedWorlds,
} from "~/server/api/personalized-worlds";
import { WorldId } from "~/server/api/worlds";

import nwm4 from "./nwm37.svg";
import unknown from "./unknown.svg";

const logos: { [key in WorldId]?: { logo: StaticImport; alt: string } } = {
  medium: {
    logo: nwm4,
    alt: "Cuboid letter M logo",
  },
};

export default async function DashboardWorldsPage() {
  const worlds = await getPersonalizedWorlds();

  return (
    <div className="flex flex-col lg:p-8">
      <div>
        <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
          Миры
        </h1>
        <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
          {worlds.map((w) => (
            <WorldCard
              logo={logos[w.id]?.logo}
              logoAlt={logos[w.id]?.alt}
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
  logo?: string | StaticImport;
  logoAlt?: string;
  world: PersonalizedWorld;
}) {
  return (
    <Card variant="filled" className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex h-full place-items-center gap-2">
          <Image
            src={logo ?? unknown}
            alt={logoAlt ?? "Unknown server cuboid logo"}
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
          {world.availability.type == "subscription"
            ? `${world.availability.price}₽ / месяц`
            : world.availability.type == "free"
            ? "Бесплатно"
            : ""}
        </span>
        {/* <Button variant="text">
          Подробнее
          <Icon icon="arrow_outward" size={12} className="-mr-1" />
        </Button> */}
        <div className="flex place-items-center gap-[2px]">
          <Button
            variant="filled"
            className="rounded-r-none [&_>div]:pr-5"
            disabled={world.availability.type == "unavailable"}
          >
            {world.availability.type == "subscription"
              ? "Купить"
              : world.availability.type == "free"
              ? "Играть"
              : "Недоступно"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="filled"
                className="rounded-l-none [&_>div]:pl-1 [&_>div]:pr-2"
                disabled={world.availability.type == "unavailable"}
              >
                <Icon icon="more_vert" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Icon icon="card_giftcard" />
                Другому игроку
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Icon icon="bug_report" />
                Сервер не работает
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
