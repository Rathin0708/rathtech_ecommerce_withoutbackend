"use client";

import { useEffect, useRef, useState } from "react";
import ProductVariantSelector from "@/components/product/ProductVariantSelector";
import QuantitySelector from "@/components/product/QuantitySelector";
import AddToCartButton from "@/components/product/AddToCartButton";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product, ProductVariantData } from "@/sanity/lib/fetch";

interface ProductActionsProps {
  product: Product;
  storeNumber: string;
}

export default function ProductActions({
  product,
  storeNumber,
}: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStickyVisible(!entry!.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasVariants =
    product.variants != null && product.variants.length > 0;

  return (
    <>
      {/* Variant selector */}
      {hasVariants && product.variants && (
        <div className="mt-4">
          <ProductVariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onChange={setSelectedVariant}
          />
        </div>
      )}

      {/* Quantity + CTA buttons */}
      <div ref={ctaRef} className="mt-5 space-y-3">
        {product.inStock && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Qty
            </span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              disabled={!product.inStock}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {product.inStock ? (
            <>
              <AddToCartButton
                productId={product._id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                inStock={product.inStock}
                variant={selectedVariant}
                quantity={quantity}
                className="flex-1"
                size="lg"
              />
              <WhatsAppButton
                product={product}
                variant={selectedVariant}
                quantity={quantity}
                storeNumber={storeNumber}
                className="flex-1"
                size="lg"
              />
            </>
          ) : (
            <Button
              variant="outline"
              size="lg"
              disabled
              className="flex-1 cursor-not-allowed"
            >
              Out of Stock — Notify Me
            </Button>
          )}
        </div>
      </div>

      {/* Sticky mobile CTA bar */}
      {isStickyVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-sm items-center gap-2">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              disabled={!product.inStock}
            />
            {product.inStock ? (
              <WhatsAppButton
                product={product}
                variant={selectedVariant}
                quantity={quantity}
                storeNumber={storeNumber}
                className="flex-1"
                size="default"
              />
            ) : (
              <Button
                variant="outline"
                size="default"
                disabled
                className="flex-1"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
