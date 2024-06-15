import DefaultHead from "../../../../components/DefaultHead";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import logo from "../../../../assets/logo_shadow.svg";
import { getAuthProviders, isAuthorized } from "../../../../server/api/auth";
import { AuthUsingButton } from "./auth";
import { BackButton } from "./back";

export default async function SignInPage() {
  if (await isAuthorized()) return redirect("/dashboard");
  const providers = Object.entries(await getAuthProviders()).map(([_, o]) => o);

  const t = await getTranslations("sign-in");

  return (
    <>
      <DefaultHead
        ftitle={t("title") as string | null}
        description={t("subtitle") as string | null}
      />
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          placeItems: "center",
        }}
      >
        <BackButton className="my-1" />
        <Paper
          variant="outlined"
          sx={{
            textAlign: "center",
            p: 8,
            maxWidth: "480px",
          }}
        >
          <Image src={logo} alt="NightWorlds" width={128} />
          <Typography variant="h3" component="h1" my={2}>
            {t("title")}
          </Typography>
          <Typography variant="body1" mb={8} px={4}>
            {t("subtitle")}
          </Typography>
          {providers.map((provider) =>
            provider.type == "oauth" &&
            provider.name.toLowerCase() != "discord" ? (
              <AuthUsingButton
                key={provider.id}
                provider={provider}
                className="my-2"
              />
            ) : (
              ""
            )
          )}
        </Paper>
      </Container>
    </>
  );
}
