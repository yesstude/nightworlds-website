"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { createRipples, RipplesProps } from "react-ripples";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "overflow-hidden text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
    variants: {
      variant: {
        filled:
          "bg-primary text-primary-foreground hover:bg-primary/[.92] disabled:bg-foreground/[.08] disabled:text-foreground/[.38]",
        outlined:
          "text-primary border hover:bg-primary/[.08] disabled:border-foreground/[.08] disabled:text-foreground/[.38]",
        text: "text-primary hover:bg-primary/[.08] disabled:text-foreground/[.38]",
        tonal:
          "bg-secondary/70 text-secondary-foreground hover:bg-secondary disabled:bg-foreground/[.08] disabled:text-foreground/[.38]",
        // destructive:
        //   "bg-destructive text-destructive-foreground hover:bg-destructive/[0.92]",
        // ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 rounded-[100px]",
        sm: "h-9 rounded-[100px]",
        bg: "font-bold text-md h-[50px] rounded-[100px]",
        extended_fab: "h-14 rounded-[16px]",
        fab: "h-14 rounded-[16px]",
        icon: "h-10 w-10 rounded-full",
      },
    },
  }
);

const sizePaddings: {
  [key in Exclude<
    VariantProps<typeof buttonVariants>["size"],
    undefined | null
  >]: string;
} = {
  default: "px-6 py-[10px]",
  sm: "px-4",
  bg: "px-6",
  extended_fab: "px-6",
  fab: "px-4",
  icon: "",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ripples?: Partial<RipplesProps>;
  noripple?: true;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, noripple, onClick, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    let cname = cn(buttonVariants({ variant, size, className }));

    const Ripple = React.useMemo(
      () =>
        createRipples({
          during: 1000,
          color: "rgba(0, 0, 0, .2)",
          onClick: onClick as any,
          className:
            "inline-flex h-full w-full items-center justify-center gap-2 whitespace-nowrap " +
            sizePaddings[size ?? "default"],
          ...props.ripples,
        }),
      [props.ripples, onClick]
    );
    // if (props.noripple)
    //   cname +=
    //     " inline-flex items-center justify-center gap-2 whitespace-nowrap " +
    //     sizePaddings[size ?? "default"];

    return (
      <Comp
        className={
          (noripple
            ? " inline-flex items-center justify-center gap-2 whitespace-nowrap " +
              sizePaddings[size ?? "default"]
            : "") + cname
        }
        ref={ref}
        {...props}
        children={noripple ? props.children : <Ripple>{props.children}</Ripple>}
        onClick={noripple ? onClick : undefined}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
