"use client";

import { useEffect, useRef } from "react";
import { isAceSafari } from "@/components/ace-sweep";

export type GradientFollowConfig = {
  gx: number;
  gy: number;
  grx: number;
  gry: number;
  core: number;
  mid: number;
  midAt: number;
  fade: number;
  rangeX?: number;
  rangeY?: number;
  scaleBoost?: number;
  coreBoost?: number;
  midDrop?: number;
  midAtBoost?: number;
  fadeBoost?: number;
  /** Resting alpha of the radial core color stop. */
  coreAlpha?: number;
  /** Core color alpha at full hover. */
  coreAlphaHover?: number;
  /** Resting alpha of the linear wash color stop. */
  washAlpha?: number;
  /** Wash color alpha at full hover. */
  washAlphaHover?: number;
};

export const heroGradientFollow: GradientFollowConfig = {
  gx: 63.4,
  gy: 85.5,
  grx: 77.31,
  gry: 79.56,
  core: 5.6,
  mid: 0.5,
  midAt: 37,
  fade: 69.11,
  rangeX: 26,
  rangeY: 18,
  // Core stop grows 40% less than the shared 0.5 hover boost.
  coreBoost: 0.3,
};

export const featuredGradientFollow: GradientFollowConfig = {
  gx: 50,
  gy: 108, // rest sits 30% lower than the prior 78
  // ~50% more diffused than the prior ellipse / stop distances.
  grx: 91.125,
  gry: 70.875,
  core: 8.1,
  mid: 0.238,
  midAt: 72,
  fade: 100,
  rangeX: 22,
  rangeY: 17,
  // Hover growth is 15% smaller than the shared defaults (scale 0.03, fade +11).
  scaleBoost: 0.0255,
  coreBoost: 0.425,
  midDrop: 0.1156,
  midAtBoost: 6.8,
  fadeBoost: 9.35,
  // Alphas are 15% less opaque than the prior set (×0.85).
  coreAlpha: 0.4675,
  coreAlphaHover: 0.595,
  washAlpha: 0.34,
  washAlphaHover: 0.425,
};

/** Partner CTA / closing footer — green wash matches Figma radial size & opacity. */
export const partnerCtaGradientFollow: GradientFollowConfig = {
  gx: 18,
  gy: 100,
  grx: 100,
  gry: 85,
  core: 5.3,
  mid: 0.3,
  midAt: 28,
  fade: 57.4,
  // Follow travel stays 40% closer to rest than the prior 42 / 38.
  rangeX: 25.2,
  rangeY: 22.8,
  // Hover expansion is 25% smaller than the prior 25% scale and +14 fade.
  scaleBoost: 0.1875,
  fadeBoost: 10.5,
  // Tighten the bright core on hover (5.3 → ~2.12: −20% then another −50%).
  coreBoost: -3.18,
};

/** Mobile rest sits slightly further right, matching Figma’s mobile radial. */
export const partnerCtaGradientFollowMobile: GradientFollowConfig = {
  ...partnerCtaGradientFollow,
  gx: 22,
  gy: 100,
  grx: 110,
  gry: 90,
  rangeX: 28.8,
  rangeY: 24,
};

export function gradientFollowVars(config: GradientFollowConfig) {
  return {
    ["--gx" as string]: `${config.gx}%`,
    ["--gy" as string]: `${config.gy}%`,
    ["--grx" as string]: `${config.grx}%`,
    ["--gry" as string]: `${config.gry}%`,
    ["--core" as string]: `${config.core}%`,
    ["--mid" as string]: `${config.mid}`,
    ["--mid-at" as string]: `${config.midAt}%`,
    ["--fade" as string]: `${config.fade}%`,
    ...(config.coreAlpha != null
      ? { ["--core-a" as string]: `${config.coreAlpha}` }
      : {}),
    ...(config.washAlpha != null
      ? { ["--wash-a" as string]: `${config.washAlpha}` }
      : {}),
  };
}

export type GradientFollowMotion = {
  /** Lerp while tracking after the glow has engaged. Default 0.16. */
  followEase?: number;
  /** Lerp while resetting after leave. Default matches followEase. */
  leaveEase?: number;
  /**
   * Lerp used as the pointer first engages — keeps the glow drifting
   * out from rest instead of snapping under the cursor. Default 0.045.
   */
  enterEase?: number;
};

const SETTLE = 0.001;

function nearZero(value: number) {
  return Math.abs(value) < SETTLE;
}

/**
 * Pointer-driven CSS variable animation. Runs requestAnimationFrame only while
 * values are in motion and the card is on-screen / the tab is visible.
 */
