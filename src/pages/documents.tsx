import Head from "next/head";
import { LandingAppBar } from "../components/NightWorldsBar";
import { GetServerSidePropsContext } from "next";
import getLocale from "../components/getLocale";
import { useTranslation } from "next-i18next";
import { Box, Container, Typography } from "@mui/material";
import { Spoiler } from "../components/Spoiler";
import Copyright from "../components/Copyright";

import PublicOffer from "../components/documents/public-offer.mdx";
import PrivacyPolicy from "../components/documents/privacy-policy.mdx";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getLocale("landing")(context as any);
}

export default function DocumentsPage() {
  const { t } = useTranslation("landing");

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
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "600px",
          gap: 8,
          mt: 24,
        }}
      >
        <Box>
          <Typography variant="h2" component="h1">
            Документы
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            На этой странице можно ознакомиться с документами, которые могут
            понадобиться Вам в процессе использования услуг NightWorlds
          </Typography>
        </Box>
        <Box sx={{ my: 4 }}>
          <Spoiler title="Договор-оферта">
            <Typography variant="body1" component="div">
              <PublicOffer />
            </Typography>
          </Spoiler>
          <Spoiler title="Политика конфиденциальности">
            <Typography variant="body1" component="div">
              <PrivacyPolicy />
            </Typography>
          </Spoiler>
        </Box>
        <Copyright sx={{}} />
      </Container>
    </>
  );
}
