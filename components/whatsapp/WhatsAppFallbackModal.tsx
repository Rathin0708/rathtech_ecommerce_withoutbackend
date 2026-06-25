"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildWhatsAppUrl } from "@/lib/generateWhatsAppMessage";

interface WhatsAppFallbackModalProps {
  message: string;
  phoneNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppFallbackModal({
  message,
  phoneNumber,
  isOpen,
  onClose,
}: WhatsAppFallbackModalProps) {
  const [copied, setCopied] = useState(false);
  const waUrl = buildWhatsAppUrl(phoneNumber, message);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order via WhatsApp</DialogTitle>
          <DialogDescription>
            Copy this message and send it to us on WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <textarea
          readOnly
          value={message}
          rows={8}
          aria-label="Order message"
          className="w-full resize-none rounded-lg border bg-muted px-3 py-2 font-mono text-sm focus:outline-none"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Message"}
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => window.open(waUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            WhatsApp Web
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
