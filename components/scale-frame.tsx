"use client";

import { useEffect, useState } from "react";

const DESKTOP_FRAME = 1440;
const MOBILE_FRAME = 412;

function frameForViewport() {
  return window.matchMedia("(min-width: 1024px)").matches
    ? DESKTOP_FRAME
    : MOBILE_FRAME;
}

export function ScaleFrame({ children }: { children: React.ReactNode }) {
  const [frameWidth, setFrameWidth] = useState(DESKTOP_FRAME);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setFrameWidth(frameForViewport());
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="w-full bg-black" style={{ containerType: "inline-size" }}>
      <div
        className="bg-black"
        style={{
          width: frameWidth,
          zoom: `calc(100cqw / ${frameWidth}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
