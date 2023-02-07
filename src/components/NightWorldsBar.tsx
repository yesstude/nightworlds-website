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
                <Toolbar>
                    <img src={logo.src} alt="" style={{
                        maxHeight: "48px",
                    }} />
                    <Typography
                        className="flex-grow"
                        fontWeight={300}
                        fontSize={26}
                        mt={-0.5}
                        ml={1}
                        color="primary"
                    >
                        NightWorlds
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            padding: "12px 16px",
                            borderRadius: "9999px"
                        }}
                        disabled
                    >
                        Sign Up and Play
                    </Button>
                </Toolbar>
            </AppBar>
        </Slide >
    );
}