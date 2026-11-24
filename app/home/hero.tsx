"use client";

import { useEffect, useRef, useState } from "react";
import { LazyImage, LazyVideo } from "@/components/lazy-visual";
import { Marquee } from "@/components/marquee";
import { PageNumber } from "@/components/page-number";
import { PrimaryButton } from "@/components/primary-button";
import { GradientNoise } from "@/components/gradient-noise";
import { TypeIn } from "@/components/type-in";
import { media } from "@/lib/media";
import {
  gradientFollowVars,
  heroGradientFollow,
  type GradientFollowConfig,
  useGradientFollow,
} from "@/lib/use-gradient-follow";

const DESKTOP_MQ = "(min-width: 1024px)";
const MACHINE_WIDTH = 1.4;

/** Desktop hero card design height — below this, copy centers vertically. */
const DESKTOP_CARD_H = 860;

/**
 * Shared machine slot — Figma "Frame 2147238782" in the 1400×860 card.
 * Each slide only swaps the art inset inside this frame.
 */
const MACHINE_FRAME = {
  left: 633,
  top: 78.41943359375,
  width: 764,
  height: 682,
} as const;

type MachineArt = {
  /** Offset of the art within MACHINE_FRAME (Figma image layer). */
  left: number;
  top: number;
  width: number;
  height: number;
  /**
   * Where the visual mass sits in the art box (0–1 from left).
   * Used to center the cabinet in the compact layout.
   */
  visualCenter: number;
};

type HeroSlide = {
  label: string;
  title: string;
  body: string;
  machine: string;
  video: string;
  /** Radial bloom tint over the backdrop video. */
  bloom: string;
  art: MachineArt;
};

const slides: readonly HeroSlide[] = [
  {
    label: "01",
    title: "Cold Trigger",
    body: "Lock in for explosive 4-player co-op action in this tactical arcade shooter featuring swivel-mounted weapons and dual-screen combat.",
    machine: "/ace/machine.webp",
    video: media("/ace/hero.mp4?v=3"),
    bloom: "#36F592",
    // Prior 1014² placement expressed as an inset in MACHINE_FRAME.
    art: {
      left: 338.94 - MACHINE_FRAME.left,
      top: 58.17 - MACHINE_FRAME.top,
      width: 1014.01,
      height: 1014.01,
      visualCenter: 0.68,
    },
  },
  {
    label: "02",
    title: "Thunder Jets",
    body: "Feel every roll and dive in a full-motion, 360° combat cockpit. Choose your jet, conquer six intense battlegrounds, and rule the skies in Thunder Jets.",
    machine: "/ace/machine-thunder-jets.webp",
    video: media("/ace/hero-2.mp4"),
    bloom: "#04C8CF",
    // Figma 905:8034 — image 10 inside Frame 2147238782.
    art: {
      left: -174.43701171875,
      top: 40.920570373535156,
      width: 840.3685913085938,
      height: 845.8428344726562,
      visualCenter: 0.52,
    },
  },
  {
    // Slide 03 mockup not built yet — keep the pager slot, reuse slide 01 media.
    label: "03",
    title: "Cold Trigger",
    body: "Lock in for explosive 4-player co-op action in this tactical arcade shooter featuring swivel-mounted weapons and dual-screen combat.",
    machine: "/ace/machine.webp",
    video: media("/ace/hero.mp4?v=3"),
    bloom: "#36F592",
    art: {
      left: 338.94 - MACHINE_FRAME.left,
      top: 58.17 - MACHINE_FRAME.top,
      width: 1014.01,
      height: 1014.01,
      visualCenter: 0.68,
    },
  },
];

/** text shadow — h1 */
const TEXT_SHADOW = "0px 3px 20px rgba(0, 0, 0, 0.4)";
/** machine shadow — follows machine alpha, not the square frame */
const MACHINE_SHADOW = "drop-shadow(5px 10px 32px rgba(0, 0, 0, 0.25))";

