import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { useTranslation } from "react-i18next";
import DefaultHead from "../../components/DefaultHead";
import { getLocaleProps } from "../../components/getLocale";

import ArrowBack from "@mui/icons-material/ArrowBack";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";

import logo from "../../assets/logo_shadow.svg";
import { FormEvent, useRef, useState } from "react";
import * as nar from "next-auth/react"
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { Provider } from "next-auth/providers";
import { Checkbox, FormControlLabel } from "@mui/material";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/dashboard" } };
  }

  const providers = await nar.getProviders();

  return {
    props: {
      ...await getLocaleProps(context as any, "sign-in"),
      providers: providers ?? []
    },
  }
}

const SignInPage: NextPage<any> = ({ providers }) => {
  const i18n = useTranslation("sign-in");
  function t(key: string, config?: any): string | null {
    const val = i18n.t(key, config) as any;
    return val === key ? null : val;
  }

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string>();
  const [nicknameError, setNicknameError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const nickname = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setNicknameError(undefined);
    setPasswordError(undefined);

    if (!nickname.current || !nickname.current.value) {
      nickname.current!.focus();
      return setNicknameError(t("error.no.nickname") as string);
    }
    if (!password.current || !password.current.value) {
      password.current!.focus();
      return setPasswordError(t("error.no.password") as string);
    }
    const result = await nar.signIn("credentials", {
      redirect: false,
      username: nickname.current.value,
      password: password.current.value
    });
    if (!result) return setError(t("error.default") as string);
    if (!result.ok) {
      switch (result.error) {
        case "CredentialsSignin":
          return setError(t("error.invalid") as string);
        default:
          return setError(t("error.default") as string);
      }
    }
    location.replace(result.url || "/");
  }

  return (
    <>
      <DefaultHead ftitle={t("title") as string | null} description={t("subtitle") as string | null} />
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          placeItems: "center",
        }}
      >
        <Button color="info" sx={{ my: 1 }} onClick={e => {
          window.history.back();
        }}>
          <ArrowBack sx={{ mr: 1 }} />
          <span>{t("back_button")}</span>
        </Button>
        <Paper variant="outlined" sx={{
          textAlign: "center",
          p: 8,
          maxWidth: "480px"
        }}>
          <Image src={logo} alt="NightWorlds" width={128} />
          <Typography variant="h3" component="h1" my={2}>{t("title")}</Typography>
          <Typography variant="body1" mb={8} px={4}>{t("subtitle")}</Typography>
          <form onSubmit={signIn} style={{ display: "none" }}>
            <TextField
              fullWidth
              inputRef={nickname}
              label={t("nickname") as string}
              error={!!nicknameError}
              helperText={nicknameError}
            />
            <TextField
              fullWidth
              inputRef={password}
              type={showPassword ? "text" : "password"}
              label={t("game_password") as string}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => setShowPassword(!showPassword)}
                />
              }
              label={t("showpassword") as string}
            />
            {error ?
              <Typography my={4} color="error" variant="body2">{error}</Typography>
              : ""}
            <p><Button type="submit" variant="contained" fullWidth disableElevation>{t("button")}</Button></p>
          </form>
          {(providers as Provider[]).length != 0 ?
            <Typography
              color="text.disabled"
              my={4}
              variant="body1"
              sx={{ display: "none" }}
            >
              {t("alternatives") as string}
            </Typography>
            : ""}
          {Object.values(providers as Provider[]).map(provider =>
            provider.type == "oauth"
              && provider.name.toLowerCase() != "discord" ? (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 0,
                  p: "16px",
                  width: "300px",
                  my: "8px"
                }}
                onClick={() => nar.signIn(provider.id)}
              >
                {t("with", { name: provider.name }) as string}
              </Button>
            ) : "")}
        </Paper>
      </Container>
    </>
  );
}

export default SignInPage;