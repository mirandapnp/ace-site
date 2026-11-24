"use client";

import { useWebGPUDevice } from "@figma/expressive-components";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  setup as bloomSetup,
  render as bloomRender,
} from "@/lib/custom-effects/bloom";
import { photoPath, resolvePhoto, resolvePhotoLqip } from "@/lib/photos";

/** Soft LQIP ↔ full-image crossfade (mirrors LazyImage). */
const BLUR_UP_MS = 400;
const BLUR_UP_RADIUS = "36px";
const BLUR_UP_TRANSITION = `opacity ${BLUR_UP_MS}ms linear, filter ${BLUR_UP_MS}ms linear`;
const CANVAS_DISSOLVE = `opacity ${BLUR_UP_MS}ms linear`;

export type BloomParams = {
  /** Hover intensity. Rest is always 0. */
  intensity?: number;
  tint?: { r: number; g: number; b: number; a: number };
  vignetteStrength?: number;
  vignetteSoftness?: number;
  softness?: number;
  threshold?: number;
  /** Spotlight radius (%). Origin rests at center and follows the pointer. */
  radius?: number;
};

/** Shared ACE bloom look — use on any section for a consistent hover glow. */
export const aceBloom: Required<BloomParams> = {
  intensity: 15,
  tint: { r: 179 / 255, g: 179 / 255, b: 179 / 255, a: 1 }, // #B3B3B3
  vignetteStrength: 0,
  vignetteSoftness: 100,
  softness: 60,
  threshold: 80,
  radius: 80,
};

type BloomCardProps = {
  src: string;
  /** Applied to the background image / bloom canvas (e.g. object-cover). */
  imageClassName?: string;
  /** object-position for cover crop into the bloom input. Default center. */
  objectPosition?: string;
  /** Extra opacity on the bloomed image (e.g. 0.8 for exhibitions). */
  imageOpacity?: number;
  className?: string;
  bloom?: BloomParams;
  /** Darken / vignette layers drawn above the bloomed image. */
  overlay?: ReactNode;
  children?: ReactNode;
};

type BloomFrame = {
  gpu: { device: GPUDevice; context: GPUCanvasContext; format: GPUTextureFormat };
  input: GPUTexture | null;
  output: GPUTexture | null;
  time: number;
  deltaTime: number;
  frame: number;
  mousePosition: { x: number; y: number; down: boolean };
  renderScale: number;
  params: Record<string, unknown>;
  state: Record<string, unknown>;
};

function parseObjectPosition(objectPosition: string) {
  const tokens = objectPosition.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let xAlign = 0.5;
  let yAlign = 0.5;

  const apply = (token: string, axis: "x" | "y" | "either") => {
    if (token === "left" && axis !== "y") xAlign = 0;
    else if (token === "right" && axis !== "y") xAlign = 1;
    else if (token === "center") {
      if (axis === "x") xAlign = 0.5;
      else if (axis === "y") yAlign = 0.5;
    } else if (token === "top" && axis !== "x") yAlign = 0;
    else if (token === "bottom" && axis !== "x") yAlign = 1;
  };

  if (tokens.length === 1) {
    apply(tokens[0]!, "either");
  } else if (tokens.length >= 2) {
    apply(tokens[0]!, "x");
    apply(tokens[1]!, "y");
  }

  return { xAlign, yAlign };
}

function coverDraw(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  naturalWidth: number,
  naturalHeight: number,
  objectPosition: string,
) {
  const ir = naturalWidth / naturalHeight;
  const cr = width / height;
  let dw: number;
  let dh: number;
  if (ir > cr) {
    dh = height;
    dw = height * ir;
  } else {
    dw = width;
    dh = width / ir;
  }

  const { xAlign, yAlign } = parseObjectPosition(objectPosition);
  const dx = (width - dw) * xAlign;
  const dy = (height - dh) * yAlign;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, dx, dy, dw, dh);
}

/**
 * Runs the Figma Bloom module against the background image as a GPU texture.
 * The canvas is the background image layer — overlays sit above it.
 */
