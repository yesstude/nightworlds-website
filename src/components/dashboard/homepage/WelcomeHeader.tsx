import { Box, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { api } from "../../../utils/api";

export default function WelcomeHeader () {
    const [t, i18n, tr] = useTranslation("dashboard");
    const user = api.me.profile.useQuery().data;

    const name = user?.nickname || "";

    return (
        <Box sx={{
            opacity: tr && user ? "100%" : "0%",
            transform: `translateY(${tr && user ? "0px" : "32px"})`,
            transition: "all 500ms",
            width: "100%",
            mb: 8
        }}>
            <img
                style={{
                    borderRadius: "16px"
                }}
                src={`https://minotar.net/helm/${name}/128.png`}
                alt="Your Minecraft skin"
                width="128"
                height="128"
            />
            <Typography variant="h3" component="div" sx={{ mt: 6 }}>
                {t("homepage.welcome", {name})}
            </Typography>
        </Box>
    );
}