"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterGroup from "@/components/filter/FilterGroup";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatCurrency";
import { useFilters } from "@/hooks/useFilters";
import type { FilterOptions } from "@/sanity/lib/fetch";
import type { FilterState } from "@/types";

interface FilterSheetProps {
  filterOptions: FilterOptions;
  currentFilters: FilterState;
  totalResults?: number;
}

export default function FilterSheet({
  filterOptions,
  currentFilters,
  totalResults,
}: FilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { clearAll, setMultiple } = useFilters(currentFilters);
  const [pending, setPending] = useState<FilterState>(currentFilters);

  const defaultMin = filterOptions.minPrice ?? 0;
  const defaultMax = filterOptions.maxPrice ?? 9_999_999;

  const activeCount = [
    ...(currentFilters.size ?? []),
    ...(currentFilters.color ?? []),
    ...(currentFilters.tag ?? []),
    ...(currentFilters.available ? ["available"] : []),
  ].length;

  function handleOpen() {
    setPending(currentFilters);
    setIsOpen(true);
  }

  function handleApply() {
    setMultiple(pending);
    setIsOpen(false);
  }

  function handleClear() {
    setPending({});
    clearAll();
    setIsOpen(false);
  }

  const sizes = filterOptions.sizes.map((s) => ({ label: s, value: s }));
  const colors = filterOptions.colors.map((c) => ({ label: c, value: c }));
  const tags = filterOptions.tags.map((t) => ({ label: t, value: t }));
  const hasPrice = defaultMax > defaultMin;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? handleOpen() : setIsOpen(false))}
    >
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <SlidersHorizontal className="mr-1.5 h-4 w-4" />
        Filter{activeCount > 0 ? ` (${activeCount})` : ""}
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-1">
          {sizes.length > 0 && (
            <FilterGroup
              title="Size"
              options={sizes}
              selected={pending.size ?? []}
              onChange={(values) =>
                setPending((p) => ({
                  ...p,
                  size: values.length ? values : undefined,
                }))
              }
              defaultOpen={false}
            />
          )}
          {colors.length > 0 && (
            <FilterGroup
              title="Color"
              options={colors}
              selected={pending.color ?? []}
              onChange={(values) =>
                setPending((p) => ({
                  ...p,
                  color: values.length ? values : undefined,
                }))
              }
              defaultOpen={false}
            />
          )}
          {tags.length > 0 && (
            <FilterGroup
              title="Tags"
              options={tags}
              selected={pending.tag ?? []}
              onChange={(values) =>
                setPending((p) => ({
                  ...p,
                  tag: values.length ? values : undefined,
                }))
              }
              defaultOpen={false}
            />
          )}

          {hasPrice && (
            <div className="py-3">
              <p className="mb-3 text-sm font-medium">Price Range</p>
              <Slider
                aria-label="Price range"
                min={defaultMin}
                max={defaultMax}
                step={Math.max(1, Math.floor((defaultMax - defaultMin) / 100))}
                value={[
                  pending.minPrice ?? defaultMin,
                  pending.maxPrice ?? defaultMax,
                ]}
                onValueChange={(v) => {
                  if (Array.isArray(v)) {
                    const [min, max] = v as number[];
                    setPending((p) => ({ ...p, minPrice: min, maxPrice: max }));
                  }
                }}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(pending.minPrice ?? defaultMin)}</span>
                <span>{formatCurrency(pending.maxPrice ?? defaultMax)}</span>
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2.5 py-3 text-sm">
            <input
              type="checkbox"
              checked={pending.available ?? false}
              onChange={(e) =>
                setPending((p) => ({
                  ...p,
                  available: e.target.checked || undefined,
                }))
              }
              className="h-4 w-4 rounded border-border accent-primary"
            />
            In Stock Only
          </label>
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Clear All
          </Button>
          <Button onClick={handleApply} className="flex-1">
            {totalResults != null
              ? `Show ${totalResults} Results`
              : "Apply Filters"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