function bloomGradient(bloom: string) {
  const hex = bloom.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), rgb(${r} ${g} ${b}) var(--core), rgba(${r}, ${g}, ${b}, var(--mid)) var(--mid-at), rgba(${r}, ${g}, ${b}, 0) var(--fade)), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.21) 100%)`;
}

/** Wider, softer bloom tuned for the tall mobile hero card. */
const mobileHeroGradientFollow: GradientFollowConfig = {
  gx: 50,
  gy: 82,
  grx: 130,
  gry: 48,
  core: 8,
  mid: 0.42,
  midAt: 42,
  fade: 78,
  rangeX: 22,
  rangeY: 14,
  // Core stop grows 40% less than the shared 0.5 hover boost.
  coreBoost: 0.3,
};

function HeroCopy({
  title,
  body,
  titleClassName = "",
  bodyClassName,
  align = "left",
  typeKey,
}: {
  title: string;
  body: string;
  titleClassName?: string;
  bodyClassName?: string;
  align?: "left" | "center";
  typeKey: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 min-[1024px]:gap-7 ${centered ? "items-center text-center" : ""}`}
    >
      <div
        className={`flex flex-col gap-2 min-[1024px]:gap-4 ${centered ? "items-center" : ""}`}
      >
        <TypeIn
          key={typeKey}
          text="The Latest Games"
          className={`font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-[#fff645] uppercase [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)] ${centered ? "text-center" : ""}`}
        />
        <h1
          className={`type-h1 capitalize text-white ${titleClassName}`}
          style={{ textShadow: TEXT_SHADOW }}
        >
          {title}
        </h1>
      </div>
      <p className={`type-p1 text-pretty text-white ${bodyClassName ?? ""}`}>
        {body}
      </p>
    </div>
  );
}

function HeroBackdrop({
  cardRef,
  gradientRef,
  onPointerMove,
  onPointerLeave,
  className,
  gradientConfig = heroGradientFollow,
  bloom,
  video,
  children,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  gradientRef: React.RefObject<HTMLDivElement | null>;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  className: string;
  gradientConfig?: GradientFollowConfig;
  bloom: string;
  video: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      // Outward black ring masks the light fringe from ScaleFrame’s
      // transform:scale antialiasing on the rounded clip edge.
      className={`bg-black shadow-[0_0_0_4px_#000] ${className}`}
    >
      {/* Machine art is LCP; video waits for idle so it doesn’t contend on first paint. */}
      <LazyVideo
        key={video}
        defer
        src={video}
        className="absolute -inset-10 h-[calc(100%+80px)] w-[calc(100%+80px)] max-w-none object-cover"
      />
      <div
        ref={gradientRef}
        className="pointer-events-none absolute -inset-4 isolate backdrop-blur-[8px]"
        style={{
          backgroundImage: bloomGradient(bloom),
          ...gradientFollowVars(gradientConfig),
        }}
      >
        <GradientNoise />
      </div>
      {children}
    </div>
  );
}

function HeroPager({
  active,
  onSelect,
  orientation,
}: {
  active: number;
  onSelect: (index: number) => void;
  orientation: "vertical" | "horizontal";
}) {
  const vertical = orientation === "vertical";

  return (
    <div
      className={
        vertical
          ? "flex w-[32px] flex-col items-center"
          : "flex items-center justify-center"
      }
      role="tablist"
      aria-label="Featured machines"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.label}
          className={
            vertical
              ? "flex w-full flex-col items-center"
              : "flex items-center"
          }
        >
          {index > 0 ? (
            <span
              aria-hidden
              className={
                vertical
                  ? "h-5 w-px shrink-0 bg-[rgba(215,215,215,0.75)]"
                  : "h-px w-7 shrink-0 bg-[rgba(215,215,215,0.75)]"
              }
            />
          ) : null}
          <PageNumber
            active={active === index}
            onClick={() => onSelect(index)}
            aria-label={`Featured machine ${slide.label}`}
          >
            {slide.label}
          </PageNumber>
        </div>
      ))}
    </div>
  );
}

