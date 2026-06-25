"use client";

import { formatCurrency } from "@/lib/formatCurrency";
import { Textarea } from "@/components/ui/textarea";

interface CartSummaryProps {
  subtotal: number;
  notes?: string;
  onNotesChange?: (value: string) => void;
}

export default function CartSummary({
  subtotal,
  notes,
  onNotesChange,
}: CartSummaryProps) {
  return (
    <div className="space-y-3">
      {/* Optional notes */}
      {onNotesChange !== undefined && (
        <div>
          <label
            htmlFor="order-notes"
            className="mb-1.5 block text-sm font-medium"
          >
            Order Notes
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <Textarea
            id="order-notes"
            placeholder="Special instructions, delivery address, etc."
            value={notes ?? ""}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            className="resize-none text-sm"
          />
        </div>
      )}

      {/* Subtotal row */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
        <span className="text-sm font-medium">Subtotal</span>
        <span className="text-base font-semibold tabular-nums">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Delivery note */}
      <p className="text-xs text-muted-foreground">
        Delivery charges will be confirmed via WhatsApp after placing your
        order.
      </p>
    </div>
  );
}
