"use client";

import { useState } from "react";
import { GradientNoise } from "@/components/gradient-noise";
import { LazyImage } from "@/components/lazy-visual";
import { PrimaryButton } from "@/components/primary-button";
import {
  ProductCard,
  productCardSweepStyles,
} from "@/components/product-card";
import { SecondaryButton } from "@/components/secondary-button";
import { catalogProducts, featuredProducts, productPath, type Product } from "@/content/products";
import {
  featuredGradientFollow,
  gradientFollowVars,
  useGradientFollow,
} from "@/lib/use-gradient-follow";

/** machine shadow — follows machine alpha, not the square frame */
const MACHINE_SHADOW = "drop-shadow(5px 10px 32px rgba(0, 0, 0, 0.25))";

const kickerClass =
  "font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] text-black uppercase";

const mobileKickerClass =
  "font-mono text-[12px] leading-[1.25] font-[475] tracking-[0.07px] text-black uppercase";

function FeaturedVisual({ active }: { active: Product }) {
  const glow = useGradientFollow(featuredGradientFollow, {
    followEase: 0.08,
    leaveEase: 0.04,
    enterEase: 0.035,
  });

  return (
    <div
      ref={glow.cardRef}
      onPointerMove={glow.onPointerMove}
      onPointerLeave={glow.onPointerLeave}
      className="relative aspect-[828/580] w-full overflow-hidden rounded-[16px] min-[1024px]:aspect-auto min-[1024px]:h-[580px]"
    >
      {active.scene === "combat" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-50"
        >
          <LazyImage
            fill
            alt=""
            src="/ace/air-combat-bg.webp"
            className="scale-[1.2] object-cover"
            sizes="(max-width: 1023px) 100vw, 60vw"
            quality={90}
          />
        </div>
      ) : null}
      <div
        ref={glow.gradientRef}
        className="ace-section-blur pointer-events-none absolute inset-0 isolate backdrop-blur-[4px]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse var(--grx) var(--gry) at var(--gx) var(--gy), rgba(54, 245, 146, var(--core-a)) var(--core), rgba(54, 245, 146, var(--mid)) var(--mid-at), rgba(54, 245, 146, 0) var(--fade)), linear-gradient(180deg, rgba(0, 0, 0, 0.595) 0%, rgba(0, 0, 0, 0.17) 40.385%, rgba(54, 245, 146, var(--wash-a)) 100%)",
          ...gradientFollowVars(featuredGradientFollow),
        }}
      >
        <GradientNoise />
      </div>
      <div className="ace-product-in pointer-events-none relative flex h-full items-center justify-center px-10 py-[60px] min-[1024px]:px-20 min-[1024px]:py-[100px]">
        {active.scene === "combat" ? (
          <div className="relative aspect-[511/504] w-[78%] min-[1024px]:aspect-auto min-[1024px]:h-[504px] min-[1024px]:w-[511px]">
            <LazyImage
              priority
              fill
              alt={active.name}
              src={active.image}
              className="object-contain"
              sizes="(max-width: 1023px) 70vw, 511px"
              loadedFilter={MACHINE_SHADOW}
            />
          </div>
        ) : (
          <LazyImage
            key={active.id}
            priority
            alt={active.name}
            src={active.image}
            className="h-auto w-[70%] min-[1024px]:max-h-[460px] min-[1024px]:w-auto min-[1024px]:max-w-[680px]"
            sizes="(max-width: 1023px) 70vw, 680px"
            loadedFilter={MACHINE_SHADOW}
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
        <h3 className="type-h4-panel text-black capitalize">
          {product.name}
        </h3>
        {product.stats && product.stats.length > 0 ? (
          <div className={`flex flex-col ${mobile ? "gap-4" : "gap-5"}`}>
            <p className={kickerClass}>Stats</p>
            <ul className="flex flex-col gap-2">
              {product.stats.map((stat) => (
                <li
                  key={stat}
                  className="type-p2 flex h-[17px] items-center gap-3 text-black"
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
          <p className="type-p1 flex-1 text-pretty text-black">
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
  const [activeId, setActiveId] = useState<Product["id"]>("wild-frontier");
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
          className="type-h3 text-white capitalize min-[1024px]:normal-case"
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
                  className={`w-full px-2.5 text-left transition-[padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "pt-5 pb-0" : "py-2.5"}`}
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
          <ProductCard key={product.id} product={product} />
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
        ${productCardSweepStyles}
      `}</style>
    </section>
  );
}
