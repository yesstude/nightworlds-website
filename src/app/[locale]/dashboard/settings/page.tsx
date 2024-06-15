"use client";

import {
  LoadingState,
  Title,
} from "../../../../components/dashboard/DashboardWrapper";
import { Section } from "../../../../components/Section";

import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { ReactNode, useState } from "react";
import { Paper } from "../../../../components/paper/Paper";

import ForwardArrow from "@mui/icons-material/ArrowForward";

import SettingsDialog from "../../../../components/dashboard/SettingsDialog";
import { useTranslations } from "next-intl";
import { setIngamePassword } from "../../../../server/api/settings";

export default function DashboardSettings() {
  const t = useTranslations("dashboard");

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
    changeIngamePassword: setIngamePassword,
  };

  return (
    <>
      <Title>{t("settings.name")}</Title>
      <LoadingState>{isSaving}</LoadingState>
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
                    onSubmit={async (data) => {
                      if (
                        !data?.password ||
                        typeof data.password != "string" ||
                        data.password.length < 8
                      )
                        return;
                      setIsSaving(true);
                      openDialog();

                      const success = await mutations.changeIngamePassword(
                        data.password
                      );
                      setIsSaving(false);
                      snack(success ? "success" : "error");
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
