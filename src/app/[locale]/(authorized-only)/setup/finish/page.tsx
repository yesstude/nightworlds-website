"use client";

import { useRouter } from "next/navigation";
import { useTransitions } from "~/components/transition/transition-provider";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { setAccountSetUp } from "~/server/api/account-setup";
import { useMutation } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Готово",
  description: "Аккаунт NightWorlds успешно настроен и готов к использованию.",
  openGraph: {
    type: "website",
    siteName: "NightWorlds",
    title: "Готово",
    description: "Аккаунт NightWorlds успешно настроен и готов к использованию.",
    url: "https://nightworlds.pick-me.ru/setup/finish",
    images: [
      {
        url: "https://nightworlds.pick-me.ru/medium_banner.jpg",
        width: 1200,
        height: 630,
        alt: "NightWorlds Minecraft city screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nightworlds_mc",
    title: "Готово",
    description: "Аккаунт NightWorlds успешно настроен и готов к использованию.",
    images: ["https://nightworlds.pick-me.ru/medium_banner.jpg"],
  },
  alternates: {
    canonical: "https://nightworlds.pick-me.ru/setup/finish",
  },
};

export default function SetupPage() {
  const router = useRouter();
  const transitions = useTransitions();

  const finishSetupMutation = useMutation({
    mutationFn: setAccountSetUp,
    onSuccess: () => {
      transitions?.transitionOut("emphasized-left");
      router.refresh();
    },
  });

  return (
    <>
      <Icon icon="check_circle" size={48} />
      <div>
        <h1>Готово!</h1>
        <p>Аккаунт настроен и готов для игры.</p>
      </div>
      <div className="grow" />
      <div className="w-full bg-background sm:relative ">
        <div className="w-full bg-foreground/5 py-4 sm:p-0 [&_>_button]:w-full">
          <Button
            size="extended_fab"
            disabled={finishSetupMutation.isPending}
            onClick={() => {
              finishSetupMutation.mutate();
            }}
          >
            Продолжить
          </Button>
        </div>
      </div>
    </>
  );
}
