"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import SanityImage from "@/components/shared/SanityImage";
import type { TestimonialData } from "@/sanity/lib/fetch";

interface TestimonialsSectionProps {
  testimonials: TestimonialData[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
          )}
        />
      ))}
    </span>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      <StarRating rating={testimonial.rating} />
      <p className="flex-1 text-sm leading-relaxed text-foreground/80">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {testimonial.avatar ? (
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
            <SanityImage
              image={testimonial.avatar}
              alt={testimonial.customerName}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {testimonial.customerName.charAt(0)}
          </div>
        )}
        <p className="text-sm font-medium">{testimonial.customerName}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  function prev() {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }
  function next() {
    setCurrent((c) => (c + 1) % testimonials.length);
  }

  return (
    <section aria-label="Customer testimonials" className="py-10 sm:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
          What Our Customers Say
        </h2>

        {/* Mobile: single card carousel */}
        <div className="sm:hidden">
          <TestimonialCard testimonial={testimonials[current]} />
          {testimonials.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">
                {current + 1} / {testimonials.length}
              </span>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: grid */}
        <div className="hidden grid-cols-3 gap-4 sm:grid">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