function BloomImageLayer({
  src,
  className,
  objectPosition = "center",
  opacity = 1,
  params,
  animateRef,
  resumeRef,
}: {
  src: string;
  className?: string;
  objectPosition?: string;
  opacity?: number;
  params: {
    intensity: number;
    tint: { r: number; g: number; b: number; a: number };
    vignetteStrength: number;
    vignetteSoftness: number;
    softness: number;
    threshold: number;
    origin: { x: number; y: number; radius: number };
  };
  /** When false after the first frame, the GPU loop sleeps until resumed. */
  animateRef: React.MutableRefObject<boolean>;
  resumeRef: React.MutableRefObject<(() => void) | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { device, error: deviceError } = useWebGPUDevice();
  const [useFallback, setUseFallback] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [bloomReady, setBloomReady] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduced);
    if (reduced) setUseFallback(true);
  }, []);

  useEffect(() => {
    setImageReady(false);
    setBloomReady(false);
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !device || deviceError || still) {
      if (deviceError) setUseFallback(true);
      return;
    }

    setBloomReady(false);
    let cancelled = false;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let pageVisible = document.visibilityState !== "hidden";
    let inputTexture: GPUTexture | null = null;
    let sourceBitmap: ImageBitmap | null = null;
    let lastCssW = 0;
    let lastCssH = 0;
    let lastDpr = 0;
    let frame: BloomFrame | null = null;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let signaledBloom = false;
    let lastTs = 0;

    const context = canvas.getContext("webgpu");
    if (!context) {
      setUseFallback(true);
      return;
    }

    // Match the Figma expressive-components runtime format.
    const format = "rgba8unorm" as GPUTextureFormat;
    context.configure({
      device,
      format,
      alphaMode: "premultiplied",
    });

    function rebuildInput(bitmap: ImageBitmap, cssW: number, cssH: number, dpr: number) {
      const pixelW = Math.max(1, Math.round(cssW * dpr));
      const pixelH = Math.max(1, Math.round(cssH * dpr));

      const scratch =
        typeof OffscreenCanvas !== "undefined"
          ? new OffscreenCanvas(pixelW, pixelH)
          : Object.assign(document.createElement("canvas"), {
              width: pixelW,
              height: pixelH,
            });
      scratch.width = pixelW;
      scratch.height = pixelH;
      const ctx = scratch.getContext("2d");
      if (!ctx) return;

      coverDraw(
        ctx,
        bitmap,
        pixelW,
        pixelH,
        bitmap.width,
        bitmap.height,
        objectPosition,
      );

      inputTexture?.destroy();
      inputTexture = device!.createTexture({
        size: [pixelW, pixelH, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });
      device!.queue.copyExternalImageToTexture(
        { source: scratch as GPUCopyExternalImageSource },
        { texture: inputTexture },
        [pixelW, pixelH],
      );

      canvas!.width = pixelW;
      canvas!.height = pixelH;

      frame = {
        gpu: { device: device!, context: context!, format },
        input: inputTexture,
        output: null,
        time: 0,
        deltaTime: 0,
        frame: 0,
        mousePosition: { x: 0, y: 0, down: false },
        renderScale: dpr,
        params,
        state: {},
      };
      bloomSetup(device!, frame);
      lastCssW = cssW;
      lastCssH = cssH;
      lastDpr = dpr;
    }

    const shouldAnimate = () =>
      Boolean(animateRef?.current) || !signaledBloom;

    const tick = (ts: number) => {
      if (cancelled) return;
      raf = 0;
      if (!onScreen || !pageVisible) {
        running = false;
        return;
      }
      if (!frame?.input) {
        if (shouldAnimate()) raf = requestAnimationFrame(tick);
        else running = false;
        return;
      }

      frame.deltaTime = lastTs ? ts - lastTs : 0;
      lastTs = ts;
      frame.time += frame.deltaTime;
      frame.frame += 1;
      frame.params = params;
      frame.output = context.getCurrentTexture();
      bloomRender(device, frame);
      if (!signaledBloom) {
        signaledBloom = true;
        setBloomReady(true);
      }

      // Keep rendering while the hover spotlight is live; stop at rest.
      if (shouldAnimate()) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (cancelled || running || !onScreen || !pageVisible) return;
      // Allow a single rest frame after hover settles (!shouldAnimate but input ready).
      if (!shouldAnimate() && !frame?.input) return;
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(tick);
    };
    resumeRef.current = start;

    void (async () => {
      try {
        // Prefer the local public path so GPU bloom does not depend on the image optimizer.
        const response = await fetch(photoPath(src) ?? src);
        const blob = await response.blob();
        sourceBitmap = await createImageBitmap(blob);
        if (cancelled || !sourceBitmap) return;

        const syncSize = () => {
          const cssW = canvas.clientWidth;
          const cssH = canvas.clientHeight;
          if (cssW <= 0 || cssH <= 0 || !sourceBitmap) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (
            !frame ||
            cssW !== lastCssW ||
            cssH !== lastCssH ||
            dpr !== lastDpr
          ) {
            rebuildInput(sourceBitmap, cssW, cssH, dpr);
            start();
          }
        };

        syncSize();
        ro = new ResizeObserver(syncSize);
        ro.observe(canvas);

        io = new IntersectionObserver(
          ([entry]) => {
            onScreen = entry?.isIntersecting ?? false;
            if (onScreen) start();
            else if (raf) {
              cancelAnimationFrame(raf);
              raf = 0;
              running = false;
            }
          },
          { rootMargin: "25% 0px" },
        );
        io.observe(canvas);

        start();
      } catch (err) {
        console.warn("Bloom image effect failed", err);
        if (!cancelled) setUseFallback(true);
      }
    })();

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      if (pageVisible) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        running = false;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      resumeRef.current = null;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      inputTexture?.destroy();
      sourceBitmap?.close();
    };
  }, [device, deviceError, src, objectPosition, params, still, animateRef, resumeRef]);

  const gpuActive = Boolean(device) && !deviceError && !useFallback;
  const photoVisible = !bloomReady;
  const photo = resolvePhoto(src);
  const lqip = resolvePhotoLqip(src);
  const flipTransition = still ? "none" : BLUR_UP_TRANSITION;
  const canvasTransition = still ? "none" : CANVAS_DISSOLVE;

  return (
    <>
      {lqip ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          aria-hidden
          alt=""
          src={lqip}
          className={className}
          style={{
            objectPosition,
            filter: `blur(${BLUR_UP_RADIUS})`,
            opacity: photoVisible && !imageReady ? opacity : 0,
            transition: flipTransition,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ) : null}
      {photo ? (
        <Image
          alt=""
          src={photo}
          fill
          placeholder="empty"
          sizes="100vw"
          className={className}
          onLoad={() => setImageReady(true)}
          style={{
            objectPosition,
            // Mirrored flip with LQIP; stay until first bloom frame, then fade to canvas.
            opacity: !photoVisible
              ? 0
              : lqip
                ? imageReady
                  ? opacity
                  : 0
                : opacity,
            filter: lqip
              ? imageReady
                ? "blur(0px)"
                : `blur(${BLUR_UP_RADIUS})`
              : undefined,
            transition: flipTransition,
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          src={src}
          className={className}
          style={{
            opacity: photoVisible ? opacity : 0,
            transition: canvasTransition,
          }}
          decoding="async"
          onLoad={() => setImageReady(true)}
        />
      )}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          display: gpuActive ? "block" : "none",
          opacity: bloomReady ? opacity : 0,
          transition: canvasTransition,
        }}
        aria-hidden
      />
    </>
  );
}

