"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/components/lazy-visual";

const controlClass =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#4E4E4E] text-white transition-colors enabled:hover:bg-[#FFF645] enabled:hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF645] disabled:opacity-30 disabled:transition-none";

/** Approximate BeUI SPRING_LAYOUT (stiffness 360 / damping 32). */
const zoomTransition =
  "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
/** Softer Chrome LQIP blur-up than the default 36px (Safari snaps). */
const galleryBlurUp = "14px";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: readonly string[];
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const current = images[active] ?? images[0];

  return (
    <div className="relative flex w-full flex-col items-center gap-5 overflow-hidden rounded-[16px] bg-white pt-5 pb-2.5 min-[1024px]:aspect-square min-[1024px]:w-full min-[1024px]:self-start min-[1024px]:justify-center min-[1024px]:gap-0 min-[1024px]:p-5">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden min-[1024px]:w-[90%]"
        aria-label={`View larger photo of ${name}`}
      >
        <LazyImage
          key={current}
          priority
          fill
          alt={name}
          src={current}
          className="object-contain"
          sizes="(max-width: 1023px) 100vw, 746px"
          quality={90}
          blurUpRadius={galleryBlurUp}
        />
      </button>

      {images.length > 1 ? (
        <div
          className="flex w-full gap-5 px-2.5 min-[1024px]:absolute min-[1024px]:bottom-0 min-[1024px]:left-0 min-[1024px]:w-auto min-[1024px]:flex-col min-[1024px]:p-5"
          role="tablist"
          aria-label={`${name} photos`}
        >
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Photo ${index + 1}`}
                onClick={() => setActive(index)}
                className={`relative size-[60px] shrink-0 overflow-hidden rounded-[8px] bg-white transition-[filter,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  selected
                    ? "opacity-100 grayscale-0"
                    : "opacity-50 grayscale hover:opacity-80"
                }`}
              >
                <LazyImage
                  fill
                  alt=""
                  src={src}
                  className="object-cover"
                  sizes="60px"
                  blurUpRadius={galleryBlurUp}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {lightbox ? (
        <PhotoLightbox
          name={name}
          images={images}
          index={active}
          onIndexChange={setActive}
          onClose={() => setLightbox(false)}
        />
      ) : null}
    </div>
  );
}

function PhotoLightbox({
  name,
  images,
  index,
  onIndexChange,
  onClose,
}: {
  name: string;
  images: readonly string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panByRef = useRef<(dx: number, dy: number) => void>(() => {});
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [zoom, setZoom] = useState(false);
  const reducedMotion = useRef(false);
  const current = images[index] ?? images[0];
  const multi = images.length > 1;
  const panHelp = useId();

  useEffect(() => {
    setMounted(true);
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setZoom(false);
  }, [index]);

  function requestClose() {
    if (reducedMotion.current) {
      onClose();
      return;
    }
    setVisible(false);
  }

  function move(direction: -1 | 1) {
    if (!multi) return;
    onIndexChange((index + direction + images.length) % images.length);
  }

  useEffect(() => {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (reducedMotion.current) onClose();
        else setVisible(false);
        return;
      }
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented
      ) {
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (
          event.target instanceof Element &&
          event.target.closest("[data-lightbox-zoom]")
        ) {
          return;
        }
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, index, multi, onClose, onIndexChange]);

  function onFadeEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (!visible) onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onTransitionEnd={onFadeEnd}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-black/90"
        onClick={requestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${name} photos`}
        tabIndex={-1}
        className="pointer-events-none absolute inset-3 flex flex-col outline-none sm:inset-6"
        onPointerDownCapture={(event) => {
          const target = event.target;
          if (
            target instanceof Element &&
            !target.closest(
              "button, a, input, select, textarea, [data-lightbox-content]",
            )
          ) {
            event.preventDefault();
            requestClose();
          }
        }}
      >
        <div
          data-lightbox-content=""
          className="pointer-events-auto flex items-center justify-between gap-3 pb-3 text-white"
        >
          <p className="font-mono text-[12px] leading-[15px] font-[525] tracking-[0.78px] uppercase tabular-nums">
            {index + 1} / {images.length}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            className={controlClass}
            aria-label="Close photo"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
            >
              <path
                d="M4.5 4.5l9 9M13.5 4.5l-9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <LightboxFrame
          key={current}
          src={current}
          alt={`${name} — photo ${index + 1}`}
          zoom={zoom}
          panByRef={panByRef}
          reduce={reducedMotion.current}
          onSwipe={move}
        />

        <div
          data-lightbox-content=""
          className="pointer-events-auto flex items-center justify-between gap-3 pt-3 text-white"
        >
          <button
            type="button"
            className={controlClass}
            aria-label="Previous photo"
            disabled={!multi}
            onClick={() => move(-1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M11 4.5L6.5 9 11 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className="flex items-center gap-2.5"
            onKeyDown={(event) => {
              if (!zoom) return;
              if (
                !(event.target instanceof Element) ||
                !event.target.closest("[data-lightbox-zoom]")
              ) {
                return;
              }
              const dx =
                event.key === "ArrowLeft"
                  ? -40
                  : event.key === "ArrowRight"
                    ? 40
                    : 0;
              const dy =
                event.key === "ArrowUp"
                  ? -40
                  : event.key === "ArrowDown"
                    ? 40
                    : 0;
              if (!dx && !dy) return;
              event.preventDefault();
              event.stopPropagation();
              panByRef.current(dx, dy);
            }}
          >
            <button
              type="button"
              data-lightbox-zoom=""
              aria-label="Zoom out"
              aria-describedby={panHelp}
              className={controlClass}
              disabled={!zoom}
              onClick={() => setZoom(false)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 9h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              data-lightbox-zoom=""
              aria-label="Zoom in"
              aria-describedby={panHelp}
              className={controlClass}
              disabled={zoom}
              onClick={() => setZoom(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden
              >
                <path
                  d="M9 4v10M4 9h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <button
            type="button"
            className={controlClass}
            aria-label="Next photo"
            disabled={!multi}
            onClick={() => move(1)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 4.5L11.5 9 7 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span id={panHelp} className="sr-only">
            When zoomed in, drag the image to pan, or keep this control focused
            and use the arrow keys.
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function LightboxFrame({
  src,
  alt,
  zoom,
  panByRef,
  reduce,
  onSwipe,
}: {
  src: string;
  alt: string;
  zoom: boolean;
  panByRef: React.MutableRefObject<(dx: number, dy: number) => void>;
  reduce: boolean;
  onSwipe: (direction: -1 | 1) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const boundsRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const zoomRef = useRef(zoom);
  const still = reduce;

  useEffect(() => {
    zoomRef.current = zoom;
    if (!zoom) setOffset({ x: 0, y: 0 });
  }, [zoom]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!boundsRef.current || !imageBoxRef.current) return;
      const next = {
        x: Math.max(
          0,
          (imageBoxRef.current.clientWidth * 2 - boundsRef.current.clientWidth) /
            2,
        ),
        y: Math.max(
          0,
          (imageBoxRef.current.clientHeight * 2 -
            boundsRef.current.clientHeight) /
            2,
        ),
      };
      setPan(next);
      setOffset((current) => ({
        x: Math.max(-next.x, Math.min(next.x, current.x)),
        y: Math.max(-next.y, Math.min(next.y, current.y)),
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (boundsRef.current) observer.observe(boundsRef.current);
    if (imageBoxRef.current) observer.observe(imageBoxRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    panByRef.current = (dx, dy) => {
      if (!zoomRef.current) return;
      setOffset((current) => ({
        x: Math.max(-pan.x, Math.min(pan.x, current.x + dx)),
        y: Math.max(-pan.y, Math.min(pan.y, current.y + dy)),
      }));
    };
  }, [pan.x, pan.y, panByRef]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    if (zoom) {
      dragRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: offset.x,
        originY: offset.y,
      };
      setDragging(true);
      return;
    }
    swipeRef.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!zoom || !drag) return;
    setOffset({
      x: Math.max(
        -pan.x,
        Math.min(pan.x, drag.originX + (event.clientX - drag.startX)),
      ),
      y: Math.max(
        -pan.y,
        Math.min(pan.y, drag.originY + (event.clientY - drag.startY)),
      ),
    });
  }

  function endGesture(event?: React.PointerEvent<HTMLDivElement>) {
    const wasDragging = dragRef.current != null;
    dragRef.current = null;
    if (wasDragging) setDragging(false);

    const start = swipeRef.current;
    swipeRef.current = null;
    if (!event || !start || zoom) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      onSwipe(dx < 0 ? 1 : -1);
    }
  }

  return (
    <div className="pointer-events-auto relative flex min-h-0 flex-1 items-center justify-center">
      <div
        ref={boundsRef}
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg"
      >
        <div
          ref={imageBoxRef}
          data-lightbox-content=""
          className="relative aspect-square max-h-full max-w-full"
          style={{
            width: "min(100%, calc(100dvh - 160px))",
          }}
        >
          <div
            className={`absolute inset-0 ${zoom ? "" : "overflow-hidden"}`}
          >
            <div
              className="absolute inset-0 select-none"
              style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom ? 2 : 1})`,
                transformOrigin: "center center",
                transition: still || dragging ? "none" : zoomTransition,
                touchAction: zoom ? "none" : "pan-y",
                cursor: zoom ? (dragging ? "grabbing" : "grab") : undefined,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endGesture}
              onPointerCancel={() => endGesture()}
            >
              <LazyImage
                priority
                fill
                alt={alt}
                src={src}
                className="pointer-events-none object-contain select-none"
                sizes="(max-width: 1023px) 100vw, 1120px"
                quality={90}
                blurUpRadius={galleryBlurUp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
