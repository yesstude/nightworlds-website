"use client";

import { Icon } from "./icon";
import { ReactNode, useState } from "react";

export function Spoiler(props: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  const [isOpen, setOpen] = useState(!!props.open);

  return (
    <div
      // className="border-y border-solid px-2 py-4"
      className="spoiler rounded-[24px] bg-foreground/5 px-4 py-4"
    >
      <button
        onClick={() => setOpen(!isOpen)}
        type="button"
        className="flex w-full cursor-pointer select-none place-items-center justify-between text-left text-foreground/90"
      >
        <span className="m-0">{props.title}</span>
        <Icon
          icon="chevron_right"
          size={32}
          style={{
            rotate: isOpen ? "270deg" : "90deg",
            transition: "rotate 0.3s",
          }}
        />
      </button>
      <div
        style={{
          transitionBehavior: "allow-discrete",
          maxHeight: isOpen ? "max-content" : "0px",
          opacity: isOpen ? "100%" : "0%",
          overflow: "hidden",
          transition: "max-height 0.5s, opacity 0.5s",
        }}
      >
        <div className="py-4">{props.children}</div>
      </div>
    </div>
  );
}

export function SpoilerGroup(props: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 [&_.spoiler:first-child]:rounded-t-[24px] [&_.spoiler:last-child]:rounded-b-[24px] [&_.spoiler]:rounded-[4px]">
      {props.children}
    </div>
  );
}
