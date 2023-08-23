import Head from "next/head";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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
import HomepageOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CharactersIcon from "@mui/icons-material/People";
import CharactersOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import Link from "next/link";

import logo from "../../assets/logo.svg";
import galaxyShard from "../../assets/galaxyShard.png";

import ResponsiveDrawer from "./ResponsiveDrawer";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const SetTitleContext = createContext((newtitle: string) => {});
const SetCustomLoadingContext = createContext((state: boolean) => {});

const drawerlist = [
  ["homepage.name", "/dashboard/#", <HomepageIcon />, <HomepageOutlinedIcon />],
  [],
  [
    "characters.name",
    "/dashboard/characters/#",
    <CharactersIcon />,
    <CharactersOutlinedIcon />,
  ],
  [
    "settings.name",
    "/dashboard/settings/#",
    <SettingsIcon />,
    <SettingsOutlinedIcon />,
  ],
];

export function Title(props: { children: string }) {
  const setTitle = useContext(SetTitleContext);
  setTitle(props.children);
  return <></>;
}
export function LoadingState(props: { children: boolean }) {
  const setCustomLoading = useContext(SetCustomLoadingContext);
  setCustomLoading(props.children);
  return <></>;
}

export default function DashboardWrapper(props: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const [title, setTitle] = useState<string>();
  const [customLoading, setCustomLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const i18n = useTranslation("dashboard");
  function t(key: string): string | null {
    const val = i18n.t(key);
    return val === key ? null : val;
  }

  const balance = api.me.balance.useQuery();

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=7" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box
        id="dashboardwrapper"
        component="div"
        sx={{
          opacity: i18n.ready ? "100%" : "0%",
          transition: "opacity 1s",
        }}
      >
        <Slide appear={false} direction="down" in>
          <AppBar
            variant="elevation"
            sx={{
              boxShadow: !trigger ? "none" : "#00000020 0px 0px 24px",
            }}
          >
            <Slide
              appear={false}
              direction="down"
              in={loading || customLoading}
            >
              <LinearProgress />
            </Slide>
            <Toolbar>
              <Hidden mdUp>
                <Button size="small" onClick={() => setMobileOpen(!mobileOpen)}>
                  <MenuIcon />
                </Button>
              </Hidden>
              <Link href={"/dashboard/#"} legacyBehavior>
                <Button
                  sx={{
                    textTransform: "none",
                    p: "8px 16px",
                  }}
                >
                  <img
                    src={logo.src}
                    alt="Home page"
                    style={{
                      maxHeight: "48px",
                    }}
                  />
                  <span
                    style={{
                      flexGrow: "1",
                      fontWeight: 300,
                      fontSize: 26,
                      marginTop: "-2px",
                      marginLeft: "8px",
                      fontFamily: "NightLight Sans",
                      color: "#7f00c9",
                    }}
                  >
                    NightWorlds
                  </span>
                </Button>
              </Link>
              <div style={{ flexGrow: 1 }} />
              {balance.data ? (
                <Hidden smDown>
                  <Link href={"/dashboard/#"} legacyBehavior>
                    <Button
                      sx={{
                        textTransform: "none",
                        pl: "16px",
                        pr: "8px",
                        py: "8px",
                      }}
                      variant="outlined"
                    >
                      {balance.data.galaxyshards}
                      <img
                        src={galaxyShard.src}
                        alt="Galaxy shards"
                        style={{
                          width: "auto",
                          height: "32px",
                          imageRendering: "pixelated",
                        }}
                      />
                    </Button>
                  </Link>
                </Hidden>
              ) : (
                ""
              )}
            </Toolbar>
          </AppBar>
        </Slide>
        <ResponsiveDrawer
          mobileOpen={mobileOpen}
          handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        >
          <List sx={{ flexGrow: 1 }}>
            {drawerlist.map((cfg) => {
              if (cfg.length < 1) return <Divider sx={{ my: 1 }} />;
              return (
                <ListItem key={t(cfg[0] as string) as string} disablePadding>
                  <ListItemButton
                    selected={t(cfg[0] as string) == title}
                    sx={{
                      transition: "background-color 500ms",
                    }}
                    onClick={() => {
                      setMobileOpen(false);
                      router.replace(cfg[1] as string);
                    }}
                  >
                    <ListItemIcon>
                      {t(cfg[0] as string) == title ? cfg[2] : cfg[3]}
                    </ListItemIcon>
                    <ListItemText primary={t(cfg[0] as string)} />
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
            "@media (min-width: 840px)": {
              ml: "280px",
              maxWidth: "calc(100% - 280px)",
            },
            opacity: loading ? "50%" : "100%",
            transition: "opacity 500ms",
          }}
        >
          <Container
            sx={{
              mt: 20,
              display: "flex",
              flexDirection: "column",
              placeItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <SetTitleContext.Provider value={setTitle}>
              <SetCustomLoadingContext.Provider value={setCustomLoading}>
                {props.children}
              </SetCustomLoadingContext.Provider>
            </SetTitleContext.Provider>
          </Container>
        </Box>
      </Box>
    </>
  );
}
