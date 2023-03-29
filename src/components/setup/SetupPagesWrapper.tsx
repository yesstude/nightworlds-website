import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import DefaultHead from "../DefaultHead";

import logo from "../../assets/logo.svg";

export default function SetupPagesWrapper(props: {
  children: ReactNode
}) {
  const [t] = useTranslation("setup");

  return <>
    <DefaultHead title={t("page_title") as string} />
    <Box
      component="main"
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <Paper variant="outlined" sx={{
          mt: 4,
          px: 16,
          py: 8,
          maxWidth: "400px"
        }}>
          <Box sx={{
            display: "flex",
            placeItems: "center",
            mt: 4,
            mb: 8,
            textAlign: "left",
          }}>
            <div style={{ flexGrow: 0.5 }} />
            <img src={logo.src} alt="" style={{
              maxHeight: "48px",
            }} />
            <span style={{
              fontWeight: 300,
              fontSize: 26,
              marginTop: -2,
              marginLeft: 8,
              fontFamily: "NightLight Sans",
              color: "#7f00c9"
            }}>
              NightWorlds
            </span>
          </Box>
          <Typography variant="h3" component="h1" mb={8}>
            {t("header")}
          </Typography>
          <Divider sx={{ mb: 8 }} />
          {props.children}
        </Paper>
      </Container>
    </Box>
  </>;
}