import { TransitionSuspense } from "../../../components/transition/transition-provider";
import { LandingAppBar } from "./appbar";
import LandingFooter from "./footer";
import { ReactNode } from "react";

export default async function LandingLayout(props: { children: ReactNode }) {
  return (
    <>
      <header>
        <LandingAppBar />
      </header>
      <TransitionSuspense>
        <main className="mt-8 flex flex-col place-items-center">
          {props.children}
        </main>
        <footer className="flex flex-col place-items-center">
          <LandingFooter />
        </footer>
      </TransitionSuspense>
    </>
  );
}
