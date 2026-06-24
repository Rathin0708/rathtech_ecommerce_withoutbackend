import Link from "next/link";
import SanityImage from "@/components/shared/SanityImage";
import { getProductUrl } from "@/lib/getProductUrl";
import { formatCurrency } from "@/lib/formatCurrency";
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
    <section aria-label={title ?? "Featured products"} className="py-8 sm:py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Product grid — Phase 4 will swap this for real ProductCard components */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <Link
              key={product._id}
              href={getProductUrl(product.slug)}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.image ? (
                  <SanityImage
                    image={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 4}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <span className="text-3xl">📦</span>
                  </div>
                )}
                {/* Badge */}
                {product.badge && (
                  <span className="absolute left-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                    {product.badge === "bestSeller" ? "Best Seller" :
                     product.badge === "limitedEdition" ? "Limited" :
                     product.badge}
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="flex flex-col gap-1 p-3">
                {product.categoryName && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {product.categoryName}
                  </span>
                )}
                <p className="line-clamp-2 text-sm font-medium leading-snug">
                  {product.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {formatCurrency(product.salePrice ?? product.price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
                {!product.inStock && (
                  <span className="text-xs text-muted-foreground">Out of stock</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
