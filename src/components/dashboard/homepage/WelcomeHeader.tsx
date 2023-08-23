import { Box, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { api } from "../../../utils/api";

export default function WelcomeHeader(props: { onLoad?: () => void }) {
  const [t, i18n, tr] = useTranslation("dashboard");
  const user = api.me.profile.useQuery(undefined, {
    onSuccess: props.onLoad,
  }).data;

  const avatar = user?.avatar || "";
  const name = user?.nickname || "";

  return (
    <Box
      sx={{
        opacity: tr && user ? "100%" : "0%",
        transform: `translateY(${tr && user ? "0px" : "32px"})`,
        transition: "all 500ms",
        width: "100%",
        mb: 8,
      }}
    >
      <img
        style={{
          borderRadius: "16px",
        }}
        src={avatar}
        alt="Your character picture"
        width="128"
        height="128"
      />
      <Typography variant="h3" component="div" sx={{ mt: 6 }}>
        {t("homepage.welcome", { name })}
      </Typography>
    </Box>
  );
}
