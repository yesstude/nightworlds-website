import { Box, Container, Typography } from "@mui/material";
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
      {/* <Box>
        <NewsBlock />
      </Box> */}
      <Container sx={{
        display: makeFancy ? "block" : "none",
      }}>
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
