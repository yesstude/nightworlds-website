import { ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#7f00c9',
        },
        secondary: {
            main: '#ffffff',
        },
        text: {
            primary: "#170033",
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: [
            'NightLight Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(","),
        h1: {
            fontSize: 38,
        },
        h2: {
            fontSize: 32,
            marginBottom: 16
        },
        h3: {
            fontSize: 26,
            marginBottom: 12
        },
        body1: {
            fontSize: 18,
        },
        button: {
            fontWeight: 600
        }
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                variant: "outlined",
                color: "secondary"
            },
        },
        MuiTypography: {
            defaultProps: {
                color: "text.primary",
                fontWeight: 600
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        }
    },
    spacing: 8,
};