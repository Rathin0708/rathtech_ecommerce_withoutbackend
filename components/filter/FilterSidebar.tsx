"use client";

import { useState } from "react";
import FilterGroup from "@/components/filter/FilterGroup";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatCurrency";
import { useFilters } from "@/hooks/useFilters";
import type { FilterOptions } from "@/sanity/lib/fetch";
import type { FilterState } from "@/types";

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  currentFilters: FilterState;
}

export default function FilterSidebar({
  filterOptions,
  currentFilters,
}: FilterSidebarProps) {
  const { setFilter, clearFilter, clearAll, setMultiple } =
    useFilters(currentFilters);

  const defaultMin = filterOptions.minPrice ?? 0;
  const defaultMax = filterOptions.maxPrice ?? 9_999_999;
  const [priceRange, setPriceRange] = useState([
    currentFilters.minPrice ?? defaultMin,
    currentFilters.maxPrice ?? defaultMax,
  ]);

  const hasActiveFilters =
    (currentFilters.size?.length ?? 0) > 0 ||
    (currentFilters.color?.length ?? 0) > 0 ||
    (currentFilters.tag?.length ?? 0) > 0 ||
    currentFilters.available;

  const sizes = filterOptions.sizes.map((s) => ({ label: s, value: s }));
  const colors = filterOptions.colors.map((c) => ({ label: c, value: c }));
  const tags = filterOptions.tags.map((t) => ({ label: t, value: t }));
  const hasPrice = defaultMax > defaultMin;

  return (
    <aside aria-label="Product filters" className="w-[240px] shrink-0">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Size */}
      {sizes.length > 0 && (
        <FilterGroup
          title="Size"
          options={sizes}
          selected={currentFilters.size ?? []}
          onChange={(values) =>
            values.length > 0
              ? setFilter("size", values)
              : clearFilter("size")
          }
        />
      )}

      {/* Color */}
      {colors.length > 0 && (
        <FilterGroup
          title="Color"
          options={colors}
          selected={currentFilters.color ?? []}
          onChange={(values) =>
            values.length > 0
              ? setFilter("color", values)
              : clearFilter("color")
          }
        />
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <FilterGroup
          title="Tags"
          options={tags}
          selected={currentFilters.tag ?? []}
          onChange={(values) =>
            values.length > 0 ? setFilter("tag", values) : clearFilter("tag")
          }
        />
      )}

      {/* Price range */}
      {hasPrice && (
        <div className="border-t pt-3">
          <p className="mb-3 text-sm font-medium">Price Range</p>
          <Slider
            aria-label="Price range"
            min={defaultMin}
            max={defaultMax}
            step={Math.max(1, Math.floor((defaultMax - defaultMin) / 100))}
            value={priceRange}
            onValueChange={(v) => {
              if (Array.isArray(v)) setPriceRange(v as number[]);
            }}
            onValueCommitted={(v) => {
              if (Array.isArray(v)) {
                const [min, max] = v as number[];
                setMultiple({ minPrice: min, maxPrice: max });
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="border-t pt-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={currentFilters.available ?? false}
            onChange={(e) =>
              e.target.checked
                ? setFilter("available", true)
                : clearFilter("available")
            }
            className="h-4 w-4 rounded border-border accent-primary"
          />
          In Stock Only
        </label>
      </div>
    </aside>
  );
}
