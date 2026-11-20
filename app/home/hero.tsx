"use client";

import { useState } from "react";
import { LazyImage, LazyVideo } from "@/components/lazy-visual";
import { Marquee } from "@/components/marquee";
import { PageNumber } from "@/components/page-number";
import { PrimaryButton } from "@/components/primary-button";
import { TypeIn } from "@/components/type-in";
import { media } from "@/lib/media";
import {
  gradientFollowVars,
  heroGradientFollow,
  useGradientFollow,
} from "@/lib/use-gradient-follow";

const slides = ["01", "02", "03"] as const;

export function Hero() {
  const [active, setActive] = useState(0);
  const glow = useGradientFollow(heroGradientFollow);

  return (
    <section className="w-[1440px] bg-black">
      <div className="relative h-[900px] w-[1440px]">
        <div
          ref={glow.cardRef}
          onPointerMove={glow.onPointerMove}
          onPointerLeave={glow.onPointerLeave}
          className="absolute top-5 left-5 h-[860px] w-[1400px] overflow-hidden rounded-[16px]"
        >
          <LazyVideo
            priority
            src={media("/ace/hero.mp4?v=3")}
            className="absolute -inset-10 h-[calc(100%+80px)] w-[calc(100%+80px)] max-w-none object-cover"
          />
          <div
            ref={glow.gradientRef}
            className="pointer-events-none absolute inset-0 backdrop-blur-[8px]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), #36F592 var(--core), rgba(54, 245, 146, var(--mid)) var(--mid-at), rgba(54, 245, 146, 0) var(--fade)), linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.21) 100%)",
              ...gradientFollowVars(heroGradientFollow),
            }}
          />
          <LazyImage
            priority
            alt=""
            src={media("/ace/machine.webp?v=6")}
            className="pointer-events-none absolute top-[58.17px] left-[338.94px] h-[1014.01px] w-[1014.03px] max-w-none"
          />

          <div className="absolute top-[271.5px] left-0 flex w-[664.711px] flex-col gap-10 px-5">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <TypeIn
                  text="The Latest Games"
                  className="font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-[#fff645] uppercase [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)]"
                />
                <h1 className="w-[624.711px] font-display text-[76px] leading-[0.9] font-medium tracking-[-2.28px] text-white capitalize [text-shadow:0px_3px_14px_rgba(0,0,0,0.5)]">
                  Cold Trigger
                </h1>
              </div>
              <p className="w-[495.54px] font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty text-white">
                Lock in for explosive 4-player co-op action in this tactical
                arcade shooter featuring swivel-mounted weapons and dual-screen
                combat.
              </p>
            </div>
            <PrimaryButton href="#products" color="gray">
              View Machine
            </PrimaryButton>
          </div>
        </div>

        <div className="absolute top-[382px] left-[1328px] flex w-[112px] justify-center">
          <div className="flex w-8 flex-col items-center" role="tablist" aria-label="Featured machines">
            {slides.map((label, index) => (
              <div key={label} className="flex w-full flex-col items-center">
                {index > 0 ? (
                  <span
                    aria-hidden
                    className="h-5 w-px shrink-0 bg-[rgba(215,215,215,0.75)]"
                  />
                ) : null}
                <PageNumber
                  active={active === index}
                  onClick={() => setActive(index)}
                  aria-label={`Featured machine ${label}`}
                >
                  {label}
                </PageNumber>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Marquee />
    </section>
  );
}
