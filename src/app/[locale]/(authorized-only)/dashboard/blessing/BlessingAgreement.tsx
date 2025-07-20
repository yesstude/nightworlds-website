"use client";

import React from "react";
import { createBlessingProfile } from "./actions";
import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransitions } from "~/components/transition/transition-provider";

export function BlessingAgreement() {
  const t = useTranslations("dashboard.blessing");
  const router = useRouter();
  const transition = useTransitions();

  const createProfileMutation = useMutation({
    mutationFn: createBlessingProfile,
    onSuccess: () => {
      transition?.emphasizedFadeUp();
      router.refresh();
      router.push("/dashboard/blessing");
    }
  });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 md:px-8"
    >
      <div className="flex flex-col justify-center gap-4 max-w-[500px]">
        <h1 className={"text-2xl font-bold text-foreground"}>
          {t("agreement_title")}
        </h1>
        <p className="text-base text-muted-foreground">
          {t.rich("agreement_disclaimer", {
            bold: (chunks) => <strong>{chunks}</strong>
          })}
        </p>
        <Button disabled={createProfileMutation.isPending || createProfileMutation.isSuccess} onClick={() => createProfileMutation.mutate()} className="mt-4 px-6 py-2 font-semibold shadow" variant="filled">
          {t("agreement_confirm")}
        </Button>
      </div>
    </div>
  );
} 