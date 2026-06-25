import { formatCurrency } from "@/lib/formatCurrency";
import type { CartItem } from "@/types";

export interface ProductForMessage {
  name: string;
  price: number;
  salePrice?: number | null;
}

export interface VariantForMessage {
  label: string;
  value: string;
  priceModifier?: number | null;
}

export function generateSingleProductMessage(
  product: ProductForMessage,
  variant: VariantForMessage | null,
  quantity: number
): string {
  const basePrice = product.salePrice ?? product.price;
  const finalPrice = variant?.priceModifier
    ? basePrice + variant.priceModifier
    : basePrice;

  const lines: string[] = [
    `Hi! I'd like to order:`,
    ``,
    `📦 *${product.name}*`,
  ];

  if (variant) {
    lines.push(`   ${variant.label}: ${variant.value}`);
  }
  lines.push(`   Qty: ${quantity}`);
  lines.push(
    `   Price: ${formatCurrency(finalPrice)} × ${quantity} = ${formatCurrency(finalPrice * quantity)}`
  );
  lines.push(``);
  lines.push(`Please confirm availability and delivery details. Thank you!`);

  return lines.join("\n");
}

export function generateCartMessage(items: CartItem[], notes?: string): string {
  const lines: string[] = [
    `Hi! I'd like to place an order:`,
    ``,
    `🛒 *Order Summary*`,
    `─────────────────`,
  ];

  let subtotal = 0;

  for (const item of items) {
    const unitPrice = item.salePrice ?? item.price;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    lines.push(``);
    lines.push(`📦 *${item.name}*`);

    if (item.variant) {
      const variantParts: string[] = [];
      if (item.variant.label && item.variant.value) {
        variantParts.push(`${item.variant.label}: ${item.variant.value}`);
      } else {
        if (item.variant.size) variantParts.push(`Size: ${item.variant.size}`);
        if (item.variant.color) variantParts.push(`Color: ${item.variant.color}`);
      }
      if (variantParts.length > 0) {
        lines.push(`   ${variantParts.join(" | ")}`);
      }
    }

    lines.push(
      `   Qty: ${item.quantity} × ${formatCurrency(unitPrice)} = ${formatCurrency(lineTotal)}`
    );
  }

  lines.push(``);
  lines.push(`─────────────────`);
  lines.push(`💰 *Subtotal: ${formatCurrency(subtotal)}*`);

  if (notes?.trim()) {
    lines.push(``);
    lines.push(`📝 *Notes:* ${notes.trim()}`);
  }

  lines.push(``);
  lines.push(`Please confirm availability and delivery details. Thank you!`);

  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
