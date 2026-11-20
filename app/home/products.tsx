"use client";

import { useEffect, useRef, useState } from "react";
import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { catalogProducts, featuredProducts, productPath, type Product } from "@/content/products";
import { media } from "@/lib/media";
import {
  featuredGradientFollow,
  gradientFollowVars,
  useGradientFollow,
} from "@/lib/use-gradient-follow";

const cardImage: Record<string, { frame: string; crop: string }> = {
  "skull-of-shadow": {
    frame: "aspect-[3413/3733] w-full min-[1024px]:aspect-auto min-[1024px]:h-[315px] min-[1024px]:w-[287.973px]",
    crop: "top-[1.74%] left-[-4.86%] h-[98.26%] w-[107.48%]",
  },
  "ace-shooter-promax": {
    frame: "aspect-[279/312.333] w-full min-[1024px]:aspect-auto min-[1024px]:h-[315px] min-[1024px]:w-[281.382px]",
    crop: "top-[1.3%] left-[-6.61%] h-[98.82%] w-[115.33%]",
  },
  "galaxy-rangers": {
    frame: "aspect-[279/312.333] w-full min-[1024px]:aspect-auto min-[1024px]:h-[315px] min-[1024px]:w-[281.382px]",
    crop: "top-[3.14%] left-[-14.63%] h-[96.86%] w-[129.26%]",
  },
  "wild-hunting": {
    frame: "aspect-[945.271/1063.147] w-full",
    crop: "top-[0.53%] left-[-6.4%] h-[99.47%] w-[111.87%]",
  },
  "roll-n-win": {
    frame: "aspect-[279/301.217] w-full",
    crop: "top-[-1.89%] left-[-9.85%] h-[99.54%] w-[119.69%]",
  },
  "speedy-toss": {
    frame: "aspect-[279/315] w-full min-[1024px]:aspect-auto min-[1024px]:h-[315px] min-[1024px]:w-[259.961px]",
    crop: "top-[-2.26%] left-[-11.95%] h-[102.26%] w-[123.91%]",
  },
  "crossbow-fishing": {
    frame: "aspect-[279/315] w-full min-[1024px]:aspect-auto min-[1024px]:h-[315px] min-[1024px]:w-[287.477px]",
    crop: "top-0 left-[-3.09%] h-[96.27%] w-[105.48%]",
  },
  "jet-ski-racer": {
    frame: "aspect-[279/315] w-full",
    crop: "top-[2.59%] left-[-2.6%] h-[90.45%] w-[102.12%]",
  },
};

function CatalogCard({ product }: { product: Product }) {
  const face = useRef<HTMLDivElement>(null);
  const motion = useRef({ x: 0, y: 0, tx: 0, ty: 0, frame: 0 });

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
      <div
        ref={face}
        className="group relative flex h-full origin-center flex-col items-start justify-end gap-10 rounded-[16px] bg-white px-2.5 pt-5 pb-2.5 min-[1024px]:px-5 min-[1024px]:pt-10 min-[1024px]:pb-5"
      >
        <div className="flex w-full flex-1 items-end">
          <div className={`relative shrink-0 ${cardImage[product.id].frame}`}>
            <div className="absolute inset-0 overflow-hidden">
              <LazyImage
                alt=""
                src={media(product.image)}
                className={`absolute max-w-none ${cardImage[product.id].crop}`}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <h3 className="min-w-0 flex-1 font-display text-[12px] leading-[1.25] font-medium tracking-[-0.3px] text-black capitalize min-[1024px]:text-[18px] min-[1024px]:tracking-[-0.45px]">
            <a href={productPath(product.id)} className="min-[1024px]:pointer-events-none">
              {product.name}
            </a>
          </h3>
          <a
            href={productPath(product.id)}
            aria-label={`Open ${product.name}`}
            className="relative hidden size-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(78,78,78,0.25)] min-[1024px]:flex"
          >
            <span
              aria-hidden
              className="ace-card-sweep pointer-events-none absolute inset-0 bg-[rgba(78,78,78,0.1)]"
            />
            <img alt="" src={media("/ace/plus.svg")} width={12} height={12} className="relative" />
          </a>
        </div>
        <span
          aria-hidden
          className="ace-card-sweep ace-card-fade pointer-events-none absolute inset-0 rounded-[16px] bg-[rgba(0,0,0,0.07)]"
        />
      </div>
    </li>
  );
}

