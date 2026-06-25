import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  fetchCategoryBySlug,
  fetchCategoryStaticPaths,
  fetchFilterOptions,
  fetchProducts,
} from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SanityImage from "@/components/shared/SanityImage";
import ProductGrid from "@/components/product/ProductGrid";
import SortDropdown from "@/components/filter/SortDropdown";
import FilterSidebar from "@/components/filter/FilterSidebar";
import FilterSheet from "@/components/filter/FilterSheet";
import ActiveFilters from "@/components/filter/ActiveFilters";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import StructuredData from "@/components/shared/StructuredData";
import { getCategoryUrl } from "@/lib/getCategoryUrl";
import type { FilterState, SortOption } from "@/types";

const PAGE_SIZE = 24;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  const paths = await fetchCategoryStaticPaths();
  return paths.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  const title = category.seo?.metaTitle ?? category.name;
  const ogImageUrl = category.heroImage
    ? urlForImage(
        category.heroImage as Parameters<typeof urlForImage>[0],
        1200,
        630
      )
    : undefined;

  const canonicalUrl = `${siteUrl}/categories/${slug}`;

  return {
    title,
    description: category.seo?.metaDescription ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description: category.seo?.metaDescription ?? undefined,
      url: canonicalUrl,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630 }]
        : [],
    },
    twitter: { card: "summary_large_image", title },
    robots: category.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  function s(key: string) {
    const v = sp[key];
    return typeof v === "string" ? v : "";
  }
  function arr(key: string): string[] {
    const v = sp[key];
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v) return [v];
    return [];
  }

  const sort = (s("sort") || "newest") as SortOption;
  const page = Math.max(1, parseInt(s("page") || "1", 10));
  const minPrice = s("minPrice") ? Number(s("minPrice")) : undefined;
  const maxPrice = s("maxPrice") ? Number(s("maxPrice")) : undefined;
  const available = s("available") === "true";
  const size = arr("size");
  const color = arr("color");
  const tag = arr("tag");

  const [category, filterOptions] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchFilterOptions(slug),
  ]);

  if (!category) notFound();

  const { products, total } = await fetchProducts({
    category: slug,
    tag: tag[0] ?? "",
    inStock: available,
    minPrice: minPrice ?? 0,
    maxPrice: maxPrice ?? 9_999_999,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentFilters: FilterState = {
    category: [slug],
    size,
    color,
    tag,
    minPrice,
    maxPrice,
    available,
    sort,
    page,
  };

  const hasActiveFilters =
    size.length > 0 || color.length > 0 || tag.length > 0 || available;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${siteUrl}/categories/${slug}`,
      },
    ],
  };

  return (
    <>
      <StructuredData data={breadcrumbData} />

      {/* Hero */}
      {category.heroImage && (
        <div className="relative h-48 overflow-hidden sm:h-64">
          <SanityImage
            image={category.heroImage}
            alt={category.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {category.name}
            </h1>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            ...(category.parent
              ? [
                  {
                    label: category.parent.name,
                    href: getCategoryUrl(category.parent.slug),
                  },
                ]
              : []),
            { label: category.name },
          ]}
        />

        {/* Category title (if no hero) */}
        {!category.heroImage && (
          <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
            {category.name}
          </h1>
        )}

        {/* Sub-categories */}
        {category.children && category.children.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child._id}
                href={getCategoryUrl(child.slug)}
                className="rounded-full border bg-muted px-4 py-1.5 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filterOptions={filterOptions}
              currentFilters={currentFilters}
            />
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1">
            {/* Controls */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {total} {total === 1 ? "product" : "products"}
                </p>
                <div className="lg:hidden">
                  <FilterSheet
                    filterOptions={filterOptions}
                    currentFilters={currentFilters}
                    totalResults={total}
                  />
                </div>
              </div>
              <SortDropdown currentFilters={currentFilters} />
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
              <div className="mb-4">
                <ActiveFilters currentFilters={currentFilters} />
              </div>
            )}

            {/* Grid */}
            {products.length > 0 ? (
              <>
                <ProductGrid products={products} priority />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      currentFilters={currentFilters}
                      basePath={`/categories/${slug}`}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No products in this category"
                description="Try adjusting your filters or browse other categories."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
