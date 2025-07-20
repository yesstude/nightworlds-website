import { WorldSubscriptionSheet } from "../billing/world-subscription-sheet";
import { PersonalizedWorld, getPersonalizedWorlds } from "./actions";
import { worldLogo } from "./worlds-logos";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { LinkButton } from "~/components/transition/link";
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
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "~/components/ui/icon";
import { SheetTrigger } from "~/components/ui/sheet";
import { getTranslations as getTranslationsServer } from "next-intl/server";

async function getTranslations() {
  return await getTranslationsServer("dashboard.worlds");
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  return {
    title: t("title"),
  };
}

export default async function DashboardWorldsPage() {
  const worlds = await getPersonalizedWorlds();
  const availableWorlds = worlds.filter((w) => w.isAvailable);
  const unavailableWorlds = worlds.filter((w) => !w.isAvailable);

  const t = await getTranslations();
  
  return (
    <div className="flex flex-col gap-12 lg:p-8">
      {availableWorlds.length > 0 && (
        <div>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            {t("title")}
          </h1>
          <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
            {availableWorlds.map((w) => (
              <WorldCard
                logo={worldLogo(w.id).logo}
                logoAlt={worldLogo(w.id).alt}
                world={w}
                key={w.id}
                t={t}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
          {t("unavailableWorlds")}
        </h1>
        <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
          {unavailableWorlds.map((w) => (
            <WorldCard
              logo={worldLogo(w.id).logo}
              logoAlt={worldLogo(w.id).alt}
              world={w}
              key={w.id}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getActionButtonLabel(world: PersonalizedWorld) {
  if (world.subscription?.isRenewable) return "action.renew";
  if (world.isPreOrderable) return "action.preorder";
  if (world.isTrialAvailable) return "action.trial";
  return "action.buy";
}

function WorldCard({
  world,
  logo,
  logoAlt,
  t,
}: {
  logo: string | StaticImport;
  logoAlt: string;
  world: PersonalizedWorld;
  t: Awaited<ReturnType<typeof getTranslations>>;
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
        {world.isTrialAvailable && (
          <p className="text-sm text-muted-foreground">
            {t("trialAvailable", { trialLength: world.trialLength })}
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-start gap-2">
        <span className="flex-grow">
          {!!world.subscription
            ? `${world.subscription.price}₽ / ${t("month")}`
            : world.isFree
              ? t("free")
              : ""}
        </span>
        <div className="flex place-items-center gap-[2px]">
          {world.isAvailable &&
          (world.isFree || world.subscription?.isPaid) &&
          !world.subscription?.isRenewable ? (
            <LinkButton
              variant="outlined"
              className="rounded-r-none [&_>div]:pr-5"
              href="/dashboard"
            >
              {t("action.play")}
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
                  {t(getActionButtonLabel(world))}
                </Button>
              </SheetTrigger>
            </WorldSubscriptionSheet>
          ) : (
            <Button
              variant="outlined"
              className="rounded-r-none [&_>div]:pr-5"
              disabled
            >
              {t("action.unavailable")}
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
                {!!world.subscription && (
                  <SheetTrigger asChild>
                    <DropdownMenuItem>
                      <Icon icon="featured_seasonal_and_gifts" />
                      {t("action.gift")}
                    </DropdownMenuItem>
                  </SheetTrigger>
                )}
              </DropdownMenuContent>
            </WorldSubscriptionSheet>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
