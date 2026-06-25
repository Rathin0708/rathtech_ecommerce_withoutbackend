import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchStaticPage, fetchStaticPageSlugs } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import PortableText from "@/components/shared/PortableText";
import type { PortableTextBlock } from "@portabletext/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await fetchStaticPageSlugs();
    return slugs;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await fetchStaticPage(slug);
    if (!page) return {};

    const title = page.seo?.metaTitle ?? page.title;
    const description = page.seo?.metaDescription ?? undefined;
    const ogImageUrl = page.seo?.ogImage
      ? urlForImage(
          page.seo.ogImage as Parameters<typeof urlForImage>[0],
          1200,
          630
        )
      : undefined;

    return {
      title,
      description,
      alternates: { canonical: `${siteUrl}/${slug}` },
      openGraph: {
        title,
        description,
        url: `${siteUrl}/${slug}`,
        images: ogImageUrl
          ? [{ url: ogImageUrl, width: 1200, height: 630 }]
          : [],
      },
      robots: page.seo?.noIndex ? { index: false } : undefined,
    };
  } catch {
    return {};
  }
}

export default async function StaticPage({ params }: PageProps) {
  const { slug } = await params;

  let page = null;
  try {
    page = await fetchStaticPage(slug);
  } catch {
    // Sanity not configured
  }

  if (!page) notFound();

  return (
    <div className="mx-auto max-w-screen-md px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{page.title}</h1>
      <PortableText value={page.body as PortableTextBlock[]} />
    </div>
  );
}
