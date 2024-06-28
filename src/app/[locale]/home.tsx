"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";

import { ReactNode, Suspense, useState } from "react";
import { LandingAppBar } from "../../components/NightWorldsBar";
import AppearingText from "../../components/homepage/AppearingText";

import { StaticImageData } from "next/image";
import build from "../../assets/homepage/build.webp";
import communicate from "../../assets/homepage/communicate.webp";
import simplicity from "../../assets/homepage/simplicity.webp";
import Copyright from "../../components/Copyright";

import { api } from "../../utils/api";

import { useTranslations } from "next-intl";
import WorldsList from "./worlds-list";

const FeatureBox = (props: {
  img: StaticImageData;
  header: string;
  children: ReactNode;
  reverse?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: props.reverse ? "row-reverse" : "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
        rowGap: 6,
        my: 60,
      }}
    >
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
      <Box
        sx={{
          maxWidth: 420,
          mt: 4,
        }}
      >
        <Typography variant="h1" component="h2">
          {props.header}
        </Typography>
        {props.children}
      </Box>
    </Box>
  );
};

const Home = (props: { translations: { [key: string]: string } }) => {
  const t = (key: string) => {
    return props.translations[key] || key;
  };

  const [makeFancy, setMakeFancy] = useState(false);

  let appearingText = JSON.parse(t("title"));

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
      <Box
        sx={{
          minHeight: "480px",
          display: "flex",
          justifyContent: "center",
          placeItems: "center",
          transition: "min-height 1s",
        }}
      >
        <Container>
          <AppearingText
            variant="h2"
            component="h1"
            sx={{
              textAlign: "center",
            }}
            stopAnimation={!appearingText}
            tokens={appearingText || {}}
            whenFinished={() => setTimeout(() => setMakeFancy(true), 1000)}
          />
        </Container>
      </Box>
      <Container
        sx={{
          display: makeFancy ? "block" : "none",
        }}
      >
        {/* <Box sx={{
          width: "100%",
          display: "flex",
          placeItems: "center",
          justifyContent: "center"
        }}>
        <Paper variant="outlined"
          sx={{
            px: 12,
            py: 12,
            mb: 16,
            textAlign: "center",
            maxWidth: "320px"
          }}
        >
          <Typography variant="h3" component="h2">
            Разработка приостановлена
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Процесс разработки NightWorlds v2 и NightWorld Medium 4 был временно приостановлен по решению сообщества NightLight Dev. Приносим извинения за доставленные неудобства.
          </Typography>
        </Paper>
        </Box> */}
        <Box>
          <Suspense fallback={<></>}>
            <WorldsList />
          </Suspense>
        </Box>
        <FeatureBox img={build} header={t("features.build.title")}>
          <Typography fontWeight={600} fontSize={18}>
            {t("features.build.description")}
          </Typography>
        </FeatureBox>
        <FeatureBox
          img={communicate}
          header={t("features.communicate.title")}
          reverse
        >
          <Typography fontWeight={600} fontSize={18}>
            {t("features.communicate.description")}
          </Typography>
        </FeatureBox>
        <FeatureBox img={simplicity} header={t("features.simplicity.title")}>
          <Typography fontWeight={600} fontSize={18}>
            {t("features.simplicity.description")}
          </Typography>
        </FeatureBox>
      </Container>
      <Copyright />
    </>
  );
};

export default Home;

const SubscriptionBox = () => {
  const t = useTranslations("landing");

  const [email, updateEmail] = useState<string>();
  const [nickname, updateNickname] = useState<string>();
  const [buttonText, setButtonText] = useState(t("subscribe.subscribe"));
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const res = api.subscription.subscribe.useQuery(
    {
      email: email as string,
      nickname,
    },
    {
      enabled: false,
      onSuccess: (data) => {
        if (data) setButtonText(t("subscribe.success"));
      },
    }
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 4,
        py: 24,
        mb: 16,
        textAlign: "center",
      }}
    >
      <Typography variant="h2">{t("subscribe.title")}</Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={12}>
        {t("subscribe.subtitle")}
      </Typography>
      <form
        onSubmit={(val) => {
          val.preventDefault();
          setButtonDisabled(true);
          setButtonText(t("subscribe.loading"));
          res.refetch();
        }}
      >
        <div>
          <TextField
            variant="outlined"
            label={t("subscribe.email")}
            type="email"
            required
            onInput={(val) => updateEmail((val.target as any).value)}
          />
        </div>
        <div>
          <TextField
            variant="outlined"
            label={t("subscribe.nickname")}
            onInput={(val) => updateNickname((val.target as any).value)}
          />
        </div>
        <Button type="submit" variant="outlined" disabled={buttonDisabled}>
          {buttonText}
        </Button>
      </form>
    </Paper>
  );
};
