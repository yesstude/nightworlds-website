import { GetServerSidePropsContext, NextPage } from "next";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";

import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import getLocale from "../../components/getLocale";
import { api } from "../../utils/api";
import PlayingStatusCard from "../../components/dashboard/homepage/PlayingStatusCard";
import { Card, CardContent, Container } from "@mui/material";
import NewsBlock from "../../components/NewsBlock";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { signIn } from "next-auth/react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState != "finished") return { redirect: { destination: `/setup` } };

  return getLocale("dashboard")(context as any);
}

const DashboardHome: NextPage = () => {
  const [t, i18n, tr] = useTranslation("dashboard");

  const user = api.me.profile.useQuery().data;

  return (
    <DashboardWrapper
      name={tr ? "" + t("pages.homepage") : undefined}
      title={
        user ?
          t("homepage.welcome", { name: user.nickname })
          : t("pages.homepage")
      }
    >
      <Container sx={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        {/* <NewsBlock /> */}
        <Card variant="outlined" sx={{
          width: "300px",
          px: 4,
        }}>
          <CardContent sx={{
            textAlign: "left",
          }}>
            <Typography variant="body2" component="div">
              Ранний доступ
            </Typography>
            <Typography
              component="div"
              color="text.disabled"
            >
              Если вы видите этот текст, это значит, что у вас есть ранний доступ к NightWorlds v2 и NightWorld Medium 4
            </Typography>
          </CardContent>
        </Card>
        <PlayingStatusCard />
      </Container>
    </DashboardWrapper>
  );
}

export default DashboardHome;
