import { GetServerSidePropsContext, NextPage } from "next";
import DashboardWrapper, { Title } from "../../components/dashboard/DashboardWrapper";

import { useTranslation } from "next-i18next";
import getLocale from "../../components/getLocale";
import { api } from "../../utils/api";
import PlayingStatusCard from "../../components/dashboard/homepage/PlayingStatusCard";
import { Container } from "@mui/material";
import NewsBlock from "../../components/NewsBlock";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import WelcomeHeader from "../../components/dashboard/homepage/WelcomeHeader";
import { ReactNode } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState != "finished") return { redirect: { destination: `/setup` } };

  return getLocale("dashboard")(context as any);
}

export default function DashboardHome () {
  const [t, i18n, tr] = useTranslation("dashboard");

  return (
    <Container sx={{
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      justifyContent: "center"
    }}>
      <Title>{t("pages.homepage")}</Title>
      <WelcomeHeader />
      <PlayingStatusCard />
      {/* <NewsBlock /> */}
    </Container>
  );
}
DashboardHome.getLayout = function getLayout(page: ReactNode) {
  return <DashboardWrapper>{page}</DashboardWrapper>;
};
