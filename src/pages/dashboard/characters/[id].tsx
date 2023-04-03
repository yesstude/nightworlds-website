import DashboardWrapper, {
  Title,
} from "../../../components/dashboard/DashboardWrapper";

import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

import * as index from "../index";
import { Box, Button, Card, Container } from "@mui/material";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import SkinPreview from "../../../components/skins/SkinPreview";
export const getServerSideProps = index.getServerSideProps;

import ArrowBack from "@mui/icons-material/ArrowBack";

export default function CharacterProfilePage() {
  const [t, i18n, tr] = useTranslation("dashboard");

  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return <Typography>404</Typography>;

  const character = api.characters.get.useQuery(id);

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
      <Typography variant="h1">{character.data.displayname}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
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
          }}
        ></Box>
      </Box>
    </Container>
  );
}
CharacterProfilePage.getLayout = function getLayout(page: ReactNode) {
  return <DashboardWrapper>{page}</DashboardWrapper>;
};
