"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "rathtech-wishlist";

function getStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useWishlist(productId?: string) {
  // Lazy initializer: returns [] on SSR, reads localStorage on client.
  const [wishlist, setWishlist] = useState<string[]>(getStoredIds);

  const toggle = useCallback(() => {
    if (!productId) return;
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [productId]);

  return {
    isWishlisted: productId ? wishlist.includes(productId) : false,
    toggle,
    wishlist,
  };
}
