"use client";

import { useCallback, useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
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

function openWhatsApp(url: string): boolean {
  // Use a temporary anchor so rel="noopener noreferrer" is properly set
  // and the browser's popup blocker can intercept cleanly.
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return true;
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
    if (!storeNumber) {
      setShowFallback(true);
      return;
    }
    openWhatsApp(waUrl);
    toast.success("Opening WhatsApp…", {
      description: "Complete your order in the WhatsApp chat.",
      duration: 4000,
    });
  }, [waUrl, storeNumber]);

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
