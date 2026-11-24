"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

const DESKTOP_FRAME = 1440;
const MOBILE_FRAME = 412;
const DESKTOP_MQ = "(min-width: 1024px)";

function frameForViewport() {
  return window.matchMedia(DESKTOP_MQ).matches ? DESKTOP_FRAME : MOBILE_FRAME;
}

/**
 * Locks the page to a fixed design width (412 / 1440) and scales it to the
 * viewport with CSS `zoom` driven by a plain number from ResizeObserver.
 *
 * Safari is unreliable with `zoom: calc(...cqw...)`, so the scale factor is
 * measured in JS and applied as a unitless number. Custom properties
 * `--ace-scale` and `--ace-frame-width` are published for design-space math
 * (e.g. hero heights that need to fill 100dvh after zoom).
 */
export function ScaleFrame({ children }: { children: React.ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(DESKTOP_FRAME);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const media = window.matchMedia(DESKTOP_MQ);

    const sync = () => {
      const frame = frameForViewport();
      const width = shell.clientWidth;
      setFrameWidth(frame);
      if (width > 0) setScale(width / frame);
    };

    sync();
    media.addEventListener("change", sync);
    const observer = new ResizeObserver(sync);
    observer.observe(shell);
    return () => {
      media.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={shellRef}
      className="w-full bg-black"
      style={
        {
          ["--ace-frame-width" as string]: frameWidth,
          ["--ace-scale" as string]: scale,
        } as CSSProperties
      }
    >
      <div
        className="bg-black"
        style={{
          width: frameWidth,
          // Plain number — Safari rejects / mishandles zoom: calc(cqw / …).
          zoom: scale,
        }}
      >
        {children}
      </div>
    </div>
  );
}
