import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentFilters: FilterState;
  basePath: string;
}

function buildPageUrl(
  basePath: string,
  filters: FilterState,
  page: number
): string {
  const params = new URLSearchParams();
  filters.category?.forEach((v) => params.append("category", v));
  filters.size?.forEach((v) => params.append("size", v));
  filters.color?.forEach((v) => params.append("color", v));
  filters.tag?.forEach((v) => params.append("tag", v));
  if (filters.minPrice && filters.minPrice > 0)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice && filters.maxPrice < 9_999_999)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.available) params.set("available", "true");
  if (filters.sort && filters.sort !== "newest")
    params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({
  currentPage,
  totalPages,
  currentFilters,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(basePath, currentFilters, currentPage - 1)}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background text-sm hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-muted text-sm text-muted-foreground opacity-50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {showPages.map((page, i) => {
        const prev = showPages[i - 1];
        const showEllipsis = prev != null && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
                …
              </span>
            )}
            <Link
              href={buildPageUrl(basePath, currentFilters, page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-colors",
                page === currentPage
                  ? "border-primary bg-primary text-primary-foreground pointer-events-none"
                  : "border-input bg-background hover:bg-muted"
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(basePath, currentFilters, currentPage + 1)}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background text-sm hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-muted text-sm text-muted-foreground opacity-50 cursor-not-allowed">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
