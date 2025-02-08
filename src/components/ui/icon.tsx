"use client";

import { MaterialSymbol } from "react-material-symbols";

export type IconName = Parameters<typeof MaterialSymbol>[0]["icon"];

export function Icon(props: Parameters<typeof MaterialSymbol>[0]) {
  const style = {
    ...props.style,
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    flexShrink: 0,
    maxWidth: `${props.size ?? 24}px`,
  };
  return (
    <MaterialSymbol {...props} style={style as any} size={props.size ?? 24} />
  );
}
