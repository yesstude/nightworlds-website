"use client";

import "../../styles/globals.css";

import { ThemeProvider, createTheme } from "@mui/material";
import { themeOptions } from "../../components/ThemeOptions";
import { cygre_font } from "../../fonts/cygre/cygre";

const theme = createTheme(themeOptions);

export default function Theme({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <div className={`${cygre_font}`}>{children}</div>
    </ThemeProvider>
  );
}
