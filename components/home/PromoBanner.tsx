import Link from "next/link";
import { Button } from "@/components/ui/button";
import SanityImage from "@/components/shared/SanityImage";
import { cn } from "@/lib/utils";
import type { HeroBannerData } from "@/sanity/lib/fetch";

interface PromoBannerProps {
  banner: HeroBannerData;
}

export default function PromoBanner({ banner }: PromoBannerProps) {
  const isDark = banner.textColorScheme !== "dark";

  return (
    <section aria-label="Promotional banner" className="py-6 sm:py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-muted">
          {/* Background image */}
          {banner.desktopImage && (
            <div className="absolute inset-0">
              <SanityImage
                image={banner.desktopImage}
                alt=""
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

          {/* Content */}
          <div
            className={cn(
              "relative flex flex-col items-start justify-center gap-4 px-8 py-12 sm:py-16 md:max-w-[55%]",
              isDark ? "text-white" : "text-foreground"
            )}
          >
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {banner.headline}
            </h2>
            {banner.subheadline && (
              <p className="text-sm opacity-90 sm:text-base">{banner.subheadline}</p>
            )}
            {banner.cta && (
              <Button render={<Link href={banner.cta.url ?? "#"} />} size="lg">
                {banner.cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
