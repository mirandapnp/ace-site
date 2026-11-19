import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/content/products";
import { site } from "@/content/site";
import { media } from "@/lib/media";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: site.name };
  return {
    title: product.name,
    description: product.body || product.name,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-black px-5 py-20 text-white">
      <a
        href="/"
        className="font-mono text-[12px] leading-[1.25] font-[525] tracking-[0.78px] text-white uppercase"
      >
        Home
      </a>
      <h1 className="mt-10 font-display text-[48px] leading-none font-medium tracking-[-1.2px] text-white">
        {product.name}
      </h1>
      {product.body ? (
        <p className="mt-6 max-w-[560px] font-sans text-[14px] leading-[1.5] font-[485] tracking-[0.175px] text-pretty text-white">
          {product.body}
        </p>
      ) : null}
      <img
        alt={product.name}
        src={media(product.image)}
        className="mt-10 max-h-[640px] w-auto max-w-full"
      />
    </main>
  );
}
