import { Box, Container, Paper, Typography } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import AppearingText from "../components/homepage/AppearingText";
import { ReactNode, useState } from "react";
import { LandingAppBar } from "../components/NightWorldsBar";

import build from "../assets/homepage/build.webp";
import communicate from "../assets/homepage/communicate.webp";
import simplicity from "../assets/homepage/simplicity.webp";
import { StaticImageData } from "next/image";
import Copyright from "../components/Copyright";

const FeatureBox = (props: {
  img: StaticImageData,
  header: string,
  children: ReactNode,
  reverse?: boolean,
}) => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: props.reverse ? "row-reverse" : "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 4,
      mb: 20,
    }}>
      <img src={props.img.src} alt="" width={480} height={384} />
      <Box sx={{
        minWidth: 420,
        width: 420,
        m: "auto",
        mt: 2
      }}>
        <Typography
          variant="h2"
          fontSize={64}
        >{props.header}</Typography>
        {props.children}
      </Box>
    </Box>
  );
}

const Home: NextPage = () => {
  const [makeFancy, setMakeFancy] = useState(false);

  const hello = api.example.hello.useQuery({ text: "from EcStud" });

  return (
    <>
      <Head>
        <title>NightWorlds</title>
        <meta name="description" content="Minecraft server with unlimited possibilities" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <LandingAppBar appear={makeFancy} />
      <Box sx={{
        minHeight: makeFancy ? "400px" : "100vh",
        display: "flex",
        justifyContent: "center",
        placeItems: "center",
        transition: "min-height 1s"
      }}>
        <Container>
          <AppearingText
            variant="h1"
            sx={{
              textAlign: "center",
              margin: "auto",
              maxWidth: "70%",
            }}
            tokens={{
              "Minecraft": 1,
              "server": 15,
              "with": 30,
              "unlimited": 35,
              "possibilities": 50,
            }}
            whenFinished={() => setTimeout(() => setMakeFancy(true), 1000)}
          />
        </Container>
      </Box>
      {/* <Box>
        <NewsBlock />
      </Box> */}
      {makeFancy && <Container>
        <FeatureBox
          img={build}
          header="Build amazing stuff"
        >
          <Typography>
            The server rules are designed to allow players to build anything they want. You can build a statue, a futurisic city or café – we don't mind. The main rule is not to grief.
          </Typography>
        </FeatureBox>
        <FeatureBox
          img={communicate}
          header="Communicate with other players"
          reverse
        >
          <Typography>
            One of the main priorities of NightWorlds is people. This rule works in all of NightWorlds. Together, we can make anything possible!
          </Typography>
        </FeatureBox>
        <FeatureBox
          img={simplicity}
          header="There's no sense to overcomplicate things"
          reverse
        >
          <Typography>
            We target minimalism. Simplicity is the real power! Here you won't see webpages with design like in 2007. Also, we don't show tons of text at one in the actual game.
          </Typography>
        </FeatureBox>
      </Container>}
      <Copyright sx={{}} />
    </>
  );
};

export default Home;
