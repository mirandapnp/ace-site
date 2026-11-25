"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { LabelBadge } from "@/components/label-badge";
import { LazyImage } from "@/components/lazy-visual";
import { productPath, type Product } from "@/content/products";
import { media } from "@/lib/media";

/**
 * Per-machine display size (css px), from opaque subject bounds so transparent
 * padding doesn’t shrink some cabinets. Shared scale: max subject side ≈ 170
 * (mobile, width-driven so narrow cards don’t clamp unevenly) / 280 (desktop,
 * height-driven). Tall/slim vs short/wide keep their proportions.
 */
const cardMachineSize: Record<
  string,
  { mobileW: number; desktopH: number }
> = {
  "pop-shot-circus": { mobileW: 153, desktopH: 301 },
  "cold-trigger": { mobileW: 182, desktopH: 299 },
  "racing-xtreme": { mobileW: 163, desktopH: 290 },
  "bikers-madness": { mobileW: 162, desktopH: 292 },
  "thunder-jets": { mobileW: 186, desktopH: 275 },
  "dragon-kingdom-vr": { mobileW: 150, desktopH: 292 },
  "medal-master": { mobileW: 186, desktopH: 259 },
  "hoop-hustle": { mobileW: 144, desktopH: 289 },
};

const cardMachineStage =
  "relative flex h-[184px] w-full items-end justify-center min-[1024px]:h-[302px]";
const cardMachineImage =
  "object-contain object-bottom drop-shadow-[2px_6px_20px_rgba(0,0,0,0.12)]";

export const productCardSweepStyles = `
.ace-card-sweep {
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 33.333%, transparent 66.666%, transparent 100%);
  -webkit-mask-size: 300% 100%;
  mask-size: 300% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;
  transition: mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ace-card-fade {
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, transparent 33.333%, #000 66.666%, #000 100%);
  mask-image: linear-gradient(90deg, transparent 0%, transparent 33.333%, #000 66.666%, #000 100%);
  transition: mask-position 1400ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-mask-position 1400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.group:hover .ace-card-sweep {
  -webkit-mask-position: 0 0;
  mask-position: 0 0;
}
@media (prefers-reduced-motion: reduce) {
  .ace-card-sweep { transition: none; }
}
`;

/**
 * Homepage / related-products catalog card — tilt + sweep hover, whole card links.
 */
export function ProductCard({ product }: { product: Product }) {
  const face = useRef<HTMLAnchorElement>(null);
  const motion = useRef({ x: 0, y: 0, tx: 0, ty: 0, frame: 0 });
  const size = cardMachineSize[product.id];
  const label = product.labels?.[0];

  useEffect(() => {
    const current = motion.current;
    return () => cancelAnimationFrame(current.frame);
  }, []);

  function step() {
    const node = face.current;
    const pose = motion.current;
    if (!node) return;
    pose.x += (pose.tx - pose.x) * 0.09;
    pose.y += (pose.ty - pose.y) * 0.09;
    const settled =
      Math.abs(pose.tx - pose.x) < 0.02 && Math.abs(pose.ty - pose.y) < 0.02;
    if (settled && pose.tx === 0 && pose.ty === 0) {
      pose.x = 0;
      pose.y = 0;
      pose.frame = 0;
      node.style.transform = "";
      node.parentElement?.style.setProperty("perspective", "");
      return;
    }
    node.style.transform = `rotateX(${pose.y.toFixed(3)}deg) rotateY(${pose.x.toFixed(3)}deg)`;
    pose.frame = requestAnimationFrame(step);
  }

  function tilt(event: React.MouseEvent<HTMLLIElement>) {
    if (document.documentElement.hasAttribute("data-safari")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.currentTarget.style.perspective = "900px";
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const max = 5;
    const pose = motion.current;
    pose.ty = y * max;
    pose.tx = -x * max;
    if (!pose.frame) pose.frame = requestAnimationFrame(step);
  }

  function rest() {
    const pose = motion.current;
    pose.tx = 0;
    pose.ty = 0;
    if (!pose.frame) pose.frame = requestAnimationFrame(step);
  }

  return (
    <li className="relative z-0 hover:z-10" onMouseMove={tilt} onMouseLeave={rest}>
      <a
        ref={face}
        href={productPath(product.id)}
        aria-label={product.name}
        className="group relative flex h-full origin-center flex-col items-start justify-end gap-10 rounded-[16px] bg-white px-2.5 pt-5 pb-2.5 min-[1024px]:px-5 min-[1024px]:pt-10 min-[1024px]:pb-5"
      >
        {label ? (
          <span className="absolute top-0 left-0 z-[1] p-2">
            <LabelBadge variant={label} />
          </span>
        ) : null}
        <div className="flex w-full flex-1 items-end justify-center">
          <div
            className={cardMachineStage}
            style={
              size
                ? ({
                    ["--machine-w-mobile" as string]: `${size.mobileW}px`,
                    ["--machine-h-desktop" as string]: `${size.desktopH}px`,
                  } as CSSProperties)
                : undefined
            }
          >
            <LazyImage
              alt=""
              src={product.image}
              className={`${cardMachineImage} h-auto ${size ? "w-[var(--machine-w-mobile)] min-[1024px]:h-[var(--machine-h-desktop)] min-[1024px]:w-auto" : "max-h-full max-w-[80%]"}`}
              sizes="(max-width: 1023px) 45vw, 25vw"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <h3 className="type-h6 min-w-0 flex-1 text-black capitalize">
            {product.name}
          </h3>
          <span
            aria-hidden
            className="relative hidden size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(78,78,78,0.25)] min-[1024px]:flex"
          >
            <span className="ace-card-sweep pointer-events-none absolute inset-0 bg-[rgba(78,78,78,0.1)]" />
            <img
              alt=""
              src={media("/ace/plus.svg")}
              width={12}
              height={12}
              className="relative"
            />
          </span>
        </div>
        <span
          aria-hidden
          className="ace-card-sweep ace-card-fade pointer-events-none absolute inset-0 rounded-[16px] bg-[rgba(0,0,0,0.07)]"
        />
      </a>
    </li>
  );
}
