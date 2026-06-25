"use client";

import { useCallback, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WhatsAppFallbackModal from "@/components/whatsapp/WhatsAppFallbackModal";
import {
  buildWhatsAppUrl,
  generateCartMessage,
} from "@/lib/generateWhatsAppMessage";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface WhatsAppCheckoutButtonProps {
  cart: CartItem[];
  storeNumber: string;
  notes?: string;
  className?: string;
}

function openWhatsApp(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function WhatsAppCheckoutButton({
  cart,
  storeNumber,
  notes,
  className,
}: WhatsAppCheckoutButtonProps) {
  const [showFallback, setShowFallback] = useState(false);

  const handleClick = useCallback(() => {
    if (cart.length === 0) return;

    if (!storeNumber) {
      setShowFallback(true);
      return;
    }

    const message = generateCartMessage(cart, notes);
    const waUrl = buildWhatsAppUrl(storeNumber, message);
    openWhatsApp(waUrl);

    toast.success("Your order has been sent!", {
      description: "Await confirmation from our team via WhatsApp.",
      action: { label: "Continue Shopping", onClick: () => {} },
      duration: 5000,
    });
  }, [cart, storeNumber, notes]);

  const message = generateCartMessage(cart, notes);

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={cart.length === 0}
        className={cn(
          "w-full gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57] focus-visible:ring-[#25D366]/50",
          className
        )}
        size="lg"
        aria-label="Checkout via WhatsApp"
      >
        <ShoppingBag className="h-4 w-4" />
        Checkout via WhatsApp
      </Button>
      {cart.length > 0 && (
        <WhatsAppFallbackModal
          message={message}
          phoneNumber={storeNumber}
          isOpen={showFallback}
          onClose={() => setShowFallback(false)}
        />
      )}
    </>
  );
}
