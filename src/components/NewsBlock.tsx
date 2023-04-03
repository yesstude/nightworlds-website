import { Box, Button, Card, CardContent, CardMedia, Container, IconButton, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

import cat from "../assets/cat.png";
import LeftArrowIcon from "@mui/icons-material/ArrowBackIosNew";
import RightArrowIcon from "@mui/icons-material/ArrowForwardIos";

import { useTranslation } from "next-i18next";
import { api } from "../utils/api";

export default function NewsBlock() {
  const [t, i18n, tr] = useTranslation("dashboard");

  const [animation, setAnimation] = useState(false);
  const [page, setPage] = useState(0);

  const news = api.news.preview.useQuery().data;

  if (!news || news.length <= 0) return (<></>);

  function switchPage (amount: number) {
    setAnimation(val => !val);
    setTimeout(() => setPage(val => Math.max(Math.min(val + amount, news!.length-1), 0)), 250);
    setTimeout(() => setAnimation(val => !val), 250);
  }

  return (
    <Paper variant="outlined" sx={{
      p: 8,
    }}>
      <Typography
        variant="h4"
        component="h2"
        mb={8}
      >
        {t("homepage.news.title")}
      </Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        rowGap: 8,
        columnGap: 16,
        textAlign: "left",
        opacity: animation ? "0%" : "100%",
        transition: "opacity 250ms",
      }}>
        <Image
          src={news[page]!.image.src}
          width={news[page]!.image.width}
          height={news[page]!.image.height}
          alt={news[page]!.title}
          style={{
            borderRadius: "24px",
            maxWidth: "70vw",
            width: "auto",
            maxHeight: "300px",
            height: "auto"
          }}
        />
        <Box sx={{ maxWidth: "400px", flexGrow: 1 }}>
          <Typography variant="h5" component="div">
            <b>{news[page]!.title}</b>
          </Typography>
          <Typography component="div" mt={2} color="text.disabled">
            {news[page]!.author} · {news[page]!.date.toLocaleDateString()}
          </Typography>
          <Typography mt={4} component="div">
            {news[page]!.preview}
          </Typography>
          <Button
            sx={{
              p: "16px",
              borderRadius: "9999px",
              mt: 8,
              mx: 2,
            }}
            variant="outlined"
            disabled={page <= 0}
            onClick={() => {
              if (page > 0) switchPage(-1);
            }}
          >
            <LeftArrowIcon />
          </Button>
          <Button
            sx={{
              p: "16px",
              borderRadius: "9999px",
              mt: 8,
              mx: 2,
            }}
            variant={news.length - 1 == page ? "contained" : "outlined"}
            onClick={() => {
              if (news.length - 1 > page) switchPage(1);
            }}
          >
            <RightArrowIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

function NewsCard() {
  return (
    <Card variant="outlined" sx={{
      display: "flex",
      background: "#fff",
      // maxWidth: "260px",
      maxHeight: "280px",
      minWidth: "800px",
      minHeight: "280px",
      borderRadius: "18px !important",
      p: "0px",
      scrollSnapAlign: "center",
      // border: "#bbb solid 1px !important"
    }}>
      <CardMedia
        image={cat.src}
        sx={{
          height: "200px",
          // m: -8,
          borderRadius: "12px"
        }}
      />
      <CardContent sx={{
        mt: 8,
        px: "4px",
        textAlign: "left",
      }}>
        <Typography variant="h5" component="div">
          <b>NightWorld Medium is now open for everyone!</b>
        </Typography>
        <Typography component="div" mt={2} color="text.disabled">
          EcStud · Today
        </Typography>
      </CardContent>
    </Card>
  );
}