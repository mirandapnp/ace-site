"use client";

import { useEffect, useRef, useState } from "react";
import { LazyImage, LazyVideo } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { TypeIn } from "@/components/type-in";
import { media } from "@/lib/media";

const slides = ["01", "02", "03"] as const;

const ticker = [
  "Global Arcade Logistics",
  "Rapid ROI",
  "Global Arcade Logistics",
  "Zero-Downtime Engineering",
  "Rapid ROI",
  "Global Arcade Logistics",
  "Zero-Downtime Engineering",
];

export function Hero() {
  const [active, setActive] = useState(0);
  const glow = useGradientFollow();

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
              ["--gx" as string]: "63.4%",
              ["--gy" as string]: "85.5%",
              ["--grx" as string]: "77.31%",
              ["--gry" as string]: "79.56%",
              ["--core" as string]: "5.6%",
              ["--mid" as string]: "0.5",
              ["--mid-at" as string]: "37%",
              ["--fade" as string]: "69.11%",
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

        <div className="absolute top-[394px] left-[1328px] flex w-[112px] justify-center">
          <div className="flex w-10 flex-col items-center" role="tablist" aria-label="Featured machines">
            {slides.map((label, index) => (
              <div key={label} className="flex w-full flex-col items-center">
                {index > 0 ? (
                  <span
                    aria-hidden
                    className="h-10 w-0.5 shrink-0 bg-[rgba(215,215,215,0.75)]"
                  />
                ) : null}
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  onClick={() => setActive(index)}
                  className={
                    active === index
                      ? "flex size-10 items-center justify-center rounded-[8px] border border-[#fff645] bg-[rgba(78,78,78,0.75)] font-mono text-[12px] leading-[1.25] font-[470] tracking-[0.78px] text-[#fff645] uppercase"
                      : "flex size-10 items-center justify-center rounded-[8px] border border-[rgba(215,215,215,0.75)] bg-[rgba(78,78,78,0.5)] font-mono text-[12px] leading-[1.25] font-[470] tracking-[0.78px] text-white uppercase"
                  }
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[35px] overflow-hidden" aria-label="Global Arcade Logistics, Rapid ROI, Zero-Downtime Engineering">
        <style>{`
          @keyframes ace-ticker {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
          .ace-ticker { animation: ace-ticker 100s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .ace-ticker { animation: none; }
          }
        `}</style>
        <div className="ace-ticker flex w-max items-end">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-start gap-7 py-[10px] pr-7 font-mono text-[12px] leading-[1.25] font-[470] tracking-[0.78px] whitespace-nowrap text-white uppercase"
            >
              {ticker.map((item, index) => (
                <span key={`${copy}-${index}`} className="flex gap-7">
                  <span>{item}</span>
                  <span aria-hidden>/</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function useGradientFollow() {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hoverTarget = useRef(0);
  const hover = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.16;
      current.current.y += (target.current.y - current.current.y) * 0.16;
      hover.current += (hoverTarget.current - hover.current) * 0.16;
      const node = gradientRef.current;
      if (node) {
        const scale = 1 + hover.current * 0.03;
        const h = hover.current;
        node.style.setProperty("--gx", `${63.4 + current.current.x * 26}%`);
        node.style.setProperty("--gy", `${85.5 + current.current.y * 18}%`);
        node.style.setProperty("--grx", `${77.31 * scale}%`);
        node.style.setProperty("--gry", `${79.56 * scale}%`);
        node.style.setProperty("--core", `${5.6 + h * 0.5}%`);
        node.style.setProperty("--mid", `${0.5 - h * 0.16}`);
        node.style.setProperty("--mid-at", `${37 + h * 8}%`);
        node.style.setProperty("--fade", `${69.11 + h * 11}%`);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    hoverTarget.current = 1;
    const rect = card.getBoundingClientRect();
    target.current.x = (event.clientX - rect.left) / rect.width - 0.5;
    target.current.y = (event.clientY - rect.top) / rect.height - 0.5;
  }

  function onPointerLeave() {
    hoverTarget.current = 0;
    target.current.x = 0;
    target.current.y = 0;
  }

  return { cardRef, gradientRef, onPointerMove, onPointerLeave };
}
