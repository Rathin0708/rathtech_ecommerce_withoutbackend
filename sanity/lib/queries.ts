import { groq } from 'next-sanity'

// ─── Reusable fragments ──────────────────────────────────────────────────────

const IMAGE_FIELDS = /* groq */ `
  alt,
  caption,
  asset,
  "lqip": asset->metadata.lqip
`

const SEO_FIELDS = /* groq */ `
  metaTitle,
  metaDescription,
  noIndex,
  "ogImage": ogImage{ ${IMAGE_FIELDS} }
`

export const PRODUCT_CARD_FIELDS = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  price,
  salePrice,
  badge,
  inStock,
  shortDescription,
  "image": images[0]{ ${IMAGE_FIELDS} },
  "categoryName": categories[0]->name,
  "categorySlug": categories[0]->slug.current
`

// ─── Site Settings ───────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{
    storeName,
    tagline,
    whatsappNumber,
    currency,
    currencySymbol,
    announcementBar,
    "logo": logo{ ${IMAGE_FIELDS} },
    primaryNav[]{
      label,
      url,
      children[]{ label, url },
      "featuredImage": featuredImage{ ${IMAGE_FIELDS} },
      featuredImageLink
    },
    footerNav[]{
      groupTitle,
      links[]{ label, url }
    },
    socialLinks,
    uspItems[],
    "defaultSeo": defaultSeo{ ${SEO_FIELDS} }
  }
`

// ─── Homepage ────────────────────────────────────────────────────────────────

export const HOMEPAGE_QUERY = groq`
  {
    "page": *[_type == "homePage" && _id == "singleton-homePage"][0]{
      heroSlides[]{
        headline,
        subheadline,
        textColorScheme,
        cta,
        "desktopImage": desktopImage{ ${IMAGE_FIELDS} },
        "mobileImage": mobileImage{ ${IMAGE_FIELDS} }
      },
      featuredProductsTitle,
      featuredProducts[]->{ ${PRODUCT_CARD_FIELDS} },
      featuredCategories[]->{
        _id,
        name,
        "slug": slug.current,
        "image": heroImage{ ${IMAGE_FIELDS} }
      },
      promoBanner{
        headline,
        subheadline,
        textColorScheme,
        cta,
        "desktopImage": desktopImage{ ${IMAGE_FIELDS} },
        "mobileImage": mobileImage{ ${IMAGE_FIELDS} }
      },
      secondaryProductsTitle,
      secondaryProducts[]->{ ${PRODUCT_CARD_FIELDS} },
      testimonials[]{
        quote,
        customerName,
        rating,
        "avatar": avatar{ ${IMAGE_FIELDS} }
      },
      uspItems[],
      showWhatsAppCta
    },
    "settings": *[_type == "siteSettings"][0]{
      storeName,
      tagline,
      whatsappNumber,
      announcementBar,
      uspItems[]
    }
  }
`

// ─── Products (PLP) ──────────────────────────────────────────────────────────

export const PRODUCTS_QUERY = groq`
  *[
    _type == "product"
    && ($category == "" || $category in categories[]->slug.current)
    && ($tagFilter == "" || $tagFilter in tags[])
    && ($inStock == false || inStock == true)
    && price >= $minPrice
    && price <= $maxPrice
  ] | order(
    select(
      $sort == "price-asc"    => price asc,
      $sort == "price-desc"   => price desc,
      $sort == "name-asc"     => name asc,
      $sort == "best-sellers" => isFeatured desc,
      publishedAt desc
    )
  ) [$start..$end] {
    ${PRODUCT_CARD_FIELDS}
  }
`

export const PRODUCTS_COUNT_QUERY = groq`
  count(*[
    _type == "product"
    && ($category == "" || $category in categories[]->slug.current)
    && ($tagFilter == "" || $tagFilter in tags[])
    && ($inStock == false || inStock == true)
    && price >= $minPrice
    && price <= $maxPrice
  ])
`

export const PRODUCT_STATIC_PATHS_QUERY = groq`
  *[_type == "product" && defined(slug.current)][0...200]{
    "slug": slug.current
  }
`

