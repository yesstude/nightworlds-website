"use client";

import { usePathname, useRouter } from "next/navigation";
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

export type Transition = "fade-out";

interface TransitionContext {
  animation: React.MutableRefObject<Transition | null>;
  className: string;
  setClassName: Dispatch<SetStateAction<string>>;
}

const TransitionContext = createContext<TransitionContext | null>(null);

const TRANSITION_DURATION = 400;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [className, setClassName] = useState("");
  const animation = useRef<Transition | null>(null);

  return (
    <TransitionContext.Provider
      value={{
        className,
        setClassName,
        animation,
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
    fadeIntoViewport();
  }, [pathname]);

  const context = transitionContext;

  function fadeOut() {
    return animate("fade-out", context);
  }

  function fadeIntoViewport() {
    if (context.animation.current) {
      const animation = getInAnimation(context.animation.current);
      context.setClassName(animation);
      setTimeout(() => context.setClassName(""), TRANSITION_DURATION);
    }
  }

  return { fadeOut, fadeIntoViewport };
}

function getOutAnimation(animation: Transition) {
  return `animate-${animation}-out`;
}

function getInAnimation(animation: Transition) {
  return `animate-${animation}-in`;
}

function animate(animation: Transition, context: TransitionContext) {
  return new Promise((resolve) => {
    const className = getOutAnimation(animation);
    context.setClassName(className);
    context.animation.current = animation;

    setTimeout(resolve, TRANSITION_DURATION);
  });
}
