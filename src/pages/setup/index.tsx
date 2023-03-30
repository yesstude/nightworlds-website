import { Button, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import getLocale from "../../components/getLocale";
import SetupPagesWrapper from "../../components/setup/SetupPagesWrapper";
import { authOptions } from "../../server/auth";
import { api } from "../../utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState == "finished") return { redirect: { destination: `/setup/additional` } };

  return getLocale("setup")(context as any);
}

const SetupPage: NextPage = () => {
  const [t] = useTranslation("setup");
  const router = useRouter();

  const user = api.me.profile.useQuery().data;

  return (
    <SetupPagesWrapper>
      <Typography variant="h4" component="h2">
        {user ? t("greeting.title", { name: user.nickname }) : ""}
      </Typography>
      <Typography variant="body2" component="div">
        {t("greeting.subtitle")}
      </Typography>
      <Button
        variant="contained"
        size="large"
        disableElevation
        fullWidth
        sx={{
          mt: 16,
          mb: -4
        }}
        onClick={() => router.replace("/setup/discord")}
      >
        {t("greeting.button")}
      </Button>
    </SetupPagesWrapper>
  );
}

export default SetupPage;