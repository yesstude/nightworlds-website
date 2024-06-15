import { Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import SetupPagesWrapper from "../../../components/setup/SetupPagesWrapper";
import { getProfile, isSetupFinished } from "../../../server/api/auth";
import { NextButton } from "./buttons";

export default async function SetupPage() {
  if (await isSetupFinished()) return redirect("/dashboard");

  const t = await getTranslations("setup");

  const profile = (await getProfile())!;
  const name = profile.nickname || profile.name;

  return (
    <>
      {name && (
        <Typography variant="h4" component="h2">
          {t("greeting.title", { name })}
        </Typography>
      )}
      <Typography variant="body2" component="div">
        {t("greeting.subtitle")}
      </Typography>
      <NextButton href="/setup/discord" className="mt-16" />
    </>
  );
}
