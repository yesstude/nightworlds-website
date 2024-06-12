import { Spoiler } from "../Spoiler";

import PublicOffer from "./public-offer.mdx";
import PrivacyPolicy from "./privacy-policy.mdx";
import { Typography } from "@mui/material";

export default function Documents() {
  return (
    <>
      <Spoiler title="Договор-оферта">
        <Typography variant="body1" component="div">
          <PublicOffer />
        </Typography>
      </Spoiler>
      <Spoiler title="Политика конфиденциальности">
        <Typography variant="body1" component="div">
          <PrivacyPolicy />
        </Typography>
      </Spoiler>
    </>
  );
}
