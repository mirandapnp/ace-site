"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";

const DESKTOP_FRAME = 1440;
const MOBILE_FRAME = 412;
const DESKTOP_MQ = "(min-width: 1024px)";
const SCALE_EPS = 1e-4;
const VH_EPS = 0.5;
const HEIGHT_EPS = 0.5;

type Metrics = {
  frameWidth: number;
  scale: number;
  vhDesign: number;
};

const SERVER_METRICS: Metrics = {
  frameWidth: DESKTOP_FRAME,
  scale: 1,
  vhDesign: 900,
};

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

function readMetrics(shellWidth?: number): Metrics {
  const frameWidth = frameForViewport();
  const vp = viewportSize();
  const width = shellWidth && shellWidth > 0 ? shellWidth : vp.width;
  const scale = width > 0 ? width / frameWidth : 1;
  return {
    frameWidth,
    scale,
    // Design-space px that map to 100vh after scale.
    vhDesign: scale > 0 ? vp.height / scale : 900,
  };
}

function metricsEqual(a: Metrics, b: Metrics) {
  return (
    a.frameWidth === b.frameWidth &&
    Math.abs(a.scale - b.scale) < SCALE_EPS &&
    Math.abs(a.vhDesign - b.vhDesign) < VH_EPS
  );
}

type Listener = () => void;

let snapshot: Metrics =
  typeof window !== "undefined" ? readMetrics() : SERVER_METRICS;
let shellEl: HTMLElement | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function syncStore() {
  const next = readMetrics(shellEl?.clientWidth);
  if (metricsEqual(snapshot, next)) return false;
  snapshot = next;
  emit();
  return true;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return SERVER_METRICS;
}

/**
 * Locks the page to a fixed design width (412 / 1440) and scales it to the
 * viewport with `transform: scale()` plus a layout spacer.
 *
 * CSS `zoom` is avoided: Safari mis-applies zoom to padding, gap, margin, and
 * replaced-content sizes. Transform scaling keeps design-space lengths exact;
 * the spacer (`frameHeight * scale`) restores document scroll height.
 */
export function ScaleFrame({ children }: { children: React.ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHeightRef = useRef(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const metrics = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useLayoutEffect(() => {
    shellEl = shellRef.current;
    syncStore();

    const media = window.matchMedia(DESKTOP_MQ);
    const onViewport = () => {
      syncStore();
    };

    media.addEventListener("change", onViewport);
    window.addEventListener("resize", onViewport);
    // resize only — visualViewport scroll was rewriting --ace-vh-design every frame.
    const visual = window.visualViewport;
    visual?.addEventListener("resize", onViewport);

    const shell = shellRef.current;
    const frame = frameRef.current;
    const shellRo = new ResizeObserver(onViewport);
    if (shell) shellRo.observe(shell);

    const measureFrame = () => {
      if (!frame) return;
      const next = frame.offsetHeight;
      if (Math.abs(next - frameHeightRef.current) < HEIGHT_EPS) return;
      frameHeightRef.current = next;
      setFrameHeight(next);
    };
    measureFrame();
    const frameRo = new ResizeObserver(measureFrame);
    if (frame) frameRo.observe(frame);

    return () => {
      shellEl = null;
      media.removeEventListener("change", onViewport);
      window.removeEventListener("resize", onViewport);
      visual?.removeEventListener("resize", onViewport);
      shellRo.disconnect();
      frameRo.disconnect();
    };
  }, []);

  const { frameWidth, scale, vhDesign } = metrics;
  const layoutHeight = frameHeight > 0 ? frameHeight * scale : undefined;

  return (
    <div
      ref={shellRef}
      className="w-full bg-black"
      // Client metrics differ from SSR defaults by design.
      suppressHydrationWarning
      style={
        {
          ["--ace-frame-width" as string]: frameWidth,
          ["--ace-scale" as string]: scale,
          ["--ace-vh-design" as string]: vhDesign,
        } as CSSProperties
      }
    >
      {/*
        Spacer owns the scaled footprint in document flow.
        The design frame is taken out of flow and visually scaled from top-left
        so Safari lays out real 412/1440 px (gaps, padding, icons) correctly.
      */}
      <div
        className="relative w-full bg-black"
        suppressHydrationWarning
        style={{ height: layoutHeight }}
      >
        <div
          ref={frameRef}
          className="absolute top-0 left-0 bg-black"
          suppressHydrationWarning
          style={{
            width: frameWidth,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
