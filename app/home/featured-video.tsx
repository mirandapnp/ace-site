"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/components/lazy-visual";
import { PlayButtonFace } from "@/components/play-button";
import { SecondaryButton } from "@/components/secondary-button";
import { featuredVideo } from "@/content/featured-video";
import { media } from "@/lib/media";

export function FeaturedVideo() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const [titleLine, titleRest] = featuredVideo.title.split("\n");

  return (
    <section className="w-[1440px] px-5 py-5" aria-labelledby={titleId}>
      <div className="relative w-full">
        <div className="relative z-0 h-[540px] w-[880px]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group absolute inset-0 size-full overflow-hidden rounded-[16px] text-left"
            aria-label="Play featured video"
          >
            <LazyImage
              alt=""
              src={media(featuredVideo.thumbnail)}
              className="absolute inset-0 size-full object-cover"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[rgba(31,31,31,0.1)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 backdrop-blur-[4px] transition-opacity duration-[350ms] ease-out group-hover:opacity-100 motion-reduce:transition-none"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayButtonFace />
            </span>
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 z-10 w-[560px] shadow-[-6px_2px_24px_rgba(0,0,0,0.2)]">
          <div className="flex size-full flex-col overflow-hidden rounded-[16px] bg-[#EC268E] p-5">
            <p className="font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-black uppercase">
              {featuredVideo.eyebrow}
            </p>
            <div className="mt-5 flex min-h-0 flex-1 flex-col justify-between">
              <div className="flex flex-col gap-5">
                <h2
                  id={titleId}
                  className="font-display text-[32px] leading-[1.25] font-medium tracking-[-0.96px] text-black capitalize"
                >
                  {titleLine}
                  <br />
                  {titleRest}
                </h2>
                <p className="font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty text-black">
                  {featuredVideo.body}
                </p>
              </div>
              <div className="flex items-start gap-5">
                <SecondaryButton href={featuredVideo.productHref} color="black">
                  View product
                </SecondaryButton>
                <SecondaryButton
                  href={featuredVideo.channelHref}
                  color="outline"
                  arrow={false}
                  external
                >
                  Explore all videos
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <VideoLightbox
          youtubeId={featuredVideo.youtubeId}
          title={featuredVideo.title.replace("\n", " ")}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </section>
  );
}

function VideoLightbox({
  youtubeId,
  title,
  onClose,
}: {
  youtubeId: string;
  title: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    setMounted(true);
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function requestClose() {
    if (reducedMotion.current) {
      onClose();
      return;
    }
    setVisible(false);
  }

  useEffect(() => {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (reducedMotion.current) onClose();
      else setVisible(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function onFadeEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (!visible) onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-[8px] transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={requestClose}
      onTransitionEnd={onFadeEnd}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full border border-[rgba(215,215,215,0.75)] bg-[rgba(78,78,78,0.5)] text-white"
        aria-label="Close video"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        className="aspect-video w-full max-w-[1120px] overflow-hidden rounded-[16px] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="size-full border-0"
        />
      </div>
    </div>,
    document.body,
  );
}
