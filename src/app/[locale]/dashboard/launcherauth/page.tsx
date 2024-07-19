import { Box, Container, Typography } from "@mui/material";
import { Title } from "../../../../components/dashboard/DashboardWrapper";
import { CheckCircleOutline } from "@mui/icons-material";
import { redirect } from "next/navigation";
import { issueToken } from "../../../../server/api/auth";

export default async function LauncherAuthPage() {
  console.log(await issueToken());
  redirect("nightworlds://auth/" + (await issueToken()));

  return (
    <Container className="flex flex-col place-items-center gap-8 py-8">
      <Title>Вход в лаунчер</Title>
      <Typography variant="h1">Вход в лаунчер</Typography>
      <Box className="flex max-w-[300px] flex-col place-items-center gap-6 rounded-[64px] bg-[#b9e7bb] p-[48px]">
        <CheckCircleOutline className="text-[128px] text-[#329637]" />
        <Typography variant="h4" component="p" className="text-[#329637]">
          Вы должны быть авторизированы. Можно закрыть эту страницу
        </Typography>
      </Box>
    </Container>
  );
}
