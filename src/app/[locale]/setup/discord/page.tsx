import { Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import SetupPagesWrapper from "../../../../components/setup/SetupPagesWrapper";
import { isDiscordLinked, isSetupFinished } from "../../../../server/api/auth";
import { NextButton } from "../buttons";
import DiscordSignInButton from "./buttons";

export default async function DiscordSetupPage() {
  if (await isSetupFinished()) return redirect("/dashboard");
  const t = await getTranslations("setup");

  const discord = await isDiscordLinked();

  return (
    <>
      <Typography variant="h4" component="h2">
        {t("discord.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {discord ? t("discord.success") : t("discord.subtitle")}
      </Typography>
      <DiscordSignInButton disabled={discord} />
      <NextButton
        textKey="discord.continue_button"
        href="/setup/nickname"
        disabled={!discord}
      />
    </>
  );
}
