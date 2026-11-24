"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { resolvePhoto, resolvePhotoLqip } from "@/lib/photos";

const lead = "400% 0px";
/** Soft LQIP ↔ full-image crossfade. */
const BLUR_UP_MS = 400;
const BLUR_UP_RADIUS = "36px";
const BLUR_UP_TRANSITION = `opacity ${BLUR_UP_MS}ms linear, filter ${BLUR_UP_MS}ms linear`;

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

function revealStyle(ready: boolean, opacity: number, still: boolean) {
  return {
    opacity: ready ? opacity : 0,
    transition: still ? "none" : "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
  };
}

/**
 * Soft LQIP above the full image. Fixed blur; opacity fades with the
 * full-image flip (opacity + unblur).
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
        filter: `blur(${BLUR_UP_RADIUS})`,
        opacity: ready ? 0 : 1,
        transition: still ? "none" : BLUR_UP_TRANSITION,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
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
  quality,
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
  /** next/image encode quality (1–100). Default 75. */
  quality?: number;
  style?: CSSProperties;
}) {
  const photo = resolvePhoto(src);
  const still = useStill();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [src]);

  const lqip = resolvePhotoLqip(src);
  const hasBlurUp = Boolean(lqip);
  const restFilter =
    loadedFilter && loadedFilter.length > 0 ? loadedFilter : undefined;
  // Flip with the LQIP: blurred + invisible → sharp (+ optional drop-shadow) + opaque.
  const imageFilter = hasBlurUp
    ? ready
      ? `blur(0px)${restFilter ? ` ${restFilter}` : ""}`
      : `blur(${BLUR_UP_RADIUS})`
    : restFilter;

  const shared = {
    alt,
    className,
    sizes: sizes ?? (fill ? "100vw" : undefined),
    quality,
    preload: priority || undefined,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    fetchPriority: (priority ? "high" : "low") as "high" | "low",
    onLoad: () => setReady(true),
    style: {
      ...style,
      opacity: hasBlurUp ? (ready ? restOpacity : 0) : restOpacity,
      filter: imageFilter,
      transition: hasBlurUp && !still ? BLUR_UP_TRANSITION : undefined,
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
      onLoad={() => setReady(true)}
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
