"use client";

import { useState } from "react";
import SanityImage from "@/components/shared/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImageData } from "@/sanity/lib/fetch";

interface ProductGalleryProps {
  images: SanityImageData[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted touch-pinch-zoom">
        {activeImage ? (
          <SanityImage
            image={activeImage}
            alt={activeImage.alt ?? "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl text-muted-foreground">📦</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          role="tablist"
          aria-label="Product images"
          className="flex gap-2 overflow-x-auto scroll-smooth pb-1 snap-x"
        >
          {images.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-label={`View image ${i + 1}`}
              aria-selected={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight")
                  setActiveIndex((p) => Math.min(images.length - 1, p + 1));
                if (e.key === "ArrowLeft")
                  setActiveIndex((p) => Math.max(0, p - 1));
              }}
              className={cn(
                "relative aspect-square w-16 shrink-0 snap-start overflow-hidden rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === activeIndex
                  ? "border-foreground"
                  : "border-border hover:border-foreground/50"
              )}
            >
              <SanityImage
                image={img}
                alt={img.alt ?? `Image ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
