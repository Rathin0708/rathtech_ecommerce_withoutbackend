"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartVariant } from "@/types";

function variantKey(variant: CartVariant | null): string {
  return variant ? JSON.stringify(variant) : "none";
}

function itemKey(id: string, variant: CartVariant | null): string {
  return `${id}::${variantKey(variant)}`;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: CartVariant | null) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    variant?: CartVariant | null
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        const key = itemKey(incoming.id, incoming.variant);
        const existing = get().items.find(
          (i) => itemKey(i.id, i.variant) === key
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              itemKey(i.id, i.variant) === key
                ? { ...i, quantity: i.quantity + incoming.quantity }
                : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, incoming] }));
        }
      },

      removeItem: (id, variant = null) => {
        const key = itemKey(id, variant ?? null);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.id, i.variant) !== key),
        }));
      },

      updateQuantity: (id, quantity, variant = null) => {
        const key = itemKey(id, variant ?? null);
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => itemKey(i.id, i.variant) !== key),
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              itemKey(i.id, i.variant) === key ? { ...i, quantity } : i
            ),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, item) => {
          const unitPrice = item.salePrice ?? item.price;
          return sum + unitPrice * item.quantity;
        }, 0),
    }),
    {
      name: "rathtech-cart",
      version: 1,
    }
  )
);
