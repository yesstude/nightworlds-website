"use client";

import { Button } from "../ui/button";
import { Transition, useTransitions } from "./transition-provider";
import { AnchorHTMLAttributes, MouseEventHandler } from "react";
import { usePathname, useRouter } from "~/i18n/routing";

function generateOnClick(
  href: string,
  transition?: Transition,
  defaultOnClick?: MouseEventHandler<HTMLElement>,
  dontPrevent?: boolean,
) {
  const transitions = useTransitions();
  const router = useRouter();
  let pathname = usePathname();

  if (transitions && pathname != href) {
    // const defaultOnClick = props.onClick;
    const onClick: MouseEventHandler<HTMLElement> = (event) => {
      // alert(JSON.stringify({ pathname, href }));
      defaultOnClick?.(event);
      // if (event.defaultPrevented) return;
      if (!dontPrevent) {
        event.preventDefault();
        event.stopPropagation();
      }
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
  },
) {
  let props = { ...dprops };

  props.onClick = generateOnClick(props.href, props.transition, props.onClick);

  return <a {...props} />;
}

export function LinkButton(
  dprops: Parameters<typeof Button>[0] & {
    href: string;
    transition?: Transition;
  },
) {
  let { href, ...props } = { ...dprops };

  props.onClick = generateOnClick(href, props.transition, props.onClick);
  if (props.disabled) props.onClick = undefined;

  return (
    <a href={href}>
      <Button {...props} />
    </a>
  );
}
