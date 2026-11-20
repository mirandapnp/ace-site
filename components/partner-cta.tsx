"use client";

import { useEffect, useRef, useState } from "react";
import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { media } from "@/lib/media";

const metaType =
  "font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] uppercase";

function TypeIn({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }

    let index = 0;
    setShown("");
    const tick = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(tick);
    }, 48);

    return () => window.clearInterval(tick);
  }, [started, text]);

  const typing = shown.length > 0 && shown.length < text.length;

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{shown}</span>
      {typing ? (
        <span
          aria-hidden
          className="ace-blink ml-[0.1em] inline-block h-[1em] w-[0.55em] bg-current align-[-0.1em]"
        />
      ) : null}
    </p>
  );
}

export function PartnerCta({
  eyebrow = "Ready to level up?",
  signal = "Let’s Partner Up",
  title = (
    <>
      Upgrade Your
      <br />
      Arcade Floor Today
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
  return (
    <section className="w-[1440px] px-5 pt-5" aria-labelledby="partner-cta-heading">
      <div className="relative flex h-[640px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-5 py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <LazyImage
              alt=""
              src={media(image)}
              className="absolute top-[-22.93%] left-0 h-[145.85%] w-full max-w-none"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(178.02deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 45.55%, rgba(54, 245, 146, 0.25) 89.19%), linear-gradient(90deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
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

        <div className="relative flex flex-col items-start gap-10">
          <div className="flex flex-col gap-4 text-white">
            <h2
              id="partner-cta-heading"
              className="font-display text-[54px] leading-[1.1] font-medium tracking-[-1.755px] whitespace-pre"
            >
              {title}
            </h2>
            <p className="font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] whitespace-nowrap">
              {body}
            </p>
          </div>
          <PrimaryButton href={href}>{action}</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
