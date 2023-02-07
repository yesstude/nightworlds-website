import { Box, Button, Container, Input, Paper, TextField, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";

import AppearingText from "../components/homepage/AppearingText";
import { ReactNode, useState } from "react";
import { LandingAppBar } from "../components/NightWorldsBar";

import build from "../assets/homepage/build.webp";
import communicate from "../assets/homepage/communicate.webp";
import simplicity from "../assets/homepage/simplicity.webp";
import { StaticImageData } from "next/image";
import Copyright from "../components/Copyright";
import { useTranslation } from "next-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config.mjs";
import { api } from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";

const FeatureBox = (props: {
  img: StaticImageData,
  header: string,
  children: ReactNode,
  reverse?: boolean,
}) => {
  return (
    <Box className="w-[460px] sm:w-[unset]" sx={{
      display: "flex",
      flexDirection: props.reverse ? "row-reverse" : "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 4,
      mx: "auto",
      mb: 20,
    }}>
      <img src={props.img.src} alt="" width={480} height={384} />
      <Box sx={{
        maxWidth: 420,
        margin: "auto",
        mt: 2
      }}>
        <Typography
          variant="h2"
          fontSize={64}
        >{props.header}</Typography>
        {props.children}
      </Box>
    </Box>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["landing"], nextI18nConfig, nextI18nConfig.i18n.locales)),
  },
});

const Home: NextPage = () => {
  const { t } = useTranslation('landing');

  const [makeFancy, setMakeFancy] = useState(false);

  return (
    <>
      <Head>
        <title>NightWorlds</title>
        <meta name="description" content={t("description") as string} />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <LandingAppBar appear={makeFancy} button={t("actionbutton")} />
      <Box className="w-[500px] sm:w-[unset] m-auto" sx={{
        minHeight: makeFancy ? "400px" : "90vh",
        display: "flex",
        justifyContent: "center",
        placeItems: "center",
        transition: "min-height 1s"
      }}>
        <Container>
          <AppearingText
            variant="h1"
            sx={{
              textAlign: "center",
              margin: "auto",
              maxWidth: "70%",
            }}
            tokens={JSON.parse(t("title"))}
            whenFinished={() => setTimeout(() => setMakeFancy(true), 1000)}
          />
        </Container>
      </Box>
      <Container sx={{
        display: makeFancy ? "block" : "none",
      }}>
        <SubscriptionBox />
        <FeatureBox
          img={build}
          header={t("features.build.title")}
        >
          <Typography>{t("features.build.description")}</Typography>
        </FeatureBox>
        <FeatureBox
          img={communicate}
          header={t("features.communicate.title")}
          reverse
        >
          <Typography>{t("features.communicate.description")}</Typography>
        </FeatureBox>
        <FeatureBox
          img={simplicity}
          header={t("features.simplicity.title")}
        >
          <Typography>{t("features.simplicity.description")}</Typography>
        </FeatureBox>
      </Container>
      <Copyright sx={{}} />
    </>
  );
};

export default Home;

const SubscriptionBox = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('landing');

  const [email, updateEmail] = useState<string>();
  const [nickname, updateNickname] = useState<string>();
  const [buttonText, setButtonText] = useState(t("subscribe.subscribe"));
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const res = api.subscription.subscribe.useQuery({
    email: email as string,
    nickname
  }, {
    enabled: false, onSuccess: (data) => {
      if (data) setButtonText(t("subscribe.success"));
    }
  });

  return (
    <Paper variant="outlined"
      sx={{
        px: 4,
        py: 12,
        mb: 16,
        textAlign: "center"
      }}
    >
      <Typography variant="h2">
        {t("subscribe.title")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        {t("subscribe.subtitle")}
      </Typography>
      <form onSubmit={val => {
        val.preventDefault();
        setButtonDisabled(true);
        setButtonText(t("subscribe.loading"));
        res.refetch();
      }}>
        <div><TextField variant="outlined" label={t("subscribe.email")} size="small" type="email" required onInput={val => updateEmail((val.target as any).value)} /></div>
        <div><TextField variant="outlined" label={t("subscribe.nickname")} size="small" onInput={val => updateNickname((val.target as any).value)} /></div>
        <Button type="submit" variant="contained" disabled={buttonDisabled} sx={{
          padding: "12px 28px",
          borderRadius: "9999px",
          mt: "24px"
        }}>{buttonText}</Button>
      </form>
    </Paper>
  );
}