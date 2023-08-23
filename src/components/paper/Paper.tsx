import { MouseEventHandler, ReactNode, useContext } from "react";
import { themeOptions } from "../ThemeOptions";

import sectionStyles from "../Section.module.css";
import { SectionContext } from "../Section";

import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material";

export function Paper(props: {
  children: ReactNode;
  variant?: "elevated" | "outlined";
  paddings?: number;
  margins?: number;
  radius?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}) {
  const { palette } = useTheme();
  const sectionContext = useContext(SectionContext);

  let container = props.children;

  container = (
    <div
      style={{
        background:
          props.variant == "outlined"
            ? "none"
            : palette?.background?.paper || "#fff",
        padding: `${(props.paddings || 8) * 4}px`,
        display: "flex",
        width: "100%",
      }}
    >
      {container}
    </div>
  );

  if (props.onClick) {
    container = (
      <ButtonBase
        focusRipple
        onClick={props.onClick}
        sx={{
          textAlign: "unset",
          width: "100%",
        }}
      >
        {container}
      </ButtonBase>
    );
  }

  container = (
    <div
      className={sectionContext.paperClassName}
      style={{
        margin: `${(props.margins || 1) * 4}px`,
        border: `${props.variant == "outlined" ? "thin" : "0px"} solid ${
          palette?.divider || "#ccc"
        }`,
        borderRadius: `${(props.radius || 8) * 16}px`,
        overflow: "hidden",
        ...props.style,
      }}
    >
      {container}
    </div>
  );

  return container;
}
