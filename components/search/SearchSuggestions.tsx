"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import SanityImage from "@/components/shared/SanityImage";
import ProductPrice from "@/components/product/ProductPrice";
import { getProductUrl } from "@/lib/getProductUrl";
import type { ProductCard } from "@/sanity/lib/fetch";

interface SearchSuggestionsProps {
  suggestions: ProductCard[];
  isLoading: boolean;
  recentSearches: string[];
  query: string;
  onSelect: (query: string) => void;
  onClose: () => void;
}

export default function SearchSuggestions({
  suggestions,
  isLoading,
  recentSearches,
  query,
  onSelect,
  onClose,
}: SearchSuggestionsProps) {
  if (query.trim().length < 2) {
    if (recentSearches.length === 0) return null;
    return (
      <div className="border-t py-2">
        <p className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Recent Searches
        </p>
        {recentSearches.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            {s}
          </button>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border-t px-3 py-4 text-sm text-muted-foreground">
        Searching…
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="border-t px-3 py-4 text-sm text-muted-foreground">
        No results for &ldquo;{query}&rdquo;
      </div>
    );
  }

  return (
    <div className="border-t py-2">
      {suggestions.map((product) => (
        <Link
          key={product._id}
          href={getProductUrl(product.slug)}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
            {product.image && (
              <SanityImage
                image={product.image}
                alt={product.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            {product.categoryName && (
              <p className="text-xs text-muted-foreground">
                {product.categoryName}
              </p>
            )}
          </div>
          <ProductPrice
            price={product.price}
            salePrice={product.salePrice}
            size="sm"
          />
        </Link>
      ))}

      <div className="mx-3 mt-1 border-t pt-2">
        <Link
          href={`/search?q=${encodeURIComponent(query)}`}
          onClick={onClose}
          className="flex items-center gap-2 rounded-md py-2 text-sm font-medium text-primary hover:underline"
        >
          <Search className="h-3.5 w-3.5" />
          See all results for &ldquo;{query}&rdquo;
        </Link>
      </div>
    </div>
  );
}
