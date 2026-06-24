import { client } from './client'
import {
  HOMEPAGE_QUERY,
  SITE_SETTINGS_QUERY,
  PRODUCTS_QUERY,
  PRODUCTS_COUNT_QUERY,
  PRODUCT_STATIC_PATHS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_STATIC_PATHS_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  FILTER_OPTIONS_QUERY,
  SEARCH_SUGGESTIONS_QUERY,
  SEARCH_RESULTS_QUERY,
  SEARCH_RESULTS_COUNT_QUERY,
  STATIC_PAGE_SLUGS_QUERY,
  STATIC_PAGE_BY_SLUG_QUERY,
} from './queries'
import type { SortOption } from '@/types'

// ─── Shared types ─────────────────────────────────────────────────────────────
// These are minimal types used until `sanity typegen` generates the full set.

export interface SanityImageData {
  alt: string
  caption?: string | null
  asset: unknown
  lqip?: string | null
}

export interface ProductCard {
  _id: string
  name: string
  slug: string
  price: number
  salePrice?: number | null
  badge?: string | null
  inStock: boolean
  shortDescription?: string | null
  image?: SanityImageData | null
  categoryName?: string | null
  categorySlug?: string | null
}

export interface ProductVariantData {
  label: string
  value: string
  priceModifier?: number | null
  inStock: boolean
  sku?: string | null
  image?: SanityImageData | null
}

export interface CategoryRef {
  _id: string
  name: string
  slug: string
  parentName?: string | null
  parentSlug?: string | null
}

export interface Product {
  _id: string
  name: string
  slug: string
  price: number
  salePrice?: number | null
  badge?: string | null
  inStock: boolean
  shortDescription?: string | null
  sku?: string | null
  weight?: number | null
  publishedAt?: string | null
  tags?: string[] | null
  description?: unknown[] | null
  images: SanityImageData[]
  variants?: ProductVariantData[] | null
  categories: CategoryRef[]
  relatedProducts?: ProductCard[] | null
  seo?: SeoData | null
}

export interface SeoData {
  metaTitle?: string | null
  metaDescription?: string | null
  noIndex?: boolean | null
  ogImage?: SanityImageData | null
}

export interface Category {
  _id: string
  name: string
  slug: string
  order?: number | null
  parent?: { _id: string; name: string; slug: string } | null
  image?: SanityImageData | null
}

export interface CategoryDetail extends Category {
  description?: unknown[] | null
  heroImage?: SanityImageData | null
  children?: { _id: string; name: string; slug: string }[] | null
  seo?: SeoData | null
}

export interface StaticPage {
  _id: string
  title: string
  slug: string
  body: unknown[]
  seo?: SeoData | null
}

export interface FilterOptions {
  sizes: string[]
  colors: string[]
  tags: string[]
  minPrice?: number | null
  maxPrice?: number | null
}

export interface SiteSettings {
  storeName: string
  tagline?: string | null
  whatsappNumber: string
  currency: string
  currencySymbol: string
  announcementBar?: {
    isVisible: boolean
    text?: string | null
    linkText?: string | null
    linkUrl?: string | null
  } | null
  logo?: SanityImageData | null
  primaryNav?: NavItem[] | null
  footerNav?: FooterGroup[] | null
  socialLinks?: {
    instagram?: string | null
    facebook?: string | null
    twitter?: string | null
    youtube?: string | null
  } | null
  uspItems?: UspItemData[] | null
  defaultSeo?: SeoData | null
}

export interface NavItem {
  label: string
  url?: string | null
  children?: { label: string; url: string }[] | null
  featuredImage?: SanityImageData | null
  featuredImageLink?: string | null
}

export interface FooterGroup {
  groupTitle?: string | null
  links?: { label: string; url: string }[] | null
}

export interface UspItemData {
  iconName: string
  title: string
  subtitle?: string | null
}

export interface HeroBannerData {
  headline: string
  subheadline?: string | null
  textColorScheme?: 'light' | 'dark' | null
  cta?: { label: string; url: string; variant?: string | null } | null
  desktopImage: SanityImageData
  mobileImage?: SanityImageData | null
}

export interface HomepageData {
  page?: {
    heroSlides?: HeroBannerData[] | null
    featuredProductsTitle?: string | null
    featuredProducts?: ProductCard[] | null
    featuredCategories?: {
      _id: string
      name: string
      slug: string
      image?: SanityImageData | null
    }[] | null
    promoBanner?: HeroBannerData | null
    secondaryProductsTitle?: string | null
    secondaryProducts?: ProductCard[] | null
    testimonials?: TestimonialData[] | null
    uspItems?: UspItemData[] | null
    showWhatsAppCta?: boolean | null
  } | null
  settings?: {
    storeName: string
    tagline?: string | null
    whatsappNumber: string
    announcementBar?: SiteSettings['announcementBar']
    uspItems?: UspItemData[] | null
  } | null
}

