"use client";

import { useEffect, useState } from "react";
import { isDevelopment } from "~/server/api/debug";

export function useIsDevelopment() {
  const [is, setIs] = useState(false);

  useEffect(() => {
    isDevelopment().then(setIs);
  }, []);

  return is;
}
