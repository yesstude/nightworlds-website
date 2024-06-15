import { Box, Button, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AdditionalSetupPage() {
  const t = await getTranslations("setup");

  return (
    <>
      <Typography variant="h4" component="h2">
        {t("additional.title")}
      </Typography>
      <Typography variant="body2" component="div">
        {t("additional.subtitle")}
      </Typography>
      <Box className="flex flex-row flex-wrap justify-stretch gap-4 pt-8 text-left">
        <ActionCard href="/dashboard">
          <Typography variant="h5" component="div">
            {t("additional.actions.dashboard")}
          </Typography>
        </ActionCard>
      </Box>
    </>
  );
}

function ActionCard(props: { children: ReactNode; href: URL | string }) {
  return (
    <Link href={props.href}>
      <Button
        variant="outlined"
        component="div"
        className="min-w-28 flex-grow cursor-pointer rounded-xl bg-white"
        style={{
          border: "none !important",
          display: "block !important",
          textTransform: "none",
        }}
      >
        {props.children}
      </Button>
    </Link>
  );
}
