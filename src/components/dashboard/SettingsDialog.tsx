"use client";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

type FormInputBlock = {
  name: string;
  type: "text" | "password" | "number" | "checkbox";
  labelkey?: string;
  defaultValue?: string | number;
  defaultChecked?: boolean;
};

type FormBlock =
  | {
      children: ReactNode;
    }
  | FormInputBlock
  | {
      group: FormBlock[];
    };

export const SetErrorContext = createContext((arg: boolean, id: string) => {});
export function SetError(props: { children: boolean }) {
  const setError = useContext(SetErrorContext);
  const id = useId();

  useEffect(() => {
    setError(props.children, id);
  }, [props.children]);

  return <></>;
}

export default function SettingsDialog(props: {
  title: string;
  blocks: FormBlock[];
  onClose?: () => void;
  onSubmit?: (values: { [k: string]: number | string | boolean }) => void;
}) {
  const t = useTranslations("dashboard");

  const [formData, setFormData] = useState<{
    [k: string]: number | string | boolean;
  }>({});
  const [errors, setErrors] = useState<Map<string, boolean>>(new Map());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.onSubmit?.(formData);
  };

  function blocksToForm(blocks: FormBlock[]): ReactNode {
    return blocks.map((block) => {
      if ("group" in block) {
        return blocksToForm(block.group);
      } else if ("children" in block) {
        return block.children;
      } else {
        switch (block.type) {
          case "checkbox":
            return (
              <FormControlLabel
                key={block.name}
                control={
                  <Checkbox
                    name={block.name}
                    onChange={handleChange}
                    defaultChecked={block.defaultChecked}
                  />
                }
                label={t(block.labelkey || "")}
              />
            );
          case "number":
            return (
              <TextField
                key={block.name}
                name={block.name}
                type="number"
                label={t(block.labelkey || "")}
                defaultValue={block.defaultValue}
                onChange={handleChange}
              />
            );
          case "text":
            return (
              <TextField
                key={block.name}
                name={block.name}
                label={t(block.labelkey || "")}
                defaultValue={block.defaultValue}
                onChange={handleChange}
              />
            );
          case "password":
            return (
              <PasswordField
                {...block}
                type="password"
                handleChange={handleChange}
              />
            );
          default:
            return undefined;
        }
      }
    });
  }

  return (
    <SetErrorContext.Provider
      value={(error, id) => {
        setErrors((prevErrors) => {
          const newErrors = new Map(prevErrors);
          newErrors.set(id, error);
          return newErrors;
        });
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{blocksToForm(props.blocks)}</DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose?.()}>
          {t("settings.cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={new Set(errors.values()).has(true)}
          onClick={handleSubmit}
        >
          {t("settings.save")}
        </Button>
      </DialogActions>
    </SetErrorContext.Provider>
  );
}

export function PasswordField(
  props: FormInputBlock & {
    type: "password";
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
) {
  const t = useTranslations("dashboard");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Typography
        dangerouslySetInnerHTML={{
          __html: t(
            "settings.sections.security.ingamepassword.helpertext"
          ).replaceAll(/\*\*(.*)\*\*/gm, "<strong>$1</strong>"),
        }}
      />
      <TextField
        type={showPassword ? "text" : "password"}
        name={props.name}
        label={t(props.labelkey || "")}
        sx={{
          mt: 8,
          mb: 2,
        }}
        fullWidth
        autoComplete="new-password"
        error={password.length < 8 && password.length > 0}
        helperText={
          password.length < 8 && password.length > 0
            ? t("settings.sections.security.ingamepassword.invalid")
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
        onInput={(el) => setPassword((el.target as any).value)}
        onChange={props.handleChange}
      />
      <SetError>{password.length < 8}</SetError>
    </>
  );
}
