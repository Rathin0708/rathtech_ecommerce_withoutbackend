import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  salePrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProductPrice({
  price,
  salePrice,
  className,
  size = "md",
}: ProductPriceProps) {
  const hasSale = salePrice != null && salePrice < price;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {hasSale ? (
        <>
          <span
            aria-label={`Sale price: ${formatCurrency(salePrice)}`}
            className={cn(
              "font-semibold text-red-600 dark:text-red-400",
              sizeClasses[size]
            )}
          >
            {formatCurrency(salePrice)}
          </span>
          <span
            aria-label={`Original price: ${formatCurrency(price)}`}
            className={cn(
              "text-muted-foreground line-through",
              size === "lg" ? "text-base" : "text-xs"
            )}
          >
            {formatCurrency(price)}
          </span>
        </>
      ) : (
        <span
          aria-label={`Price: ${formatCurrency(price)}`}
          className={cn("font-semibold", sizeClasses[size])}
        >
          {formatCurrency(price)}
        </span>
      )}
    </div>
  );
}
