"use client";

import { Box, Container, Typography } from "@mui/material";

import { Spoiler } from "../../../components/Spoiler";

import PublicOffer from "./public-offer.mdx";
import PrivacyPolicy from "./privacy-policy.mdx";

export default function Documents() {
  return (
    <Box sx={{ my: 4 }}>
      <Spoiler title="Договор-оферта" key="public-offer">
        <Typography variant="body1" component="div">
          <PublicOffer />
        </Typography>
      </Spoiler>
      <Spoiler title="Политика конфиденциальности" key="privacy-policy">
        <Typography variant="body1" component="div">
          <PrivacyPolicy />
        </Typography>
      </Spoiler>
    </Box>
  );
}