const kickerClass =
  "font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] text-black uppercase";

const mobileKickerClass =
  "font-mono text-[14px] leading-[1.25] font-[475] tracking-[0.07px] text-black uppercase";

function FeaturedVisual({ active }: { active: Product }) {
  const glow = useGradientFollow(featuredGradientFollow);

  return (
    <div
      ref={glow.cardRef}
      onPointerMove={glow.onPointerMove}
      onPointerLeave={glow.onPointerLeave}
      className="relative aspect-[828/580] w-full overflow-hidden rounded-[16px] min-[1024px]:aspect-auto min-[1024px]:h-[580px]"
    >
      <div
        ref={glow.gradientRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), #7dae95 var(--core), rgba(125, 174, 149, var(--mid)) var(--mid-at), rgba(125, 174, 149, 0) var(--fade)), linear-gradient(to bottom, rgba(45, 45, 45, 0.25) 11.058%, #7dae95 100%)",
          ...gradientFollowVars(featuredGradientFollow),
        }}
      />
      {active.scene === "combat" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-70"
          style={{ backgroundImage: `url(${media("/ace/air-combat-bg.webp?v=2")})` }}
        />
      ) : null}
      <div className="ace-product-in pointer-events-none relative flex h-full items-center justify-center">
        {active.scene === "combat" ? (
          <div className="relative aspect-[556.468/465.523] w-[70%] min-[1024px]:aspect-auto min-[1024px]:h-[465.523px] min-[1024px]:w-[556.468px]">
            <div className="absolute top-[5.3%] right-[1.46%] left-[3.84%] aspect-[572.365/478.822] overflow-hidden">
              <LazyImage
                alt={active.name}
                src={media(active.image)}
                className="absolute top-[-13.2%] left-[-2.41%] h-[125.31%] w-[104.83%] max-w-none"
              />
            </div>
          </div>
        ) : (
          <LazyImage
            key={active.id}
            alt={active.name}
            src={media(active.image)}
            className="h-auto w-[70%] min-[1024px]:max-h-[460px] min-[1024px]:w-auto min-[1024px]:max-w-[680px]"
          />
        )}
      </div>
    </div>
  );
}

