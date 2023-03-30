import { NextPage } from "next";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";

import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import getLocale from "../../components/getLocale";

export const getServerSideProps = getLocale("dashboard");

const DashboardPersonal: NextPage = () => {
  const i18n = useTranslation("dashboard");
  function t(key: string): string | undefined {
    const val = i18n.t(key);
    return val === key ? undefined : val;
  }

  return (
    <DashboardWrapper
      name={t("pages.personal")}
    >
      <Typography>выйди отсюда че ты чекаешь гад</Typography>
    </DashboardWrapper>
  );
}

export default DashboardPersonal;