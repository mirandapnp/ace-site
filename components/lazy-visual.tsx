"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { resolvePhoto, resolvePhotoLqip } from "@/lib/photos";

const lead = "400% 0px";
/** Phase 1: LQIP fades out over a solid soft full image (no opacity hole). */
const DISSOLVE_MS = 350;
/** Phase 2: unblur full image only after the LQIP is gone. */
const UNBLUR_MS = 350;
const MATCHED_BLUR = "16px";
/**
 * Blur expands painted edges / crop; a slight scale while soft keeps the
 * framed subject from looking like it shrinks as blur clears.
 */
const SOFT_SCALE = 1.05;
const DISSOLVE = `opacity ${DISSOLVE_MS}ms linear`;
const UNBLUR = `filter ${UNBLUR_MS}ms linear, transform ${UNBLUR_MS}ms linear`;

function useNear<T extends HTMLElement>(priority: boolean) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(priority);

  useEffect(() => {
    if (priority) return;
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: lead },
    );
    observer.observe(node);
    const box = node.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) setNear(true);
    return () => observer.disconnect();
  }, [priority]);

  return { ref, near };
}

function useStill() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return still;
}

/** Start the crossfade only after pixels are decoded, not just downloaded. */
function afterDecoded(
  image: HTMLImageElement,
  done: () => void,
) {
  if (image.decode) {
    image.decode().then(done).catch(done);
    return;
  }
  done();
}

function revealStyle(ready: boolean, opacity: number, still: boolean) {
  return {
    opacity: ready ? opacity : 0,
    transition: still ? "none" : "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
  };
}

/**
 * Soft LQIP above the full image. Stays at MATCHED_BLUR; only this layer’s
 * opacity dissolves — the full image underneath is already opaque and soft.
 */
function SoftBlurUp({
  blurDataURL,
  ready,
  still,
  className,
  style,
}: {
  blurDataURL: string;
  ready: boolean;
  still: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      aria-hidden
      alt=""
      src={blurDataURL}
      className={className}
      style={{
        ...style,
        filter: `blur(${MATCHED_BLUR})`,
        transform: `scale(${SOFT_SCALE})`,
        opacity: ready ? 0 : 1,
        transition: still ? "none" : DISSOLVE,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/** After dissolve finishes, allow the full image to unblur. */
function useBlurUpPhases(ready: boolean, still: boolean) {
  const [sharp, setSharp] = useState(false);

  useEffect(() => {
    if (!ready) {
      setSharp(false);
      return;
    }
    if (still) {
      setSharp(true);
      return;
    }
    const timer = window.setTimeout(() => setSharp(true), DISSOLVE_MS);
    return () => window.clearTimeout(timer);
  }, [ready, still]);

  return sharp;
}

export function LazyImage({
  src,
  alt = "",
  className,
  priority = false,
  restOpacity = 1,
  loadedFilter,
  fill = false,
  sizes,
  width,
  height,
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  /** Maps to next/image `preload` (Next 16). */
  priority?: boolean;
  restOpacity?: number;
  loadedFilter?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
}) {
  const photo = resolvePhoto(src);
  const still = useStill();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [src]);

  const sharp = useBlurUpPhases(ready, still);
  const lqip = resolvePhotoLqip(src);
  const hasBlurUp = Boolean(lqip);
  const restFilter =
    loadedFilter && loadedFilter.length > 0 ? loadedFilter : undefined;

  const shared = {
    alt,
    className,
    sizes: sizes ?? (fill ? "100vw" : undefined),
    preload: priority || undefined,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    fetchPriority: (priority ? "high" : "low") as "high" | "low",
    onLoad: (event: SyntheticEvent<HTMLImageElement>) => {
      afterDecoded(event.currentTarget, () => setReady(true));
    },
    style: {
      ...style,
      // Stay opaque once painted: LQIP fades on top, then this layer unblurs.
      opacity: restOpacity,
      filter: hasBlurUp
        ? sharp
          ? `blur(0px)${restFilter ? ` ${restFilter}` : ""}`
          : `blur(${MATCHED_BLUR})`
        : restFilter,
      transform: hasBlurUp
        ? sharp
          ? "scale(1)"
          : `scale(${SOFT_SCALE})`
        : undefined,
      // Hide until decode so the sharp decode flash never shows under the LQIP.
      visibility: hasBlurUp && !ready ? "hidden" : undefined,
      transition: hasBlurUp && !still ? UNBLUR : undefined,
    } satisfies CSSProperties,
  };

  if (photo) {
    const objectFit = className?.includes("object-contain")
      ? "object-contain"
      : "object-cover";
    const blur = lqip ? (
      <SoftBlurUp
        blurDataURL={lqip}
        ready={ready}
        still={still}
        className={
          fill
            ? `absolute inset-0 size-full max-w-none ${objectFit}`
            : "absolute inset-0 size-full max-w-none object-contain"
        }
      />
    ) : null;

    if (fill) {
      return (
        <>
          {blur}
          <Image {...shared} src={photo} fill placeholder="empty" />
        </>
      );
    }

    return (
      <span className="relative inline-block max-w-full leading-[0]">
        {blur}
        <Image
          {...shared}
          src={photo}
          width={width ?? photo.width}
          height={height ?? photo.height}
          placeholder="empty"
        />
      </span>
    );
  }

  // Non-registry assets (logo, etc.) — optimize without blur-up.
  if (fill) {
    return <Image {...shared} src={src} fill />;
  }
  if (width != null && height != null) {
    return <Image {...shared} src={src} width={width} height={height} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={src}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      onLoad={(event) => {
        afterDecoded(event.currentTarget, () => setReady(true));
      }}
      style={shared.style}
    />
  );
}

export function LazyVideo({
  src,
  className,
  priority = false,
}: {
  src: string;
  className?: string;
  priority?: boolean;
}) {
  const { ref, near } = useNear<HTMLVideoElement>(priority);
  const still = useStill();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !near) {
      setReady(false);
      return;
    }
    const showIfLoaded = () => {
      if (node.readyState >= 2) setReady(true);
    };
    showIfLoaded();
    const frame = requestAnimationFrame(showIfLoaded);
    return () => cancelAnimationFrame(frame);
  }, [near, src]);

  return (
    <video
      ref={ref as RefObject<HTMLVideoElement>}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      preload={near ? "auto" : "none"}
      src={near ? src : undefined}
      onLoadedData={() => setReady(true)}
      className={className}
      style={revealStyle(ready, 1, still)}
    />
  );
}