function FeaturedPanel({
  product,
  layout,
}: {
  product: Product;
  layout: "desktop" | "mobile";
}) {
  const mobile = layout === "mobile";

  return (
    <>
      <div className={`flex flex-col ${mobile ? "gap-5" : "gap-7"}`}>
        <h3 className="font-display text-[32px] leading-[1.25] font-medium tracking-[-0.96px] text-black capitalize">
          {product.name}
        </h3>
        {product.stats && product.stats.length > 0 ? (
          <div className={`flex flex-col ${mobile ? "gap-4" : "gap-5"}`}>
            <p className={kickerClass}>Stats</p>
            <ul className="flex flex-col gap-2">
              {product.stats.map((stat) => (
                <li
                  key={stat}
                  className="flex h-[17px] items-center gap-3 font-sans text-[12px] leading-[1.5] font-[442] tracking-[0.15px] text-black"
                >
                  <span aria-hidden className="size-1.5 shrink-0 bg-black" />
                  {stat}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div
        className={
          mobile
            ? "flex flex-col items-stretch gap-10"
            : "flex items-end gap-10"
        }
      >
        {product.body ? (
          <p className="flex-1 font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty text-black">
            {product.body}
          </p>
        ) : mobile ? null : (
          <span className="flex-1" />
        )}
        <SecondaryButton
          href={productPath(product.id)}
          color="outline"
          className={
            mobile
              ? "w-full [&>span.relative]:w-full [&>span.relative]:justify-between"
              : "shrink-0"
          }
        >
          View
        </SecondaryButton>
      </div>
    </>
  );
}

export function Products() {
  const [activeId, setActiveId] = useState<Product["id"]>("air-combat");
  const active = featuredProducts.find((product) => product.id === activeId) ?? featuredProducts[0];

  return (
    <section
      id="products"
      className="w-[412px] px-2.5 pt-5 pb-2.5 min-[1024px]:w-[1440px] min-[1024px]:px-5 min-[1024px]:pt-20 min-[1024px]:pb-5"
      aria-labelledby="products-heading"
    >
      <div className="flex items-end justify-center min-[1024px]:justify-between">
        <h2
          id="products-heading"
          className="font-display text-[32px] leading-[1.25] font-medium tracking-[-0.96px] text-white capitalize min-[1024px]:text-[60px] min-[1024px]:leading-[1.1] min-[1024px]:tracking-[-1.95px] min-[1024px]:normal-case"
        >
          Core Products
        </h2>
        <div className="hidden min-[1024px]:block">
          <PrimaryButton href="#products" color="gray">
            All Products
          </PrimaryButton>
        </div>
      </div>

      {/* Desktop tabs + visual */}
      <div className="mt-10 hidden grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-x-5 min-[1024px]:grid">
        <div
          className="grid h-[580px] gap-[10px] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            gridTemplateRows: featuredProducts
              .map((product) => (product.id === active.id ? "450px" : "55px"))
              .join(" "),
          }}
          role="tablist"
          aria-label="Core products"
        >
          {featuredProducts.map((product) => {
            const open = product.id === active.id;
            const panelId = `${product.id}-panel`;
            const tabId = `${product.id}-tab`;

            return (
              <div
                key={product.id}
                className={
                  open
                    ? "flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] bg-[#36f592]"
                    : "flex h-full min-h-0 flex-col overflow-hidden rounded-[16px] bg-[rgba(54,245,146,0.75)] transition-colors duration-300 ease-out hover:bg-[#36f592] motion-reduce:transition-none"
                }
              >
                <button
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={open}
                  aria-controls={panelId}
                  onClick={() => setActiveId(product.id)}
                  className={`px-5 text-left text-[12px] leading-[1.25] transition-[padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "pt-7 pb-0" : "py-5"}`}
                >
                  <span className={kickerClass}>{product.kicker}</span>
                </button>
                <div
                  id={panelId}
                  role="tabpanel"
                  aria-labelledby={tabId}
                  aria-hidden={!open}
                  inert={!open}
                  className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-5 pt-5 pb-7"
                >
                  <FeaturedPanel product={product} layout="desktop" />
                </div>
              </div>
            );
          })}
        </div>

        <FeaturedVisual active={active} />
      </div>

      {/* Mobile: visual above, accordion below */}
      <div className="mt-5 flex flex-col gap-2.5 min-[1024px]:hidden">
        <FeaturedVisual active={active} />

        <div className="flex flex-col gap-1" role="tablist" aria-label="Core products">
          {featuredProducts.map((product) => {
            const open = product.id === active.id;
            const panelId = `${product.id}-mobile-panel`;
            const tabId = `${product.id}-mobile-tab`;

            return (
              <div
                key={product.id}
                className={
                  open
                    ? "grid overflow-hidden rounded-[16px] bg-[#36f592] transition-[grid-template-rows,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    : "grid overflow-hidden rounded-[16px] bg-[rgba(54,245,146,0.75)] transition-[grid-template-rows,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                }
                style={{ gridTemplateRows: open ? "auto 1fr" : "auto 0fr" }}
              >
                <button
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={open}
                  aria-controls={panelId}
                  onClick={() => setActiveId(product.id)}
                  className={`w-full px-2.5 text-left transition-[padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "pt-5 pb-0" : "py-5"}`}
                >
                  <span className={mobileKickerClass}>{product.kicker}</span>
                </button>
                <div
                  id={panelId}
                  role="tabpanel"
                  aria-labelledby={tabId}
                  aria-hidden={!open}
                  inert={!open}
                  className="min-h-0 overflow-hidden"
                >
                  <div
                    className={`flex flex-col gap-5 px-2.5 pt-5 pb-2.5 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
                  >
                    <FeaturedPanel product={product} layout="mobile" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ul className="mt-2.5 grid grid-cols-2 gap-1 min-[1024px]:mt-10 min-[1024px]:grid-cols-4 min-[1024px]:gap-5">
        {catalogProducts.map((product) => (
          <CatalogCard key={product.id} product={product} />
        ))}
      </ul>

      <div className="mt-5 min-[1024px]:hidden">
        <PrimaryButton href="#products" color="gray" className="w-full">
          All Products
        </PrimaryButton>
      </div>

      <style>{`
        .ace-product-in { animation: ace-product-in 400ms ease-out; }
        @keyframes ace-product-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ace-product-in { animation: none; }
        }
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
      `}</style>
    </section>
  );
}
