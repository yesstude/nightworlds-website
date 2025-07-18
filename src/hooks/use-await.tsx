"use client";

import { useEffect, useState } from "react";

export function useAwait<T extends (...props: any[]) => Promise<any>>(
  fun: T,
  ...args: Parameters<T>
): Awaited<ReturnType<T>> | undefined {
  const [value, setValue] = useState<Awaited<ReturnType<T>>>();

  useEffect(() => {
    fun(...args).then(setValue);
  }, []);

  return value;
}
