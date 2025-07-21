"use client";

import logo from "../assets/logo.svg";
import Link from "./transition/link";
import Image from "next/image";

export function Logo(props: { className?: string; caption?: string }) {
  return (
    <Link href="/" className={props.className}>
      <div className="flex h-full place-items-center gap-2">
        <Image
          src={logo}
          alt="Cuboid moon logo"
          width={42}
          loading="eager"
          className="logo"
        />
        <span className="mt-1 text-[24px] font-bold text-foreground">
          {props.caption ?? "NightWorlds"}
        </span>
      </div>
    </Link>
  );
}
