import { ReactNode } from "react";
import { LandingAppBar } from "./appbar";
import LandingFooter from "./footer";

export default async function LandingLayout(props: { children: ReactNode }) {
  return (
    <>
      <header>
        <LandingAppBar />
      </header>
      <main className="my-8 flex flex-col place-items-center">
        {props.children}
      </main>
      <footer className="flex flex-col place-items-center">
        <LandingFooter />
      </footer>
    </>
  );
}
