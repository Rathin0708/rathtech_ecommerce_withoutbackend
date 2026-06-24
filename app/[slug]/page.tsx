import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchStaticPage, fetchStaticPageSlugs } from "@/sanity/lib/fetch";
import PortableText from "@/components/shared/PortableText";
import type { PortableTextBlock } from "@portabletext/types";

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
    return {
      title: page.seo?.metaTitle ?? page.title,
      description: page.seo?.metaDescription ?? undefined,
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
