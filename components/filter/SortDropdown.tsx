"use client";

import { useFilters } from "@/hooks/useFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterState, SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-sellers", label: "Best Sellers" },
  { value: "name-asc", label: "Name: A–Z" },
];

interface SortDropdownProps {
  currentFilters: FilterState;
}

export default function SortDropdown({ currentFilters }: SortDropdownProps) {
  const { setSort } = useFilters(currentFilters);
  const value = currentFilters.sort ?? "newest";

  return (
    <Select
      value={value}
      onValueChange={(v) => v && setSort(v as SortOption)}
    >
      <SelectTrigger className="w-[180px]" aria-label="Sort products">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
