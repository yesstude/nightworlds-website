import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { themeOptions } from "../components/ThemeOptions";

const theme = createTheme(themeOptions);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
