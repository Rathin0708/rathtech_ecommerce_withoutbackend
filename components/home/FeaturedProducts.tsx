import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import type { ProductCard } from "@/sanity/lib/fetch";

interface FeaturedProductsProps {
  title?: string | null;
  products?: ProductCard[] | null;
  viewAllHref?: string;
}

export default function FeaturedProducts({
  title = "Featured Products",
  products,
  viewAllHref = "/products",
}: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section
      aria-label={title ?? "Featured products"}
      className="py-8 sm:py-10"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={products} priority />
      </div>
    </section>
  );
}
