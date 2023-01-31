import { Box, Paper, Typography } from "@mui/material";

import image from "../../assets/homepage/build.webp";


// TODO
export default function NewsBlock() {
    return (
        <Paper variant="outlined" className="portrait:max-w-[min-content]" sx={{
            maxWidth: "fit-content",
            margin: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap-reverse",
            paddingTop: 8
        }}>
            <Box><img src={image.src} alt="" /></Box>
            <Typography
                variant="h2"
                className="text-center"
                px={4}
                minWidth={"200px"}
            >
                NightWorlds News
            </Typography>
        </Paper>
    );
}