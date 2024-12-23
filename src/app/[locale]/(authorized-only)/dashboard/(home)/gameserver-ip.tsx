"use client";

import { memo, ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export function GameserverIP(props: { ip: string; className?: string }) {
  const [success, setSuccess] = useState(false);

  return (
    <Root ip={props.ip} success={success} className={props.className}>
      <Btn ip={props.ip} setSuccess={setSuccess} />
    </Root>
  );
}

const Btn = memo(function Btn({
  setSuccess,
  ip,
}: {
  setSuccess: (c: (a: boolean) => boolean) => any;
  ip: string;
}) {
  return (
    <Button
      className="rounded-l-[4px]"
      variant="filled"
      size="fab"
      ripples={{
        during: 300,
      }}
      onClick={() => {
        setSuccess((last) => {
          if (last) return true;
          navigator.clipboard.writeText(ip);
          setTimeout(() => setSuccess(() => false), 1000);
          return true;
        });
      }}
    >
      <Icon
        icon="content_copy"
        weight={800}
        className="copy-icon"
        style={{
          transition: "opacity 300ms, transform 300ms",
        }}
      />
      <Icon
        icon="check"
        weight={800}
        className="check-icon right-[32px] -mr-8"
        style={{
          transition: "opacity 300ms, transform 300ms",
        }}
      />
    </Button>
  );
});

function Root({
  children,
  ip,
  success,
  className,
}: {
  children: ReactNode;
  ip: string;
  success: boolean;
  className?: string;
}) {
  return (
    <div className={"flex flex-row place-items-center gap-1 " + className}>
      <div className="flex h-14 flex-col justify-center rounded-l-[16px] rounded-r-[4px] bg-primary px-6 text-primary-foreground">
        <span className="text-md select-none font-mono font-extrabold 2xl:text-3xl">
          {ip}
        </span>
      </div>
      <div
        className={
          success
            ? "[&_.check-icon]:rotate-[0deg] [&_.check-icon]:opacity-100 [&_.copy-icon]:rotate-[180deg] [&_.copy-icon]:opacity-0"
            : "[&_.check-icon]:-rotate-[180deg] [&_.check-icon]:opacity-0 [&_.copy-icon]:rotate-[0deg] [&_.copy-icon]:opacity-100"
        }
      >
        {children}
      </div>
    </div>
  );
}
