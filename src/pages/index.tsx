import { Box, Button, Container, Input, Paper, TextField, Typography } from "@mui/material";
import { GetServerSidePropsContext, type NextPage } from "next";
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

import { api } from "../utils/api";
import { authOptions } from "../server/auth";
import { getServerSession } from "next-auth";
import getLocale from "../components/getLocale";

const FeatureBox = (props: {
  img: StaticImageData,
  header: string,
  children: ReactNode,
  reverse?: boolean,
}) => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: props.reverse ? "row-reverse" : "row",
      justifyContent: "space-around",
      flexWrap: "wrap",
      rowGap: 6,
      my: 60,
    }}>
      <img
        src={props.img.src}
        alt=""
        width={480}
        height={384}
        style={{
          maxWidth: "80vw",
          maxHeight: "64vw",
        }}
      />
      <Box sx={{
        maxWidth: 420,
        mt: 4,
      }}>
        <Typography
          variant="h1"
          component="h2"
        >
          {props.header}
        </Typography>
        {props.children}
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) return { redirect: { destination: "/dashboard" } };

  return getLocale("landing")(context as any);
}

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
      <LandingAppBar
        appear={makeFancy}
        button={t("actionbutton")}
        shortbutton={t("actionbutton_short")}
      />
      <Box sx={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        placeItems: "center",
        transition: "min-height 1s"
      }}>
        <Container>
          <AppearingText
            variant="h2"
            component="h1"
            sx={{
              textAlign: "center",
            }}
            tokens={JSON.parse(t("title"))}
            whenFinished={() => setTimeout(() => setMakeFancy(true), 1000)}
          />
        </Container>
      </Box>
      <Container sx={{
        display: makeFancy ? "block" : "none"
      }}>
        <Paper variant="outlined"
          sx={{
            px: 4,
            py: 24,
            mb: 16,
            textAlign: "center"
          }}
        >
          <Typography variant="h3" component="h2">
            Разработка приостановлена
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Процесс разработки NightWorlds v2 и NightWorld Medium 4 был временно приостановлен по решению сообщества NightLight Dev. Приносим извинения за доставленные неудобства.
          </Typography>
        </Paper>
        <FeatureBox
          img={build}
          header={t("features.build.title")}
        >
          <Typography fontWeight={600}>{t("features.build.description")}</Typography>
        </FeatureBox>
        <FeatureBox
          img={communicate}
          header={t("features.communicate.title")}
          reverse
        >
          <Typography fontWeight={600}>{t("features.communicate.description")}</Typography>
        </FeatureBox>
        <FeatureBox
          img={simplicity}
          header={t("features.simplicity.title")}
        >
          <Typography fontWeight={600}>{t("features.simplicity.description")}</Typography>
        </FeatureBox>
      </Container>
      <Copyright sx={{}} />
    </>
  );
};

export default Home;

const SubscriptionBox = () => {
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
        py: 24,
        mb: 16,
        textAlign: "center"
      }}
    >
      <Typography variant="h2">
        {t("subscribe.title")}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={12}>
        {t("subscribe.subtitle")}
      </Typography>
      <form onSubmit={val => {
        val.preventDefault();
        setButtonDisabled(true);
        setButtonText(t("subscribe.loading"));
        res.refetch();
      }}>
        <div><TextField variant="outlined" label={t("subscribe.email")} type="email" required onInput={val => updateEmail((val.target as any).value)} /></div>
        <div><TextField variant="outlined" label={t("subscribe.nickname")} onInput={val => updateNickname((val.target as any).value)} /></div>
        <Button type="submit" variant="outlined" disabled={buttonDisabled}>{buttonText}</Button>
      </form>
    </Paper>
  );
}
