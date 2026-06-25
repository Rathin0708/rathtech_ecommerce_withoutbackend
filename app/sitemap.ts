import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

interface SitemapEntry {
  slug: string;
  _updatedAt: string;
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cacheOptions = { next: { revalidate: 3600 } };

  const [products, categories, staticPages] = await Promise.all([
    client.fetch<SitemapEntry[]>(
      groq`*[_type == "product" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`,
      {},
      cacheOptions
    ),
    client.fetch<SitemapEntry[]>(
      groq`*[_type == "category" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`,
      {},
      cacheOptions
    ),
    client.fetch<SitemapEntry[]>(
      groq`*[_type == "staticPage" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`,
      {},
      cacheOptions
    ),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pageRoutes: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...pageRoutes,
  ];
}
