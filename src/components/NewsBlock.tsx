import { Box, Card, CardContent, CardMedia, Container, Paper, Typography } from "@mui/material";

import cat from "../assets/cat.png";

export default function NewsBlock() {
  return (
    <Container sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{
        p: 8,
        borderRadius: "22px",
        maxWidth: "100%",
        mx: 8,
      }}>
        <Typography
          variant="h4"
          component="h2"
          mb={8}
        >
          News from NightWorlds
        </Typography>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          gap: "32px",
          overflow: "scroll",
        }}>
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </Box>
      </Paper>
    </Container>
  );
}

function NewsCard() {
  return (
    <Card variant="outlined" sx={{
      background: "#fff",
      maxWidth: "260px",
      maxHeight: "280px",
      minWidth: "260px",
      minHeight: "280px",
      borderRadius: "18px !important",
      p: "0px",
      // border: "#bbb solid 1px !important"
    }}>
      <CardMedia
        image={cat.src}
        sx={{
          height: "200px",
          m: -4,
          borderRadius: "12px"
        }}
      />
      <CardContent sx={{
        mt: "16px",
        px: "4px",
        textAlign: "left",
      }}>
        <Typography component="div">
          <b>NightWorld Medium is now open for everyone!</b>
        </Typography>
        <Typography component="div" mt={2} color="text.disabled">
          EcStud · Today
        </Typography>
      </CardContent>
    </Card>
  );
}