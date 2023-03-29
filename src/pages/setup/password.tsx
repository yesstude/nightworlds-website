import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import getLocale from "../../components/getLocale";
import SetupPagesWrapper from "../../components/setup/SetupPagesWrapper";
import { api } from "../../utils/api";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState == "finished") return { redirect: { destination: `/setup/additional` } };

  return getLocale("setup")(context as any);
}

const PasswordSetupPage: NextPage = () => {
  const [t] = useTranslation("setup");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const normalLength = password.length >= 8;

  const set = api.setup.setPassword.useQuery(password, {
    enabled: false,
    onSuccess(data) {
      if (!data) return;
      router.replace("/setup/additional");
    }
  });

  return (
    <SetupPagesWrapper>
      <Typography variant="h4" component="h2">
        {t("password.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {t("password.subtitle")}
      </Typography>
      <TextField
        label={t("password.password")}
        sx={{
          mt: 8,
          mb: 2,
        }}
        fullWidth
        type={showPassword ? "text" : "password"}
        error={!normalLength && password.length > 0}
        helperText={
          !normalLength && password.length > 0
            ? t("password.error.length")
            : undefined
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }}
        onInput={el => setPassword((el.target as any).value)}
      />
      <Button
        variant="outlined"
        size="large"
        disableElevation
        fullWidth
        sx={{
          mb: -4
        }}
        disabled={!normalLength}
        onClick={() => set.refetch()}
      >
        {t("password.finish_button")}
      </Button>
    </SetupPagesWrapper>
  );
}

export default PasswordSetupPage;