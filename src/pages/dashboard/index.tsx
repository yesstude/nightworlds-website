import { GetServerSidePropsContext, NextPage } from "next";
import DashboardWrapper, { LoadingState, Title } from "../../components/dashboard/DashboardWrapper";

import { useTranslation } from "next-i18next";
import getLocale from "../../components/getLocale";
import { api } from "../../utils/api";
import PlayingStatusCard from "../../components/dashboard/homepage/PlayingStatusCard";
import { Box, Container } from "@mui/material";
import NewsBlock from "../../components/NewsBlock";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import WelcomeHeader from "../../components/dashboard/homepage/WelcomeHeader";
import { ReactNode, useState } from "react";
import FriendsPlayingCard from "../../components/dashboard/homepage/FriendsPlayingCard";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState != "finished") return { redirect: { destination: `/setup` } };

  return getLocale("dashboard")(context as any);
}

export default function DashboardHome () {
  const [t, i18n, tr] = useTranslation("dashboard");

  const [showPage, setShowPage] = useState(false);

  return (
    <>
      <Container sx={{
        display: "flex",
        justifyContent: "center"
      }}>
        <header>
          <Title>{t("homepage.name")}</Title>
          <LoadingState>{!showPage}</LoadingState>
          <WelcomeHeader onLoad={() => {
            setTimeout(() => setShowPage(true), 250);
          }} />
        </header>
      </Container>
      <Container sx={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        justifyContent: "center",
        opacity: showPage ? "100%" : "0%",
        transform: `translateY(${showPage ? "0px" : "32px"})`,
        transition: "all 500ms",
      }}>
        <PlayingStatusCard />
        <FriendsPlayingCard />
        <NewsBlock />
      </Container>
    </>
  );
}
DashboardHome.getLayout = function getLayout(page: ReactNode) {
  return <DashboardWrapper>{page}</DashboardWrapper>;
};
