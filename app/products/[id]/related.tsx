import {
  ProductCard,
  productCardSweepStyles,
} from "@/components/product-card";
import { relatedProducts, type Product } from "@/content/products";

export function RelatedProducts({ product }: { product: Product }) {
  const related = relatedProducts(product);
  if (related.length === 0) return null;

  return (
    <section className="flex flex-col gap-10" aria-labelledby="related-heading">
      <style>{productCardSweepStyles}</style>
      <h2 id="related-heading" className="type-h4 max-w-[620px] text-white capitalize">
        Related Products
      </h2>
      <ul className="grid grid-cols-2 gap-1 min-[1024px]:grid-cols-4 min-[1024px]:gap-5">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </ul>
    </section>
  );
}
