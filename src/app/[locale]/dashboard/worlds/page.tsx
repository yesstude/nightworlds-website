import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { Title } from "../../../../components/dashboard/DashboardWrapper";
import Link from "next/link";
import { World, getAvailableWorlds } from "../../../../server/api/worlds";

export default async function WorldsPage() {
  const worlds = await getAvailableWorlds();

  return (
    <Container>
      <Title>Миры</Title>
      <Typography variant="h1">Миры</Typography>
      <Box className="mt-16 flex flex-row flex-wrap justify-center gap-8">
        {worlds.map((w) => (
          <WorldCard key={w.name} world={w} />
        ))}
        {worlds.length < 1 && (
          <Typography variant="h4" component="p">
            Ни один мир пока что не доступен
          </Typography>
        )}
      </Box>
    </Container>
  );
}

function WorldCard(props: { world: World }) {
  return (
    <Card
      variant="outlined"
      className="min-w-[240px] max-w-[320px] flex-1 text-left"
    >
      <CardContent>
        <Typography variant="h3" component="h2">
          {props.world.displayName}
        </Typography>
        <Typography variant="body1">{props.world.description || ""}</Typography>
      </CardContent>
      <CardActions>
        <Link href={`./worlds/${props.world.name}`}>
          <Button variant="outlined" disabled={!props.world.available}>
            Играть
          </Button>
        </Link>
        <Link href={`/worlds/${props.world.name}`}>
          <Button variant="text">Описание</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
