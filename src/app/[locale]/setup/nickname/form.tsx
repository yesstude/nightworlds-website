"use client";

import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { NextButton } from "../buttons";
import {
  checkNickname,
  setNickname,
} from "../../../../server/api/accountSetup";
import checkNick from "./check";
import { useRef } from "react";

export function NicknameForm() {
  const t = useTranslations("setup");

  const ref = useRef<HTMLFormElement>();

  const [state, action] = useFormState<{
    available?: boolean;
    error?: string;
    nickname?: string;
  }>(checkNick as any, {});

  const error = t(`nickname.error.${state.error || "none"}`);

  return (
    <form action={action} ref={ref as any}>
      <TextField
        label={t("nickname.nickname")}
        className="mb-2 mt-8"
        name="nickname"
        fullWidth
        error={!!state.error}
        helperText={typeof state.nickname == "string" ? error : undefined}
        onInput={(field) => {
          ref.current?.requestSubmit();
        }}
      />
      <NextButton
        textKey="nickname.continue_button"
        href="/setup/password"
        onClick={() => {
          setNickname(state.nickname!);
          return true;
        }}
        disabled={!state.available}
      />
    </form>
  );
}
