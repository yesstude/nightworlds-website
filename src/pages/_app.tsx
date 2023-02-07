import "../styles/globals.css";
import { type AppType } from "next/app";

import nextI18nConfig from "../../next-i18next.config.mjs";
import { api } from "../utils/api";

import { createTheme, ThemeProvider } from "@mui/material";
import { themeOptions } from "../components/ThemeOptions";
import { appWithTranslation } from "next-i18next";

const theme = createTheme(themeOptions);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

const I18nApp = appWithTranslation(MyApp, nextI18nConfig);
const TRPCApp = api.withTRPC(I18nApp);

export default TRPCApp;