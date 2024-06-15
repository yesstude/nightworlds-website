"use client";

import DashboardWrapper, {
  Title,
} from "../../../../../components/dashboard/DashboardWrapper";

import Typography from "@mui/material/Typography";
import { ReactNode, useState } from "react";

import { Box, Button, Card, Container } from "@mui/material";
import { api } from "../../../../../utils/api";
import { useRouter } from "next/router";
import SkinPreview from "../../../../../components/skins/SkinPreview";

import ArrowBack from "@mui/icons-material/ArrowBack";
import { useTranslations } from "next-intl";

export default function CharacterProfilePage() {
  const t = useTranslations("dashboard");

  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return <Typography>404</Typography>;

  const character = api.characters.get.useQuery(id);

  const [isAvatar, setIsAvatar] = useState(!!character?.data?.isYourAvatar);

  const setAvatar = api.characters.setAvatar.useMutation();

  if (!character.data) {
    if (!character.isFetched) return <></>;
    else return <Typography>404</Typography>;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        placeItems: "center",
      }}
    >
      <Title>{character.data.displayname}</Title>
      <Button
        color="info"
        sx={{ my: 1 }}
        onClick={() => {
          router.replace("/dashboard/characters");
        }}
      >
        <ArrowBack sx={{ mr: 1 }} />
        <span>{t("back_button")}</span>
      </Button>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "80px !important",
          background: "#f7effc8a !important",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ textAlign: "left", ml: "16px" }}
        >
          {character.data.displayname}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <Card variant="outlined" sx={{ borderRadius: "64px !important" }}>
            <SkinPreview
              fov={10}
              url={character.data.skin}
              style={
                {
                  "max-width": "70vw",
                  "max-height": "auto",
                } as any
              }
            />
          </Card>
          <Box
            sx={{
              maxWidth: "500px",
              py: 2,
            }}
          >
            <Button
              variant="contained"
              disabled={isAvatar}
              onClick={() => {
                setIsAvatar(true);
                setAvatar.mutateAsync(id).then(() => {
                  character.refetch();
                });
              }}
              sx={{ borderRadius: "24px !important", maxWidth: "160px" }}
            >
              {isAvatar
                ? t("characters.actions.avataralready")
                : t("characters.actions.avatar")}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
