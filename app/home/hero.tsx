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

const slides = ["01", "02", "03"] as const;
const MACHINE_WIDTH = 1.4;
const DESKTOP_MQ = "(min-width: 1024px)";

/** Desktop hero card design height — below this, copy centers vertically. */
const DESKTOP_CARD_H = 860;
/** Machine in the 1400×860 card — right-anchored % size so it keeps place and eases off the copy when short. */
const DESKTOP_MACHINE = {
  right: 1400 - 338.94 - 1014.01,
  topPct: (58.17 / DESKTOP_CARD_H) * 100,
  sizePct: (1014.01 / DESKTOP_CARD_H) * 100,
} as const;

/** text shadow — h1 */
const TEXT_SHADOW = "0px 3px 20px rgba(0, 0, 0, 0.4)";
/** machine shadow — follows machine alpha, not the square frame */
const MACHINE_SHADOW = "drop-shadow(5px 10px 32px rgba(0, 0, 0, 0.25))";

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
  titleClassName = "",
  bodyClassName,
  align = "left",
}: {
  titleClassName?: string;
  bodyClassName?: string;
  align?: "left" | "center";
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
          text="The Latest Games"
          className={`font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-[#fff645] uppercase [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)] ${centered ? "text-center" : ""}`}
        />
        <h1
          className={`type-h1 capitalize text-white ${titleClassName}`}
          style={{ textShadow: TEXT_SHADOW }}
        >
          Cold Trigger
        </h1>
      </div>
      <p
        className={`type-p1 text-pretty text-white ${bodyClassName ?? ""}`}
      >
        Lock in for explosive 4-player co-op action in this tactical arcade
        shooter featuring swivel-mounted weapons and dual-screen combat.
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
  children,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  gradientRef: React.RefObject<HTMLDivElement | null>;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  className: string;
  gradientConfig?: GradientFollowConfig;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
    >
      {/* Machine art is LCP; video waits for idle so it doesn’t contend on first paint. */}
      <LazyVideo
        defer
        src={media("/ace/hero.mp4?v=3")}
        className="absolute -inset-10 h-[calc(100%+80px)] w-[calc(100%+80px)] max-w-none object-cover"
      />
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 isolate backdrop-blur-[8px]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), #36F592 var(--core), rgba(54, 245, 146, var(--mid)) var(--mid-at), rgba(54, 245, 146, 0) var(--fade)), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.21) 100%)",
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
      {slides.map((label, index) => (
        <div
          key={label}
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
            aria-label={`Featured machine ${label}`}
          >
            {label}
          </PageNumber>
        </div>
      ))}
    </div>
  );
}

function MobileMachineSlot() {
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
  }, []);

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
          priority
          alt=""
          src="/ace/machine.webp"
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

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ);
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
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
      const machineW = card.clientHeight * (1014.01 / DESKTOP_CARD_H);
      // Cabinet art (marquee/screen) sits right of the square, so center that mass.
      const visualCenter = 0.68;
      const boxLeft = copyRight + (card.clientWidth - copyRight - machineW) / 2;
      setCompactMachineLeft(boxLeft + (0.5 - visualCenter) * machineW);
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
  }, [desktop, glow.cardRef]);

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
            className="absolute inset-5 overflow-hidden rounded-[16px]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={
                desktopCompact && compactMachineLeft != null
                  ? {
                      left: compactMachineLeft,
                      top: `${DESKTOP_MACHINE.topPct}%`,
                      height: `${DESKTOP_MACHINE.sizePct}%`,
                      aspectRatio: "1 / 1",
                    }
                  : {
                      right: DESKTOP_MACHINE.right,
                      top: `${DESKTOP_MACHINE.topPct}%`,
                      height: `${DESKTOP_MACHINE.sizePct}%`,
                      aspectRatio: "1 / 1",
                    }
              }
            >
              <LazyImage
                priority
                fill
                alt=""
                src="/ace/machine.webp"
                className="object-contain"
                // ~1014/1440 of the design frame; vw tracks ScaleFrame on large screens.
                sizes="(max-width: 1023px) 140vw, 71vw"
                quality={90}
                loadedFilter={MACHINE_SHADOW}
              />
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
                titleClassName="w-[624.711px]"
                bodyClassName="w-[495.54px]"
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
            gradientConfig={mobileHeroGradientFollow}
            className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[16px] pt-2.5"
          >
            <div className="relative z-10 flex w-full shrink-0 flex-col gap-5 px-2.5 pt-10">
              <HeroCopy align="center" />
              <PrimaryButton href="#products" color="gray" className="w-full">
                View Machine
              </PrimaryButton>
            </div>

            <MobileMachineSlot />
          </HeroBackdrop>

          <HeroPager active={active} onSelect={setActive} orientation="horizontal" />
        </HeroShell>
      )}

      <Marquee />
    </section>
  );
}
