import ProductGrid from "@/components/product/ProductGrid";
import type { ProductCard } from "@/sanity/lib/fetch";

interface RelatedProductsProps {
  products: ProductCard[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-label="Related products" className="mt-12">
      <h2 className="mb-6 text-xl font-semibold">You may also like</h2>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}
