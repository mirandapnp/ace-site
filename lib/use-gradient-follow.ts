"use client";

import { useEffect, useRef } from "react";

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
};

export const featuredGradientFollow: GradientFollowConfig = {
  gx: 50,
  gy: 78,
  grx: 90,
  gry: 70,
  core: 8,
  mid: 0.45,
  midAt: 40,
  fade: 72,
  rangeX: 28,
  rangeY: 22,
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
  };
}

export function useGradientFollow(config: GradientFollowConfig) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hoverTarget = useRef(0);
  const hover = useRef(0);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const tick = () => {
      const cfg = configRef.current;
      current.current.x += (target.current.x - current.current.x) * 0.16;
      current.current.y += (target.current.y - current.current.y) * 0.16;
      hover.current += (hoverTarget.current - hover.current) * 0.16;
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
        node.style.setProperty(
          "--mid-at",
          `${cfg.midAt + h * (cfg.midAtBoost ?? 8)}%`,
        );
        node.style.setProperty(
          "--fade",
          `${cfg.fade + h * (cfg.fadeBoost ?? 11)}%`,
        );
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    hoverTarget.current = 1;
    const rect = card.getBoundingClientRect();
    target.current.x = (event.clientX - rect.left) / rect.width - 0.5;
    target.current.y = (event.clientY - rect.top) / rect.height - 0.5;
  }

  function onPointerLeave() {
    hoverTarget.current = 0;
    target.current.x = 0;
    target.current.y = 0;
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
  restRef.current = rest;
  hoverHeightRef.current = hover;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const tick = () => {
      // Slow ease — keeps the peak from popping in.
      hoverAmount.current += (hoverTarget.current - hoverAmount.current) * 0.06;
      currentX.current += (targetX.current - currentX.current) * 0.08;
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
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    hoverTarget.current = 1;
    const rect = card.getBoundingClientRect();
    targetX.current = (event.clientX - rect.left) / rect.width;
  }

  function onPointerLeave() {
    hoverTarget.current = 0;
  }

  return {
    cardRef,
    gradientRef,
    onPointerMove,
    onPointerLeave,
    restHeight: rest,
  };
}
