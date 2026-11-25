"use client";

import { useEffect, useState } from "react";
import { GradientNoise } from "@/components/gradient-noise";
import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { TypeIn } from "@/components/type-in";
import {
  gradientFollowVars,
  partnerCtaGradientFollow,
  partnerCtaGradientFollowMobile,
  useGradientFollow,
} from "@/lib/use-gradient-follow";

const metaType =
  "font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] uppercase min-[1024px]:text-[14px] min-[1024px]:font-[475] min-[1024px]:tracking-[0.07px]";

/** text shadow — footer heading */
const TEXT_SHADOW = "0px 3px 20px rgba(0, 0, 0, 0.4)";

const green = "54, 245, 146";

export function PartnerCta({
  eyebrow = "Ready to level up?",
  signal = "Let’s Partner Up",
  title = (
    <>
      Upgrade Your
      <br />
      Arcade Floor
      <br className="min-[1024px]:hidden" />
      <span className="hidden min-[1024px]:inline"> </span>
      Today
    </>
  ),
  body = "Contact us for pricing, shipping details, and availability on our top-earning machines.",
  action = "Start a conversation",
  href = "#contact",
  image = "/ace/partner-cta.webp",
}: {
  eyebrow?: string;
  signal?: string;
  title?: React.ReactNode;
  body?: string;
  action?: string;
  href?: string;
  image?: string;
}) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const follow = mobile ? partnerCtaGradientFollowMobile : partnerCtaGradientFollow;
  const glow = useGradientFollow(follow, {
    followEase: 0.12,
    leaveEase: 0.045,
  });

  return (
    <section
      className="ace-below-fold w-[412px] px-2.5 py-2.5 min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:py-5"
      aria-labelledby="partner-cta-heading"
    >
      <div
        ref={glow.cardRef}
        onPointerMove={glow.onPointerMove}
        onPointerLeave={glow.onPointerLeave}
        className="relative flex h-[600px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-2.5 pt-5 pb-2.5 min-[1024px]:h-[700px] min-[1024px]:px-5 min-[1024px]:py-7"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden rounded-[16px]">
            <div className="absolute top-[-17.24%] left-0 h-[117.24%] w-[269.15%] min-[1024px]:top-[-31.19%] min-[1024px]:h-[143.49%] min-[1024px]:w-[107.6%]">
              <LazyImage
                fill
                alt=""
                src={image}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)",
            }}
          />
          <div
            ref={glow.gradientRef}
            className="absolute inset-0 isolate"
            style={{
              backgroundImage: `radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), rgba(${green}, 0.6) var(--core), rgba(${green}, 0) var(--fade))`,
              ...gradientFollowVars(follow),
            }}
          >
            <GradientNoise />
          </div>
        </div>

        <div className="relative flex items-center justify-between">
          <TypeIn text={eyebrow} className={`${metaType} text-[#FFF645]`} />
          <p className={`flex items-center gap-2.5 ${metaType} text-[#36F592]`}>
            <span aria-hidden className="ace-blink size-1.5 shrink-0 bg-[#36F592]" />
            <span>{signal}</span>
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col justify-between min-[1024px]:flex-none min-[1024px]:gap-10">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-white min-[1024px]:flex-none min-[1024px]:items-start min-[1024px]:justify-start min-[1024px]:text-left">
            <h2
              id="partner-cta-heading"
              className="type-h2 capitalize min-[1024px]:normal-case"
              style={{ textShadow: TEXT_SHADOW }}
            >
              {title}
            </h2>
            <p className="type-p1-responsive text-pretty min-[1024px]:whitespace-nowrap">
              {body}
            </p>
          </div>
          <PrimaryButton href={href} className="w-full min-[1024px]:w-fit">
            {action}
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
