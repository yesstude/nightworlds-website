import DashboardWrapper, {
  Title,
} from "../../components/dashboard/DashboardWrapper";

import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

import * as index from "./index";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  useTheme,
} from "@mui/material";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
export const getServerSideProps = index.getServerSideProps;

export default function DashboardCharactersPage() {
  const [t, i18n, tr] = useTranslation("dashboard");

  const router = useRouter();

  const palette = useTheme().palette;

  const count = api.characters.count.useQuery().data;
  const characters = api.characters.list.useQuery({}).data;

  return (
    <Container>
      <Title>{t("characters.name")}</Title>
      <Box sx={{ my: 6 }}>
        <Typography variant="h1">{t("characters.name")}</Typography>
        <Typography variant="subtitle1">
          {t("characters.subtitle.v", { count: count?.characters || 0 })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {(characters || [0]).length < 1 && (
          <Button
            sx={{
              border: `${palette.primary.main} 1px solid !important`,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                background: "none",
                transition: "background 500ms",
                textTransform: "none",
              }}
            >
              <Box
                sx={{
                  height: "192px",
                  width: "192px",
                  color: palette.primary.main,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h1"
                  component="div"
                  color="primary"
                  sx={{
                    fontWeight: "100 !important",
                    fontSize: "8em !important",
                  }}
                >
                  +
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="subtitle1" component="div">
                  {t("characters.create")}
                </Typography>
              </CardContent>
            </Card>
          </Button>
        )}
        {(characters || []).map((ch: any) => (
          <Button
            onClick={() => {
              router.replace(`/dashboard/characters/${ch.id}`);
            }}
          >
            <Card
              key={ch.id}
              variant="outlined"
              sx={{
                background: "none",
                transition: "background 500ms",
                textTransform: "none",
              }}
            >
              <CardMedia
                image={ch.previewImage}
                sx={{ height: "192px", width: "192px" }}
              />
              <CardContent>
                <Typography variant="subtitle1" component="div">
                  {ch.displayname}
                </Typography>
              </CardContent>
            </Card>
          </Button>
        ))}
      </Box>
    </Container>
  );
}
DashboardCharactersPage.getLayout = function getLayout(page: ReactNode) {
  return <DashboardWrapper>{page}</DashboardWrapper>;
};
