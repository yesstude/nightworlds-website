import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { ReactNode } from "react";
import NightWorldsBar from "./NightWorldsBar";

export default function DefaultContainer(props: {
    children?: ReactNode
}) {
    return (
        <>
            <header>
                <NightWorldsBar />
            </header>
            <main>
                <Container>
                    <Box sx={{ my: 10 }}>
                        {props.children}
                    </Box>
                </Container>
            </main>
        </>
    );
}