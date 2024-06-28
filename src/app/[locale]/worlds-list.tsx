"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import { World, getAllWorlds } from "../../server/api/worlds";
import Link from "next/link";
import Image from "next/image";

import nwm4 from "../../assets/homepage/nwm4.svg";
import { use, useEffect, useState } from "react";

export default function WorldsList() {
  const [worlds, setWorlds] = useState<World[]>([]);

  useEffect(() => {
    (async () => {
      setWorlds(await getAllWorlds());
    })();
  }, []);

  if (worlds.length < 1) return <></>;
  return (
    <Paper variant="outlined" className="px-12 py-11">
      <Typography variant="h2">Текущие сервера</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          mt: 8,
          gap: 4,
          overflowX: "scroll",
        }}
      >
        {worlds.map((w) => (
          <WorldCard key={w.name} world={w} />
        ))}
      </Box>
    </Paper>
  );
}

function WorldCard(props: { world: World }) {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#efe1f7",
        minWidth: "320px",
        maxWidth: "320px",
        p: "0 !important",
      }}
    >
      <Link
        href={`/worlds/${props.world.name}`}
        style={{ textDecoration: "unset" }}
      >
        <CardActionArea>
          <CardMedia
            sx={{
              backgroundColor: "#a4e2ff",
              p: 8,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image alt={props.world.displayName} src={nwm4} width="180" />
          </CardMedia>
          <CardContent sx={{ p: 8 }}>
            <Typography variant="h3">{props.world.displayName}</Typography>
            <Typography fontWeight={400}>
              {props.world.description || "Нет описания"}
            </Typography>
            <Typography sx={{ mt: 4, mb: 0 }} fontWeight={600} variant="h4">
              {/* 69₽ / месяц */}
              Бесплатно
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
