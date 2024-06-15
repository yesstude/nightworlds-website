import React from "react";
import Head from "next/head";
import { LandingAppBar } from "../../../components/NightWorldsBar";
import { useTranslations } from "next-intl";
import { Box, Container, Typography } from "@mui/material";
import Copyright from "../../../components/Copyright";
import Documents from "./Documents";

export default function DocumentsPage() {
  const t = useTranslations("landing");

  return (
    <>
      <Head>
        <title>Документы</title>
        <meta name="description" content={t("description") as string} />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <LandingAppBar
        appear={true}
        button={t("actionbutton")}
        shortbutton={t("actionbutton_short")}
      />
      <Container className="mt-24 flex max-w-[800px] flex-col gap-8">
        <Box>
          <Typography variant="h2" component="h1">
            Документы
          </Typography>
          <Typography variant="body1">
            На этой странице можно ознакомиться с документами, которые могут
            понадобиться Вам в процессе использования услуг NightWorlds
          </Typography>
        </Box>
        <Documents />
        <Copyright />
      </Container>
    </>
  );
}
