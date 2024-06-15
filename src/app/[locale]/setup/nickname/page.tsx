import { Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { isSetupFinished } from "../../../../server/api/auth";
import { NicknameForm } from "./form";

export default async function NicknameSetupPage() {
  if (await isSetupFinished()) return redirect("/dashboard");
  const t = await getTranslations("setup");
  return (
    <>
      <Typography variant="h4" component="h2">
        {t("nickname.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {t("nickname.subtitle")}
      </Typography>
      <NicknameForm />
    </>
  );
}
