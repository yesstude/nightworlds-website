"use client";

import { Transition, useTransitions } from "./transition-provider";
import { AnchorHTMLAttributes, MouseEventHandler, memo } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "~/i18n/routing";

function generateOnClick(
  href: string,
  transition?: Transition,
  defaultOnClick?: MouseEventHandler<HTMLElement>,
  dontPrevent?: boolean
) {
  const transitions = useTransitions();
  const router = useRouter();
  let pathname = usePathname();

  if (transitions && pathname != href) {
    // const defaultOnClick = props.onClick;
    const onClick: MouseEventHandler<HTMLElement> = async (event) => {
      // alert(JSON.stringify({ current, formattedhref }));
      await defaultOnClick?.(event);
      // if (event.defaultPrevented) return;
      if (!dontPrevent) event.preventDefault();
      transitions
        .transitionOut(transition ?? "emphasized-fade")
        .then(() => router.push(href))
        .then(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        });
    };
    return onClick;
  }
  return defaultOnClick;
}

export default function Link(
  dprops: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    transition?: Transition;
  }
) {
  let props = { ...dprops };

  props.onClick = generateOnClick(props.href, props.transition, props.onClick);

  return <a {...props} />;
}

const MemoButton = memo(
  Button,
  (prev, next) => prev.disabled == next.disabled && prev.onClick == next.onClick
);

export function LinkButton(
  dprops: Parameters<typeof MemoButton>[0] & {
    href: string;
    transition?: Transition;
  }
) {
  let props = { ...dprops };

  props.onClick = generateOnClick(
    props.href,
    props.transition,
    props.onClick,
    true
  );
  if (props.disabled) props.onClick = undefined;

  return <MemoButton {...props} />;
}
