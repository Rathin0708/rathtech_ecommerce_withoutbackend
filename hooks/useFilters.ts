"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FilterState, SortOption } from "@/types";

function buildQueryString(filters: FilterState): string {
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
  if (filters.page && filters.page > 1)
    params.set("page", String(filters.page));

  return params.toString();
}

export function useFilters(currentFilters: FilterState = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (filters: FilterState) => {
      const qs = buildQueryString(filters);
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname]
  );

  const setFilter = useCallback(
    (key: keyof FilterState, value: FilterState[typeof key]) => {
      navigate({ ...currentFilters, [key]: value, page: 1 });
    },
    [currentFilters, navigate]
  );

  const setMultiple = useCallback(
    (updates: Partial<FilterState>) => {
      navigate({ ...currentFilters, ...updates, page: 1 });
    },
    [currentFilters, navigate]
  );

  const clearFilter = useCallback(
    (key: keyof FilterState) => {
      const next = { ...currentFilters, page: 1 };
      delete next[key];
      navigate(next);
    },
    [currentFilters, navigate]
  );

  const clearAll = useCallback(() => {
    navigate(currentFilters.sort ? { sort: currentFilters.sort } : {});
  }, [currentFilters, navigate]);

  const setSort = useCallback(
    (sort: SortOption) => {
      navigate({ ...currentFilters, sort, page: 1 });
    },
    [currentFilters, navigate]
  );

  const setPage = useCallback(
    (page: number) => {
      navigate({ ...currentFilters, page });
    },
    [currentFilters, navigate]
  );

  return { setFilter, setMultiple, clearFilter, clearAll, setSort, setPage };
}
