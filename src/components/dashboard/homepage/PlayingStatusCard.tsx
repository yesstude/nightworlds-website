import { Box, Button, Card, CardContent, lighten, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { api } from "../../../utils/api";

import playing from "../../../assets/dashboard/playingstatus/playing.png";
import played from "../../../assets/dashboard/playingstatus/played.png";

export default function PlayingStatusCard() {
  const statusQuery = api.me.lastplayed.useQuery();
  const status = statusQuery.data;

  useEffect(() => {
    setInterval(() => {
      statusQuery.refetch();
    }, 5000);
  }, [])

  if (!status) return <></>;
  if (!status.stopped) return <PlayingServer
    server={status.server}
    gameStarted={status.started.getTime()}
  />
  return <LastServer
    server={status.server}
    gameStarted={status.started}
    gameEnded={status.stopped}
  />
}

function parseTimePassed(start: number, end: number): string {
  return (Math.floor((end - start) / 60 / 60))
    + ":" +
    ("00" + Math.floor(((end) - start) / 60) % 60).slice(-2)
    + ":" +
    ("00" + Math.floor((end - start)) % 60).slice(-2);
}

function LastServer(props: {
  server: string,
  gameStarted: Date,
  gameEnded: Date
}) {
  const [t] = useTranslation("dashboard");

  const parsedTime = parseTimePassed(props.gameStarted.getTime(), props.gameEnded.getTime());

  return (
    <Card variant="outlined" sx={{
      maxWidth: "600px",
      minWidth: "300px",
      py: 8,
      px: 4,
    }}>
      <CardContent sx={{
        textAlign: "left",
        display: "flex",
        gap: "16px",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          placeItems: "center",
          justifyContent: "center",
          px: 12,
          flexShrink: 1,
          maxWidth: "160px",
        }}>
          <Image src={played} alt="Game" style={{
            display: "block",
            width: "100%",
            height: "auto",
            maxWidth: "128px",
          }} />
        </Box>
        <Box sx={{
          maxWidth: "220px",
        }}>
          <Typography variant="body2" component="div">
            {props.server}
          </Typography>
          <Typography
            component="div"
            color="text.disabled"
          >
            {t("homepage.playing_card.played", { parsedTime, server: props.server })}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            size="small"
            sx={{ mt: 4, borderRadius: 9999 }}
          >
            {t("homepage.playing_card.play")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function PlayingServer({ server, gameStarted }: {
  server: string,
  gameStarted: number
}) {
  const [t] = useTranslation("dashboard");

  const [parsedTime, setParsedTime] = useState("");

  useEffect(() => {
    setInterval(() => {
      setParsedTime(parseTimePassed(gameStarted, Date.now() / 1000));
    }, 1000)
  }, []);

  return (
    <Card variant="outlined" sx={{
      maxWidth: "600px",
      minWidth: "300px",
      background: "#35fe311f",
      py: 8,
      px: 4,
    }}>
      <CardContent sx={{
        textAlign: "left",
        display: "flex",
        gap: "16px",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          placeItems: "center",
          justifyContent: "center",
          px: 12,
          flexShrink: 1,
          maxWidth: "160px",
        }}>
          <Image src={playing} alt="Game" style={{
            display: "block",
            width: "100%",
            height: "auto",
            maxWidth: "128px",
          }} />
        </Box>
        <Box sx={{
          maxWidth: "220px",
        }}>
          <Typography variant="body2" component="div">
            {server}
          </Typography>
          <Typography
            component="div"
            color="text.disabled"
          >
            {t("homepage.playing_card.playing", { parsedTime })}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="error"
            sx={{ mt: 4, borderRadius: 9999 }}
          >
            {t("homepage.playing_card.leave")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}