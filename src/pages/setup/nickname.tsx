import { Button, TextField, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
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

const NicknameSetupPage: NextPage = () => {
  const [t] = useTranslation("setup");
  const router = useRouter();

  const [nickname, setNickname] = useState("");

  const formatted = nickname.match(/^[A-Za-z_\d]*$/);
  const normalLength = nickname.length >= 3 && nickname.length;
  const available = api.setup.nicknameAvailable.useQuery(nickname).data;

  const set = api.setup.setNickname.useQuery(nickname, {
    enabled: false,
    onSuccess(data) {
      if (!data) return;
      router.replace("/setup/password");
    }
  });

  return (
    <SetupPagesWrapper>
      <Typography variant="h4" component="h2">
        {t("nickname.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {t("nickname.subtitle")}
      </Typography>
      <TextField
        label={t("nickname.nickname")}
        sx={{
          mt: 8,
          mb: 2,
        }}
        fullWidth
        error={!(formatted && normalLength && available)}
        helperText={
          formatted ? (
            normalLength ? (
              available ? t("nickname.error.none")
                : t("nickname.error.occupied")
            ) : t("nickname.error.length")
          ) : t("nickname.error.format")
        }
        onInput={el => setNickname((el.target as any).value)}
      />
      <Button
        variant="outlined"
        size="large"
        disableElevation
        fullWidth
        sx={{
          mb: -4
        }}
        disabled={!(formatted && normalLength && available)}
        onClick={() => set.refetch()}
      >
        {t("nickname.continue_button")}
      </Button>
    </SetupPagesWrapper>
  );
}

export default NicknameSetupPage;