"use client";

import { useCallback, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppFallbackModal from "@/components/whatsapp/WhatsAppFallbackModal";
import {
  buildWhatsAppUrl,
  generateSingleProductMessage,
} from "@/lib/generateWhatsAppMessage";
import { cn } from "@/lib/utils";
import type { VariantForMessage, ProductForMessage } from "@/lib/generateWhatsAppMessage";

interface WhatsAppButtonProps {
  product: ProductForMessage & { name: string };
  variant: VariantForMessage | null;
  quantity: number;
  storeNumber: string;
  className?: string;
  size?: "default" | "sm" | "lg";
  label?: string;
}

export default function WhatsAppButton({
  product,
  variant,
  quantity,
  storeNumber,
  className,
  size = "default",
  label = "Order via WhatsApp",
}: WhatsAppButtonProps) {
  const [showFallback, setShowFallback] = useState(false);
  const message = generateSingleProductMessage(product, variant, quantity);
  const waUrl = buildWhatsAppUrl(storeNumber, message);

  const handleClick = useCallback(() => {
    const popup = window.open(waUrl, "_blank");
    if (!popup) {
      setShowFallback(true);
      return;
    }
    const timer = setTimeout(() => {
      if (!document.hidden) setShowFallback(true);
    }, 2000);
    window.addEventListener("blur", () => clearTimeout(timer), { once: true });
  }, [waUrl]);

  return (
    <>
      <Button
        onClick={handleClick}
        className={cn(
          "gap-2 bg-[#25D366] text-white hover:bg-[#1ebe57] focus-visible:ring-[#25D366]/50",
          className
        )}
        size={size}
        aria-label={`Order ${product.name} via WhatsApp`}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </Button>
      <WhatsAppFallbackModal
        message={message}
        phoneNumber={storeNumber}
        isOpen={showFallback}
        onClose={() => setShowFallback(false)}
      />
    </>
  );
}