/**
 * Section card with Figma Bloom over the background image layer.
 * Intensity eases 0 → hover max on enter; origin follows the pointer
 * with the same soft enter/follow blend as the hero gradient.
 */
export function BloomCard({
  src,
  imageClassName = "absolute inset-0 size-full object-cover",
  objectPosition = "center",
  imageOpacity = 1,
  className,
  bloom,
  overlay,
  children,
}: BloomCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverTarget = useRef(0);
  const hover = useRef(0);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const animateRef = useRef(false);
  const resumeBloomRef = useRef<(() => void) | null>(null);
  const startHoverRef = useRef<() => void>(() => {});

  const look = { ...aceBloom, ...bloom };
  const hoverIntensity = look.intensity;
  const radius = look.radius;
  const tint = look.tint;
  const vignetteStrength = look.vignetteStrength;
  const vignetteSoftness = look.vignetteSoftness;
  const softness = look.softness;
  const threshold = look.threshold;

  // Live params — mutated each frame; bloom render reads this object.
  const paramsRef = useRef({
    intensity: 0,
    tint: { ...tint },
    vignetteStrength: 0,
    vignetteSoftness,
    softness,
    threshold,
    origin: { x: 50, y: 50, radius },
  });
  const params = paramsRef.current;

  useEffect(() => {
    params.tint.r = tint.r;
    params.tint.g = tint.g;
    params.tint.b = tint.b;
    params.tint.a = tint.a;
    params.vignetteSoftness = vignetteSoftness;
    params.softness = softness;
    params.threshold = threshold;
    params.origin.radius = radius;
  }, [
    params,
    tint.r,
    tint.g,
    tint.b,
    tint.a,
    vignetteSoftness,
    softness,
    threshold,
    radius,
  ]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      params.intensity = 0;
      params.vignetteStrength = 0;
      params.origin.x = 50;
      params.origin.y = 50;
      animateRef.current = false;
      return;
    }

    const enter = 0.045;
    const follow = 0.1;
    const leave = 0.045;
    const settle = 0.001;

    let frame = 0;
    let running = false;

    const settled = () =>
      hoverTarget.current === 0 &&
      hover.current < settle &&
      Math.abs(current.current.x - 50) < settle &&
      Math.abs(current.current.y - 50) < settle;

    const tick = () => {
      frame = 0;
      const engaged = hover.current;
      const intensityEase = hoverTarget.current > 0 ? enter : leave;
      hover.current += (hoverTarget.current - hover.current) * intensityEase;

      const ease =
        hoverTarget.current > 0
          ? enter + (follow - enter) * engaged
          : leave;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      const h = hover.current;
      params.intensity = h * hoverIntensity;
      params.vignetteStrength = h * vignetteStrength;
      params.origin.x = current.current.x;
      params.origin.y = current.current.y;

      if (settled()) {
        hover.current = 0;
        current.current.x = 50;
        current.current.y = 50;
        params.intensity = 0;
        params.vignetteStrength = 0;
        params.origin.x = 50;
        params.origin.y = 50;
        animateRef.current = false;
        running = false;
        // One more GPU frame so the canvas lands on intensity 0.
        resumeBloomRef.current?.();
        return;
      }

      animateRef.current = true;
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      animateRef.current = true;
      resumeBloomRef.current?.();
      frame = requestAnimationFrame(tick);
    };
    startHoverRef.current = start;

    return () => {
      startHoverRef.current = () => {};
      cancelAnimationFrame(frame);
      animateRef.current = false;
    };
  }, [params, hoverIntensity, vignetteStrength]);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root) return;
    hoverTarget.current = 1;
    const rect = root.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    target.current.x = ((event.clientX - rect.left) / rect.width) * 100;
    target.current.y = ((event.clientY - rect.top) / rect.height) * 100;
    startHoverRef.current();
  }

  function onPointerLeave() {
    hoverTarget.current = 0;
    target.current.x = 50;
    target.current.y = 50;
    startHoverRef.current();
  }

  return (
    <div
      ref={rootRef}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <BloomImageLayer
            src={src}
            className={imageClassName}
            objectPosition={objectPosition}
            opacity={imageOpacity}
            params={params}
            animateRef={animateRef}
            resumeRef={resumeBloomRef}
          />
        </div>
        {overlay}
      </div>
      {children}
    </div>
  );
}
