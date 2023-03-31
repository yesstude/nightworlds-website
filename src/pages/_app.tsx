import "../styles/globals.css";
import { type AppType } from "next/app";

import nextI18nConfig from "../../next-i18next.config.mjs";
import { api } from "../utils/api";

import { createTheme, ThemeProvider } from "@mui/material";
import { themeOptions } from "../components/ThemeOptions";

import { appWithTranslation } from "next-i18next";

import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

const theme = createTheme(themeOptions);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  const getLayout = (Component as any).getLayout || ((page: any) => page);

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </ThemeProvider>
  );
};

const I18nApp = appWithTranslation(MyApp, nextI18nConfig);
const TRPCApp = api.withTRPC(I18nApp);

export default TRPCApp;