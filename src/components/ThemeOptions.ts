import { PaletteOptions, ThemeOptions } from "@mui/material";

const palette: PaletteOptions = {
  primary: {
    main: "#9c42d0",
    light: "#c178ec",
  },
  secondary: {
    main: "#ffffff",
  },
  error: {
    main: "#f55",
    light: "#ef5350",
  },
  info: {
    main: "#aaa",
  },
  text: {
    primary: "#111",
    secondary: "#170033",
    disabled: "#4a4a4a",
  },
  background: {
    default: "#fdf5ff",
    paper: "#f7effc",
  },
};

export const themeOptions: ThemeOptions = {
  palette,
  components: {
    MuiCard: {
      defaultProps: {
        style: {
          borderRadius: "24px",
          padding: "32px",
          border: "none",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        variant: "outlined",
        color: "secondary",
      },
    },
    MuiPaper: {
      defaultProps: {
        style: {
          border: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        sx: { m: 1 },
      },
      styleOverrides: {
        sizeSmall: {
          padding: "8px 32px",
          borderRadius: "12px",
        },
        sizeMedium: {
          padding: "10px 32px",
        },
        sizeLarge: {
          padding: "16px 32px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          ":is(.Mui-selected)": {
            background: "#efdff8",
            " .MuiTypography-root": {
              color: palette.text!.secondary!,
            },
            " .MuiListItemIcon-root": {
              color: `${palette.text!.secondary!} !important`,
            },
          },
          " .MuiTypography-root": {
            color: palette.text!.disabled!,
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          marginLeft: "8px",
          minWidth: "40px",
        },
      },
    },
    MuiListItemText: {
      defaultProps: {
        sx: {
          " .MuiTypography-root": {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        sx: { m: 1 },
        InputLabelProps: {
          sx: {
            px: 2,
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
  shape: {
    borderRadius: 48,
  },
  typography: {
    fontFamily: [
      "NightLight Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    allVariants: {
      // letterSpacing: "-0.3px",
      color: palette.text!.secondary!,
    },
    h1: {
      fontWeight: 600,
      fontSize: 52,
      marginBottom: 20,
      "@media (min-width: 600px)": {
        fontSize: 64,
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: 38,
      marginBottom: 16,
      "@media (min-width: 600px)": {
        fontSize: 48,
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: 26,
      marginBottom: 12,
      "@media (min-width: 600px)": {
        fontSize: 36,
      },
    },
    h4: {
      fontWeight: 400,
      fontSize: 22,
      marginBottom: 12,
      "@media (min-width: 600px)": {
        fontSize: 26,
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: 16,
      marginBottom: 2,
      "@media (min-width: 600px)": {
        fontSize: 20,
      },
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: 16,
      marginTop: -8,
      marginBottom: 12,
      "@media (min-width: 600px)": {
        fontSize: 26,
        marginTop: -16,
      },
    },
    body1: {
      fontSize: 14,
      lineHeight: 1.25,
      fontWeight: 400,
      "@media (min-width: 600px)": {
        fontSize: 16,
      },
    },
    body2: {
      fontWeight: 600,
      fontSize: 15,
      marginBottom: -4,
      "@media (min-width: 600px)": {
        fontSize: 17,
      },
    },
    button: {
      fontWeight: 600,
    },
  },
  spacing: 4,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1240,
      xl: 1440,
    },
  },
};
