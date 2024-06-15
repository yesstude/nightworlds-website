"use client";

import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function NextButton(props: {
  href: string;
  textKey?: string;
  onClick?: () => boolean;
  className?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("setup");
  return (
    <Button
      variant="contained"
      size="large"
      disableElevation
      fullWidth
      className={props.className}
      onClick={() => {
        if (!props.onClick || props.onClick()) router.push(props.href);
      }}
      disabled={props.disabled}
    >
      {t(props.textKey || "greeting.button")}
    </Button>
  );
}
