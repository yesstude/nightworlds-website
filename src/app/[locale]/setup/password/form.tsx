"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { NextButton } from "../buttons";
import { setPassword } from "../../../../server/api/accountSetup";

export default function PasswordForm() {
  const t = useTranslations("setup");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPasswordState] = useState("");
  const normalLength = password.length >= 8;

  return (
    <>
      <TextField
        label={t("password.password")}
        className="mb-2 mt-8"
        fullWidth
        type={showPassword ? "text" : "password"}
        error={!normalLength && password.length > 0}
        helperText={
          !normalLength && password.length > 0
            ? t("password.error.length")
            : undefined
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onInput={(el) => setPasswordState((el.target as any).value)}
      />
      <NextButton
        textKey="password.finish_button"
        href="/setup/additional"
        onClick={() => {
          setPassword(password);
          return true;
        }}
      />
    </>
  );
}
