import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchProductBySlug,
  fetchProductStaticPaths,
  fetchSiteSettings,
} from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPrice from "@/components/product/ProductPrice";
import ProductBadge from "@/components/product/ProductBadge";
import ProductActions from "@/components/product/ProductActions";
import RelatedProducts from "@/components/product/RelatedProducts";
import StructuredData from "@/components/shared/StructuredData";
import { PortableText } from "@portabletext/react";

interface PDPProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const paths = await fetchProductStaticPaths();
  return paths.map(({ slug }) => ({ slug }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const title = product.seo?.metaTitle ?? product.name;
  const description =
    product.seo?.metaDescription ?? product.shortDescription ?? undefined;
  const ogImageSource = product.seo?.ogImage ?? product.images[0];
  const ogImageUrl = ogImageSource
    ? urlForImage(ogImageSource as Parameters<typeof urlForImage>[0], 1200, 630)
    : undefined;
  const canonicalUrl = `${siteUrl}/products/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: product.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function ProductPage({ params }: PDPProps) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    fetchProductBySlug(slug),
    fetchSiteSettings(),
  ]);

  if (!product) notFound();

  const storeNumber = settings?.whatsappNumber ?? "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? undefined,
    sku: product.sku ?? undefined,
    image: product.images.map((img) =>
      urlForImage(img as Parameters<typeof urlForImage>[0], 800)
    ),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(product.salePrice ?? product.price),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${product.slug}`,
    },
  };

  const primaryCategory = product.categories[0];

  return (
    <>
      <StructuredData data={structuredData} />

      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            ...(primaryCategory
              ? [
                  {
                    label: primaryCategory.name,
                    href: `/categories/${primaryCategory.slug}`,
                  },
                ]
              : [{ label: "Products", href: "/products" }]),
            { label: product.name },
          ]}
        />

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={product.images} />

          {/* Info */}
          <div className="flex flex-col">
            {/* Category + badge */}
            <div className="flex items-center gap-2">
              {primaryCategory && (
                <a
                  href={`/categories/${primaryCategory.slug}`}
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  {primaryCategory.name}
                </a>
              )}
              {product.badge && (
                <ProductBadge badge={product.badge} />
              )}
            </div>

            {/* Name */}
            <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
              {product.name}
            </h1>

            {/* Stock badge */}
            <p
              className={`mt-2 text-sm font-medium ${
                product.inStock
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {/* Price */}
            <ProductPrice
              price={product.price}
              salePrice={product.salePrice}
              size="lg"
              className="mt-3"
            />

            {/* Short description */}
            {product.shortDescription && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>
            )}

            {/* Interactive actions */}
            <ProductActions product={product} storeNumber={storeNumber} />

            {/* Full description */}
            {product.description && (
              <div className="mt-8 border-t pt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                  <PortableText value={product.description as Parameters<typeof PortableText>[0]["value"]} />
                </div>
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="mt-4 text-xs text-muted-foreground">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* Related products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <RelatedProducts products={product.relatedProducts} />
        )}
      </div>
    </>
  );
}
