import { Title } from "../../../components/dashboard/DashboardWrapper";

import { Container } from "@mui/material";
import { getTranslations } from "next-intl/server";
import NewsBlock from "../../../components/NewsBlock";
import FriendsPlayingCard from "../../../components/dashboard/homepage/FriendsPlayingCard";
import PlayingStatusCard from "../../../components/dashboard/homepage/PlayingStatusCard";
import WelcomeHeader from "../../../components/dashboard/homepage/WelcomeHeader";

export default async function DashboardHome() {
  const t = await getTranslations("dashboard");

  return (
    <>
      <Container className="flex justify-center">
        <header>
          <Title>{t("homepage.name")}</Title>
          <WelcomeHeader />
        </header>
      </Container>
      <Container className="flex flex-wrap justify-center gap-4">
        <PlayingStatusCard />
        <FriendsPlayingCard />
        {/* <NewsBlock /> */}
      </Container>
    </>
  );
}
