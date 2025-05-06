"use client";

import { ReactNode } from "react";
import { MaterialSymbol, MaterialSymbolProps } from "react-material-symbols";
import { MediumOutlinedIcon } from "./icons/medium";

const customIcons = {
  medium: <MediumOutlinedIcon />,
} as const satisfies { [k: string]: ReactNode };

type OriginalProps = Parameters<typeof MaterialSymbol>[0];

export type IconName = OriginalProps["icon"] | keyof typeof customIcons;

export function Icon(
  props: Omit<MaterialSymbolProps, "icon"> & { icon: IconName },
) {
  const style = {
    ...props.style,
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    flexShrink: 0,
    maxWidth: `${props.size ?? 24}px`,
  };
  const custom = (customIcons as any)[props.icon];
  if (custom) {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          fill: props.fill ? "currentColor" : "#00000000",
          stroke: props.fill ? "#00000000" : "currentColor",
          ...(style as any),
        }}
      >
        {custom}
      </svg>
    );
  }
  return (
    <MaterialSymbol
      {...(props as OriginalProps)}
      style={style as any}
      size={props.size ?? 24}
    />
  );
}