export interface TestimonialData {
  quote: string
  customerName: string
  rating: number
  avatar?: SanityImageData | null
}

// ─── Fetch functions ──────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, {
    next: { revalidate: 3600, tags: ['site'] },
  })
}

export async function fetchHomepage(): Promise<HomepageData> {
  return client.fetch<HomepageData>(HOMEPAGE_QUERY, {}, {
    next: { revalidate: 60, tags: ['homepage', 'products', 'categories'] },
  })
}

export interface ProductQueryParams {
  category?: string
  tag?: string
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
  page?: number
  pageSize?: number
}

export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<{ products: ProductCard[]; total: number }> {
  const {
    category = '',
    tag = '',
    inStock = false,
    minPrice = 0,
    maxPrice = 9_999_999,
    sort = 'newest',
    page = 1,
    pageSize = 24,
  } = params

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  const tagFilter = tag  // renamed to avoid collision with Sanity client reserved 'tag' param

  const [products, total] = await Promise.all([
    client.fetch<ProductCard[]>(
      PRODUCTS_QUERY,
      { category, tagFilter, inStock, minPrice, maxPrice, sort, start, end },
      { next: { revalidate: 60, tags: ['products'] } }
    ),
    client.fetch<number>(
      PRODUCTS_COUNT_QUERY,
      { category, tagFilter, inStock, minPrice, maxPrice },
      { next: { revalidate: 60, tags: ['products'] } }
    ),
  ])

  return { products, total }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch<Product | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 30, tags: [`product-${slug}`, 'products'] } }
  )
}

export async function fetchProductStaticPaths(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(
    PRODUCT_STATIC_PATHS_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['products'] } }
  )
}

export async function fetchCategories(): Promise<Category[]> {
  return client.fetch<Category[]>(CATEGORIES_QUERY, {}, {
    next: { revalidate: 3600, tags: ['categories'] },
  })
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
  return client.fetch<CategoryDetail | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 60, tags: [`category-${slug}`, 'categories'] } }
  )
}

export async function fetchCategoryStaticPaths(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(
    CATEGORY_STATIC_PATHS_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['categories'] } }
  )
}

export async function fetchFilterOptions(category = ''): Promise<FilterOptions> {
  const raw = await client.fetch<{
    sizes: (string | null)[]
    colors: (string | null)[]
    tags: (string | null)[]
    minPrice?: number | null
    maxPrice?: number | null
  }>(
    FILTER_OPTIONS_QUERY,
    { category },
    { next: { revalidate: 60, tags: ['products'] } }
  )

  return {
    sizes: [...new Set(raw.sizes.filter(Boolean) as string[])].sort(),
    colors: [...new Set(raw.colors.filter(Boolean) as string[])].sort(),
    tags: [...new Set(raw.tags.filter(Boolean) as string[])].sort(),
    minPrice: raw.minPrice ?? 0,
    maxPrice: raw.maxPrice ?? 9_999_999,
  }
}

export async function fetchSearchSuggestions(searchQuery: string): Promise<ProductCard[]> {
  if (!searchQuery || searchQuery.trim().length < 2) return []
  return client.fetch<ProductCard[]>(
    SEARCH_SUGGESTIONS_QUERY,
    { searchTerm: searchQuery.trim() },
    { next: { revalidate: 0 } }
  )
}

export async function fetchSearchResults(
  searchQuery: string,
  page = 1,
  pageSize = 24
): Promise<{ products: ProductCard[]; total: number }> {
  if (!searchQuery || searchQuery.trim().length < 2) return { products: [], total: 0 }

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  const searchTerm = searchQuery.trim()

  const [products, total] = await Promise.all([
    client.fetch<ProductCard[]>(
      SEARCH_RESULTS_QUERY,
      { searchTerm, start, end },
      { next: { revalidate: 0 } }
    ),
    client.fetch<number>(
      SEARCH_RESULTS_COUNT_QUERY,
      { searchTerm },
      { next: { revalidate: 0 } }
    ),
  ])

  return { products, total }
}

export async function fetchStaticPage(slug: string): Promise<StaticPage | null> {
  return client.fetch<StaticPage | null>(
    STATIC_PAGE_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 300, tags: [`page-${slug}`, 'pages'] } }
  )
}

export async function fetchStaticPageSlugs(): Promise<{ slug: string }[]> {
  return client.fetch<{ slug: string }[]>(
    STATIC_PAGE_SLUGS_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['pages'] } }
  )
}
