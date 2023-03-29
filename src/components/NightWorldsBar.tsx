import { AppBar, Button, Container, Hidden, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import Link from "next/link";
import logo from "../assets/logo.svg";

export default function NightWorldsBar() {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar>
        <Container>
          <Toolbar>
            <Link href={"/#"} legacyBehavior>
              <img src={logo.src} alt="Home page" style={{
                maxHeight: "48px"
              }} />
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
}

export function LandingAppBar(props: {
  appear: boolean,
  button: string,
  shortbutton: string,
}) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={true} direction="down" in={!trigger && props.appear}>
      <AppBar>
        <Toolbar>
          <img src={logo.src} alt="" style={{
            maxHeight: "48px",
          }} />
          <span style={{
            flexGrow: 1,
            fontWeight: 300,
            fontSize: 26,
            marginTop: -2,
            marginLeft: 4,
            fontFamily: "NightLight Sans",
            color: "#7f00c9"
          }}>
            NightWorlds
          </span>
          <Button
            variant="contained"
            sx={{
              padding: "12px 16px",
              borderRadius: "9999px"
            }}
            disabled
          >
            <Hidden smUp>
              {props.shortbutton}
            </Hidden>
            <Hidden smDown>
              {props.button}
            </Hidden>
          </Button>
        </Toolbar>
      </AppBar>
    </Slide >
  );
}