export function useGradientFollow(
  config: GradientFollowConfig,
  motion: GradientFollowMotion = {},
) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hoverTarget = useRef(0);
  const hover = useRef(0);
  const configRef = useRef(config);
  const motionRef = useRef(motion);
  const startRef = useRef<() => void>(() => {});
  configRef.current = config;
  motionRef.current = motion;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let running = false;
    let onScreen = true;
    let pageVisible = document.visibilityState !== "hidden";
    let scrolling = false;
    let scrollTimeout = 0;
    const safari = isAceSafari();
    let io: IntersectionObserver | null = null;

    const settled = () =>
      hoverTarget.current === 0 &&
      nearZero(hover.current) &&
      nearZero(current.current.x) &&
      nearZero(current.current.y) &&
      nearZero(target.current.x) &&
      nearZero(target.current.y);

    const snapRest = () => {
      hover.current = 0;
      current.current.x = 0;
      current.current.y = 0;
      const cfg = configRef.current;
      const node = gradientRef.current;
      if (!node) return;
      node.style.setProperty("--gx", `${cfg.gx}%`);
      node.style.setProperty("--gy", `${cfg.gy}%`);
      node.style.setProperty("--grx", `${cfg.grx}%`);
      node.style.setProperty("--gry", `${cfg.gry}%`);
      node.style.setProperty("--core", `${cfg.core}%`);
      node.style.setProperty("--mid", `${cfg.mid}`);
      if (cfg.coreAlpha != null) {
        node.style.setProperty("--core-a", `${cfg.coreAlpha}`);
      }
      if (cfg.washAlpha != null) {
        node.style.setProperty("--wash-a", `${cfg.washAlpha}`);
      }
      node.style.setProperty("--mid-at", `${cfg.midAt}%`);
      node.style.setProperty("--fade", `${cfg.fade}%`);
    };

    const stopFrame = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      running = false;
    };

    const tick = () => {
      frame = 0;
      if (!onScreen || !pageVisible || scrolling) {
        running = false;
        return;
      }

      const cfg = configRef.current;
      const follow = motionRef.current.followEase ?? 0.16;
      const leave = motionRef.current.leaveEase ?? follow;
      const enter = motionRef.current.enterEase ?? 0.045;

      // Blend enter → follow as engagement rises so the first move
      // drifts from the resting spot instead of leaping to the pointer.
      const engaged = hover.current;
      const ease =
        hoverTarget.current > 0
          ? enter + (follow - enter) * engaged
          : leave;

      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      // Intensity rises on the soft enter curve so glow + travel start together.
      const intensityEase = hoverTarget.current > 0 ? enter : leave;
      hover.current += (hoverTarget.current - hover.current) * intensityEase;
      const node = gradientRef.current;
      if (node) {
        const h = hover.current;
        const scale = 1 + h * (cfg.scaleBoost ?? 0.03);
        node.style.setProperty(
          "--gx",
          `${cfg.gx + current.current.x * (cfg.rangeX ?? 26)}%`,
        );
        node.style.setProperty(
          "--gy",
          `${cfg.gy + current.current.y * (cfg.rangeY ?? 18)}%`,
        );
        node.style.setProperty("--grx", `${cfg.grx * scale}%`);
        node.style.setProperty("--gry", `${cfg.gry * scale}%`);
        node.style.setProperty("--core", `${cfg.core + h * (cfg.coreBoost ?? 0.5)}%`);
        node.style.setProperty("--mid", `${cfg.mid - h * (cfg.midDrop ?? 0.16)}`);
        if (cfg.coreAlpha != null) {
          const end = cfg.coreAlphaHover ?? cfg.coreAlpha;
          node.style.setProperty(
            "--core-a",
            `${cfg.coreAlpha + h * (end - cfg.coreAlpha)}`,
          );
        }
        if (cfg.washAlpha != null) {
          const end = cfg.washAlphaHover ?? cfg.washAlpha;
          node.style.setProperty(
            "--wash-a",
            `${cfg.washAlpha + h * (end - cfg.washAlpha)}`,
          );
        }
        node.style.setProperty(
          "--mid-at",
          `${cfg.midAt + h * (cfg.midAtBoost ?? 8)}%`,
        );
        node.style.setProperty(
          "--fade",
          `${cfg.fade + h * (cfg.fadeBoost ?? 11)}%`,
        );
      }

      if (settled()) {
        snapRest();
        running = false;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !onScreen || !pageVisible || scrolling) return;
      if (settled()) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    startRef.current = start;

    const bindIo = () => {
      const card = cardRef.current;
      if (!card || io) return;
      io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry?.isIntersecting ?? false;
          if (onScreen) start();
          else stopFrame();
        },
        { rootMargin: "25% 0px" },
      );
      io.observe(card);
    };
    bindIo();
    const bindFrame = requestAnimationFrame(bindIo);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible) start();
      else stopFrame();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Safari: freeze the rAF glow while the page is scrolling.
    const onScroll = () => {
      scrolling = true;
      stopFrame();
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        scrolling = false;
        start();
      }, 140);
    };
    if (safari) {
      window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    }

    return () => {
      startRef.current = () => {};
      stopFrame();
      cancelAnimationFrame(bindFrame);
      window.clearTimeout(scrollTimeout);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (safari) {
        window.removeEventListener("scroll", onScroll, true);
      }
    };
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    hoverTarget.current = 1;
    const rect = card.getBoundingClientRect();
    target.current.x = (event.clientX - rect.left) / rect.width - 0.5;
    target.current.y = (event.clientY - rect.top) / rect.height - 0.5;
    startRef.current();
  }

  function onPointerLeave() {
    hoverTarget.current = 0;
    target.current.x = 0;
    target.current.y = 0;
    startRef.current();
  }

  return { cardRef, gradientRef, onPointerMove, onPointerLeave };
}

