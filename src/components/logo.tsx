"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import logo from "../assets/logo.svg";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/">
      <div className="flex h-full place-items-center gap-2">
        <Image
          src={logo}
          alt="NightWorlds"
          width={42}
          // className="brightness-125"
        />
        <span className="mt-1 text-[24px] font-bold text-foreground">
          NightWorlds
        </span>
      </div>
    </Link>
  );
}
