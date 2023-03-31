import Head from "next/head";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Hidden, LinearProgress, useScrollTrigger } from "@mui/material";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import HomepageIcon from "@mui/icons-material/Home";
import PersonalIcon from "@mui/icons-material/AccountCircle";

import Link from "next/link";

import logo from "../../assets/logo.svg";
import ResponsiveDrawer from "./ResponsiveDrawer";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const SetTitleContext = createContext((newtitle: string) => {});

export function Title (props: {
  children: string
}) {
  const setTitle = useContext(SetTitleContext);
  setTitle(props.children);
  return (<></>);
}

export default function DashboardWrapper(props: {
  children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [title, setTitle] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const i18n = useTranslation("dashboard");
  function t(key: string): string | null {
    const val = i18n.t(key);
    return val === key ? null : val;
  }

  useEffect(() => {
    setInterval(() => {
      setTrigger(window.scrollY >= 1);
    }, 100);

    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeError", () => setLoading(false));
    router.events.on("routeChangeComplete", () => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>{title || "NightWorlds"}</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=7" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
      </Head>
      <Box id="dashboardwrapper" component="div" sx={{
        opacity: i18n.ready ? "100%" : "0%",
        transition: "opacity 1s",
      }}>
        <Slide appear={false} direction="down" in>
          <AppBar
            variant="elevation"
            sx={{
              boxShadow: !trigger ? "none" : undefined
            }}
          >
            <Slide appear={false} direction="down" in={loading}>
              <LinearProgress />
            </Slide>
            <Toolbar>
              <Hidden mdUp>
                <Button
                  size="small"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  <MenuIcon />
                </Button>
              </Hidden>
              <Link
                href={"/dashboard/#"}
                legacyBehavior
              >
                <Button sx={{
                  textTransform: "none",
                  p: "8px 16px"
                }}>
                  <img src={logo.src} alt="Home page"
                    style={{
                      maxHeight: "48px"
                    }}
                  />
                  <span style={{
                    flexGrow: "1",
                    fontWeight: 300,
                    fontSize: 26,
                    marginTop: "-2px",
                    marginLeft: "8px",
                    fontFamily: "NightLight Sans",
                    color: "#7f00c9",
                  }}>
                    NightWorlds
                  </span>
                </Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Slide>
        <ResponsiveDrawer
          mobileOpen={mobileOpen}
          handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        >
          <List sx={{ flexGrow: 1 }}>
            {[
              [t("pages.homepage"), "/dashboard/#", <HomepageIcon />],
              [],
              [t("pages.personal"), "/dashboard/personal/#", <PersonalIcon />],
            ].map(cfg => {
              if (cfg.length < 1) return (
                <Divider sx={{ my: 1 }} />
              );
              return (
                <ListItem key={cfg[0] as string} disablePadding>
                  <ListItemButton
                    selected={cfg[0] == title}
                    sx={{
                      transition: "background-color 500ms",
                    }}
                    onClick={() => {
                      setMobileOpen(false);
                      router.replace(cfg[1] as string);
                    }}
                  >
                    <ListItemIcon>{cfg[2]}</ListItemIcon>
                    <ListItemText primary={cfg[0]} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Typography
            color="text.disabled"
            sx={{
              mx: 2,
              mb: 2,
            }}
          >
            NightWorlds v2 Early access
          </Typography>
        </ResponsiveDrawer>
        <Box
          component="main"
          sx={{
            '@media (min-width: 840px)': {
              ml: "280px",
              maxWidth: "calc(100% - 280px)",
            },
            opacity: loading ? "50%" : "100%",
            transition: "opacity 500ms",
          }}
        >
          <Container sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            placeItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}>
            <SetTitleContext.Provider value={setTitle}>
              {props.children}
            </SetTitleContext.Provider>
          </Container>
        </Box>
      </Box>
    </>
  )
}


