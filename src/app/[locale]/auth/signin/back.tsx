"use client";

import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function BackButton(props: { className?: string }) {
  const t = useTranslations("sign-in");

  const router = useRouter();

  return (
    <Button
      className={props.className}
      color="info"
      onClick={(e) => {
        router.back();
      }}
    >
      <ArrowBack sx={{ mr: 1 }} />
      <span>{t("back_button")}</span>
    </Button>
  );
}
