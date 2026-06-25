"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";
import type { FilterState } from "@/types";

interface ActiveFiltersProps {
  currentFilters: FilterState;
}

const LABEL_MAP: Partial<Record<keyof FilterState, string>> = {
  size: "Size",
  color: "Color",
  tag: "Tag",
  category: "Category",
};

export default function ActiveFilters({ currentFilters }: ActiveFiltersProps) {
  const { setFilter, clearFilter, clearAll } = useFilters(currentFilters);

  type Chip = { key: keyof FilterState; displayKey: string; value: string };
  const chips: Chip[] = [];

  (["size", "color", "tag", "category"] as const).forEach((key) => {
    const values = currentFilters[key];
    if (Array.isArray(values)) {
      values.forEach((v) =>
        chips.push({ key, displayKey: LABEL_MAP[key] ?? key, value: v })
      );
    }
  });

  if (currentFilters.available) {
    chips.push({ key: "available", displayKey: "Status", value: "In Stock" });
  }

  if (chips.length === 0) return null;

  function handleRemove(chip: Chip) {
    if (chip.key === "available") {
      clearFilter("available");
      return;
    }
    const current = currentFilters[chip.key] as string[] | undefined;
    if (!current) return;
    const next = current.filter((v) => v !== chip.value);
    if (next.length > 0) {
      setFilter(chip.key, next);
    } else {
      clearFilter(chip.key);
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Active filters"
    >
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          onClick={() => handleRemove(chip)}
          aria-label={`Remove filter: ${chip.displayKey}: ${chip.value}`}
          className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs font-medium transition-colors hover:border-destructive/30 hover:bg-destructive/10"
        >
          <span className="text-muted-foreground">{chip.displayKey}:</span>
          <span>{chip.value}</span>
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      ))}
      <Button
        variant="ghost"
        size="xs"
        onClick={clearAll}
        className="text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
