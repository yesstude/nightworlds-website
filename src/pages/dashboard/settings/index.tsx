import { GetServerSidePropsContext } from "next";
import getLocale from "../../../components/getLocale";
import { getServerAuthSession } from "../../../server/auth";
import DashboardWrapper, {
  LoadingState,
  Title,
} from "../../../components/dashboard/DashboardWrapper";
import { useTranslation } from "next-i18next";
import { Section } from "../../../components/Section";

import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { ReactNode, useState } from "react";
import { Paper } from "../../../components/paper/Paper";

import ForwardArrow from "@mui/icons-material/ArrowForward";

import SettingsDialog from "../../../components/dashboard/SettingsDialog";
import { api } from "../../../utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) return { redirect: { destination: `/auth/signin` } };
  if (session.user.regState != "finished")
    return { redirect: { destination: `/setup` } };

  return getLocale("dashboard")(context as any);
}

export default function DashboardSettings() {
  const i18n = useTranslation("dashboard");
  const { t } = i18n;

  const [openedDialog, setOpenedDialog] = useState<ReactNode | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [snackbar, setSnackbar] = useState<SnackbarProps | undefined>();
  function snack(severity: "success" | "error") {
    if (severity === "success") {
      setSnackbar({
        children: <Alert severity="success">{t("settings.saved")}</Alert>,
      });
    } else {
      setSnackbar({
        children: <Alert severity="error">{t("settings.error")}</Alert>,
      });
    }
  }

  const openDialog = (dialog?: ReactNode) => {
    setIsDialogOpen(false);
    if (dialog)
      setTimeout(() => {
        setOpenedDialog(dialog);
        setIsDialogOpen(true);
      }, 200);
  };

  const mutations = {
    changeIngamePassword: api.settings.changeIngamePassword.useMutation(),
  };

  return (
    <>
      <Title>{t("settings.name")}</Title>
      <LoadingState>{!i18n.ready || isSaving}</LoadingState>
      {snackbar && (
        <Snackbar
          {...snackbar}
          open
          autoHideDuration={3000}
          onClose={() => setSnackbar(undefined)}
        />
      )}
      <Dialog
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            padding: 4,
          },
        }}
        open={isDialogOpen}
        onClose={() => openDialog()}
      >
        {openedDialog}
      </Dialog>
      <Section margins={3}>
        <Typography variant="h1">{t("settings.name")}</Typography>
        <Typography variant="subtitle1">{t("settings.subtitle")}</Typography>
      </Section>
      <Section
        margins={3}
        style={{ minWidth: "80%", width: "340px", textAlign: "left" }}
      >
        <Section margins={2}>
          <Typography ml={2} variant="h4" component="h2">
            {t("settings.sections.security.name")}
          </Typography>
          <Section radius={2}>
            <FullWidthButton
              title={t("settings.sections.security.ingamepassword.name")}
              onClick={() => {
                openDialog(
                  <SettingsDialog
                    title={t("settings.sections.security.ingamepassword.name")}
                    blocks={[
                      {
                        name: "password",
                        type: "password",
                        labelkey:
                          "settings.sections.security.ingamepassword.new",
                      },
                    ]}
                    onSubmit={(data) => {
                      if (
                        !data?.password ||
                        typeof data.password != "string" ||
                        data.password.length < 8
                      )
                        return;
                      setIsSaving(true);
                      openDialog();

                      mutations.changeIngamePassword
                        .mutateAsync({
                          password: data.password,
                        })
                        .then((success) => {
                          setIsSaving(false);
                          snack(success ? "success" : "error");
                        });
                    }}
                    onClose={openDialog}
                  />
                );
              }}
            />
          </Section>
        </Section>
      </Section>
    </>
  );
}

function FullWidthButton(props: { title: string; onClick: () => void }) {
  return (
    <Paper
      variant="outlined"
      paddings={6}
      radius={0.25}
      style={{ display: "flex" }}
      onClick={props.onClick}
    >
      <Typography ml={2} sx={{ flexGrow: 1 }}>
        {props.title}
      </Typography>
      <ForwardArrow />
    </Paper>
  );
}

DashboardSettings.getLayout = function getLayout(page: ReactNode) {
  return <DashboardWrapper>{page}</DashboardWrapper>;
};
