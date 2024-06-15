import { Box, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { getProfile } from "../../../server/api/auth";

export default async function WelcomeHeader(props: { onLoad?: () => void }) {
  const t = await getTranslations("dashboard");
  const user = (await getProfile())!;
  props.onLoad?.();

  const avatar = user?.avatar || "";
  const name = user?.nickname || "";

  return (
    <Box
      sx={{
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
