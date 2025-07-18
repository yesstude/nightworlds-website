import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function daysUntil(date: Date) {
  return Math.floor(
    (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );
}
