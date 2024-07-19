"use client";

import { useTranslations } from "next-intl";
import * as nar from "next-auth/react";
import { ClientSafeProvider } from "../../../../server/api/auth";
import { Button } from "@mui/material";
import setCallbackUrl from "./set-callback-url";

export function AuthUsingButton(props: {
  className?: string;
  provider: ClientSafeProvider;
  callbackUrl?: string;
}) {
  const t = useTranslations("sign-in");

  const { callbackUrl } = props;

  return (
    <Button
      variant="outlined"
      sx={{
        borderRadius: 0,
        p: "16px",
        width: "300px",
      }}
      className={props.className}
      onClick={async () => {
        callbackUrl && (await setCallbackUrl(callbackUrl));
        nar.signIn(props.provider.id);
      }}
    >
      {t("with", { name: props.provider.name }) as string}
    </Button>
  );
}
