"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import WhatsAppCheckoutButton from "@/components/whatsapp/WhatsAppCheckoutButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartDrawerProps {
  storeNumber: string;
}

export default function CartDrawer({ storeNumber }: CartDrawerProps) {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());
  const [notes, setNotes] = useState("");

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>
            Your Cart{totalItems > 0 ? ` (${totalItems})` : ""}
          </SheetTitle>
        </SheetHeader>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length > 0 ? (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem
                  key={`${item.id}::${JSON.stringify(item.variant)}`}
                  item={item}
                  onRemove={() => removeItem(item.id, item.variant)}
                  onUpdateQuantity={(qty) =>
                    updateQuantity(item.id, qty, item.variant)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Your cart is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add some products to get started.
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="text-sm font-medium text-primary hover:underline"
              >
                Browse Products →
              </Link>
            </div>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <div className="border-t px-4 py-4 space-y-3">
            <CartSummary
              subtotal={subtotal}
              notes={notes}
              onNotesChange={setNotes}
            />
            <WhatsAppCheckoutButton
              cart={items}
              storeNumber={storeNumber}
              notes={notes}
            />
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/cart"
                onClick={closeCart}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                View full cart →
              </Link>
              <button
                onClick={closeCart}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
