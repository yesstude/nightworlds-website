import { Box, Button, Card, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import getLocale from "../../components/getLocale";
import SetupPagesWrapper from "../../components/setup/SetupPagesWrapper";
import { authOptions } from "../../server/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState !== "finished") return { redirect: { destination: `/setup` } };

  return getLocale("setup")(context as any);
}

const AdditionalSetupPage: NextPage = () => {
  const [t] = useTranslation("setup");

  return (
    <SetupPagesWrapper>
      <Typography variant="h4" component="h2">
        {t("additional.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {t("additional.subtitle")}
      </Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "stretch",
        flexWrap: "wrap",
        pt: 8,
        gap: "16px",
        textAlign: "left"
      }}>
        <ActionCard href="/dashboard">
          <Typography variant="h5" component="div">
            {t("additional.actions.dashboard")}
          </Typography>
        </ActionCard>
      </Box>
    </SetupPagesWrapper>
  );
}

function ActionCard(props: {
  children: ReactNode,
  href: URL | string
}) {
  const router = useRouter();

  return (
    <Button variant="outlined" component="div" sx={{
      background: "#fff",
      width: "110px",
      flexGrow: 1,
      cursor: "pointer",
      border: "none !important",
      display: "block !important",
      borderRadius: "12px",
      textTransform: "none"
    }} onClick={() => router.replace(props.href)}>
      {props.children}
    </Button >
  );
}

export default AdditionalSetupPage;