import type { Metadata } from "next";
import Link from "next/link";
import { fetchHomepage, fetchSiteSettings } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import HeroSection from "@/components/home/HeroSection";
import CategoryChips from "@/components/home/CategoryChips";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import UspBar from "@/components/home/UspBar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import StructuredData from "@/components/shared/StructuredData";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  let storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Store";
  let tagline = "Shop the latest collection";
  let ogImageUrl: string | undefined;

  try {
    const settings = await fetchSiteSettings();
    if (settings?.storeName) storeName = settings.storeName;
    if (settings?.tagline) tagline = settings.tagline;
    if (settings?.defaultSeo?.ogImage) {
      ogImageUrl = urlForImage(
        settings.defaultSeo.ogImage as Parameters<typeof urlForImage>[0],
        1200,
        630
      );
    }
  } catch {
    // Sanity not configured
  }

  const title = `${storeName} — ${tagline}`;

  return {
    title,
    description: tagline,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description: tagline,
      url: siteUrl,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: storeName }]
        : [],
    },
    twitter: { card: "summary_large_image", title, description: tagline },
  };
}

export default async function HomePage() {
  let data = null;
  try {
    data = await fetchHomepage();
  } catch {
    // Sanity not configured — show placeholder
  }

  const page = data?.page;
  const settings = data?.settings;

  // Merge USP items: prefer homepage-level override, fall back to settings
  const uspItems = page?.uspItems?.length
    ? page.uspItems
    : settings?.uspItems ?? [];

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: settings?.storeName ?? (process.env.NEXT_PUBLIC_STORE_NAME ?? "Store"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <StructuredData data={websiteStructuredData} />

      {/* Hero */}
      {page?.heroSlides && page.heroSlides.length > 0 && (
        <HeroSection slides={page.heroSlides} />
      )}

      {/* USP bar — high up so first-time visitors see trust signals */}
      {uspItems.length > 0 && <UspBar items={uspItems} />}

      {/* Featured categories */}
      {page?.featuredCategories && page.featuredCategories.length > 0 && (
        <CategoryChips categories={page.featuredCategories} />
      )}

      {/* Featured products (New Arrivals etc.) */}
      {page?.featuredProducts && page.featuredProducts.length > 0 && (
        <FeaturedProducts
          title={page.featuredProductsTitle}
          products={page.featuredProducts}
        />
      )}

      {/* Promo banner */}
      {page?.promoBanner?.headline && (
        <PromoBanner banner={page.promoBanner} />
      )}

      {/* Secondary products (Best Sellers etc.) */}
      {page?.secondaryProducts && page.secondaryProducts.length > 0 && (
        <FeaturedProducts
          title={page.secondaryProductsTitle}
          products={page.secondaryProducts}
          viewAllHref="/products?sort=best-sellers"
        />
      )}

      {/* Testimonials */}
      {page?.testimonials && page.testimonials.length > 0 && (
        <TestimonialsSection testimonials={page.testimonials} />
      )}

      {/* Fallback when Sanity is not yet configured */}
      {!page && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-bold">Welcome to your store</h1>
          <p className="text-muted-foreground max-w-sm">
            Add your Sanity credentials to <code className="text-xs bg-muted px-1 py-0.5 rounded">.env.local</code> and
            create your Homepage document in Sanity Studio to get started.
          </p>
          <Link href="/studio" className="text-primary underline text-sm hover:no-underline">
            Open Sanity Studio →
          </Link>
        </div>
      )}
    </>
  );
}
