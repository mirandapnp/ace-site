"use client";

import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { TypeIn } from "@/components/type-in";
import { media } from "@/lib/media";
import { useCtaGradientRise } from "@/lib/use-gradient-follow";

const metaType =
  "font-mono text-[12px] leading-[1.25] font-[475] tracking-[0.07px] uppercase min-[1024px]:text-[14px]";

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
  const glow = useCtaGradientRise({ rest: 35, hover: 45 });

  return (
    <section
      className="w-[412px] px-2.5 py-2.5 min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:py-5"
      aria-labelledby="partner-cta-heading"
    >
      <div
        ref={glow.cardRef}
        onPointerMove={glow.onPointerMove}
        onPointerLeave={glow.onPointerLeave}
        className="relative flex h-[640px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-2.5 pt-5 pb-2.5 min-[1024px]:px-5 min-[1024px]:py-7"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <LazyImage
              alt=""
              src={media(image)}
              className="absolute inset-0 size-full max-w-none object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[rgba(20,20,20,0.5)]" />
          <LazyImage
            alt=""
            src={media("/ace/partner-cta-overlay.webp")}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            ref={glow.gradientRef}
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 110% var(--peak, 41%) at var(--px, 50%) 100%, rgba(54, 245, 146, var(--peak-a, 0)) 0%, rgba(54, 245, 146, calc(var(--peak-a, 0) * 0.45)) 50%, rgba(54, 245, 146, 0) 85%)",
            }}
          />
        </div>

        <div className="relative flex items-center justify-between">
          <TypeIn text={eyebrow} className={`${metaType} text-[#FFF645]`} />
          <p className={`flex items-center gap-2.5 ${metaType} text-[#36F592]`}>
            <span aria-hidden className="ace-blink size-1.5 shrink-0 bg-[#36F592]" />
            <span>{signal}</span>
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-10 text-center min-[1024px]:items-start min-[1024px]:text-left">
          <div className="flex flex-col gap-4 text-white">
            <h2
              id="partner-cta-heading"
              className="type-h2"
            >
              {title}
            </h2>
            <p className="font-sans text-[14px] leading-[1.5] font-[475] tracking-[0.175px] text-pretty min-[1024px]:whitespace-nowrap">
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