function MobileMachineSlot({ src }: { src: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [roomy, setRoomy] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    const wrap = imgWrapRef.current;
    if (!slot || !wrap) return;

    const sync = () => {
      const img = wrap.querySelector("img");
      if (!img || img.naturalWidth === 0) return;
      const displayHeight =
        (slot.clientWidth * MACHINE_WIDTH * img.naturalHeight) / img.naturalWidth;
      // Full machine visible → even space above/below; otherwise keep 20px and crop.
      setRoomy(displayHeight <= slot.clientHeight + 0.5);
    };

    sync();
    const img = wrap.querySelector("img");
    img?.addEventListener("load", sync);
    const observer = new ResizeObserver(sync);
    observer.observe(slot);
    return () => {
      img?.removeEventListener("load", sync);
      observer.disconnect();
    };
  }, [src]);

  return (
    <div
      ref={slotRef}
      className={
        roomy
          ? "relative z-10 flex min-h-0 w-full flex-1 flex-col justify-evenly overflow-hidden"
          : "relative z-10 flex min-h-0 w-full flex-1 flex-col justify-start overflow-hidden pt-5"
      }
    >
      <div ref={imgWrapRef} className="w-full shrink-0">
        <LazyImage
          key={src}
          priority
          alt=""
          src={src}
          className="pointer-events-none block h-auto w-[140%] max-w-none -translate-x-[14.3%]"
          // 140% of the 412 design frame → scales with ScaleFrame.
          sizes="(max-width: 1023px) 140vw, 71vw"
          quality={90}
          loadedFilter={MACHINE_SHADOW}
        />
      </div>
    </div>
  );
}

