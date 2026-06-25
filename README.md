# RathTech E-Commerce

A production-grade, WhatsApp-first e-commerce storefront built without a payment gateway. Merchants accept orders through a structured WhatsApp checkout flow — zero payment friction, zero PCI overhead.

---

## 🔗 Links

| | URL |
|---|---|
| **Live Site** | [https://yourdomain.com](https://yourdomain.com) |
| **Sanity Studio (CMS)** | [https://yourdomain.com/studio](https://yourdomain.com/studio) |
| **Sanity Manage** | [https://sanity.io/manage](https://sanity.io/manage) |
| **Vercel Dashboard** | [https://vercel.com/dashboard](https://vercel.com/dashboard) |
| **GitHub Repo** | [https://github.com/YOUR_USERNAME/YOUR_REPO](https://github.com/YOUR_USERNAME/YOUR_REPO) |

> **Replace all placeholders above** with your actual URLs after deploying. See [STATUS.md](STATUS.md) for the step-by-step deployment guide.

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC-first) |
| Styling | Tailwind CSS v4 + Base UI (Shadcn v4) |
| CMS | Sanity v5 |
| State | Zustand v5 |
| Checkout | WhatsApp Business deep link |
| Hosting | Vercel (edge network + ISR) |
| Analytics | Vercel Analytics + Speed Insights |

---

## ✨ Features

- **WhatsApp checkout** — single tap generates a pre-filled order message; no payment gateway, no PCI compliance
- **CMS-driven catalog** — add products, categories, banners, and promotions from Sanity Studio without touching code
- **ISR revalidation** — Sanity webhook triggers `revalidateTag()` within 60 s of publishing any change
- **Live search** — debounced search bar with live product suggestions and recent-searches history
- **URL-driven filters** — size, color, tag, price range, availability; each filter state is shareable via URL
- **Cart drawer + full cart page** — Zustand cart persisted to `localStorage`, survives page refresh
- **SEO-complete** — `robots.txt`, `sitemap.xml`, Product JSON-LD, WebSite JSON-LD, canonical tags, OG images per page
- **Lighthouse-optimised** — `priority` on LCP images, LQIP blur placeholders, static prerendering on all cacheable pages
- **WCAG AA accessibility** — focus-visible rings, aria-labels, screen-reader text, 40 px+ touch targets, 4.5:1 badge contrast

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 20
- A [Sanity](https://sanity.io) account (free tier works)

### 1 — Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

### 2 — Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | [sanity.io/manage](https://sanity.io/manage) → Project → Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (default) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_TOKEN` | sanity.io/manage → API → Tokens → Create "Viewer" token |
| `SANITY_REVALIDATE_SECRET` | Run: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev |
| `NEXT_PUBLIC_STORE_NAME` | Your store name |

### 3 — Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site runs with a Sanity fallback message until you add content in the Studio.

### 4 — Open Sanity Studio

```
http://localhost:3000/studio
```

Create at minimum:
1. **Site Settings** — store name, WhatsApp number (`919876543210` format), logo
2. **Homepage** — at least one hero slide + featured products
3. **1 Category** + **2–3 Products** assigned to it

---

## 📂 Project Structure

```
ecommerce/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (ISR 60s)
│   ├── products/           # PLP + PDP
│   ├── categories/[slug]/  # Category pages
│   ├── cart/               # Cart page
│   ├── search/             # Search results
│   ├── [slug]/             # Static pages (About, FAQ…)
│   ├── api/revalidate/     # Sanity ISR webhook handler
│   ├── robots.ts           # /robots.txt
│   └── sitemap.ts          # /sitemap.xml
├── components/
│   ├── layout/             # Header, Footer, MegaMenu, MobileNav, Breadcrumb
│   ├── product/            # ProductCard, ProductGrid, ProductGallery, etc.
│   ├── cart/               # CartDrawer, CartItem, CartSummary, CartPageContent
│   ├── filter/             # SortDropdown, FilterSidebar, FilterSheet, FilterGroup
│   ├── search/             # SearchBar, SearchSuggestions, SearchModal
│   ├── whatsapp/           # WhatsAppButton, WhatsAppCheckoutButton, FallbackModal
│   ├── home/               # HeroSection, FeaturedProducts, CategoryChips…
│   └── shared/             # SanityImage, PortableText, Pagination, StructuredData
├── hooks/                  # useFilters, useSearch, useWishlist
├── lib/                    # cn, formatCurrency, getProductUrl, generateWhatsAppMessage
├── store/                  # cartStore (Zustand + persist), uiStore
├── sanity/
│   ├── schemaTypes/        # Product, Category, HomePage, SiteSettings, StaticPage
│   ├── lib/                # client, serverClient, image, queries, fetch
│   └── types/              # Generated types (sanity typegen)
└── types/                  # CartItem, FilterState, SortOption, BadgeType
```

---

## 🔧 Key Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript type check
npx sanity typegen generate   # Regenerate Sanity TypeScript types (run after schema changes)
```

---

## 🌐 WhatsApp Checkout Flow

1. Customer browses products and selects variants + quantity
2. Taps **"Order via WhatsApp"** → a pre-filled message is built:
   ```
   Hi! I'd like to order:
   📦 *Blue Kurti — Size: M*
      Qty: 2 × ₹999 = ₹1,998
   Please confirm availability and delivery details. Thank you!
   ```
3. WhatsApp opens with the message ready to send to the store number
4. Store owner confirms via WhatsApp and arranges payment + delivery

No payment gateway, no PCI compliance, no server costs beyond Vercel + Sanity free tiers.

---

## 📋 CMS Content Guide

Access the Studio at `/studio`. Document types:

| Type | Purpose |
|---|---|
| **Site Settings** | Store name, WhatsApp number, logo, nav, footer, social links |
| **Homepage** | Hero slides, featured categories/products, promo banner, testimonials |
| **Product** | Name, images, price, sale price, variants (size/color), categories |
| **Category** | Name, hero image, parent category (for hierarchy) |
| **Static Page** | About, FAQ, Contact, Returns, Privacy Policy — full Portable Text body |

---

## 🔄 ISR Revalidation

Content changes in Sanity appear on the live site within **60 seconds** via Next.js ISR:

1. Editor publishes a product in Sanity Studio
2. Sanity fires a webhook to `POST /api/revalidate`
3. The handler calls `revalidateTag()` for the relevant cache tags
4. Next.js re-renders the affected pages on the next request

No full re-deploy needed for any content change.

---

## 📄 Documentation

| File | Contents |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Full PRD, SRS, Sanity schema, SEO strategy, performance plan (45 sections) |
| [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) | Phased task breakdown with acceptance criteria and time estimates |
| [`STATUS.md`](STATUS.md) | Live progress tracker — all 8 phases, deployment checklist |

---

## 🏷 Version

**v1.0.0** — Initial production release

Built by **Rathin** · Powered by [Next.js](https://nextjs.org) · CMS by [Sanity](https://sanity.io) · Hosted on [Vercel](https://vercel.com)
