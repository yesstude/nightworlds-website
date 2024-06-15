"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactNode, use, useEffect, useState } from "react";
import { getLastPlayed } from "../../../../server/api/me";

export default function PlayingStatusCard() {
  const t = useTranslations("dashboard");

  let status: Awaited<ReturnType<typeof getLastPlayed>> | undefined;

  useEffect(() => {
    setInterval(async () => {
      status = await getLastPlayed();
    }, 5000);
  }, []);

  if (!status)
    return (
      <UniCard
        title={t("homepage.playing_card.first")}
        subtitle={t("homepage.playing_card.neverplayed")}
        artcolor="#b392c6"
        button={
          <Button variant="contained" size="small" disableElevation disabled>
            {t("homepage.playing_card.play")}
          </Button>
        }
      />
    );
  if (!status.stopped)
    return (
      <PlayingServer
        server={status.server}
        gameStarted={status.started.getTime()}
      />
    );
  return (
    <LastServer
      server={status.server}
      gameStarted={status.started}
      gameEnded={status.stopped}
    />
  );
}

function parseTimePassed(start: number, end: number): string {
  return (
    Math.floor((end - start) / 60 / 60) +
    ":" +
    ("00" + (Math.floor((end - start) / 60) % 60)).slice(-2) +
    ":" +
    ("00" + (Math.floor(end - start) % 60)).slice(-2)
  );
}

export function LastServer(props: {
  server: string;
  gameStarted: Date;
  gameEnded: Date;
}) {
  const t = useTranslations("dashboard");

  const parsedTime = parseTimePassed(
    props.gameStarted.getTime(),
    props.gameEnded.getTime()
  );

  return (
    <UniCard
      title={props.server}
      subtitle={t("homepage.playing_card.played", {
        server: props.server,
        parsedTime,
      })}
      artcolor="#b392c6"
      button={
        <Button variant="contained" size="small" disableElevation>
          {t("homepage.playing_card.play")}
        </Button>
      }
    />
  );
}

export function PlayingServer({
  server,
  gameStarted,
}: {
  server: string;
  gameStarted: number;
}) {
  const t = useTranslations("dashboard");

  const [parsedTime, setParsedTime] = useState("");

  useEffect(() => {
    setInterval(() => {
      setParsedTime(parseTimePassed(gameStarted, Date.now() / 1000));
    }, 1000);
  }, []);

  return (
    <UniCard
      title={server}
      subtitle={t("homepage.playing_card.playing", { server, parsedTime })}
      artcolor="#7ec181"
      background="#e5ffe4"
      button={
        <Button
          variant="outlined"
          size="small"
          color="error"
          disableElevation
          disabled
        >
          {t("homepage.playing_card.leave")}
        </Button>
      }
    />
  );
}

export function UniCard(props: {
  title: string;
  subtitle: string;
  artcolor: string;
  background?: string;
  button?: ReactNode;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        placeItems: "center",
        flexWrap: "wrap-reverse",
        gap: "32px",
        textAlign: "left",
        background: props.background,
      }}
    >
      <Box
        sx={{
          width: "165px",
          flexGrow: 1,
        }}
      >
        <Typography variant="body2" component="div">
          {props.title}
        </Typography>
        <Typography component="div" sx={{ mb: "16px" }}>
          {props.subtitle}
        </Typography>
        {props.button}
      </Box>
      <Box>
        <svg
          width="205"
          height="95"
          viewBox="0 0 205 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M129.832 64.9987C128.81 49.9987 137.407 45.9987 145.865 42.8913L156.239 39.4009L166.613 35.9105C179.644 30.4987 186.897 34.5978 190.49 40C199.524 53.5835 206.535 69.4165 201.084 73.2482C195.632 77.0799 181.851 59.0877 178.407 58.4987C171.812 64.3731 169.22 62.2159 165.407 63.4987C161.595 64.7816 160.351 70.4749 151.141 68.3307C148.753 70.8816 149.229 93.0373 141.425 93.321C133.621 93.6047 131.987 79.1343 129.832 64.9987ZM129.832 64.9987C129.359 61.8995 130.03 67.921 129.832 64.9987ZM153.704 22.9434C142.617 -1.97457 112.971 -16.9962 103.47 48.2635C93.9703 113.523 63.9225 81.4083 48.4015 70.034M53.0552 30.3417L35.5916 14.0907C35.1677 13.6963 34.5922 13.5227 34.02 13.6107L10.028 17.298M53.0552 30.3417L28.9534 33.1733M53.0552 30.3417L45.5114 55.2264C45.2966 55.9352 44.6896 56.4482 43.9556 56.5477L20.9212 59.669M28.9534 33.1733L10.028 17.298M28.9534 33.1733L20.9212 59.669M10.028 17.298L2.48896 42.1671C2.2725 42.8812 2.49565 43.6558 3.05883 44.1452L20.9212 59.669"
            stroke={props.artcolor}
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </Box>
    </Card>
  );
}
