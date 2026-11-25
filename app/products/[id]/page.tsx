import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Marquee } from "@/components/marquee";
import { PartnerCta } from "@/components/partner-cta";
import { ScaleFrame } from "@/components/scale-frame";
import {
  getProduct,
  productGallery,
  products,
} from "@/content/products";
import { site } from "@/content/site";
import { ProductGallery } from "./gallery";
import { RelatedProducts } from "./related";
import { ProductSpecs } from "./specs";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: site.name };
  return {
    title: product.name,
    description: product.body || product.name,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-black" aria-hidden />
      }
    >
      <ProductListing params={params} />
    </Suspense>
  );
}

async function ProductListing({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const gallery = productGallery(product);

  return (
    <div className="min-h-screen w-full min-w-0 bg-black">
      <Header />
      <ScaleFrame>
        <main className="flex w-[412px] flex-col min-[1024px]:w-[1440px]">
          <div className="flex flex-col gap-5 px-2.5 pt-20 pb-2.5 min-[1024px]:gap-20 min-[1024px]:px-5 min-[1024px]:pb-5">
            <div className="flex flex-col gap-2.5 min-[1024px]:grid min-[1024px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-[1024px]:gap-5">
              <ProductGallery name={product.name} images={gallery} />
              <ProductSpecs product={product} />
            </div>
            <RelatedProducts product={product} />
          </div>
          <Marquee />
          <PartnerCta />
          <Footer />
        </main>
      </ScaleFrame>
    </div>
  );
}
