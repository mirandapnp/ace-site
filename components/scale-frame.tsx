"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

const DESKTOP_FRAME = 1440;
const MOBILE_FRAME = 412;
const DESKTOP_MQ = "(min-width: 1024px)";

function frameForViewport() {
  return window.matchMedia(DESKTOP_MQ).matches ? DESKTOP_FRAME : MOBILE_FRAME;
}

function viewportSize() {
  const visual = window.visualViewport;
  return {
    width: visual?.width ?? window.innerWidth,
    height: visual?.height ?? window.innerHeight,
  };
}

/**
 * Locks the page to a fixed design width (412 / 1440) and scales it to the
 * viewport with CSS `zoom` driven by a plain number from ResizeObserver.
 *
 * Safari is unreliable with `zoom: calc(...cqw...)` and with `dvh` inside a
 * zoomed subtree, so scale + design-space viewport height are measured in JS
 * and published as unitless custom properties for layout math.
 */
export function ScaleFrame({ children }: { children: React.ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(DESKTOP_FRAME);
  const [scale, setScale] = useState(1);
  const [vhDesign, setVhDesign] = useState(900);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const media = window.matchMedia(DESKTOP_MQ);

    const sync = () => {
      const frame = frameForViewport();
      // Prefer the shell’s content box for width (excludes scrollbars reliably).
      const width = shell.clientWidth || viewportSize().width;
      const { height } = viewportSize();
      const nextScale = width > 0 ? width / frame : 1;
      setFrameWidth(frame);
      setScale(nextScale);
      // Design-space px that map to 100vh after zoom (avoids Safari dvh+zoom bugs).
      if (nextScale > 0) setVhDesign(height / nextScale);
    };

    sync();
    media.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    const visual = window.visualViewport;
    visual?.addEventListener("resize", sync);
    visual?.addEventListener("scroll", sync);
    const observer = new ResizeObserver(sync);
    observer.observe(shell);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      visual?.removeEventListener("resize", sync);
      visual?.removeEventListener("scroll", sync);
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
          // Unitless design-space px ≈ 100vh after zoom.
          ["--ace-vh-design" as string]: vhDesign,
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
