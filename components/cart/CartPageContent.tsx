"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import WhatsAppCheckoutButton from "@/components/whatsapp/WhatsAppCheckoutButton";
import Breadcrumb from "@/components/layout/Breadcrumb";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartPageContentProps {
  storeNumber: string;
}

export default function CartPageContent({ storeNumber }: CartPageContentProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const [notes, setNotes] = useState("");

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold sm:text-3xl">Your Cart</h1>
        {items.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-destructive"
                />
              }
            >
              <Trash2 className="h-4 w-4" />
              Clear cart
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  All {items.length} {items.length === 1 ? "item" : "items"}{" "}
                  will be removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearCart}
                  variant="destructive"
                >
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse our products and add something you love."
          action={
            <Link
              href="/products"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Browse Products
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div>
            <div className="divide-y rounded-xl border bg-card px-4">
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
            <p className="mt-3 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          {/* Order summary */}
          <div className="space-y-4 rounded-xl border bg-card p-4 h-fit">
            <h2 className="text-base font-semibold">Order Summary</h2>
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
            <Link
              href="/products"
              className="block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
