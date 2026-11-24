"use client";

import { useId } from "react";

/**
 * Animated film grain masked by the parent gradient’s ellipse vars
 * (--gx/--gy/--grx/--gry/--core/--mid-at/--fade) so it reads where
 * the wash is most opaque. Seed jumps like TV static. Same green tone as
 * the wash, with crushed luminance so speckles stay visible under color-burn.
 */
export function GradientNoise({ className = "" }: { className?: string }) {
  const filterId = `ace-noise-${useId().replace(/:/g, "")}`;
  // Discrete seed cycle — each step is a fresh noise field (TV static).
  const seeds = Array.from({ length: 24 }, (_, i) => i + 1).join(";");

  return (
    <svg
      aria-hidden
      className={`ace-gradient-noise ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <filter
          id={filterId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.215"
            numOctaves="4"
            seed="1"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="seed"
              values={seeds}
              dur="0.792s"
              repeatCount="indefinite"
              calcMode="discrete"
            />
          </feTurbulence>
          {/* Crush midtones so dark/light speckles still read on the wash. */}
          <feComponentTransfer in="noise" result="contrast">
            <feFuncR type="linear" slope="1.8" intercept="-0.4" />
            <feFuncG type="linear" slope="1.8" intercept="-0.4" />
            <feFuncB type="linear" slope="1.8" intercept="-0.4" />
          </feComponentTransfer>
          {/* Same ACE green tone (#36F592) — contrast comes from luminance, not hue. */}
          <feColorMatrix
            in="contrast"
            type="matrix"
            values="
              0.12 0    0    0 0.04
              0    0.58 0    0 0.18
              0    0    0.32 0 0.10
              0    0    0    0.9 0"
            result="greenGrain"
          />
        </filter>
      </defs>
      <rect
        width="100%"
        height="100%"
        filter={`url(#${filterId})`}
        style={{ mixBlendMode: "color-burn" }}
      />
    </svg>
  );
}
