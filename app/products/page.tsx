import type { Metadata } from "next";
import { fetchFilterOptions, fetchProducts } from "@/sanity/lib/fetch";
import ProductGrid from "@/components/product/ProductGrid";
import SortDropdown from "@/components/filter/SortDropdown";
import FilterSidebar from "@/components/filter/FilterSidebar";
import FilterSheet from "@/components/filter/FilterSheet";
import ActiveFilters from "@/components/filter/ActiveFilters";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import type { FilterState, SortOption } from "@/types";

export const metadata: Metadata = {
  title: "All Products",
  description: "Shop our full collection",
};

const PAGE_SIZE = 24;

interface PLPProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseSearchParams(
  sp: Record<string, string | string[] | undefined>
): FilterState & { page: number } {
  function s(key: string) {
    const v = sp[key];
    return typeof v === "string" ? v : "";
  }
  function arr(key: string): string[] {
    const v = sp[key];
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v) return [v];
    return [];
  }

  return {
    category: arr("category"),
    size: arr("size"),
    color: arr("color"),
    tag: arr("tag"),
    minPrice: s("minPrice") ? Number(s("minPrice")) : undefined,
    maxPrice: s("maxPrice") ? Number(s("maxPrice")) : undefined,
    available: s("available") === "true",
    sort: (s("sort") || "newest") as SortOption,
    page: Math.max(1, parseInt(s("page") || "1", 10)),
  };
}

export default async function ProductsPage({ searchParams }: PLPProps) {
  const sp = await searchParams;
  const params = parseSearchParams(sp);
  const {
    category,
    size,
    color,
    tag,
    minPrice,
    maxPrice,
    available,
    sort = "newest",
    page = 1,
  } = params;

  const categorySlug = category?.[0] ?? "";
  const tagFilter = tag?.[0] ?? "";

  const [{ products, total }, filterOptions] = await Promise.all([
    fetchProducts({
      category: categorySlug,
      tag: tagFilter,
      inStock: available,
      minPrice: minPrice ?? 0,
      maxPrice: maxPrice ?? 9_999_999,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    fetchFilterOptions(categorySlug),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentFilters: FilterState = {
    category,
    size,
    color,
    tag,
    minPrice,
    maxPrice,
    available,
    sort,
    page,
  };

  const hasActiveFilters =
    (size?.length ?? 0) > 0 ||
    (color?.length ?? 0) > 0 ||
    (tag?.length ?? 0) > 0 ||
    (category?.length ?? 0) > 0 ||
    available;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">All Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            filterOptions={filterOptions}
            currentFilters={currentFilters}
          />
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Controls row */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <FilterSheet
                  filterOptions={filterOptions}
                  currentFilters={currentFilters}
                  totalResults={total}
                />
              </div>
            </div>
            <SortDropdown currentFilters={currentFilters} />
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="mb-4">
              <ActiveFilters currentFilters={currentFilters} />
            </div>
          )}

          {/* Grid */}
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} priority />
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    currentFilters={currentFilters}
                    basePath="/products"
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters to find what you're looking for."
            />
          )}
        </div>
      </div>
    </div>
  );
}
