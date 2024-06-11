import { GetServerSidePropsContext, NextPage } from "next";
import { LandingAppBar } from "../components/NightWorldsBar";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";
import getLocale from "../components/getLocale";
import { Box, Button, Container, Typography } from "@mui/material";
import nwm4 from "../assets/homepage/nwm4.svg";
import Image from "next/image";
import Link from "next/link";
import Copyright from "../components/Copyright";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) return { redirect: { destination: "/dashboard" } };

  return getLocale("landing")(context as any);
}

function TagWord(props: {
  children: string;
  disabled?: boolean;
  mod?: boolean;
}) {
  return (
    <Typography
      component="span"
      fontWeight={600}
      sx={{
        backgroundColor: props.disabled
          ? "#ddd"
          : props.mod
          ? "#c1e5af"
          : "#e5befd",
        py: 2,
        px: 3,
        borderRadius: 10,
        opacity: props.disabled ? "30%" : "100%",
      }}
    >
      {props.children}
    </Typography>
  );
}

export default (function Medium() {
  const { t } = useTranslation("landing");

  return (
    <>
      <Head>
        <title>Medium</title>
        <meta name="description" content={t("description") as string} />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <LandingAppBar
        appear={true}
        button={t("actionbutton")}
        shortbutton={t("actionbutton_short")}
      />
      <Container sx={{display: "flex", flexDirection: "column", gap: 8, placeItems: "center"}}>
        <Box
          sx={{
            mt: 24,
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: "72px",
            rowGap: "48px",
          }}
        >
          <Image
            alt="NightWorld Medium 4"
            src={nwm4}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "48px",
            }}
          />
          <Box
            sx={{
              minWidth: "260px",
              maxWidth: "400px",
            }}
          >
            <Typography variant="h2" component="h1">
              NightWorld Medium 3.6
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              <TagWord>Java Edition</TagWord>
              <TagWord mod>PlasmoVoice</TagWord>
              <TagWord mod>Emotecraft</TagWord>
            </Box>
            <Typography fontWeight={600}>
              Ванильный игровой сервер без обязательных модификаций.
              Присутствуют элементы политики и экономики. RolePlay необязателен,
              однако приветствуется.
            </Typography>
            <Box mt={8} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography fontWeight={600} variant="h4" component="span">
                69₽ / месяц
              </Typography>
              <Button variant="contained" disabled>
                Оформить
              </Button>
              <Typography
                sx={{ opacity: "50%" }}
                component="span"
                textAlign="center"
                fontWeight={300}
              >
                Пока невозможно
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{maxWidth: "700px"}}>
          <Typography variant="h2">Как поиграть?</Typography>
          <Typography fontWeight={600} variant="h5" component="p">
            После покупки «проходки»{" "}
            <Link href="/dashboard">в вашем личном кабинете</Link> появятся
            инструкции по установке игры, рекомендуемых для неё модов
            (необязательно) и входу на игровой сервер.
          </Typography>
        </Box>
        <Copyright sx={{}} />
      </Container>
    </>
  );
} as NextPage);
