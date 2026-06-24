# Enterprise E-Commerce Platform — Master Architecture Document

**Version:** 1.0.0  
**Date:** 2026-06-24  
**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Shadcn UI · Sanity CMS v5 · Vercel  
**Checkout Model:** WhatsApp-first (no payment gateway)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Goals](#2-business-goals)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Complete Website Sitemap](#6-complete-website-sitemap)
7. [Information Architecture](#7-information-architecture)
8. [Navigation Structure](#8-navigation-structure)
9. [Homepage Detailed Breakdown](#9-homepage-detailed-breakdown)
10. [Product Listing Page Breakdown](#10-product-listing-page-breakdown)
11. [Product Details Page Breakdown](#11-product-details-page-breakdown)
12. [Category Page Breakdown](#12-category-page-breakdown)
13. [Search System](#13-search-system)
14. [Filtering System](#14-filtering-system)
15. [Cart System](#15-cart-system)
16. [Checkout System](#16-checkout-system)
17. [WhatsApp Checkout Flow](#17-whatsapp-checkout-flow)
18. [SEO Strategy](#18-seo-strategy)
19. [Performance Strategy](#19-performance-strategy)
20. [Accessibility Strategy](#20-accessibility-strategy)
21. [Analytics Strategy](#21-analytics-strategy)
22. [CMS Architecture](#22-cms-architecture)
23. [Sanity Schema Architecture](#23-sanity-schema-architecture)
24. [Required CMS Collections](#24-required-cms-collections)
25. [Required CMS Fields](#25-required-cms-fields)
26. [Image Management Strategy](#26-image-management-strategy)
27. [Caching Strategy](#27-caching-strategy)
28. [Security Strategy](#28-security-strategy)
29. [Deployment Strategy](#29-deployment-strategy)
30. [Vercel Configuration](#30-vercel-configuration)
31. [Environment Variables](#31-environment-variables)
32. [Folder Structure](#32-folder-structure)
33. [Component Architecture](#33-component-architecture)
34. [Reusable Component List](#34-reusable-component-list)
35. [State Management Strategy](#35-state-management-strategy)
36. [API / Data Fetching Strategy](#36-api--data-fetching-strategy)
37. [Error Handling Strategy](#37-error-handling-strategy)
38. [Loading State Strategy](#38-loading-state-strategy)
39. [Future Scalability Plan](#39-future-scalability-plan)
40. [Lighthouse 100 Optimization Plan](#40-lighthouse-100-optimization-plan)
41. [Mobile Optimization Plan](#41-mobile-optimization-plan)
42. [Production Readiness Checklist](#42-production-readiness-checklist)
43. [Testing Checklist](#43-testing-checklist)
44. [Deployment Checklist](#44-deployment-checklist)
45. [Post-Deployment Maintenance Plan](#45-post-deployment-maintenance-plan)

---

## 1. Executive Summary

This document defines the complete architecture, design system, content model, and delivery strategy for a production-grade e-commerce storefront. The platform is built without a traditional backend or payment gateway. Orders are placed via a structured **WhatsApp checkout flow**, which lets small-to-medium businesses accept orders immediately without PCI compliance overhead, while the CMS-driven architecture ensures the catalog scales to tens of thousands of SKUs.

The technology choices are deliberate:

| Concern | Choice | Reason |
|---|---|---|
| Rendering | Next.js 16 App Router (RSC-first) | Zero-JS by default, streaming, partial pre-rendering |
| Styling | Tailwind CSS v4 + Shadcn UI | Utility-first with accessible, unstyled primitives |
| Content | Sanity CMS v5 | Real-time CDN, GROQ, typed schemas, image transforms |
| Hosting | Vercel | Edge network, ISR, analytics, zero-config CI/CD |
| Checkout | WhatsApp Business API deep link | No payment risk, instant merchant adoption |

The entire system runs with **zero server-side custom infrastructure**. All data comes from Sanity's hosted CDN. All deployments go through Vercel's edge network. This means near-zero operational cost and maintenance burden for the business owner.

---

## 2. Business Goals

### Primary Goals

1. **Catalog publishing speed** — A non-technical merchant can publish a new product, category, or promotional banner within 5 minutes using the Sanity Studio, with changes visible on the live site within 60 seconds via ISR revalidation.

2. **Conversion via WhatsApp** — Replace the conventional cart → payment form → confirmation funnel with a single tap that opens a pre-filled WhatsApp message. This removes all payment friction for markets where WhatsApp commerce is the default buying behavior.

3. **Lighthouse 100** — Every public-facing page must score ≥ 95 on all four Lighthouse categories (Performance, Accessibility, Best Practices, SEO) to ensure organic discoverability and perceived quality.

4. **Mobile-first revenue** — ≥ 70% of sessions are expected on mobile. Every layout decision prioritizes 375 px viewports before scaling up.

5. **Zero downtime operations** — Sanity content changes must never require a new deployment. ISR with on-demand revalidation decouples content updates from code deploys.

### Secondary Goals

6. Scale catalog from 1 product to 50,000+ SKUs without code changes.
7. Support multi-category, multi-tag, multi-variant product structures.
8. Enable seasonal promotions via CMS-controlled banners, badges, and sale prices.
9. Provide the merchant with a real-time view of what customers are ordering via WhatsApp message logs.
10. Make the codebase approachable for a single mid-level developer to maintain.

### Success Metrics

| Metric | Target |
|---|---|
| Time-to-first-byte (TTFB) | < 200 ms (edge-cached) |
| Largest Contentful Paint (LCP) | < 1.5 s on 4G mobile |
| Cumulative Layout Shift (CLS) | < 0.05 |
| Interaction to Next Paint (INP) | < 200 ms |
| WhatsApp click-through rate | > 15% of cart sessions |
| Bounce rate | < 40% |
| Organic search impressions | Month-over-month growth |

---

## 3. User Personas

### Persona A — Ayesha, Mobile Shopper (Primary)

- **Age:** 24  
- **Device:** Android mid-range phone, 4G  
- **Behavior:** Discovers products via Instagram/TikTok, taps link, browses on mobile. Expects fast load, large product images, clear pricing, and a WhatsApp button she already knows how to use.  
- **Pain points:** Slow sites, hidden shipping costs, lengthy checkout forms, payment failures.  
- **Goal:** Find the right product quickly, confirm it is in stock, and place an order in under 2 minutes.

### Persona B — Marcus, Desktop Browser (Secondary)

- **Age:** 34  
- **Device:** MacBook, Chrome, broadband  
- **Behavior:** Researches products thoroughly, compares variants, reads descriptions. More likely to share a product link with someone else before buying.  
- **Goal:** Access complete product information, navigate categories cleanly, trust the site looks professional.

### Persona C — Riya, Returning Customer

- **Age:** 29  
- **Device:** iPhone, saved WhatsApp contact  
- **Behavior:** Already bought once via WhatsApp. Returns to browse new arrivals or check if a wishlist item is back in stock. Relies on clear "New" and "Back in Stock" badges.  
- **Goal:** Find new products fast, re-order easily.

### Persona D — Farhan, Merchant / Content Editor

- **Age:** 40  
- **Device:** Desktop laptop, Sanity Studio  
- **Behavior:** Uploads product images, writes descriptions, sets prices, manages categories, enables/disables products. Not a developer.  
- **Goal:** Publish product changes in minutes without touching code or asking a developer.

### Persona E — Dev / Maintainer

- **Age:** 27  
- **Device:** Any  
- **Behavior:** Adds new page types, adjusts Sanity schemas, deploys new features, monitors Vercel analytics.  
- **Goal:** Clear folder structure, typed schemas, zero ambiguity about where things live.

---

## 4. Functional Requirements

### FR-01 · Product Catalog

| ID | Requirement |
|---|---|
| FR-01.1 | Display a product grid on category and listing pages with image, name, price, and sale badge. |
| FR-01.2 | Support product variants (size, color, material) where each variant has its own price and stock status. |
| FR-01.3 | Mark products as In Stock / Out of Stock. Out-of-stock products are visible but the WhatsApp CTA is replaced with "Notify Me". |
| FR-01.4 | Support product badges: New, Sale, Best Seller, Limited Edition — controlled from CMS. |
| FR-01.5 | Display original price struck through when a sale price is set. |
| FR-01.6 | Related products section on each product detail page. |
| FR-01.7 | Product image gallery with zoom and swipe support. |

### FR-02 · Categories & Navigation

| ID | Requirement |
|---|---|
| FR-02.1 | Hierarchical category tree (parent → child) managed entirely in Sanity. |
| FR-02.2 | Mega-menu on desktop; drawer-based navigation on mobile. |
| FR-02.3 | Breadcrumb on all category/product pages. |
| FR-02.4 | Category hero banner (image + title + subtitle) editable in CMS. |

### FR-03 · Search

| ID | Requirement |
|---|---|
| FR-03.1 | Full-text search across product name, description, category, and tags. |
| FR-03.2 | Live search suggestions as the user types (debounced, 300 ms). |
| FR-03.3 | Search results page with filtering and sorting. |
| FR-03.4 | Zero-results page with suggested products. |
| FR-03.5 | Recent searches stored in localStorage. |

### FR-04 · Filtering & Sorting

| ID | Requirement |
|---|---|
| FR-04.1 | Filter by category, price range, tags, availability, and any custom attribute. |
| FR-04.2 | Multi-select filters — a user can pick multiple colors simultaneously. |
| FR-04.3 | Sort by: Newest, Price Low→High, Price High→Low, Best Seller, Relevance. |
| FR-04.4 | Active filters displayed as removable chips above the grid. |
| FR-04.5 | Filter state persists in URL query parameters for shareability. |
| FR-04.6 | Mobile filter opens in a bottom sheet; desktop shows a left sidebar. |

### FR-05 · Cart

| ID | Requirement |
|---|---|
| FR-05.1 | Persistent cart stored in localStorage (survives page refresh). |
| FR-05.2 | Add, remove, and update quantity of items. |
| FR-05.3 | Cart icon in header shows item count badge. |
| FR-05.4 | Cart slide-over drawer accessible from any page. |
| FR-05.5 | Cart displays line-item subtotals and order total. |
| FR-05.6 | Cart supports variant selection (size, color) per line item. |

### FR-06 · WhatsApp Checkout

| ID | Requirement |
|---|---|
| FR-06.1 | "Order via WhatsApp" CTA on product detail page (single item). |
| FR-06.2 | "Checkout via WhatsApp" CTA in cart (full order summary). |
| FR-06.3 | Pre-filled WhatsApp message includes: product name(s), variant(s), quantity, price, and a request for delivery details. |
| FR-06.4 | WhatsApp phone number managed in Sanity site settings. |
| FR-06.5 | Fallback copy-to-clipboard for devices where WhatsApp deep link fails. |

### FR-07 · CMS-Controlled Pages

| ID | Requirement |
|---|---|
| FR-07.1 | Homepage sections (hero, featured products, banners, testimonials) fully editable in Sanity. |
| FR-07.2 | Static pages (About, Contact, Returns Policy, FAQ) managed as Portable Text documents in Sanity. |
| FR-07.3 | Site-wide announcement bar text and visibility controlled in Sanity. |
| FR-07.4 | Footer links and social media handles managed in Sanity. |

### FR-08 · SEO

| ID | Requirement |
|---|---|
| FR-08.1 | Every page has a unique, CMS-overridable `<title>` and `<meta name="description">`. |
| FR-08.2 | Open Graph and Twitter Card meta tags on all pages. |
| FR-08.3 | Structured data (JSON-LD) on product pages: `Product`, `BreadcrumbList`, `Organization`. |
| FR-08.4 | Auto-generated `sitemap.xml` covering all products and categories. |
| FR-08.5 | `robots.txt` with correct allow/disallow rules. |
| FR-08.6 | Canonical tags on all pages. |

---

## 5. Non-Functional Requirements

### NFR-01 · Performance

| ID | Requirement |
|---|---|
| NFR-01.1 | LCP ≤ 1.5 s on simulated 4G (Lighthouse mobile). |
| NFR-01.2 | Total Blocking Time (TBT) ≤ 150 ms. |
| NFR-01.3 | First Input Delay (FID) ≤ 100 ms. |
| NFR-01.4 | CLS ≤ 0.05. |
| NFR-01.5 | Bundle size: initial JS ≤ 150 KB gzipped. |
| NFR-01.6 | Images served via Sanity CDN with WebP/AVIF format negotiation and `srcset`. |

### NFR-02 · Scalability

| ID | Requirement |
|---|---|
| NFR-02.1 | The architecture must handle a catalog of 50,000 products without page regeneration time exceeding 60 seconds at build time. This is achieved by combining ISR (on-demand) with static generation of only the top-N most popular pages. |
| NFR-02.2 | Sanity GROQ queries must use projection to fetch only required fields (never `*`). |
| NFR-02.3 | Product list pages use cursor-based pagination, not offset pagination, to remain performant as catalog grows. |

### NFR-03 · Reliability

| ID | Requirement |
|---|---|
| NFR-03.1 | All Sanity fetches have error boundaries so a CMS outage degrades gracefully (cached content is shown). |
| NFR-03.2 | The WhatsApp link generation is pure client-side — it has no network dependency. |
| NFR-03.3 | Cart state is localStorage-only — no server state — so it works offline. |

### NFR-04 · Security

| ID | Requirement |
|---|---|
| NFR-04.1 | No secrets exposed to the client bundle. Sanity read tokens stay server-side only. |
| NFR-04.2 | Content Security Policy (CSP) headers via `next.config.ts`. |
| NFR-04.3 | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` on all responses. |
| NFR-04.4 | Sanity Studio route (`/studio`) protected by Sanity's own authentication. |

### NFR-05 · Accessibility

| ID | Requirement |
|---|---|
| NFR-05.1 | WCAG 2.1 AA compliance across all pages. |
| NFR-05.2 | Keyboard navigable: all interactive elements reachable via Tab, operable via Enter/Space. |
| NFR-05.3 | Screen reader compatible: all images have descriptive alt text; all icons have aria-label. |
| NFR-05.4 | Minimum color contrast ratio of 4.5:1 for body text, 3:1 for large text. |
| NFR-05.5 | Focus indicators visible and high-contrast. |

### NFR-06 · Maintainability

| ID | Requirement |
|---|---|
| NFR-06.1 | All Sanity schema types are generated via `sanity typegen` — no hand-written query result types. |
| NFR-06.2 | Shared UI primitives live in `components/ui/` (Shadcn), feature components in `components/features/`. |
| NFR-06.3 | No business logic in page/layout files — all logic in hooks, utilities, or server actions. |

---

## 6. Complete Website Sitemap

```
/ (Homepage)
├── /products (All Products — PLP)
│   └── /products/[slug] (Product Detail Page — PDP)
├── /categories (All Categories)
│   └── /categories/[slug] (Category Page — CLP)
│       └── /categories/[slug]/[childSlug] (Sub-category Page)
├── /search (Search Results Page)
├── /cart (Cart Page — also accessible as slide-over)
├── /about (About Us — static)
├── /contact (Contact — static with WhatsApp link)
├── /faq (FAQ — Portable Text)
├── /returns (Returns & Refund Policy — Portable Text)
├── /privacy (Privacy Policy — Portable Text)
├── /terms (Terms & Conditions — Portable Text)
├── /new-arrivals (New Arrivals — filtered PLP)
├── /sale (Sale / Clearance — filtered PLP)
├── /best-sellers (Best Sellers — filtered PLP)
├── /wishlist (Wishlist — client-side only)
└── /studio (Sanity Studio — protected)
    └── /studio/[[...tool]] (All Sanity Studio routes)

System routes (no UI):
├── /sitemap.xml (auto-generated)
├── /robots.txt (static)
└── /api/revalidate (webhook endpoint for ISR revalidation)
```

---

## 7. Information Architecture

### Content Hierarchy

```
Site
├── Site Settings (singleton)
│   ├── Store name, logo, favicon
│   ├── WhatsApp number
│   ├── Announcement bar
│   ├── Social links
│   └── Footer navigation
│
├── Navigation (singleton)
│   ├── Primary nav items
│   └── Mega-menu columns
│
├── Homepage (singleton)
│   ├── Hero section (slides or static)
│   ├── Featured categories strip
│   ├── Featured products grid
│   ├── Mid-page banner
│   ├── Testimonials
│   └── Brand strip / USP bar
│
├── Products (collection)
│   ├── Core fields (name, slug, price, description)
│   ├── Images (gallery)
│   ├── Variants (options + SKUs)
│   ├── Category references (many-to-many)
│   ├── Tags
│   └── SEO overrides
│
├── Categories (collection)
│   ├── Name, slug, description
│   ├── Hero image
│   ├── Parent category (optional — for hierarchy)
│   └── SEO overrides
│
└── Static Pages (collection)
    ├── Title, slug
    ├── Portable Text body
    └── SEO overrides
```

### URL — Content Mapping

| URL Pattern | Content Source | Rendering |
|---|---|---|
| `/` | Homepage singleton | ISR (60 s) |
| `/products` | All products, paginated | ISR (60 s) |
| `/products/[slug]` | Product document | ISR (30 s) + on-demand |
| `/categories/[slug]` | Category + products | ISR (60 s) + on-demand |
| `/search` | Client-side GROQ | CSR |
| `/[slug]` (static pages) | Static Page document | ISR (300 s) |

---

## 8. Navigation Structure

### Desktop Navigation

```
[Logo]  [Mega Menu Items...]                    [Search] [Wishlist] [Cart (n)]

Mega Menu structure per item:
┌─────────────────────────────────────────────────────┐
│  Column 1          Column 2          Column 3        │
│  Sub-cat link      Sub-cat link      Featured Image  │
│  Sub-cat link      Sub-cat link      + CTA text      │
│  View All →        View All →                        │
└─────────────────────────────────────────────────────┘
```

### Mobile Navigation (Hamburger → Drawer)

```
[Hamburger] [Logo (centered)] [Search] [Cart (n)]

Drawer (slides from left):
├── [Search bar at top]
├── Home
├── All Products
├── Categories (accordion expand)
│   ├── Category A
│   │   ├── Sub-cat 1
│   │   └── Sub-cat 2
│   └── Category B
├── New Arrivals
├── Sale
├── ──────────────
├── About
├── Contact
└── [Social icons]
```

### Sticky Header Behavior

- On scroll down: header compresses (reduces padding, hides announcement bar).
- On scroll up: full header re-appears.
- At top of page: transparent over hero if hero has background image; solid background otherwise.
- Cart icon badge updates in real time via Zustand without re-render of surrounding elements.

### Breadcrumb Pattern

All interior pages show:
```
Home > Category Name > Sub-category Name > Product Name
```
Each segment is a link except the last (current page). Rendered as `<nav aria-label="Breadcrumb">` with JSON-LD `BreadcrumbList` structured data.

---

## 9. Homepage Detailed Breakdown

### Section 1 — Announcement Bar

- **Position:** Above header, full-width.
- **Content:** Single line of text + optional link. E.g., "Free shipping on orders over ₹999 | Shop Now →"
- **CMS control:** `announcementBar` object in Site Settings singleton. Has `text`, `linkText`, `linkUrl`, `isVisible` boolean fields.
- **Behavior:** Dismissible per session (localStorage flag). Hides on dismiss, re-appears next session.
- **Design:** Brand accent color background, white text, centered. Closes with an ✕ button.

### Section 2 — Hero

- **Layout options:** Full-bleed single slide, or auto-advancing carousel (max 3 slides) — controlled by CMS `heroType` field.
- **Content per slide:** Background image (desktop + mobile variants), headline (H1), subheadline, CTA button text + URL, text color override (light/dark).
- **Image:** Sanity image asset. Desktop: 1440 × 600 px. Mobile: 390 × 500 px. Both loaded via `<picture>` with `srcset` and `sizes`.
- **Performance:** Hero image preloaded with `<link rel="preload">`. LCP candidate. Must be above the fold.
- **Accessibility:** `role="banner"`, carousel has pause-on-focus, arrows have aria-labels, dots are `<button>` with screen-reader text.

### Section 3 — Category Chips / Featured Categories

- **Layout:** Horizontal scroll strip on mobile; 4–6 column grid on desktop.
- **Content per item:** Category image (square), category name.
- **CMS control:** `featuredCategories` array in Homepage singleton — references to Category documents, reorderable.
- **Behavior:** Tapping a chip navigates to `/categories/[slug]`.

### Section 4 — Featured Products Grid

- **Title:** Editable in CMS (e.g., "New Arrivals", "Trending Now").
- **Layout:** 2-column on mobile, 4-column on desktop.
- **Content per card:** Product image (1:1 ratio), badge (if set), product name, price, sale price.
- **CMS control:** `featuredProducts` array in Homepage singleton — references to Product documents, max 8.
- **Interaction:** Card hover shows secondary image (if provided) on desktop. Tapping navigates to PDP.

### Section 5 — Mid-Page Banner (Promotional)

- **Layout:** Full-width, split layout (image left, text right) on desktop; stacked on mobile.
- **Content:** Background/foreground image, headline, body text, CTA button.
- **CMS control:** `promoBanner` object in Homepage singleton.
- **Use case:** Seasonal sale call-out, new collection launch.

### Section 6 — Secondary Product Grid (Optional)

- Same structure as Section 4. Title could be "Best Sellers" or "Sale Items."
- CMS toggle to show/hide this section.

### Section 7 — USP Bar (Trust Signals)

- **Layout:** 3–4 column icon + text strips.
- **Content examples:** "Free Delivery over ₹999", "Easy Returns", "Secure WhatsApp Checkout", "100% Authentic".
- **CMS control:** Array of `{ icon: string (icon name), title: string, subtitle: string }` in Site Settings.
- **Design:** Light gray background, centered, subtle border-top/bottom.

### Section 8 — Testimonials

- **Layout:** Carousel on mobile, 3-column grid on desktop.
- **Content per item:** Quote text, customer name, star rating (1–5), optional avatar.
- **CMS control:** `testimonials` collection referenced in Homepage.

### Section 9 — Brand Strip (Optional)

- Horizontal row of partner/brand logos. Greyscale by default, full color on hover.
- CMS control: array of `{ logo: image, name: string, url: string }`.

### Section 10 — Newsletter / WhatsApp Community CTA

- **Content:** "Join our WhatsApp community for exclusive deals" + CTA button.
- **Behavior:** Button opens WhatsApp with a pre-filled opt-in message to the store number.
- No email form (keeps stack simple and avoids GDPR complexity).

### Homepage Data Fetching

All homepage data is fetched in a single GROQ query from the server component (`app/page.tsx`). The query is tagged with `{ next: { revalidate: 60, tags: ['homepage'] } }`. On-demand revalidation is triggered when the Sanity webhook fires.

---

## 10. Product Listing Page Breakdown

### URL: `/products` and `/categories/[slug]`

### Layout

```
[Breadcrumb]
[Page Title + Product Count]

[Mobile: Filter Button (bottom sheet) | Sort Dropdown]
  ─────────────────────────────────────────────────────
[Desktop: Left Sidebar Filters] | [Product Grid]
                                 | [Pagination / Load More]
```

### Product Grid Card Anatomy

```
┌────────────────────────┐
│  [Badge: NEW / SALE]   │
│                        │
│    Product Image       │  ← 1:1 ratio, lazy-loaded
│    (hover: image 2)    │
│                        │
│  [Wishlist Icon ♡]     │
├────────────────────────┤
│  Category Tag          │
│  Product Name          │
│  ★★★★☆ (4.2) 18 rev   │  ← future-proof field, optional
│  ₹ 1,299  ~~₹ 1,799~~ │
│  [Add to Cart] or      │
│  [Out of Stock]        │
└────────────────────────┘
```

### Pagination Strategy

- Default: 24 products per page.
- Strategy: "Load More" button appends next page to existing grid (better for mobile UX than numbered pagination).
- URL: `?page=2` query param updates to allow deep-linking.
- Fallback: numbered pagination for SEO (crawlable links to all pages).

### Empty State

When no products match the current filter:
- Illustration + "No products found" message.
- "Clear all filters" CTA.
- 4 suggested products from the same parent category.

### Sort Dropdown Options

1. Newest First (default)
2. Price: Low to High
3. Price: High to Low
4. Best Sellers
5. Name: A–Z

---

## 11. Product Details Page Breakdown

### URL: `/products/[slug]`

### Layout (Desktop — 2 column)

```
[Breadcrumb]
──────────────────────────────────────────────────
[Image Gallery — 60% width] | [Product Info — 40%]
                              ├── Category tag
                              ├── Product name (H1)
                              ├── Rating summary
                              ├── Price / Sale price
                              ├── Stock status badge
                              ├── Short description
                              ├── Variant selectors (Size/Color)
                              ├── Quantity selector
                              ├── [Order via WhatsApp] (Primary CTA)
                              ├── [Add to Cart] (Secondary CTA)
                              ├── [♡ Add to Wishlist]
                              ├── USP icons (Free delivery, Returns)
                              └── Share buttons
──────────────────────────────────────────────────
[Product Description Tabs: Description | Details | Care]
──────────────────────────────────────────────────
[Related Products Grid]
```

### Layout (Mobile — single column)

Image gallery → Product info → Variant selectors → CTAs → Description → Related products.

Sticky bottom bar on mobile: `[Qty] [Order via WhatsApp]` — always visible while scrolling.

### Image Gallery Behavior

- Primary image displayed large.
- Thumbnail strip below (desktop) or dots indicator (mobile).
- Tap/click to switch main image.
- Pinch-to-zoom on mobile; CSS zoom or lightbox on desktop.
- If multiple images: swipe gesture on mobile.

### Variant Selector Behavior

- Color variant: swatch buttons (colored circles with border when selected).
- Size variant: pill buttons. Unavailable sizes shown with diagonal strikethrough.
- When a variant is selected, the URL updates: `?color=red&size=M` (for shareability).
- Changing variant updates: price, stock status, and primary image (if variant has its own image).

### WhatsApp CTA Button

- Primary button, full width on mobile.
- Label: "Order via WhatsApp".
- Icon: WhatsApp logo SVG.
- On click: opens `https://wa.me/{number}?text={encodedMessage}` in a new tab.
- Message format defined in Section 17.

### Out of Stock State

- WhatsApp CTA replaced with "Out of Stock — Notify Me".
- "Notify Me" opens a modal with a WhatsApp message pre-filled: "Hi, I'd like to be notified when [Product Name] is back in stock."

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "image": ["..."],
  "description": "...",
  "sku": "...",
  "brand": { "@type": "Brand", "name": "..." },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "...",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "..." }
  }
}
```

---

## 12. Category Page Breakdown

### URL: `/categories/[slug]`

### Anatomy

1. **Category Hero** — Full-width image (16:5 desktop, 4:3 mobile), category name overlaid, optional subtitle.
2. **Sub-category Chips** — If this category has children: horizontal chip strip linking to each sub-category. Active chip highlighted.
3. **Breadcrumb** — `Home > Parent Category > Current Category`.
4. **Filter Sidebar + Product Grid** — Same as PLP (Section 10).
5. **Category Description** — SEO-targeted text below the grid (Portable Text from CMS), hidden behind "Read more" on mobile.

### Static Generation Strategy

Categories are statically generated at build time via `generateStaticParams()`. At build time, the top 50 categories (by product count) are pre-rendered. All others use on-demand ISR — first request triggers generation, result cached on edge.

### Category Hierarchy Navigation

- If viewing a parent category: shows sub-category chips above the product grid.
- If viewing a sub-category: breadcrumb includes parent; a "View all [Parent]" link appears.
- Products in a sub-category are NOT included in parent category queries unless explicitly tagged. The merchant controls this via the category reference on each product.

---

## 13. Search System

### Architecture

Search is implemented entirely via GROQ queries against the Sanity CDN. No external search service (e.g., Algolia) is required for initial launch. The architecture supports swapping to Algolia later.

### Search Flow

```
User types → debounce 300ms → GROQ query to Sanity CDN
                                        ↓
                              Results ranked by relevance
                                        ↓
                         Suggestions dropdown (max 5 items)
                                        ↓
User presses Enter / selects → /search?q=term page renders
```

### Search Query Strategy

```groq
// Suggestion query (live, max 5)
*[_type == "product" && (
  name match $query + "*" ||
  pt::text(description) match $query + "*"
)] | order(_score desc) [0..4] {
  _id, name, slug, "image": images[0], price
}

// Full search results query (paginated)
*[_type == "product" && (
  name match $query + "*" ||
  tags[] match $query + "*" ||
  categories[]->name match $query + "*"
)] | order(_score desc) [$start..$end] {
  // full card projection
}
```

### Search Results Page (`/search`)

- URL: `/search?q=sneakers&page=1`
- Heading: `{n} results for "sneakers"`
- Same grid + filter layout as PLP.
- Zero results: show "Did you mean…" suggestions (prefix search on similar terms), plus 4 featured products.
- Recent searches: last 5 searches stored in localStorage, shown in dropdown before user types.

### Search UX Enhancements

- Search input in header opens a modal/overlay on mobile (full-screen takeover).
- Suggestion dropdown shows: product thumbnail, name, price, category tag.
- Keyboard navigation: arrow keys move through suggestions; Escape closes.

---

## 14. Filtering System

### Filter State Architecture

Filter state lives entirely in URL query parameters. This means:
- Filters are shareable via URL.
- Browser back/forward works correctly.
- No client-side state library needed for filters.
- SSR can read filters from `searchParams` on the server.

### URL Parameter Schema

```
/products?category=shoes&color=red,blue&size=M,L&minPrice=500&maxPrice=2000&sort=price-asc&page=1
```

### Filter Types

| Filter | UI Component | URL Param | Multi-select |
|---|---|---|---|
| Category | Checkbox list | `category` | Yes |
| Price Range | Dual-handle slider | `minPrice`, `maxPrice` | No |
| Size | Pill buttons | `size` | Yes |
| Color | Color swatches | `color` | Yes |
| Availability | Toggle | `available` | No |
| Tag | Checkbox list | `tag` | Yes |
| Custom Attribute | Checkbox list | `attr_[name]` | Yes |

### Filter Sidebar (Desktop)

- Fixed position, left side, 280 px wide.
- Each filter group is an accordion (open by default for top 3, collapsed for others).
- "Clear all" link at the top.
- Filter count badge on each group header showing how many options are active.

### Filter Bottom Sheet (Mobile)

- Trigger: "Filter & Sort" sticky button at bottom of screen.
- Opens a bottom sheet (Sheet component from Shadcn).
- "Apply Filters" and "Clear All" buttons at the bottom of the sheet.
- Filter count badge on the trigger button.

### Active Filter Chips

Displayed between the page header and the product grid:
```
Filters: [Color: Red ×] [Size: M ×] [Price: ₹500–₹2000 ×]  [Clear all]
```

### Filter Data Source

Filter options (available colors, sizes, price range) are derived from the current query result set — not hardcoded. This means if no red products exist in the current category, "Red" is not shown as a filter option. This requires a separate GROQ aggregation query:

```groq
{
  "colors": *[_type == "product" && references($categoryId)].variants[].color,
  "sizes": *[_type == "product" && references($categoryId)].variants[].size,
  "priceRange": {
    "min": min(*[_type == "product" && references($categoryId)].price),
    "max": max(*[_type == "product" && references($categoryId)].price)
  }
}
```

---

## 15. Cart System

### Architecture

The cart is entirely client-side, managed by **Zustand** with persistence middleware to `localStorage`. No server-side cart state exists. This is intentional — it eliminates session management complexity and allows the cart to work offline.

### Cart State Shape

```typescript
interface CartItem {
  id: string;               // Sanity product _id
  slug: string;
  name: string;
  image: string;            // Sanity image URL (pre-resolved)
  price: number;
  salePrice: number | null;
  quantity: number;
  variant: {
    size?: string;
    color?: string;
    sku?: string;
  } | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: CartItem['variant']) => void;
  updateQuantity: (id: string, quantity: number, variant?: CartItem['variant']) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}
```

### Cart Item Uniqueness

A cart item is unique by `(id + JSON.stringify(variant))`. Two items with the same product ID but different sizes/colors are treated as separate line items.

### Cart UI Components

1. **Cart Icon + Badge** — In header. Badge shows `totalItems`. Animates on add (scale pulse).
2. **Cart Drawer (Slide-over)** — Opens from the right. Shows all items, quantities, subtotals, and the WhatsApp checkout button.
3. **Cart Page (`/cart`)** — Full-page view for better mobile usability. Same data as the drawer.
4. **Mini-cart Confirmation Toast** — When "Add to Cart" is clicked, a toast appears: "[Product] added to cart. [View Cart]".

### Cart Interactions

| Action | Behavior |
|---|---|
| Add item | Adds to cart; opens mini-cart toast; cart icon badge increments. |
| Increase quantity | `+` button increments count. |
| Decrease quantity | `-` button decrements; at 1, pressing `-` removes the item. |
| Remove item | Trash icon. Triggers a subtle fade-out animation. |
| Clear cart | Available in full cart page. Requires a confirmation dialog. |
| Close drawer | Click outside, press Escape, or click ✕. |

---

## 16. Checkout System

### Philosophy

This platform deliberately omits a traditional checkout system (address forms, payment gateway integration, order management database). The checkout is a single action: generating a WhatsApp message. This decision:

- Eliminates PCI DSS compliance requirements.
- Requires zero backend infrastructure.
- Works in markets where WhatsApp is the primary commerce channel.
- Allows the merchant to handle payment collection via bank transfer, cash on delivery, or any informal method they prefer.

### Checkout Flow Summary

```
[Cart page / Cart drawer]
        ↓
[Review order summary]
        ↓
[Click "Checkout via WhatsApp"]
        ↓
[WhatsApp opens with pre-filled message]
        ↓
[Customer sends message to merchant]
        ↓
[Merchant confirms, provides payment details]
        ↓
[Customer pays (external to platform)]
        ↓
[Merchant ships order]
```

### Pre-Checkout Summary (on Cart page)

Before the WhatsApp button, the cart page shows:

- Itemized list with images, names, variants, quantity, unit price, line total.
- Subtotal.
- Delivery note: "Delivery charges will be confirmed by the merchant via WhatsApp."
- Tax note if applicable.
- Order notes text area (optional, included in WhatsApp message).
- "Checkout via WhatsApp" button (primary, full width on mobile).

---

## 17. WhatsApp Checkout Flow

### Deep Link Format

```
https://wa.me/{E164_PHONE_NUMBER}?text={URL_ENCODED_MESSAGE}
```

The phone number is stored in Sanity Site Settings as `whatsappNumber` (E.164 format, e.g., `917012345678`). It is fetched at build time and passed as a prop/env variable.

### Single Product Order Message Template

```
Hi! I'd like to order:

*Product:* {productName}
*Variant:* {size} / {color}  (omitted if no variant)
*Quantity:* {qty}
*Price:* ₹{price}

Please confirm availability and share delivery details. Thank you!
```

### Full Cart Checkout Message Template

```
Hi! I'd like to place an order:

*Order Summary:*
{items.map(item => `• ${item.name} (${item.variant || 'No variant'}) x${item.qty} — ₹${item.lineTotal}`).join('\n')}

*Subtotal:* ₹{subtotal}

*Notes:* {customerNotes || 'None'}

Please confirm and share payment/delivery details. Thank you!
```

### Message Generation Rules

1. All currency values formatted as `₹{value.toLocaleString('en-IN')}`.
2. Variant line omitted entirely if the product has no variants.
3. Notes line omitted if the customer left the notes field empty.
4. Message is URL-encoded before being appended to the `wa.me` link.
5. The message is generated entirely client-side in a utility function `generateWhatsAppMessage(cart, storeNumber)`.

### Fallback Behavior

If the device cannot open the WhatsApp deep link (e.g., desktop without WhatsApp installed):
1. Detect failure via `window.addEventListener('blur', ...)` timeout pattern.
2. After 2 seconds without a blur event, show a modal:
   - Full message text in a readonly textarea.
   - "Copy Message" button (copies to clipboard).
   - WhatsApp Web link (`https://web.whatsapp.com/send?phone=...`).

### Post-Checkout UX

After clicking the WhatsApp button:
1. A confirmation screen/toast appears: "Your order details have been sent! Await confirmation from our team."
2. Cart is NOT cleared automatically — the user must clear it manually or it clears when a new session starts.
3. Optional: "Continue Shopping" button.

### Merchant Workflow (Out of Scope for Platform)

This is informational for the merchant:
- Set up a WhatsApp Business account with the number in Site Settings.
- Create Quick Reply templates for order confirmation, payment request, shipping update.
- Use WhatsApp Business labels to track order status (Pending, Confirmed, Shipped, Completed).

---

## 18. SEO Strategy

### On-Page SEO

Every page uses Next.js `generateMetadata()` to produce `<head>` meta tags server-side. Base metadata is defined in `app/layout.tsx`. Page-specific metadata overrides it.

**Metadata hierarchy:**
1. CMS SEO override fields (highest priority).
2. Computed from content (product name → title, description text → meta description).
3. Site-level defaults (lowest priority).

### Title Format

```
[Page-Specific Title] | [Store Name]
// Example: "Air Max Pro Sneakers | Urban Kicks"

// Homepage:
[Store Name] — [Tagline]
// Example: "Urban Kicks — Premium Sneakers Online"
```

### Meta Description Rules

- Length: 120–160 characters.
- Must include primary keyword naturally.
- Product pages: include product name, key feature, price signal.
- Category pages: include category name, breadth ("50+ styles"), location if relevant.

### Open Graph

```typescript
openGraph: {
  title: pageTitle,
  description: metaDescription,
  url: canonicalUrl,
  siteName: storeName,
  images: [{ url: ogImageUrl, width: 1200, height: 630, alt: imageAlt }],
  type: 'website', // 'product' for PDPs
  locale: 'en_IN',
}
```

### Twitter Card

```typescript
twitter: {
  card: 'summary_large_image',
  title: pageTitle,
  description: metaDescription,
  images: [ogImageUrl],
}
```

### Structured Data

| Page | Schema Types |
|---|---|
| All pages | `Organization`, `WebSite` (with `SearchAction`) |
| Homepage | `WebPage`, `ItemList` (featured products) |
| PDP | `Product`, `BreadcrumbList` |
| PLP / Category | `CollectionPage`, `BreadcrumbList` |
| Static pages | `WebPage` |

### Sitemap Generation

`app/sitemap.ts` exports a `generateSitemap` function that:
1. Fetches all product slugs from Sanity (paginated, up to 50,000).
2. Fetches all category slugs from Sanity.
3. Fetches all static page slugs from Sanity.
4. Returns a `MetadataRoute.Sitemap` array.
5. Respects `_updatedAt` from Sanity for `lastModified`.

Sitemap is split into an index + sub-sitemaps if product count exceeds 50,000 (Google limit).

### robots.txt

```
User-agent: *
Allow: /
Disallow: /studio/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
```

### Canonical Tags

- Every page sets `<link rel="canonical" href="..." />`.
- Paginated pages: canonical points to page 1 (not each individual page number).
- Filter URLs: canonical points to the unfiltered category URL (prevents duplicate content from filter combinations).

### URL Strategy

- Slugs: kebab-case, from product/category name, auto-generated in Sanity with uniqueness check.
- No trailing slashes (configured in `next.config.ts`).
- Redirects for old URLs configured in `next.config.ts` (permanent 301).

---

## 19. Performance Strategy

### Rendering Model per Route

| Route | Strategy | Reason |
|---|---|---|
| `/` | ISR (60 s) | Content changes frequently |
| `/products` | ISR (60 s) | Catalog changes |
| `/products/[slug]` | ISR (30 s) + on-demand | Price/stock changes |
| `/categories/[slug]` | ISR (60 s) + on-demand | Content changes |
| `/search` | CSR | Dynamic query, uncacheable |
| `/cart` | CSR | User-specific state |
| Static pages | ISR (300 s) | Rarely changes |

### Image Optimization

- All product images stored in Sanity CDN.
- Served via `@sanity/image-url` with transform parameters: `?w=800&auto=format&fit=crop&q=80`.
- Next.js `<Image>` component with `sizes` prop for responsive loading.
- `priority` prop on hero image and first product in grid (LCP candidates).
- WebP format requested by default; AVIF where supported.
- `placeholder="blur"` with `blurDataURL` from Sanity's low-quality image placeholder (LQIP).

### JavaScript Bundle Strategy

- React Server Components (RSC) for all data-fetching components. Zero JS sent to client.
- Client components only where interactivity is required: cart, search, filters, image gallery, mega menu.
- `dynamic()` with `ssr: false` for heavy client-only components (image lightbox, carousel library).
- No global client-side state management library for read-only data — RSC handles it.
- Zustand for cart state only (< 5 KB gzipped).

### Font Loading

- Font: system font stack as primary, with a single optional web font (Inter or brand font).
- Font loaded with `next/font` (automatic self-hosting, swap display, preload).
- Font subsetting: only Latin characters.

### Third-Party Scripts

- No analytics scripts in initial bundle — deferred to `afterInteractive` or `lazyOnload` strategy.
- No third-party CSS imports.
- No jQuery or legacy utilities.
- WhatsApp button uses a deep link — no SDK required.

### Critical CSS

- Tailwind CSS v4 purges unused classes at build time.
- Above-the-fold CSS is inlined by Next.js automatically.
- No render-blocking CSS from external CDNs.

### Preloading Strategy

```html
<link rel="preload" as="image" href="{heroImageUrl}" fetchpriority="high">
<link rel="preconnect" href="https://cdn.sanity.io">
<link rel="dns-prefetch" href="https://cdn.sanity.io">
```

---

## 20. Accessibility Strategy

### WCAG 2.1 AA Compliance Checklist

**Perceivable**
- All images have descriptive `alt` text sourced from Sanity `altText` field (required field).
- Decorative images use `alt=""`.
- Color is never the only means of conveying information (e.g., out-of-stock products also show text, not just a gray color).
- Minimum contrast ratio 4.5:1 enforced via design tokens.
- Video content (if any) has captions.

**Operable**
- All interactive elements reachable via keyboard (Tab order follows DOM order).
- No keyboard traps (modals use focus trap with proper release on Escape).
- Skip-to-main-content link at the top of every page.
- Carousel auto-play (if used) pauses on hover/focus.
- Touch targets minimum 44 × 44 px.
- No time limits on user actions.

**Understandable**
- `lang="en"` (or locale-appropriate) on `<html>`.
- Form labels explicitly associated with inputs (`htmlFor` / `id` pairing or `aria-label`).
- Error messages identify the field in error and explain how to fix it.
- Consistent navigation (same order, same appearance on every page).

**Robust**
- All Shadcn components use semantic HTML and WAI-ARIA attributes correctly.
- No invalid ARIA attributes.
- Tested with NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android).

### Specific Component Accessibility Notes

| Component | Accessibility Implementation |
|---|---|
| Image Gallery | `role="region" aria-label="Product images"`, arrow buttons have `aria-label="Next image"`, active slide has `aria-current="true"` |
| Mega Menu | `role="navigation"`, menu items `role="menuitem"`, keyboard open/close/arrow navigation |
| Cart Drawer | `role="dialog" aria-modal="true" aria-label="Shopping cart"`, focus trapped inside when open |
| Filters | Each filter group is a `<fieldset>` with `<legend>`, checkboxes have visible labels |
| Price | Never displayed as `₹1299`-only — always has an accessible label `<span aria-label="Price: 1,299 rupees">₹1,299</span>` |
| Star Rating | `role="img" aria-label="4.2 out of 5 stars"` |
| Quantity Selector | Buttons have `aria-label="Decrease quantity"` / `"Increase quantity"`, input has `aria-label="Quantity"` |

---

## 21. Analytics Strategy

### No third-party analytics by default. The following can be added without architectural changes:

### Vercel Analytics (Built-in, Recommended)

- Enable `@vercel/analytics` package.
- Add `<Analytics />` component to `app/layout.tsx`.
- Provides page views, Web Vitals (LCP, CLS, FID, INP) per page.
- No cookie consent required (privacy-preserving, no PII).

### Event Tracking (Custom)

Track these events via a `trackEvent(name, properties)` utility that wraps whichever analytics provider is configured:

| Event | Trigger | Properties |
|---|---|---|
| `product_viewed` | PDP load | `product_id`, `product_name`, `price`, `category` |
| `product_added_to_cart` | Add to cart click | `product_id`, `variant`, `price`, `quantity` |
| `product_removed_from_cart` | Remove from cart | `product_id` |
| `cart_viewed` | Cart drawer / page open | `items_count`, `subtotal` |
| `whatsapp_checkout_initiated` | WhatsApp button click | `items_count`, `subtotal`, `source` (cart/pdp) |
| `search_performed` | Search submit | `query`, `results_count` |
| `filter_applied` | Filter change | `filter_type`, `filter_value` |
| `category_viewed` | Category page load | `category_name`, `products_count` |

### Google Analytics 4 (Optional Add-on)

If enabled, use Next.js `<Script>` with `strategy="lazyOnload"`. Configure GA4 via environment variable `NEXT_PUBLIC_GA4_MEASUREMENT_ID`.

### Merchant Dashboard (Future)

No custom analytics dashboard is built in v1. Merchant uses:
- Vercel Analytics dashboard for traffic/performance.
- WhatsApp Business analytics for order message volume.

---

## 22. CMS Architecture

### Sanity Project Setup

- **Project ID:** Stored in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- **Dataset:** `production` (live), `staging` (optional for content preview).
- **API Version:** Pinned (e.g., `2024-01-01`) in `sanity/env.ts`. Never use `"v1"` or `"latest"`.
- **Studio URL:** Embedded at `/studio` in the Next.js app via `next-sanity` embedded studio.

### Sanity Client Configuration

Two clients are used:

1. **Server-side client** (`sanity/lib/client.ts`) — Uses `token` from env, `useCdn: false` for guaranteed freshness on on-demand ISR revalidation.
2. **CDN client** (`sanity/lib/clientCDN.ts`) — No token, `useCdn: true`, used in all page-level RSC fetches for maximum speed.

```typescript
// server client (for revalidation / webhook handlers)
export const serverClient = createClient({
  projectId, dataset, apiVersion, useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// CDN client (for all page rendering)
export const cdnClient = createClient({
  projectId, dataset, apiVersion, useCdn: true,
  perspective: 'published',
});
```

### Sanity Webhook → ISR Revalidation

Sanity sends a POST webhook to `/api/revalidate` when any document is published. The endpoint:

1. Validates the secret header (`SANITY_REVALIDATE_SECRET`).
2. Reads the `_type` from the webhook payload.
3. Calls `revalidateTag()` for the relevant cache tags:
   - `product` type → `revalidateTag('products')`, `revalidateTag('homepage')`
   - `category` type → `revalidateTag('categories')`
   - `homePage` type → `revalidateTag('homepage')`
   - `siteSettings` type → `revalidateTag('site')`

### Preview Mode (Future)

Sanity Visual Editing / Presentation tool can be enabled later without architectural changes. The `perspective: 'previewDrafts'` client option is reserved for this.

---

## 23. Sanity Schema Architecture

### Schema Design Principles

1. **Document types** for content that has its own URL or exists independently.
2. **Object types** for reusable sub-documents (variant, SEO fields, price, etc.).
3. **Reference types** for relationships between documents.
4. All schemas are TypeScript — `defineType`, `defineField`, `defineArrayMember` from `sanity`.
5. `sanity typegen` is run after any schema change to regenerate `sanity.types.ts`.

### Schema File Layout

```
sanity/schemaTypes/
├── index.ts                  (exports all types)
├── documents/
│   ├── product.ts
│   ├── category.ts
│   ├── staticPage.ts
│   ├── homePage.ts
│   └── siteSettings.ts
└── objects/
    ├── productVariant.ts
    ├── priceObject.ts
    ├── seoFields.ts
    ├── imageWithAlt.ts
    ├── ctaButton.ts
    ├── heroBanner.ts
    ├── testimonial.ts
    └── uspItem.ts
```

---

## 24. Required CMS Collections

| Collection | Type | Singleton? | Description |
|---|---|---|---|
| `product` | Document | No | Individual product listings |
| `category` | Document | No | Product categories (hierarchical) |
| `staticPage` | Document | No | About, Contact, FAQ, Policy pages |
| `homePage` | Document | Yes | Homepage content blocks |
| `siteSettings` | Document | Yes | Global config: logo, number, nav |

---

## 25. Required CMS Fields

### Product (`product`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Product display name |
| `slug` | `slug` | Yes | URL slug, auto-generated from name |
| `description` | `array` (Portable Text) | Yes | Rich text product description |
| `shortDescription` | `string` | No | 1–2 line summary for grid cards |
| `images` | `array` of `imageWithAlt` | Yes | Min 1, max 8 images |
| `price` | `number` | Yes | Regular price in lowest currency unit |
| `salePrice` | `number` | No | Sale price; if set, displayed with strike-through on original |
| `currency` | `string` | No | Default: `INR`. Supports future multi-currency |
| `variants` | `array` of `productVariant` | No | Size/color/material options |
| `categories` | `array` of `reference` → `category` | Yes | Min 1 category |
| `tags` | `array` of `string` | No | Search/filter tags |
| `badge` | `string` (enum) | No | `new`, `sale`, `bestSeller`, `limitedEdition`, `comingSoon` |
| `inStock` | `boolean` | Yes | Default: `true` |
| `sku` | `string` | No | Merchant stock-keeping unit |
| `weight` | `number` | No | Grams, for shipping calculation reference |
| `relatedProducts` | `array` of `reference` → `product` | No | Max 4 |
| `seo` | `seoFields` | No | Overrides for title, description, OG image |
| `publishedAt` | `datetime` | Yes | Controls "Newest" sort order |
| `isFeatured` | `boolean` | No | Flag for homepage/featured queries |

### Product Variant (`productVariant` — object)

| Field | Type | Required | Notes |
|---|---|---|---|
| `label` | `string` | Yes | e.g., "Size", "Color", "Material" |
| `value` | `string` | Yes | e.g., "M", "Red", "Cotton" |
| `priceModifier` | `number` | No | Added to base price (can be negative) |
| `inStock` | `boolean` | Yes | Per-variant stock |
| `sku` | `string` | No | Per-variant SKU |
| `image` | `imageWithAlt` | No | Variant-specific image (e.g., color swatch) |

### Category (`category`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | Yes | Category display name |
| `slug` | `slug` | Yes | URL slug |
| `description` | `array` (Portable Text) | No | SEO category description |
| `heroImage` | `imageWithAlt` | No | Category page hero image |
| `parent` | `reference` → `category` | No | For sub-category hierarchy |
| `order` | `number` | No | Manual sort order in navigation |
| `seo` | `seoFields` | No | SEO overrides |

### Static Page (`staticPage`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Page title (h1) |
| `slug` | `slug` | Yes | URL slug (e.g., `about`, `faq`) |
| `body` | `array` (Portable Text) | Yes | Full page content |
| `seo` | `seoFields` | No | SEO overrides |

### Home Page (`homePage` — singleton)

| Field | Type | Required | Notes |
|---|---|---|---|
| `heroSlides` | `array` of `heroBanner` | Yes | Min 1, max 3 hero slides |
| `featuredCategories` | `array` of `reference` → `category` | No | Max 6 category chips |
| `featuredProductsTitle` | `string` | No | e.g., "New Arrivals" |
| `featuredProducts` | `array` of `reference` → `product` | No | Max 8 products |
| `promoBanner` | `heroBanner` | No | Mid-page promotional banner |
| `secondaryProductsTitle` | `string` | No | e.g., "Best Sellers" |
| `secondaryProducts` | `array` of `reference` → `product` | No | Max 8 products |
| `testimonials` | `array` of `testimonial` | No | Max 6 testimonials |
| `uspItems` | `array` of `uspItem` | No | 3–4 trust signal icons |
| `showNewsletter` | `boolean` | No | Toggle WhatsApp community CTA |

### Site Settings (`siteSettings` — singleton)

| Field | Type | Required | Notes |
|---|---|---|---|
| `storeName` | `string` | Yes | e.g., "Urban Kicks" |
| `tagline` | `string` | No | Used in homepage title |
| `logo` | `imageWithAlt` | Yes | Header logo |
| `favicon` | `image` | No | Browser tab icon |
| `whatsappNumber` | `string` | Yes | E.164 format, e.g., `917012345678` |
| `announcementBar` | `object` | No | `{ text, linkText, linkUrl, isVisible }` |
| `primaryNav` | `array` of nav item objects | Yes | Desktop mega-menu config |
| `footerNav` | `array` of link group objects | No | Footer column links |
| `socialLinks` | `object` | No | `{ instagram, facebook, twitter, youtube }` |
| `defaultSeo` | `seoFields` | Yes | Site-wide SEO defaults |
| `currency` | `string` | Yes | Default: `INR` |
| `currencySymbol` | `string` | Yes | Default: `₹` |

### SEO Fields (`seoFields` — object)

| Field | Type | Notes |
|---|---|---|
| `metaTitle` | `string` | Max 70 chars |
| `metaDescription` | `string` | Max 160 chars |
| `ogImage` | `imageWithAlt` | 1200 × 630 px recommended |
| `noIndex` | `boolean` | Default: false |

### Image With Alt (`imageWithAlt` — object)

| Field | Type | Required | Notes |
|---|---|---|---|
| `asset` | `image` | Yes | Sanity image reference |
| `alt` | `string` | Yes | Descriptive alt text |
| `caption` | `string` | No | Shown in gallery lightbox |

---

## 26. Image Management Strategy

### Sanity Image Pipeline

1. Merchant uploads image in Sanity Studio (any format, any size).
2. Sanity stores original in its asset store.
3. At render time, `@sanity/image-url` builds a transform URL:
   ```
   https://cdn.sanity.io/images/{projectId}/{dataset}/{assetId}
     ?w=800&h=800&fit=crop&auto=format&q=80
   ```
4. Next.js `<Image>` component handles responsive `srcset` automatically.

### Image Sizes per Use Case

| Context | Width | Height | Fit | Quality |
|---|---|---|---|---|
| Product card (grid) | 400 | 400 | crop | 80 |
| Product card (grid 2x) | 800 | 800 | crop | 80 |
| PDP main image | 800 | 800 | clip | 85 |
| PDP thumbnail | 120 | 120 | crop | 75 |
| Hero (desktop) | 1440 | 600 | crop | 85 |
| Hero (mobile) | 800 | 1000 | crop | 80 |
| Category hero | 1200 | 400 | crop | 80 |
| OG Image | 1200 | 630 | crop | 85 |
| Logo | 200 | auto | – | 90 |

### Image alt Text Policy

- All product images have a CMS `alt` field that is **required** by Sanity schema validation.
- If alt is empty at render time, fallback: `"{productName} — {storeStoreName}"`.
- Decorative images (backgrounds, shapes) use `alt=""`.

### Placeholder Strategy

Sanity provides an LQIP (Low Quality Image Placeholder) via the `metadata.lqip` field on the image asset. This is a base64-encoded tiny blurred thumbnail used as `blurDataURL` in Next.js `<Image>`.

```typescript
// In GROQ query, include:
"blurDataURL": images[0].asset->metadata.lqip
```

---

## 27. Caching Strategy

### Layer 1 — Sanity CDN Cache

All GROQ queries via `useCdn: true` are served from Sanity's global CDN edge cache. Cache TTL is managed by Sanity. Invalidated when content is published.

### Layer 2 — Next.js Fetch Cache

All `fetch()` calls in RSCs use the Next.js data cache with explicit `tags`:

```typescript
const data = await fetch(sanityUrl, {
  next: { revalidate: 60, tags: ['products', 'homepage'] }
});
```

### Layer 3 — Vercel Edge Cache

ISR pages are served from Vercel's edge cache. The `Cache-Control` header is:
```
s-maxage=60, stale-while-revalidate=86400
```
This means: serve cached version for 60 s, then revalidate in background while still serving stale for up to 24 h.

### Layer 4 — On-Demand Revalidation

When Sanity fires a webhook → `POST /api/revalidate`:
1. Validates `SANITY_REVALIDATE_SECRET` header.
2. Calls `revalidateTag()` for affected tags.
3. Returns `{ revalidated: true }`.

This flushes the specific Next.js cache tag across all edge nodes within seconds.

### Layer 5 — Browser Cache

- Static assets (JS, CSS, fonts): `Cache-Control: public, max-age=31536000, immutable` (Vercel handles this).
- Pages: `Cache-Control: s-maxage=60, stale-while-revalidate`.
- API routes: `Cache-Control: no-store` (revalidation endpoint should not be cached).

### Cache Tag Strategy

| Content Type | Tags |
|---|---|
| All products | `['products']` |
| Specific product | `['products', `product-${slug}`]` |
| All categories | `['categories']` |
| Specific category | `['categories', `category-${slug}`]` |
| Homepage | `['homepage']` |
| Site settings | `['site']` |
| Static pages | `['pages', `page-${slug}`]` |

---

## 28. Security Strategy

### HTTP Security Headers

Configured in `next.config.ts` via `headers()`:

```typescript
{
  key: 'X-Content-Type-Options', value: 'nosniff'
},
{
  key: 'X-Frame-Options', value: 'DENY'
},
{
  key: 'X-XSS-Protection', value: '1; mode=block'
},
{
  key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'
},
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=()'
},
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://cdn.sanity.io",
    "connect-src 'self' https://*.sanity.io https://api.sanity.io",
    "font-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ')
}
```

### Environment Variable Security

| Variable | Exposure | Location |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client + Server | Safe: project ID is public |
| `NEXT_PUBLIC_SANITY_DATASET` | Client + Server | Safe: dataset name is public |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Client + Server | Safe: analytics ID is public |
| `SANITY_API_TOKEN` | Server only | Never in `NEXT_PUBLIC_` prefix |
| `SANITY_REVALIDATE_SECRET` | Server only | Never in `NEXT_PUBLIC_` prefix |

### Sanity API Token Permissions

The server-side Sanity token uses `viewer` role (read-only). No write permissions are needed from the Next.js app. Write access is handled by Sanity Studio's own authenticated session.

### Input Sanitization

- No user input is written to any database.
- Search queries: passed directly to GROQ `match` operator — GROQ has no injection vector (it is not a string-interpolated query language; it is parameterized).
- WhatsApp message: `encodeURIComponent()` applied to entire message string before appending to URL.

### Rate Limiting (Vercel)

- Vercel Pro plan includes DDoS protection.
- `/api/revalidate` endpoint validates the secret on every request.
- Optionally add Vercel's rate limiting middleware.

---

## 29. Deployment Strategy

### CI/CD Pipeline

```
Developer pushes to GitHub
         ↓
Vercel detects push (webhook)
         ↓
Vercel builds Next.js project
  - `next build`
  - Static pages pre-generated
  - ISR pages deferred
         ↓
Vercel deploys to edge network
  - Preview URL for non-main branches
  - Production URL for `main` branch
         ↓
Sanity Studio deployed (embedded in Next.js)
```

### Branch Strategy

| Branch | Vercel Environment | Purpose |
|---|---|---|
| `main` | Production | Live site |
| `staging` | Preview (custom domain) | QA, content preview |
| `feature/*` | Preview (auto URL) | Developer testing |

### Environment Configs

| Variable | Production | Preview | Development |
|---|---|---|---|
| `SANITY_DATASET` | `production` | `staging` | `development` |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Preview URL | `http://localhost:3000` |

### Build Optimization

- `generateStaticParams()` for top-N products/categories at build time.
- `dynamicParams = true` (default) allows on-demand generation of remaining pages.
- `output: 'standalone'` not needed (Vercel handles this).

---

## 30. Vercel Configuration

### `vercel.json`

```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["bom1"],
  "headers": [],
  "rewrites": [],
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Region Selection

`bom1` = Mumbai, India. Primary target market. Reduces TTFB by ~200 ms for Indian users compared to US-East. Change to `sin1` (Singapore) for SEA markets.

### Edge Functions vs Serverless Functions

| Route | Runtime |
|---|---|
| All RSC pages | Edge (automatic via Next.js App Router) |
| `/api/revalidate` | Node.js (requires `crypto` for secret validation) |

### Vercel Analytics

Enable in `vercel.json` or Vercel dashboard. Add `<Analytics />` from `@vercel/analytics` in `app/layout.tsx`.

### Vercel Speed Insights

Add `<SpeedInsights />` from `@vercel/speed-insights` in `app/layout.tsx` for real-user performance monitoring (Core Web Vitals per page).

---

## 31. Environment Variables

### `.env.local` (Development)

```bash
# Sanity — Public (safe to expose)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Sanity — Server only (never expose)
SANITY_API_TOKEN=your_read_only_token
SANITY_REVALIDATE_SECRET=your_random_secret_string

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME=Your Store Name

# Analytics (optional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature flags (optional)
NEXT_PUBLIC_ENABLE_WISHLIST=true
NEXT_PUBLIC_ENABLE_REVIEWS=false
```

### Vercel Dashboard Environment Variables

All of the above, set per environment (Production / Preview / Development):
- Production: `SANITY_DATASET=production`
- Preview: `SANITY_DATASET=staging` (optional)

### `sanity/env.ts`

```typescript
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
export const dataset = assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET, 'Missing NEXT_PUBLIC_SANITY_DATASET');
export const projectId = assertValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
```

---

## 32. Folder Structure

```
ecommerce/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, providers, header, footer
│   ├── page.tsx                      # Homepage — RSC
│   ├── globals.css                   # Tailwind base + CSS variables
│   │
│   ├── products/
│   │   ├── page.tsx                  # All products PLP — RSC
│   │   └── [slug]/
│   │       ├── page.tsx              # Product detail page — RSC
│   │       └── loading.tsx           # PDP skeleton
│   │
│   ├── categories/
│   │   ├── page.tsx                  # All categories — RSC
│   │   └── [slug]/
│   │       ├── page.tsx              # Category page — RSC
│   │       └── loading.tsx
│   │
│   ├── search/
│   │   └── page.tsx                  # Search results — CSR-heavy
│   │
│   ├── cart/
│   │   └── page.tsx                  # Full cart page
│   │
│   ├── [slug]/
│   │   └── page.tsx                  # Dynamic static pages (about, faq, etc.)
│   │
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts              # ISR revalidation webhook handler
│   │
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx              # Embedded Sanity Studio
│   │
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   └── robots.ts                     # robots.txt generation
│
├── components/
│   ├── ui/                           # Shadcn UI primitives (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── input.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/                       # Layout-level components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AnnouncementBar.tsx
│   │   ├── MegaMenu.tsx
│   │   ├── MobileNav.tsx
│   │   └── Breadcrumb.tsx
│   │
│   ├── product/                      # Product-specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── ProductVariantSelector.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── ProductBadge.tsx
│   │   ├── ProductPrice.tsx
│   │   └── RelatedProducts.tsx
│   │
│   ├── cart/                         # Cart components
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartIcon.tsx
│   │
│   ├── search/                       # Search components
│   │   ├── SearchBar.tsx
│   │   ├── SearchModal.tsx
│   │   ├── SearchSuggestions.tsx
│   │   └── SearchResults.tsx
│   │
│   ├── filter/                       # Filter components
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterSheet.tsx
│   │   ├── FilterGroup.tsx
│   │   ├── ActiveFilters.tsx
│   │   └── SortDropdown.tsx
│   │
│   ├── whatsapp/                     # WhatsApp CTA components
│   │   ├── WhatsAppButton.tsx
│   │   ├── WhatsAppCheckoutButton.tsx
│   │   └── WhatsAppFallbackModal.tsx
│   │
│   ├── home/                         # Homepage section components
│   │   ├── HeroSection.tsx
│   │   ├── CategoryChips.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── PromoBanner.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── UspBar.tsx
│   │
│   └── shared/                       # Truly shared, generic components
│       ├── SanityImage.tsx           # Wrapper around next/image for Sanity assets
│       ├── PortableText.tsx          # Portable Text renderer
│       ├── Pagination.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       └── StructuredData.tsx
│
├── hooks/                            # Custom React hooks
│   ├── useCart.ts                    # Zustand cart selectors
│   ├── useWishlist.ts                # localStorage wishlist
│   ├── useSearch.ts                  # Debounced search
│   ├── useFilters.ts                 # URL-based filter state
│   └── useWhatsApp.ts               # WhatsApp message generation
│
├── lib/                              # Pure utility functions
│   ├── formatCurrency.ts
│   ├── generateWhatsAppMessage.ts
│   ├── getProductUrl.ts
│   └── cn.ts                         # Tailwind class merge utility
│
├── sanity/
│   ├── env.ts
│   ├── client.ts                     # CDN client
│   ├── serverClient.ts               # Server-only client (with token)
│   ├── structure.ts                  # Studio sidebar structure
│   ├── schemaTypes/
│   │   ├── index.ts
│   │   ├── documents/
│   │   └── objects/
│   ├── lib/
│   │   ├── queries.ts                # All GROQ query strings
│   │   └── fetch.ts                  # Typed fetch wrappers
│   └── types/
│       └── sanity.types.ts           # Auto-generated by sanity typegen
│
├── store/
│   ├── cartStore.ts                  # Zustand cart store
│   └── uiStore.ts                    # Zustand UI state (drawer open/closed)
│
├── types/
│   └── index.ts                      # App-level TypeScript types
│
├── public/
│   ├── icons/
│   │   └── whatsapp.svg
│   └── images/
│       └── placeholder.png
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── sanity.config.ts
├── sanity.cli.ts
└── package.json
```

---

## 33. Component Architecture

### Server vs Client Component Decision Tree

```
Does the component:
  - Fetch data from Sanity?           → Server Component
  - Render static/semi-static content? → Server Component
  - Use useState / useEffect?          → Client Component
  - Handle user events (click, input)?  → Client Component
  - Use browser APIs (localStorage)?   → Client Component
  - Use Zustand store?                 → Client Component
```

### Component Communication Patterns

1. **Server → Client:** Props only. Server components pass fetched data as props to Client components.
2. **Client → Client:** Zustand store (cart, UI state) or URL state (filters).
3. **Client → Server:** URL navigation (filter/search params), Server Actions (future).

### Data Flow for PDP

```
app/products/[slug]/page.tsx  (Server Component)
  │
  ├── fetchProductBySlug(slug)  ← GROQ query
  │
  └── renders:
      ├── ProductGallery (Client — image switching)
      ├── ProductInfo (Server — static info display)
      │   ├── ProductPrice (Server)
      │   ├── ProductBadge (Server)
      │   └── ProductVariantSelector (Client — user selection)
      ├── AddToCartButton (Client — cart interaction)
      ├── WhatsAppButton (Client — link generation)
      └── RelatedProducts (Server — separate query)
```

### Provider Architecture

```
app/layout.tsx
└── <Providers>                    (Client Component)
    ├── CartStoreProvider (Zustand)
    ├── UIStoreProvider (Zustand)
    └── <ToastProvider> (Shadcn)
```

---

## 34. Reusable Component List

### UI Primitives (Shadcn — install these)

```bash
npx shadcn@latest add button card dialog drawer input label
  select separator sheet skeleton slider tabs toast badge
  accordion scroll-area command popover
```

### Custom Shared Components

| Component | Location | Props | Description |
|---|---|---|---|
| `SanityImage` | `components/shared/` | `image: SanityImageSource`, `alt: string`, `sizes: string`, `priority?: boolean` | Wraps `@sanity/image-url` + `next/image` |
| `PortableText` | `components/shared/` | `value: PortableTextBlock[]` | Renders Sanity Portable Text with Tailwind prose styles |
| `ProductCard` | `components/product/` | `product: ProductCardData`, `priority?: boolean` | Grid card: image, badge, name, price, CTA |
| `ProductGrid` | `components/product/` | `products: ProductCardData[]`, `columns?: 2 \| 3 \| 4` | Responsive CSS grid of `ProductCard` |
| `ProductBadge` | `components/product/` | `badge: BadgeType` | Colored badge: New / Sale / etc. |
| `ProductPrice` | `components/product/` | `price: number`, `salePrice?: number`, `currency?: string` | Displays price with optional strike-through |
| `QuantitySelector` | `components/product/` | `value: number`, `onChange: (n) => void`, `min?: number`, `max?: number` | +/− quantity buttons with accessible labels |
| `Breadcrumb` | `components/layout/` | `items: {label: string, href?: string}[]` | Navigation breadcrumb with JSON-LD |
| `Pagination` | `components/shared/` | `currentPage: number`, `totalPages: number`, `baseUrl: string` | Page number links |
| `EmptyState` | `components/shared/` | `title: string`, `description?: string`, `action?: ReactNode` | Empty grid / zero results UI |
| `WhatsAppButton` | `components/whatsapp/` | `product: Product`, `variant?: Variant`, `quantity: number`, `storeNumber: string` | Single product WhatsApp CTA |
| `WhatsAppCheckoutButton` | `components/whatsapp/` | `cart: CartItem[]`, `storeNumber: string` | Full cart WhatsApp CTA |
| `FilterSidebar` | `components/filter/` | `filters: FilterOptions`, `activeFilters: ActiveFilters`, `onChange: FilterChangeHandler` | Desktop left-sidebar filters |
| `ActiveFilters` | `components/filter/` | `filters: ActiveFilters`, `onRemove: (key, value) => void` | Removable filter chips |
| `SortDropdown` | `components/filter/` | `value: SortOption`, `onChange: (sort) => void` | Sort select |
| `SearchBar` | `components/search/` | `placeholder?: string`, `onSearch: (q) => void` | Accessible search input with clear button |
| `StructuredData` | `components/shared/` | `data: object` | Renders `<script type="application/ld+json">` |

---

## 35. State Management Strategy

### Principle: Minimize Client State

1. **Server state** (product data, category data, site settings) — always fetched in Server Components. Never stored in client state.
2. **URL state** (filters, sort, page, search query) — stored in URL query params. Managed via `useRouter` / `useSearchParams` from `next/navigation`.
3. **Transient UI state** (drawer open/closed, modal open/closed) — Zustand `uiStore`.
4. **Persistent client state** (cart, wishlist) — Zustand with `persist` middleware to `localStorage`.

### Zustand Stores

**`store/cartStore.ts`**
```typescript
// State: items[], totalItems (derived), subtotal (derived)
// Actions: addItem, removeItem, updateQuantity, clearCart
// Persistence: localStorage key 'cart'
```

**`store/uiStore.ts`**
```typescript
// State: isCartOpen, isSearchOpen, isMobileNavOpen
// Actions: openCart, closeCart, openSearch, closeSearch, toggleMobileNav
// No persistence
```

### Why Not Redux / React Query / SWR?

- **Redux**: Overkill for this scope. Zustand achieves the same with 1/10th the boilerplate.
- **React Query / SWR**: Not needed. Server Components handle all data fetching. There is no client-side data fetching that needs caching/revalidation (search is the exception, handled with a simple `useSWR` hook if needed).
- **Context API**: Avoided for cart because it causes full-tree re-renders on every cart change. Zustand's selectors prevent this.

---

## 36. API / Data Fetching Strategy

### All Data Fetching via GROQ

All queries are defined in `sanity/lib/queries.ts` as exported constants. Queries use **projection** — only fetch needed fields.

### Query Organization

```typescript
// sanity/lib/queries.ts

export const PRODUCT_CARD_FRAGMENT = `
  _id, name, slug, price, salePrice, badge, inStock,
  "image": images[0]{ asset, alt, "lqip": asset->metadata.lqip },
  "category": categories[0]->{ name, slug }
`;

export const HOMEPAGE_QUERY = groq`{
  "hero": *[_type == "homePage"][0].heroSlides,
  "featuredProducts": *[_type == "homePage"][0].featuredProducts[]->{
    ${PRODUCT_CARD_FRAGMENT}
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    storeName, whatsappNumber, announcementBar, uspItems
  }
}`;

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id, name, slug, description, shortDescription, price, salePrice,
    badge, inStock, sku, variants, tags, publishedAt,
    images[]{ asset, alt, caption, "lqip": asset->metadata.lqip },
    categories[]->{ _id, name, slug },
    relatedProducts[]->{ ${PRODUCT_CARD_FRAGMENT} },
    seo
  }
`;

export const PRODUCTS_QUERY = groq`
  *[_type == "product"
    && ($category == null || references(*[_type == "category" && slug.current == $category]._id))
    && ($minPrice == null || price >= $minPrice)
    && ($maxPrice == null || price <= $maxPrice)
    && ($inStock == null || inStock == $inStock)
  ] | order(
    select(
      $sort == "price-asc" => price asc,
      $sort == "price-desc" => price desc,
      publishedAt desc
    )
  ) [$start..$end] {
    ${PRODUCT_CARD_FRAGMENT}
  }
`;
```

### Typed Fetch Wrappers

```typescript
// sanity/lib/fetch.ts
export async function fetchProduct(slug: string): Promise<SanityProduct | null> {
  return cdnClient.fetch(PRODUCT_BY_SLUG_QUERY, { slug }, {
    next: { revalidate: 30, tags: [`product-${slug}`, 'products'] }
  });
}
```

### No `use client` in Page Files

Page files (`app/**/page.tsx`) are always Server Components. They call typed fetch functions, then pass results to presentational components. This ensures maximum RSC usage and zero client-bundle bloat from data fetching.

---

## 37. Error Handling Strategy

### Next.js Error Boundaries

| File | Scope | Content |
|---|---|---|
| `app/error.tsx` | Global error boundary | Generic "Something went wrong" + "Try again" + "Home" |
| `app/not-found.tsx` | 404 handler | "Page not found" + search bar + featured products |
| `app/products/[slug]/not-found.tsx` | Product 404 | "Product not found" + related products |
| `app/loading.tsx` | Global loading | Full-page skeleton |

### Sanity Fetch Error Handling

```typescript
// Pattern used in all fetch wrappers
try {
  const data = await cdnClient.fetch(query, params);
  if (!data) notFound(); // triggers not-found.tsx
  return data;
} catch (error) {
  console.error('Sanity fetch failed:', error);
  // Return null or throw — let error.tsx handle it
  throw error;
}
```

### Cart Error States

- Attempting to add an out-of-stock product: prevented at UI level (button disabled).
- localStorage unavailable (private browsing): `try/catch` around Zustand persist; cart falls back to in-memory only.

### WhatsApp Link Error

- If `whatsappNumber` is null/empty in settings: WhatsApp button is hidden and replaced with a "Contact Us" link.
- If `window.open` is blocked: fallback modal shown (see Section 17).

### Type Safety as Error Prevention

- All GROQ results are typed via `sanity typegen` output in `sanity/types/sanity.types.ts`.
- TypeScript strict mode (`"strict": true` in `tsconfig.json`).
- No `any` types in component props.

---

## 38. Loading State Strategy

### Server Component Loading (Suspense + Skeleton)

Each page has a `loading.tsx` file that renders a skeleton matching the page layout. Next.js App Router streams content using React Suspense — the skeleton renders immediately while data loads.

### Skeleton Components

| Page | Skeleton Content |
|---|---|
| Homepage | Hero placeholder, 4 category chip skeletons, 8 product card skeletons |
| PLP | Grid of 12 product card skeletons |
| PDP | Image gallery skeleton + info skeleton (name, price, button bars) |
| Category | Hero skeleton + 8 card skeletons |

### Product Card Skeleton

```
┌──────────────────┐
│   [gray block]   │  ← image placeholder (aspect-square)
├──────────────────┤
│ [──────] [──]    │  ← category tag + badge
│ [──────────────] │  ← name
│ [────] [───────] │  ← price
└──────────────────┘
```
Implemented with Tailwind `animate-pulse` and `bg-muted` on gray blocks.

### Client Component Loading

- Search suggestions: spinner icon inside the input while loading.
- Add to Cart: button shows loading spinner after click, re-enables after toast confirms.
- WhatsApp button: no loading state (instantaneous link).
- Filters: when filter changes update the product list, the grid shows a subtle opacity-50 overlay while new results stream in.

### Optimistic UI

- **Add to Cart:** Cart count badge increments immediately (before any async operation, since cart is localStorage-only).
- **Wishlist toggle:** Toggles immediately.
- No optimistic UI needed for Sanity data (read-only).

---

## 39. Future Scalability Plan

### Phase 2 — Enhanced Discovery

- **Algolia integration:** Drop-in replacement for GROQ-based search. Replace `useSearch` hook internals. All component interfaces remain unchanged.
- **Product reviews:** Add `review` document type to Sanity. Display on PDP. No user auth needed — merchant-moderated reviews entered via Studio.
- **Recently viewed products:** localStorage array, shown on PDP sidebar and cart page.

### Phase 3 — User Accounts (Optional)

- Introduce Clerk or NextAuth for authentication.
- Add `wishlist` sync to user profile.
- Order history via WhatsApp conversation history (no database needed).

### Phase 4 — Payment Integration

- The WhatsApp checkout can be replaced or supplemented with Razorpay / Stripe.
- Cart state structure (`CartItem[]`) is already the correct shape for a payment intent payload.
- Add `/checkout` page with address form + payment button.
- No other architectural changes required.

### Phase 5 — Multi-region / Multi-currency

- Sanity dataset per locale, or `i18n` plugin.
- `currency` field in Site Settings supports this from day one.
- Next.js `i18n` routing (`/en/`, `/ar/`) can be added without page restructuring.

### Phase 6 — B2B / Wholesale

- Add `customerType` context (retail / wholesale).
- Wholesale prices as a second price field on `product`.
- Gated wholesale section via Clerk `organizationMembership` roles.

---

## 40. Lighthouse 100 Optimization Plan

### Performance (Target: 100)

| Optimization | Implementation |
|---|---|
| Hero image preload | `<link rel="preload" fetchpriority="high">` in `<head>` |
| First product image priority | `priority` prop on first `<Image>` in grid |
| No render-blocking scripts | All scripts use `strategy="afterInteractive"` or `"lazyOnload"` |
| Font optimization | `next/font` with `display: swap`, subset to Latin |
| Minimal JS | RSC for all non-interactive components |
| No layout shift | Explicit `width`/`height` on all images; `aspect-ratio` on placeholders |
| Tailwind purge | Automatic in production build |
| AVIF/WebP images | `auto=format` in Sanity image URL |
| Compression | Vercel handles Brotli/gzip automatically |
| HTTP/2 | Vercel edge — automatic |

### Accessibility (Target: 100)

| Optimization | Implementation |
|---|---|
| All images have alt text | Required field in Sanity schema |
| Color contrast | Design tokens enforce 4.5:1 minimum |
| Aria labels on icons | All icon-only buttons have `aria-label` |
| Skip navigation | `<a href="#main-content">` as first element |
| Semantic HTML | `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>` used correctly |
| Form labels | All inputs have `<label>` or `aria-label` |
| Focus management | Focus trap in modals; focus returns to trigger on close |

### Best Practices (Target: 100)

| Optimization | Implementation |
|---|---|
| HTTPS | Vercel enforces HTTPS |
| No console errors | Lint rule + error boundaries |
| Correct image aspect ratios | Explicit `width`/`height` or `fill` with container |
| No deprecated APIs | TypeScript + ESLint catch these |
| Security headers | Configured in `next.config.ts` |

### SEO (Target: 100)

| Optimization | Implementation |
|---|---|
| Meta description on every page | `generateMetadata()` in every page file |
| `<title>` on every page | `generateMetadata()` |
| Crawlable links | `<a href>` — no JS-only navigation |
| `robots.txt` | `app/robots.ts` |
| Structured data | JSON-LD via `StructuredData` component |
| `hreflang` | If multi-language is added in Phase 5 |

---

## 41. Mobile Optimization Plan

### Breakpoint System (Tailwind v4)

```
xs:  375px   (minimum supported — iPhone SE)
sm:  640px
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px
2xl: 1536px
```

All layouts are designed mobile-first: base styles for 375px, then `sm:`, `md:`, `lg:` overrides.

### Touch Target Minimums

- All buttons: minimum `min-h-[44px] min-w-[44px]`.
- Cart icon, wishlist icon, nav hamburger: minimum 44×44 touch area even if visual icon is smaller (achieved via `p-` padding).

### Mobile-Specific UI Decisions

| Feature | Mobile Implementation |
|---|---|
| Navigation | Bottom-sheet drawer from left |
| Filters | Bottom sheet, "Apply" button |
| Product gallery | Swipe gesture (touch events or CSS scroll-snap) |
| Sticky CTA on PDP | Fixed bottom bar: Qty + WhatsApp button |
| Cart | Full `/cart` page preferred over drawer (easier to scroll) |
| Search | Full-screen modal overlay |
| Breadcrumb | Truncated with ellipsis on small screens |

### Gesture Support

- Product image swipe: CSS `scroll-snap` on a horizontally scrolling container (no JS library needed).
- Pull-to-refresh: Native browser behavior — no custom implementation.
- Pinch-to-zoom on product images: `touch-action: pinch-zoom` CSS property.

### Offline Behavior

- Cart persists offline via localStorage.
- Pages previously visited are served from Vercel CDN cache.
- No Service Worker / PWA in v1 (added in Phase 2 if needed).

### Performance on Low-End Devices

- Avoid CSS animations with `transform` + `opacity` only (GPU-composited).
- Use `will-change: transform` only on elements that will animate.
- Disable heavy hover effects on touch devices via `@media (hover: none)`.
- Lazy-load images below the fold with `loading="lazy"` (default in `next/image`).

---

## 42. Production Readiness Checklist

### Content

- [ ] All products have at least 1 image with alt text
- [ ] All products have prices set
- [ ] All products are assigned to at least one category
- [ ] Site Settings: store name, WhatsApp number, logo, default SEO filled
- [ ] Homepage: hero slide(s) configured
- [ ] At least one static page (About or Contact) published
- [ ] Announcement bar text set (or `isVisible: false`)

### Code

- [ ] `npm run build` completes with zero errors
- [ ] `npm run lint` returns zero warnings/errors
- [ ] TypeScript strict mode: zero type errors
- [ ] No `console.log` in production code
- [ ] No `TODO` comments in committed code
- [ ] All environment variables documented in `.env.example`

### SEO

- [ ] `sitemap.xml` accessible and valid at `/sitemap.xml`
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] Google Search Console: sitemap submitted
- [ ] All public pages have unique meta title + description
- [ ] Structured data valid (test with Google Rich Results Test)

### Performance

- [ ] Lighthouse mobile score ≥ 95 on homepage
- [ ] Lighthouse mobile score ≥ 90 on a PDP
- [ ] No images above the fold with `loading="lazy"` (should be `priority`)
- [ ] No render-blocking resources
- [ ] Core Web Vitals pass on Vercel Speed Insights

### Security

- [ ] All security headers present (verify with securityheaders.com)
- [ ] `SANITY_API_TOKEN` not in any `NEXT_PUBLIC_` variable
- [ ] `SANITY_REVALIDATE_SECRET` is a strong random string (32+ chars)
- [ ] CSP does not use `unsafe-eval`
- [ ] Sanity Studio accessible only to authenticated users

### Accessibility

- [ ] Axe DevTools: zero critical issues on homepage
- [ ] Axe DevTools: zero critical issues on PDP
- [ ] Keyboard-only navigation works on all pages
- [ ] Screen reader test on product purchase flow

### Analytics

- [ ] Vercel Analytics enabled
- [ ] Speed Insights enabled
- [ ] Key events firing (product_viewed, whatsapp_checkout_initiated)

---

## 43. Testing Checklist

### Manual Test Cases

**Homepage**
- [ ] Hero image loads and is above the fold
- [ ] Hero CTA links to correct URL
- [ ] Featured products grid shows correct products
- [ ] Announcement bar appears / dismisses / does not re-appear in same session

**Product Listing**
- [ ] Products load with images, names, prices
- [ ] Sort: each option reorders results correctly
- [ ] Filters: selecting a size filter shows only products with that size
- [ ] Active filter chips appear and remove correctly
- [ ] "Load more" appends products (does not replace)
- [ ] Empty state shows when no products match

**Product Detail**
- [ ] All images appear in gallery
- [ ] Image swipe works on mobile
- [ ] Variant selection updates price
- [ ] Out-of-stock variant shows disabled state
- [ ] "Add to Cart" adds item, shows toast, updates badge
- [ ] "Order via WhatsApp" opens WhatsApp (or falls back on desktop)
- [ ] WhatsApp message contains correct product name, variant, price
- [ ] Breadcrumb links are correct

**Cart**
- [ ] Adding same variant increments quantity (not duplicate line item)
- [ ] Adding different variants of same product creates separate line items
- [ ] Quantity +/− updates subtotal
- [ ] Removing item (to 0) removes the line
- [ ] Cart persists after page refresh
- [ ] "Checkout via WhatsApp" generates correct full-order message

**Search**
- [ ] Typing returns live suggestions
- [ ] Pressing Enter navigates to search results page
- [ ] Filters work on search results page
- [ ] Zero results shows suggested products

**Navigation**
- [ ] Mega menu opens on hover (desktop), shows all sub-categories
- [ ] Mobile drawer opens from hamburger
- [ ] All nav links navigate correctly
- [ ] Cart icon badge shows correct count

**Static Pages**
- [ ] About, Contact, FAQ, Policy pages render Portable Text correctly
- [ ] Headings, bold, lists render correctly in Portable Text

**SEO**
- [ ] View source: `<title>` and `<meta description>` correct on homepage
- [ ] View source: `<title>` and `<meta description>` correct on a PDP
- [ ] JSON-LD present on PDP
- [ ] OG tags present on PDP

### Automated Tests (Future — Phase 2)

- Unit tests for `generateWhatsAppMessage()` utility
- Unit tests for `formatCurrency()` utility
- Unit tests for cart store (add, remove, update, persist)
- E2E (Playwright): homepage load, PDP → add to cart → WhatsApp checkout flow

---

## 44. Deployment Checklist

### Pre-Deployment

- [ ] `git pull` from main, ensure working tree is clean
- [ ] `npm install` — no peer dependency conflicts
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] All env variables added to Vercel dashboard
- [ ] Custom domain configured in Vercel (DNS propagated)
- [ ] SSL certificate active on custom domain

### Sanity Setup

- [ ] Sanity project created at sanity.io
- [ ] Dataset `production` exists
- [ ] CORS origin added in Sanity manage: `https://yourdomain.com` and `https://yourdomain.vercel.app`
- [ ] CORS origin for Studio: `https://yourdomain.com`
- [ ] Sanity API token (viewer) created and added to Vercel env
- [ ] Webhook created in Sanity: URL = `https://yourdomain.com/api/revalidate`, secret = `SANITY_REVALIDATE_SECRET` value, events = `create`, `update`, `delete`

### Post-Deployment Smoke Test

- [ ] Visit production URL — homepage loads
- [ ] At least one product detail page loads
- [ ] Cart add/remove works
- [ ] WhatsApp button opens WhatsApp with correct message
- [ ] Sanity Studio at `/studio` — requires login, loads correctly
- [ ] Publish a product change in Sanity — verify it appears on site within 60 seconds (ISR)
- [ ] Check Vercel Analytics dashboard — pageviews recording

---

## 45. Post-Deployment Maintenance Plan

### Weekly

- Review Vercel Analytics: top pages, bounce rate, Core Web Vitals per page.
- Check for any Vercel deployment failures in the dashboard.
- Review error logs in Vercel Functions tab.
- Monitor WhatsApp order volume (out of scope for platform — merchant-side).

### Monthly

- **Dependency audit:** `npm audit` — patch critical/high vulnerabilities.
- **Dependency updates:** Update minor versions — `npm update`. Test build after.
- **Lighthouse audit:** Run on homepage + 2 PDPs. Address any regressions.
- **Broken link check:** Run a crawl (Screaming Frog or similar). Fix 404s.
- **Sanity schema review:** Confirm `sanity typegen` output is committed and matches deployed code.
- **Image audit:** Check for any product images with missing alt text in Sanity Studio.

### Quarterly

- **Major dependency updates:** Next.js minor/patch, Sanity v5 updates, Tailwind. Test in staging branch first.
- **SEO audit:** Google Search Console — impressions, clicks, coverage issues, Core Web Vitals field data.
- **Full accessibility audit:** Run Axe on all page types. Address any new issues.
- **Security headers review:** Re-test at securityheaders.com. Tighten CSP if possible.
- **Performance budget check:** Ensure bundle sizes are within limits. Run `npx @next/bundle-analyzer`.

### On Content Change (Automated)

- Sanity webhook fires → `/api/revalidate` → affected cache tags invalidated → pages regenerated within 60 s.
- No manual intervention needed for routine content changes.

### On Code Change

1. Create feature branch from `main`.
2. Develop + test locally (`npm run dev`).
3. Push branch → Vercel creates preview deployment automatically.
4. Test on preview URL.
5. Merge to `main` → Vercel deploys to production automatically.
6. Smoke test production.

### Incident Response

| Issue | First Response |
|---|---|
| Site down (Vercel outage) | Check vercel.com/status. Wait for resolution. Consider Sanity CDN fallback. |
| Products not updating | Check Vercel Function logs for `/api/revalidate`. Verify Sanity webhook is firing. Manually trigger revalidation via Vercel dashboard. |
| WhatsApp number changed | Update `whatsappNumber` in Sanity Site Settings. Publishes instantly. |
| High error rate | Check Vercel error logs. Rollback deployment if needed via Vercel dashboard (instant). |
| CLS regression | Profile with Chrome DevTools. Common causes: images without dimensions, font swap, late-loading ads. |

---

*End of Architecture Document — v1.0.0*

*This document is the single source of truth for the platform architecture. All implementation decisions should reference this document. When requirements evolve, update this document first, then implement.*