// ─── Product Detail (PDP) ────────────────────────────────────────────────────

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    price,
    salePrice,
    badge,
    inStock,
    shortDescription,
    sku,
    weight,
    publishedAt,
    tags[],
    description[]{
      ...,
      _type == "block" => @
    },
    images[]{
      alt,
      caption,
      asset,
      "lqip": asset->metadata.lqip
    },
    variants[]{
      label,
      value,
      priceModifier,
      inStock,
      sku,
      "image": image{ ${IMAGE_FIELDS} }
    },
    categories[]->{
      _id,
      name,
      "slug": slug.current,
      "parentName": parent->name,
      "parentSlug": parent->slug.current
    },
    relatedProducts[]->{ ${PRODUCT_CARD_FIELDS} },
    "seo": seo{ ${SEO_FIELDS} }
  }
`

// ─── Categories ──────────────────────────────────────────────────────────────

export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    order,
    "parent": parent->{ _id, name, "slug": slug.current },
    "image": heroImage{ ${IMAGE_FIELDS} }
  }
`

export const CATEGORY_STATIC_PATHS_QUERY = groq`
  *[_type == "category" && defined(slug.current)][0...200]{
    "slug": slug.current
  }
`

export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    "heroImage": heroImage{ ${IMAGE_FIELDS} },
    "parent": parent->{ _id, name, "slug": slug.current },
    "children": *[_type == "category" && parent._ref == ^._id] | order(order asc) {
      _id,
      name,
      "slug": slug.current
    },
    "seo": seo{ ${SEO_FIELDS} }
  }
`

// ─── Filter Options ──────────────────────────────────────────────────────────

export const FILTER_OPTIONS_QUERY = groq`
  {
    "sizes": *[
      _type == "product"
      && ($category == "" || $category in categories[]->slug.current)
    ].variants[label == "Size"].value,
    "colors": *[
      _type == "product"
      && ($category == "" || $category in categories[]->slug.current)
    ].variants[label == "Color"].value,
    "tags": *[
      _type == "product"
      && ($category == "" || $category in categories[]->slug.current)
    ].tags[],
    "minPrice": *[
      _type == "product"
      && ($category == "" || $category in categories[]->slug.current)
    ] | order(price asc)[0].price,
    "maxPrice": *[
      _type == "product"
      && ($category == "" || $category in categories[]->slug.current)
    ] | order(price desc)[0].price
  }
`

// ─── Search ──────────────────────────────────────────────────────────────────

export const SEARCH_SUGGESTIONS_QUERY = groq`
  *[
    _type == "product"
    && (
      name match $searchTerm + "*"
      || $searchTerm in tags[]
    )
  ] | order(_score desc, publishedAt desc) [0...5] {
    _id,
    name,
    "slug": slug.current,
    price,
    salePrice,
    "image": images[0]{ ${IMAGE_FIELDS} },
    "categoryName": categories[0]->name
  }
`

export const SEARCH_RESULTS_QUERY = groq`
  *[
    _type == "product"
    && (
      name match $searchTerm + "*"
      || $searchTerm in tags[]
      || categories[]->name match $searchTerm + "*"
    )
  ] | order(_score desc, publishedAt desc) [$start..$end] {
    ${PRODUCT_CARD_FIELDS}
  }
`

export const SEARCH_RESULTS_COUNT_QUERY = groq`
  count(*[
    _type == "product"
    && (
      name match $searchTerm + "*"
      || $searchTerm in tags[]
      || categories[]->name match $searchTerm + "*"
    )
  ])
`

// ─── Static Pages ────────────────────────────────────────────────────────────

export const STATIC_PAGE_SLUGS_QUERY = groq`
  *[_type == "staticPage" && defined(slug.current)]{
    "slug": slug.current
  }
`

export const STATIC_PAGE_BY_SLUG_QUERY = groq`
  *[_type == "staticPage" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    body,
    "seo": seo{ ${SEO_FIELDS} }
  }
`
