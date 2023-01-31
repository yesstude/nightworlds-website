import { AppBar, Button, Container, Slide, Toolbar, Typography, useScrollTrigger } from "@mui/material";
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
    appear: boolean
}) {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={true} direction="down" in={!trigger && props.appear}>
            <AppBar>
                <Toolbar className="select-none">
                    <img src={logo.src} alt="" style={{
                        maxHeight: "48px",
                    }} />
                    <Typography
                        variant="body1"
                        className="-mt-1 ml-2 font-light flex-grow"
                        fontSize={26}
                        color="primary"
                    >
                        NightWorlds
                    </Typography>
                    <Button
                        variant="contained"
                        className="rounded-full px-5 py-3"
                        disabled
                    >
                        Sign Up and Play
                    </Button>
                </Toolbar>
            </AppBar>
        </Slide >
    );
}