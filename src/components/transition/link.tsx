"use client";

import { useTransitions } from "./transition-provider";
import { usePathname, useRouter } from "next/navigation";
import { AnchorHTMLAttributes, MouseEventHandler, memo } from "react";
import { Button } from "../ui/button";

function generateOnClick(
  href: string,
  defaultOnClick?: MouseEventHandler<HTMLElement>,
  dontPrevent?: boolean
) {
  const transitions = useTransitions();
  const router = useRouter();
  let pathname = usePathname();
  if (pathname.split("/")[1]?.length == 2) pathname = pathname.slice(3);
  const current = new URL(pathname, "http://localhost").pathname;
  const formattedhref = new URL(href, "http://localhost").pathname;

  if (transitions && current != formattedhref) {
    // const defaultOnClick = props.onClick;
    const onClick: MouseEventHandler<HTMLElement> = async (event) => {
      await defaultOnClick?.(event);
      // if (event.defaultPrevented) return;
      if (!dontPrevent) event.preventDefault();
      transitions
        .fadeOut()
        .then(() => router.push(formattedhref))
        .then(() => {
          window.scrollTo({ top: 0 });
        });
    };
    return onClick;
  }
  return defaultOnClick;
}

export default function Link(
  dprops: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
) {
  let props = { ...dprops };

  props.onClick = generateOnClick(props.href, props.onClick);

  return <a {...props} />;
}

const MemoButton = memo(Button, (prev, next) => prev.disabled == next.disabled);

export function LinkButton(
  dprops: Parameters<typeof MemoButton>[0] & { href: string }
) {
  let props = { ...dprops };

  props.onClick = generateOnClick(props.href, props.onClick, true);
  if (props.disabled) props.onClick = undefined;

  return <MemoButton {...props} />;
}