function HeroShell({
  desktop,
  children,
}: {
  desktop: boolean;
  children: React.ReactNode;
}) {
  if (desktop) {
    return (
      <div
        className="relative w-[1440px]"
        style={{ height: "min(900px, calc(var(--ace-vh-design, 900) * 1px))" }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-5 px-2.5 pt-2.5"
      style={{ height: "calc(var(--ace-vh-design, 800) * 1px)" }}
    >
      {children}
    </div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const [desktopCompact, setDesktopCompact] = useState(false);
  const [compactMachineLeft, setCompactMachineLeft] = useState<number | null>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const glow = useGradientFollow(
    desktop === false ? mobileHeroGradientFollow : heroGradientFollow,
  );
  const slide = slides[active] ?? slides[0];
  const art = slide.art;

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MQ);
    const sync = () => setDesktop(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!desktop) {
      setDesktopCompact(false);
      setCompactMachineLeft(null);
      return;
    }

    const card = glow.cardRef.current;
    if (!card) return;

    const sync = () => {
      const compact = card.clientHeight < DESKTOP_CARD_H - 0.5;
      setDesktopCompact(compact);
      const copy = copyRef.current;
      if (!compact || !copy) {
        setCompactMachineLeft(null);
        return;
      }
      // Center on the rendered words, not the wider copy box.
      const range = document.createRange();
      let edge = 0;
      copy.querySelectorAll("h1, p").forEach((node) => {
        range.selectNodeContents(node);
        edge = Math.max(edge, range.getBoundingClientRect().right);
      });
      const cardBox = card.getBoundingClientRect();
      // ScaleFrame uses transform: scale, so rects and layout px differ.
      const scale = cardBox.width / card.clientWidth || 1;
      const copyRight = (edge - cardBox.left) / scale;
      const frameH = card.clientHeight * (MACHINE_FRAME.height / DESKTOP_CARD_H);
      const frameW = frameH * (MACHINE_FRAME.width / MACHINE_FRAME.height);
      // Art box size in card px (scaled with the frame).
      const artW = frameW * (art.width / MACHINE_FRAME.width);
      const artLeftInFrame = frameW * (art.left / MACHINE_FRAME.width);
      const boxLeft = copyRight + (card.clientWidth - copyRight - artW) / 2;
      // compactMachineLeft is the FRAME left that keeps art visually centered.
      setCompactMachineLeft(
        boxLeft - artLeftInFrame + (0.5 - art.visualCenter) * artW,
      );
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(card);
    const copy = copyRef.current;
    if (copy) observer.observe(copy);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) sync();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [desktop, glow.cardRef, art, slide.title, slide.body]);

  return (
    <section className="w-[412px] bg-black min-[1024px]:w-[1440px]">
      {desktop === null ? (
        <>
          {/* Reserve layout before matchMedia so only one hero tree mounts. */}
          <div
            className="hidden w-[1440px] min-[1024px]:block"
            style={{ height: "min(900px, calc(var(--ace-vh-design, 900) * 1px))" }}
            aria-hidden
          />
          <div
            className="min-[1024px]:hidden"
            style={{ height: "calc(var(--ace-vh-design, 800) * 1px)" }}
            aria-hidden
          />
        </>
      ) : desktop ? (
        <HeroShell desktop>
          <HeroBackdrop
            cardRef={glow.cardRef}
            gradientRef={glow.gradientRef}
            onPointerMove={glow.onPointerMove}
            onPointerLeave={glow.onPointerLeave}
            bloom={slide.bloom}
            video={slide.video}
            className="absolute inset-5 overflow-hidden rounded-[16px]"
          >
            {/* Shared Figma slot: Frame 2147238782 */}
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={
                desktopCompact && compactMachineLeft != null
                  ? {
                      left: compactMachineLeft,
                      top: `${(MACHINE_FRAME.top / DESKTOP_CARD_H) * 100}%`,
                      height: `${(MACHINE_FRAME.height / DESKTOP_CARD_H) * 100}%`,
                      aspectRatio: `${MACHINE_FRAME.width} / ${MACHINE_FRAME.height}`,
                    }
                  : {
                      left: MACHINE_FRAME.left,
                      top: `${(MACHINE_FRAME.top / DESKTOP_CARD_H) * 100}%`,
                      height: `${(MACHINE_FRAME.height / DESKTOP_CARD_H) * 100}%`,
                      aspectRatio: `${MACHINE_FRAME.width} / ${MACHINE_FRAME.height}`,
                    }
              }
            >
              <div
                className="absolute"
                style={{
                  left: `${(art.left / MACHINE_FRAME.width) * 100}%`,
                  top: `${(art.top / MACHINE_FRAME.height) * 100}%`,
                  width: `${(art.width / MACHINE_FRAME.width) * 100}%`,
                  height: `${(art.height / MACHINE_FRAME.height) * 100}%`,
                }}
              >
                <LazyImage
                  key={slide.machine}
                  priority
                  fill
                  alt=""
                  src={slide.machine}
                  className="object-contain"
                  sizes="(max-width: 1023px) 140vw, 71vw"
                  quality={90}
                  loadedFilter={MACHINE_SHADOW}
                />
              </div>
            </div>

            <div
              ref={copyRef}
              className={
                desktopCompact
                  ? "absolute top-1/2 left-0 z-10 flex w-[664.711px] -translate-y-1/2 flex-col gap-10 px-5"
                  : "absolute top-[271.5px] left-0 z-10 flex w-[664.711px] flex-col gap-10 px-5"
              }
            >
              <HeroCopy
                typeKey={slide.label}
                title={slide.title}
                body={slide.body}
                titleClassName="w-[624.711px]"
                bodyClassName="max-w-[420px]"
              />
              <PrimaryButton href="#products" color="gray">
                View Machine
              </PrimaryButton>
            </div>
          </HeroBackdrop>

          <div className="absolute top-1/2 left-[1328px] flex w-[112px] -translate-y-1/2 justify-center">
            <HeroPager active={active} onSelect={setActive} orientation="vertical" />
          </div>
        </HeroShell>
      ) : (
        <HeroShell desktop={false}>
          <HeroBackdrop
            cardRef={glow.cardRef}
            gradientRef={glow.gradientRef}
            onPointerMove={glow.onPointerMove}
            onPointerLeave={glow.onPointerLeave}
            bloom={slide.bloom}
            video={slide.video}
            gradientConfig={mobileHeroGradientFollow}
            className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[16px] pt-2.5"
          >
            <div className="relative z-10 flex w-full shrink-0 flex-col gap-5 px-2.5 pt-10">
              <HeroCopy
                typeKey={slide.label}
                title={slide.title}
                body={slide.body}
                align="center"
              />
              <PrimaryButton href="#products" color="gray" className="w-full">
                View Machine
              </PrimaryButton>
            </div>

            <MobileMachineSlot src={slide.machine} />
          </HeroBackdrop>

          <HeroPager active={active} onSelect={setActive} orientation="horizontal" />
        </HeroShell>
      )}

      <Marquee />
    </section>
  );
}
