"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import QuantitySelector from "@/components/product/QuantitySelector";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductUrl } from "@/lib/getProductUrl";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const unitPrice = item.salePrice ?? item.price;
  const lineTotal = unitPrice * item.quantity;

  const variantText = item.variant
    ? item.variant.label && item.variant.value
      ? `${item.variant.label}: ${item.variant.value}`
      : [item.variant.size, item.variant.color].filter(Boolean).join(" · ")
    : null;

  return (
    <div className="flex items-start gap-3 py-4">
      {/* Image */}
      <Link
        href={getProductUrl(item.slug)}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
        tabIndex={-1}
        aria-hidden
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl text-muted-foreground">
            📦
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link
          href={getProductUrl(item.slug)}
          className="truncate text-sm font-medium transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
        {variantText && (
          <p className="text-xs text-muted-foreground">{variantText}</p>
        )}
        <div className="flex items-center gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={onUpdateQuantity}
            min={1}
            max={99}
          />
          <span className="ml-auto text-sm font-semibold tabular-nums">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        aria-label={`Remove ${item.name} from cart`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
