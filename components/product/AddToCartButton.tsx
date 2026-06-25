"use client";

import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import type { ProductVariantData } from "@/sanity/lib/fetch";
import type { CartItem } from "@/types";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  inStock: boolean;
  variant: ProductVariantData | null;
  quantity: number;
  imageUrl?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export default function AddToCartButton({
  productId,
  slug,
  name,
  price,
  salePrice,
  inStock,
  variant,
  quantity,
  imageUrl = "",
  className,
  size = "default",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  async function handleClick() {
    if (!inStock || isAdding) return;
    setIsAdding(true);

    await new Promise((r) => setTimeout(r, 250));

    const cartVariant: CartItem["variant"] = variant
      ? { label: variant.label, value: variant.value, sku: variant.sku ?? undefined }
      : null;

    const cartItem: CartItem = {
      id: productId,
      slug,
      name,
      image: imageUrl,
      price,
      salePrice: salePrice ?? null,
      quantity,
      variant: cartVariant,
    };

    addItem(cartItem);
    setIsAdding(false);

    toast.success("Added to cart", {
      description: `${name}${variant ? ` — ${variant.label}: ${variant.value}` : ""}`,
      action: { label: "View Cart", onClick: openCart },
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!inStock || isAdding}
      className={cn(className)}
      size={size}
      variant="outline"
      aria-label={`Add ${name} to cart`}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {inStock ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
