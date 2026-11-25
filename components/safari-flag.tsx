"use client";

import { useLayoutEffect } from "react";
import { applyAceSafariFlag } from "@/components/ace-sweep";

/** Re-apply after hydration — React can strip the early <head> script’s attribute. */
export function SafariFlag() {
  useLayoutEffect(() => {
    applyAceSafariFlag();
  }, []);
  return null;
}
