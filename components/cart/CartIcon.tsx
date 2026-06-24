"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export default function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useUIStore((s) => s.openCart);

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted transition-colors"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span
          aria-hidden
          className="absolute right-1.5 top-1.5 flex h-4 w-4 animate-[scale-in_0.15s_ease] items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-primary-foreground"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