/**
 * Bottom color wash for CTA / footer.
 * Base height stays flat; a soft peak under the pointer grows taller on hover.
 */
export function useCtaGradientRise({
  rest = 35,
  hover = 45,
}: {
  rest?: number;
  hover?: number;
} = {}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const hoverTarget = useRef(0);
  const hoverAmount = useRef(0);
  const targetX = useRef(0.5);
  const currentX = useRef(0.5);
  const restRef = useRef(rest);
  const hoverHeightRef = useRef(hover);
  const startRef = useRef<() => void>(() => {});
  restRef.current = rest;
  hoverHeightRef.current = hover;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const enter = 0.04;
    const follow = 0.08;
    const leave = 0.06;

    let frame = 0;
    let running = false;
    let onScreen = true;
    let pageVisible = document.visibilityState !== "hidden";
    let io: IntersectionObserver | null = null;

    const settled = () =>
      hoverTarget.current === 0 &&
      nearZero(hoverAmount.current) &&
      Math.abs(currentX.current - 0.5) < SETTLE;

    const snapRest = () => {
      hoverAmount.current = 0;
      currentX.current = 0.5;
      const node = gradientRef.current;
      if (!node) return;
      node.style.setProperty("--px", "50%");
      node.style.setProperty("--peak", `${restRef.current / 0.85}%`);
      node.style.setProperty("--peak-a", "0");
    };

    const tick = () => {
      frame = 0;
      if (!onScreen || !pageVisible) {
        running = false;
        return;
      }

      // Slow ease — keeps the peak from popping in.
      const engaged = hoverAmount.current;
      const intensityEase = hoverTarget.current > 0 ? enter : leave;
      hoverAmount.current +=
        (hoverTarget.current - hoverAmount.current) * intensityEase;
      // Drift from rest toward the pointer; ramp to follow once engaged.
      const posEase =
        hoverTarget.current > 0
          ? enter + (follow - enter) * engaged
          : leave;
      currentX.current += (targetX.current - currentX.current) * posEase;
      const node = gradientRef.current;
      if (node) {
        const h = hoverAmount.current;
        // Grow from the resting wash height up to the hover height (not from 0).
        const edge =
          restRef.current +
          (hoverHeightRef.current - restRef.current) * h;
        // Soft fade stop ~85% of the ellipse radius.
        const peakRadius = edge / 0.85;
        node.style.setProperty("--px", `${currentX.current * 100}%`);
        node.style.setProperty("--peak", `${peakRadius}%`);
        node.style.setProperty("--peak-a", `${0.12 * h}`);
      }

      if (settled()) {
        snapRest();
        running = false;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !onScreen || !pageVisible) return;
      if (settled()) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    startRef.current = start;

    const bindIo = () => {
      const card = cardRef.current;
      if (!card || io) return;
      io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry?.isIntersecting ?? false;
          if (onScreen) start();
          else if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
            running = false;
          }
        },
        { rootMargin: "25% 0px" },
      );
      io.observe(card);
    };
    bindIo();
    const bindFrame = requestAnimationFrame(bindIo);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible) start();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        running = false;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      startRef.current = () => {};
      cancelAnimationFrame(frame);
      cancelAnimationFrame(bindFrame);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    hoverTarget.current = 1;
    const rect = card.getBoundingClientRect();
    targetX.current = (event.clientX - rect.left) / rect.width;
    startRef.current();
  }

  function onPointerLeave() {
    hoverTarget.current = 0;
    startRef.current();
  }

  return {
    cardRef,
    gradientRef,
    onPointerMove,
    onPointerLeave,
    restHeight: rest,
  };
}
