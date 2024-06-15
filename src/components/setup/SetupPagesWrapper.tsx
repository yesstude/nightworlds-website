"use client";

import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import DefaultHead from "../DefaultHead";

import { useTranslations } from "next-intl";
import logo from "../../assets/logo.svg";

export default function SetupPagesWrapper(props: { children: ReactNode }) {
  const t = useTranslations("setup");

  return (
    <>
      <DefaultHead title={t("page_title") as string} />
      <Box component="main">
        <Container className="flex flex-col place-items-center text-center">
          <Paper variant="outlined" className="mt-4 max-w-96 px-16 py-8">
            <Box className="mb-8 mt-4 flex place-items-center text-left">
              <div style={{ flexGrow: 0.5 }} />
              <img src={logo.src} alt="" className="max-h-12" />
              <span className="ml-3 mt-1 text-2xl font-light text-[#7f00c9]">
                NightWorlds
              </span>
            </Box>
            <Typography variant="h3" component="h1" className="mb-8">
              {t("header")}
            </Typography>
            <Divider sx={{ mb: 8 }} />
            {props.children}
          </Paper>
        </Container>
      </Box>
    </>
  );
}
