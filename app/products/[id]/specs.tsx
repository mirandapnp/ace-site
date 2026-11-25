import { LabelBadge } from "@/components/label-badge";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import {
  productSpecRows,
  type Product,
} from "@/content/products";

const monoMeta =
  "font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] uppercase";

export function ProductSpecs({ product }: { product: Product }) {
  const rows = productSpecRows(product);
  const brochure = product.brochure;

  return (
    <div className="flex h-full min-h-0 flex-col gap-7 rounded-[16px] bg-[rgba(78,78,78,0.5)] px-2.5 pt-5 pb-2.5 min-[1024px]:gap-10 min-[1024px]:p-5">
      <a
        href="/#products"
        className={`${monoMeta} text-[rgba(215,215,215,0.75)] transition-colors hover:text-white`}
      >
        {"< back to products"}
      </a>

      <div className="flex min-h-0 flex-1 flex-col gap-7 min-[1024px]:gap-10">
        <div className="flex flex-col gap-7">
          {product.labels && product.labels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.labels.map((label) => (
                <LabelBadge key={label} variant={label} />
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-5">
            <h1 className="type-h4 text-pretty text-white capitalize">
              {product.name}
            </h1>
            {product.body ? (
              <p className="type-p1 max-w-[512px] text-pretty text-white">
                {product.body}
              </p>
            ) : null}
          </div>
        </div>

        {rows.length > 0 ? (
          <dl
            className={`overflow-hidden rounded-[12px] border border-[rgba(215,215,215,0.25)] ${monoMeta}`}
          >
            {rows.map((row, index) => (
              <div
                key={row.label}
                className={`flex items-start justify-between gap-4 px-3 py-5 ${
                  index < rows.length - 1
                    ? "border-b border-[rgba(215,215,215,0.25)]"
                    : ""
                }`}
              >
                <dt className="shrink-0 text-[rgba(215,215,215,0.75)]">
                  {row.label}
                </dt>
                <dd className="text-right text-white">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex flex-col items-stretch gap-2.5 min-[1024px]:grid min-[1024px]:grid-cols-2">
        <div className="min-w-0">
          <PrimaryButton href="#contact" color="yellow" className="w-full">
            Request a quote
          </PrimaryButton>
        </div>
        <div className="min-w-0 min-[1024px]:h-full">
          <SecondaryButton
            href={brochure ?? "#"}
            color="white-outline"
            className="box-border h-[52px] w-full min-[1024px]:h-full"
          >
            Download brochure
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
