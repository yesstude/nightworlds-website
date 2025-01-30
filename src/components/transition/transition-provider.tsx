"use client";

import { usePathname } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Transition = "emphasized-fade";
export type TransitionData = {
  name: Transition;
  inTime: number;
  outTime: number;
};
export const TRANSITIONS: { [key in Transition]: TransitionData } = {
  "emphasized-fade": {
    name: "emphasized-fade",
    outTime: 200,
    inTime: 400,
  },
};

interface TransitionContext {
  transition: React.MutableRefObject<Transition | null>;
  className: string;
  setClassName: Dispatch<SetStateAction<string>>;
}

const TransitionContext = createContext<TransitionContext | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [className, setClassName] = useState("");
  const transition = useRef<Transition | null>(null);

  return (
    <TransitionContext.Provider
      value={{
        className,
        setClassName,
        transition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function TransitionSuspense({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const transitionContext = useContext(TransitionContext);

  return (
    <div className={`${transitionContext?.className} ${className}`}>
      {children}
    </div>
  );
}

export function useTransitions() {
  const transitionContext = useContext(TransitionContext);
  const pathname = usePathname();

  if (!transitionContext) {
    return null;
    // throw new Error(
    //   "You are attempting to use useTransitions outside of a TransitionContext."
    // );
  }

  useEffect(() => {
    transitionIntoViewport();
  }, [pathname]);

  const context = transitionContext;

  function emphasizedFadeOut() {
    return runTransition("emphasized-fade", context);
  }

  function transitionIntoViewport() {
    if (context.transition.current) {
      const cssAnim = getCSSAnimation(context.transition.current, "in");
      context.setClassName(cssAnim.className);
      setTimeout(() => context.setClassName(""), cssAnim.duration);
    }
  }

  return { emphasizedFadeOut, transitionIntoViewport };
}

function getCSSAnimation(
  transition: Transition,
  direction: "in" | "out"
): { duration: number; className: string } {
  return {
    className: `animate-${transition}-${direction}`,
    duration: TRANSITIONS[transition][`${direction}Time`],
  };
}

function runTransition(transition: Transition, context: TransitionContext) {
  return new Promise((resolve) => {
    const cssAnim = getCSSAnimation(transition, "out");
    context.setClassName(cssAnim.className);
    context.transition.current = transition;

    setTimeout(resolve, cssAnim.duration);
  });
}
