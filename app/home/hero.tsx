"use client";

import { useEffect, useRef, useState } from "react";
import { LazyImage, LazyVideo } from "@/components/lazy-visual";
import { Marquee } from "@/components/marquee";
import { PageNumber } from "@/components/page-number";
import { PrimaryButton } from "@/components/primary-button";
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
};

function HeroCopy({
  titleClassName,
  bodyClassName,
  align = "left",
}: {
  titleClassName: string;
  bodyClassName?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-5 min-[960px]:gap-7 ${centered ? "items-center text-center" : ""}`}
    >
      <div
        className={`flex flex-col gap-2 min-[960px]:gap-4 ${centered ? "items-center" : ""}`}
      >
        <TypeIn
          text="The Latest Games"
          className={`font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-[#fff645] uppercase [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)] ${centered ? "text-center" : ""}`}
        />
        <h1
          className={`font-display font-medium capitalize text-white [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)] ${titleClassName}`}
        >
          Cold Trigger
        </h1>
      </div>
      <p
        className={`font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty text-white ${bodyClassName ?? ""}`}
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
      <LazyVideo
        priority
        src={media("/ace/hero.mp4?v=3")}
        className="absolute -inset-10 h-[calc(100%+80px)] w-[calc(100%+80px)] max-w-none object-cover"
      />
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 backdrop-blur-[8px]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), #36F592 var(--core), rgba(54, 245, 146, var(--mid)) var(--mid-at), rgba(54, 245, 146, 0) var(--fade)), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.21) 100%)",
          ...gradientFollowVars(gradientConfig),
        }}
      />
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
          src={media("/ace/machine.webp?v=6")}
          className="pointer-events-none block h-auto w-[140%] max-w-none -translate-x-[14.3%]"
        />
      </div>
    </div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const desktopGlow = useGradientFollow(heroGradientFollow);
  const mobileGlow = useGradientFollow(mobileHeroGradientFollow);

  return (
    <section className="w-[412px] bg-black min-[960px]:w-[1440px]">
      {/* Desktop */}
      <div className="relative hidden h-[900px] w-[1440px] min-[960px]:block">
        <HeroBackdrop
          cardRef={desktopGlow.cardRef}
          gradientRef={desktopGlow.gradientRef}
          onPointerMove={desktopGlow.onPointerMove}
          onPointerLeave={desktopGlow.onPointerLeave}
          className="absolute top-5 left-5 h-[860px] w-[1400px] overflow-hidden rounded-[16px]"
        >
          <LazyImage
            priority
            alt=""
            src={media("/ace/machine.webp?v=6")}
            className="pointer-events-none absolute top-[58.17px] left-[338.94px] h-[1014.01px] w-[1014.03px] max-w-none"
          />

          <div className="absolute top-[271.5px] left-0 flex w-[664.711px] flex-col gap-10 px-5">
            <HeroCopy
              titleClassName="w-[624.711px] text-[76px] leading-[0.9] tracking-[-2.28px]"
              bodyClassName="w-[495.54px]"
            />
            <PrimaryButton href="#products" color="gray">
              View Machine
            </PrimaryButton>
          </div>
        </HeroBackdrop>

        <div className="absolute top-[382px] left-[1328px] flex w-[112px] justify-center">
          <HeroPager active={active} onSelect={setActive} orientation="vertical" />
        </div>
      </div>

      {/* Mobile — slider + numbers fill 100vh in design space */}
      <div
        className="flex flex-col items-center gap-5 px-2.5 pt-2.5 min-[960px]:hidden"
        style={{ height: "calc(100dvh * 412px / 100cqw)" }}
      >
        <HeroBackdrop
          cardRef={mobileGlow.cardRef}
          gradientRef={mobileGlow.gradientRef}
          onPointerMove={mobileGlow.onPointerMove}
          onPointerLeave={mobileGlow.onPointerLeave}
          gradientConfig={mobileHeroGradientFollow}
          className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[16px] pt-2.5"
        >
          <div className="relative z-10 flex w-full shrink-0 flex-col gap-5 px-2.5 pt-10">
            <HeroCopy
              align="center"
              titleClassName="text-[40px] leading-none tracking-[-1px]"
            />
            <PrimaryButton href="#products" color="gray" className="w-full">
              View Machine
            </PrimaryButton>
          </div>

          <MobileMachineSlot />
        </HeroBackdrop>

        <HeroPager active={active} onSelect={setActive} orientation="horizontal" />
      </div>

      <Marquee />
    </section>
  );
}
