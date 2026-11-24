"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { resolvePhoto } from "@/lib/photos";

const lead = "400% 0px";

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [src]);

  const filter =
    ready && loadedFilter && loadedFilter.length > 0 ? loadedFilter : undefined;

  const shared = {
    alt,
    className,
    sizes: sizes ?? (fill ? "100vw" : undefined),
    preload: priority || undefined,
    loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    decoding: "async" as const,
    fetchPriority: (priority ? "high" : "low") as "high" | "low",
    onLoad: () => setReady(true),
    style: {
      ...style,
      opacity: restOpacity,
      ...(filter ? { filter } : {}),
    } satisfies CSSProperties,
  };

  if (photo) {
    if (fill) {
      return (
        <Image
          {...shared}
          src={photo}
          fill
          placeholder="blur"
        />
      );
    }
    return (
      <Image
        {...shared}
        src={photo}
        width={width ?? photo.width}
        height={height ?? photo.height}
        placeholder="blur"
      />
    );
  }

  // Non-registry assets (logo, etc.) — optimize without blur-up.
  if (fill) {
    return (
      <Image
        {...shared}
        src={src}
        fill
      />
    );
  }
  if (width != null && height != null) {
    return (
      <Image
        {...shared}
        src={src}
        width={width}
        height={height}
      />
    );
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
