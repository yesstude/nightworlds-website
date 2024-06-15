"use client";

import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function DiscordSignInButton(props: { disabled?: boolean }) {
  const t = useTranslations("setup");

  return (
    <Button
      variant="text"
      size="large"
      disableElevation
      fullWidth
      className="mb-2 mt-16"
      disabled={props.disabled}
      onClick={() => signIn("discord")}
    >
      {t("discord.link_button")}
    </Button>
  );
}
