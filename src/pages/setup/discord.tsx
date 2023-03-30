import { DiscountRounded } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import getLocale from "../../components/getLocale";
import SetupPagesWrapper from "../../components/setup/SetupPagesWrapper";
import { api } from "../../utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState == "finished") return { redirect: { destination: `/setup/additional` } };

  return getLocale("setup")(context as any);
}

const DiscordSetupPage: NextPage = () => {
  const [t] = useTranslation("setup");
  const router = useRouter();

  const discord = api.setup.discordLinked.useQuery().data;

  return (
    <SetupPagesWrapper>
      <Typography variant="h4" component="h2">
        {t("discord.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {discord ? t("discord.success") : t("discord.subtitle")}
      </Typography>
      <Button
        variant="text"
        size="large"
        disableElevation
        fullWidth
        sx={{
          mt: 16,
          mb: 4
        }}
        disabled={!!discord}
        onClick={() => signIn("discord")}
      >
        {t("discord.link_button")}
      </Button>
      <Button
        variant="outlined"
        size="large"
        disableElevation
        fullWidth
        sx={{
          mb: -4
        }}
        disabled={!discord}
        onClick={() => router.replace("/setup/nickname")}
      >
        {t("discord.continue_button")}
      </Button>
    </SetupPagesWrapper>
  );
}

export default DiscordSetupPage;