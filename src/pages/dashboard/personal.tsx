import { NextPage } from "next";
import DashboardWrapper, { Title } from "../../components/dashboard/DashboardWrapper";

import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import getLocale from "../../components/getLocale";
import { ReactNode } from "react";

export const getServerSideProps = getLocale("dashboard");

export default function DashboardPersonal () {
  const [t, i18n, tr] = useTranslation("dashboard");

  return (
    <>
      <Title>{t("pages.personal")}</Title>
      <Typography>выйди отсюда че ты чекаешь гад</Typography>
    </>
  );
};
DashboardPersonal.getLayout = function getLayout(page: ReactNode) {
  return <DashboardWrapper>{page}</DashboardWrapper>;
};