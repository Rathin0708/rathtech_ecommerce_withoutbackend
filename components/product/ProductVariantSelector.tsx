"use client";

import { cn } from "@/lib/utils";
import type { ProductVariantData } from "@/sanity/lib/fetch";

interface ProductVariantSelectorProps {
  variants: ProductVariantData[];
  selectedVariant: ProductVariantData | null;
  onChange: (variant: ProductVariantData) => void;
}

export default function ProductVariantSelector({
  variants,
  selectedVariant,
  onChange,
}: ProductVariantSelectorProps) {
  const groups = variants.reduce<Record<string, ProductVariantData[]>>(
    (acc, v) => {
      const key = v.label;
      if (!acc[key]) acc[key] = [];
      acc[key].push(v);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([label, groupVariants]) => {
        const isColor = label.toLowerCase() === "color";
        const selectedInGroup =
          selectedVariant?.label === label ? selectedVariant : null;

        return (
          <div key={label}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-medium">{label}</span>
              {selectedInGroup && (
                <span className="text-sm text-muted-foreground">
                  {selectedInGroup.value}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {groupVariants.map((variant) => {
                const isSelected =
                  selectedVariant?.label === variant.label &&
                  selectedVariant.value === variant.value;
                const isOutOfStock = !variant.inStock;

                if (isColor) {
                  return (
                    <button
                      key={variant.value}
                      onClick={() => !isOutOfStock && onChange(variant)}
                      disabled={isOutOfStock}
                      aria-label={`${variant.label}: ${variant.value}${isOutOfStock ? " (out of stock)" : ""}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "relative h-8 w-8 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        isSelected
                          ? "scale-110 border-foreground"
                          : "border-border hover:border-foreground/50",
                        isOutOfStock && "cursor-not-allowed opacity-50"
                      )}
                      style={{ backgroundColor: variant.value.toLowerCase() }}
                    >
                      {isOutOfStock && (
                        <svg
                          className="absolute inset-0 h-full w-full rounded-full"
                          viewBox="0 0 100 100"
                          aria-hidden
                        >
                          <line
                            x1="15"
                            y1="85"
                            x2="85"
                            y2="15"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-foreground/50"
                          />
                        </svg>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={variant.value}
                    onClick={() => !isOutOfStock && onChange(variant)}
                    disabled={isOutOfStock}
                    aria-label={`${variant.label}: ${variant.value}${isOutOfStock ? " (out of stock)" : ""}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "relative min-w-[2.5rem] rounded-md border px-3 py-1.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background hover:border-foreground/50",
                      isOutOfStock && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {isOutOfStock ? <s>{variant.value}</s> : variant.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
