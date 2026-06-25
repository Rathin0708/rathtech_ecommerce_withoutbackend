"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import SanityImage from "@/components/shared/SanityImage";
import ProductBadge from "@/components/product/ProductBadge";
import ProductPrice from "@/components/product/ProductPrice";
import { getProductUrl } from "@/lib/getProductUrl";
import { getCategoryUrl } from "@/lib/getCategoryUrl";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { ProductCard as ProductCardType } from "@/sanity/lib/fetch";

interface ProductCardProps {
  product: ProductCardType;
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlist(product._id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      {/* Image container */}
      <Link
        href={getProductUrl(product.slug)}
        className="relative block aspect-square overflow-hidden bg-muted"
        tabIndex={-1}
        aria-hidden
      >
        {product.image ? (
          <SanityImage
            image={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-4xl text-muted-foreground">📦</span>
          </div>
        )}

        {/* Out-of-stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-muted-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Badge */}
      {product.badge && (
        <div className="absolute left-2 top-2 z-10">
          <ProductBadge badge={product.badge} />
        </div>
      )}

      {/* Wishlist — h-10 w-10 (40px) meets WCAG 2.5.8 touch target minimum */}
      <button
        onClick={toggle}
        aria-label={
          isWishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        className="absolute right-1.5 top-1.5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isWishlisted
              ? "fill-red-500 stroke-red-500"
              : "stroke-muted-foreground"
          )}
        />
      </button>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        {product.categoryName && (
          <Link
            href={
              product.categorySlug
                ? getCategoryUrl(product.categorySlug)
                : "/categories"
            }
            className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            tabIndex={-1}
          >
            {product.categoryName}
          </Link>
        )}
        <Link
          href={getProductUrl(product.slug)}
          className="line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <ProductPrice
          price={product.price}
          salePrice={product.salePrice}
          size="sm"
          className="mt-1"
        />
      </div>
    </article>
  );
}
