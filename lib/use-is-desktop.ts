"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_MQ = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_MQ);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function getServerSnapshot() {
  // SSR assumes mobile so noise/bloom stay off until the client knows.
  return false;
}

/** True at the site’s desktop breakpoint (≥1024px). */
export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
