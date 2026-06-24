"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SanityImage from "@/components/shared/SanityImage";
import { Button } from "@/components/ui/button";
import type { HeroBannerData } from "@/sanity/lib/fetch";

interface HeroSectionProps {
  slides: HeroBannerData[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total]
  );

  // Auto-advance
  useEffect(() => {
    if (total <= 1 || paused) return;
    intervalRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current, paused, total, goTo]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      aria-label="Hero banner"
      className="relative overflow-hidden bg-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Image */}
      <div className="relative aspect-[16/7] w-full sm:aspect-[16/6] md:aspect-[16/5]">
        {slide.desktopImage && (
          <SanityImage
            image={slide.desktopImage}
            alt={slide.desktopImage.alt ?? slide.headline}
            fill
            sizes="100vw"
            priority={current === 0}
            className="object-cover"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Text overlay */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-12 md:px-16",
          slide.textColorScheme === "dark" ? "text-foreground" : "text-white"
        )}
      >
        <div className="max-w-lg space-y-3 sm:space-y-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {slide.headline}
          </h1>
          {slide.subheadline && (
            <p className="text-sm opacity-90 sm:text-base md:text-lg">
              {slide.subheadline}
            </p>
          )}
          {slide.cta && (
            <Button
              render={<Link href={slide.cta.url ?? "#"} />}
              size="lg"
              className="mt-2"
            >
              {slide.cta.label}
            </Button>
          )}
        </div>
      </div>

      {/* Prev / Next arrows — only if multiple slides */}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5"
            role="tablist"
            aria-label="Slides"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Slide ${i + 1} of ${total}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
