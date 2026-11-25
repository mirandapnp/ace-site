"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSelect } from "@/components/language-select";
import { NavItem } from "@/components/nav-item";
import { SearchButton } from "@/components/search-button";
import { SecondaryButton } from "@/components/secondary-button";
import { useAceMetrics } from "@/components/scale-frame";
import { media } from "@/lib/media";

const links = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#products", label: "Products" },
] as const;

/** Ignore tiny scroll jitter when deciding direction. */
const DIR_EPS = 4;
/** Treat near-top as the transparent default state. */
const TOP_EPS = 8;
/** Match slide duration — block reveal/chrome flip until dismiss finishes. */
const HIDE_MS = 350;

type NavChrome = "default" | "scrolled";

/**
 * Scrolled nav wash: black tint, faded with an eased parent mask. Layer bleeds
 * below the header so the hard box edge sits where the mask is already fully
 * transparent (avoids a crisp cutoff).
 */
const progressiveWashStyles = `
.ace-nav-wash {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* Bleed past the header foot — hard edge lives in the transparent zone */
  height: calc(100% + 56px);
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 18%,
    rgba(0, 0, 0, 0.85) 32%,
    rgba(0, 0, 0, 0.55) 48%,
    rgba(0, 0, 0, 0.28) 62%,
    rgba(0, 0, 0, 0.1) 76%,
    rgba(0, 0, 0, 0.03) 88%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 18%,
    rgba(0, 0, 0, 0.85) 32%,
    rgba(0, 0, 0, 0.55) 48%,
    rgba(0, 0, 0, 0.28) 62%,
    rgba(0, 0, 0, 0.1) 76%,
    rgba(0, 0, 0, 0.03) 88%,
    transparent 100%
  );
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
.ace-nav-wash__tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 28%,
    rgba(0, 0, 0, 0.22) 52%,
    rgba(0, 0, 0, 0.06) 72%,
    rgba(0, 0, 0, 0) 88%
  );
}
`;

function ProgressiveWash({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={[
        "ace-nav-wash pointer-events-none absolute inset-x-0 top-0 transition-opacity duration-[425ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div className="ace-nav-wash__tint" />
    </div>
  );
}

/**
 * Fixed to the viewport (outside ScaleFrame) so scroll never leaves a gap
 * above the bar. Inner chrome is laid out in design px and scaled to match
 * the page frame.
 */
export function Header() {
  const { scale, frameWidth } = useAceMetrics();
  const [chrome, setChrome] = useState<NavChrome>("default");
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const raf = useRef(0);
  const chromeRef = useRef<NavChrome>("default");
  const hiddenRef = useRef(false);
  /** Ignore scroll-up reveal until the dismiss slide has finished. */
  const revealAfter = useRef(0);

  useEffect(() => {
    const applyChrome = () => {
      raf.current = 0;
      const y = window.scrollY;
      const now = performance.now();

      let nextChrome = chromeRef.current;
      let nextHidden = hiddenRef.current;

      if (y <= TOP_EPS) {
        // Visible at top — chrome transitions (425ms) back to the simple look.
        nextChrome = "default";
        nextHidden = false;
        revealAfter.current = 0;
      } else if (y > lastY.current + DIR_EPS) {
        // Dismiss only — keep whatever chrome we had (simple on first dismiss).
        if (!hiddenRef.current) {
          revealAfter.current = now + HIDE_MS;
        }
        nextHidden = true;
      } else if (
        y < lastY.current - DIR_EPS &&
        hiddenRef.current &&
        now >= revealAfter.current
      ) {
        // Apply scrolled chrome while still hidden (transition runs off-screen),
        // then unhide on the next frame so the slide-in is already scrolled.
        if (chromeRef.current !== "scrolled") {
          chromeRef.current = "scrolled";
          setChrome("scrolled");
          lastY.current = y;
          requestAnimationFrame(() => {
            hiddenRef.current = false;
            setHidden(false);
          });
          return;
        }
        nextHidden = false;
      }

      lastY.current = y;

      if (nextChrome !== chromeRef.current) {
        chromeRef.current = nextChrome;
        setChrome(nextChrome);
      }
      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setHidden(nextHidden);
      }
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(applyChrome);
    };

    lastY.current = window.scrollY;
    applyChrome();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Overshoot + clip: -100% alone can leave a hairline of the solid bar
  // (subpixels / scaled chrome). Clip only while hidden so desktop wash can bleed.
  const hideClass = hidden
    ? "-translate-y-[calc(100%+24px)] pointer-events-none"
    : "translate-y-0";
  const slideClass =
    "transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0.15,0.6,0.85)] motion-reduce:transition-none";

  const mobileScrolled =
    chrome === "scrolled" ? "rounded-b-[16px] bg-black" : "";

  return (
    <>
      <style>{progressiveWashStyles}</style>
      <div
        className={`fixed top-0 left-0 z-50 w-full ${hidden ? "pointer-events-none overflow-hidden" : ""}`}
      >
        <div className={`w-full ${slideClass} ${hideClass}`}>
          <div
            className="origin-top-left"
            style={{
              width: frameWidth,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
          <header className="relative hidden w-full items-center justify-between p-5 min-[1024px]:flex">
            <ProgressiveWash visible={chrome === "scrolled"} />

            <a href="/" className="relative z-10 flex shrink-0 items-center gap-3">
              <span className="relative h-9 w-[50.594px] shrink-0 overflow-hidden">
                <img
                  alt=""
                  src={media("/ace/logo.webp")}
                  width={640}
                  height={155}
                  className="absolute top-0 left-0 h-full w-[294.09%] max-w-none"
                  decoding="async"
                  fetchPriority="high"
                />
              </span>
              <span
                className="text-[16px] leading-[0.9] font-medium tracking-[-0.48px] whitespace-nowrap text-white uppercase"
                style={{ fontFamily: "var(--font-gt-flexa), Arial, Helvetica, sans-serif" }}
              >
                Ace Amusement
              </span>
            </a>

            <div className="relative z-10 flex shrink-0 items-center gap-5">
              <nav aria-label="Primary" className="flex items-center gap-1">
                {links.map((link) => (
                  <NavItem
                    key={link.label}
                    href={link.href}
                    scrolled={chrome === "scrolled"}
                  >
                    {link.label}
                  </NavItem>
                ))}
              </nav>

              <div className="flex items-center gap-[10px]">
                <SearchButton />
                <LanguageSelect />
                <SecondaryButton href="#enquire" color="yellow">
                  Enquire
                </SecondaryButton>
              </div>
            </div>
          </header>

          <header
            className={`relative flex w-full items-center justify-between px-2 py-3 min-[1024px]:hidden ${mobileScrolled}`}
          >
            <LanguageSelect />

            <a href="/" aria-label="Ace Amusement home" className="relative h-[34px] w-[47.783px] shrink-0 overflow-hidden">
              <img
                alt=""
                src={media("/ace/logo.webp")}
                width={640}
                height={155}
                className="absolute top-0 left-0 h-full w-[294.09%] max-w-none"
                decoding="async"
                fetchPriority="high"
              />
            </a>

            <button type="button" aria-label="Open menu" className="size-[35px] shrink-0">
              <img alt="" src={media("/ace/menu.svg")} width={35} height={35} />
            </button>
          </header>
          </div>
        </div>
      </div>
    </>
  );
}
