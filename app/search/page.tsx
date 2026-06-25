"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSearchResults } from "@/sanity/lib/fetch";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductCard } from "@/sanity/lib/fetch";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<ProductCard[]>([]);
  const [total, setTotal] = useState(0);
  // Track which query the current results are for.
  // Derive loading: q changed but results haven't caught up yet.
  const [fetchedFor, setFetchedFor] = useState<string>("");

  const isLoading = q.trim().length > 0 && q !== fetchedFor;
  const displayProducts = q.trim() ? products : [];
  const displayTotal = q.trim() ? total : 0;

  useEffect(() => {
    // Skip fetch for empty query; let derived values handle display.
    if (!q.trim()) return;

    fetchSearchResults(q)
      .then(({ products: p, total: t }) => {
        setProducts(p);
        setTotal(t);
        setFetchedFor(q);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setFetchedFor(q);
      });
  }, [q]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        {q ? (
          <>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Search results for &ldquo;{q}&rdquo;
            </h1>
            {!isLoading && (
              <p className="mt-1 text-sm text-muted-foreground">
                {displayTotal} {displayTotal === 1 ? "result" : "results"}
              </p>
            )}
          </>
        ) : (
          <h1 className="text-2xl font-semibold sm:text-3xl">Search</h1>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && q && (
        <>
          {displayProducts.length > 0 ? (
            <ProductGrid products={displayProducts} />
          ) : (
            <EmptyState
              title={`No results for "${q}"`}
              description="Try searching with different keywords or browse our categories."
            />
          )}
        </>
      )}

      {!isLoading && !q && (
        <p className="text-muted-foreground">
          Enter a search term to find products.
        </p>
      )}
    </div>
  );
}
