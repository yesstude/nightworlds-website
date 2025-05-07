import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-14 w-full rounded-t-[4px] border-b bg-background px-4 py-2 text-base text-foreground outline-none ring-offset-background transition-[border] file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground/40 focus-visible:border-b-[3px] focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );

const inputVariants = cva(
  "flex h-14 w-full place-items-center gap-3 px-4 [&>input]:bg-transparent [&>input]:w-full [&>input]:h-full focus-visible:[&>input]:outline-none text-[16px]",
  {
    variants: {
      variant: {
        outlined:
          "rounded-[4px] outline outline-1 outline-border placeholder:[&>input]:text-foreground/50 transition-[outline] duration-500 has-[:focus-visible]:duration-0 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary",
        filled:
          "flex h-14 w-full rounded-t-[4px] border-b bg-background px-4 py-2 text-base text-foreground outline-none ring-offset-background transition-[border] file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground/40 focus-visible:border-b-[3px] focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  },
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> &
    VariantProps<typeof inputVariants> & { pre?: React.ReactNode }
>(({ className, type, variant, children, pre, ...props }, ref) => {
  return (
    <div className={cn(inputVariants({ variant }), "", className)}>
      {pre}
      <input type={type} ref={ref} {...props} />
      {children}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
