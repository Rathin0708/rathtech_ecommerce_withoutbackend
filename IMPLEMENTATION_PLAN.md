# Phased Implementation Plan

**Project:** RathTech E-Commerce Platform  
**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Shadcn UI · Sanity CMS v5 · Vercel  
**Total Estimated Time:** 14–18 days (solo developer, full days)  
**Reference:** See `ARCHITECTURE.md` for full technical decisions behind every item below.

---

## Summary Timeline

| Phase | Name | Duration | Depends On |
|---|---|---|---|
| 1 | Project Setup | 1–2 days | — |
| 2 | Sanity CMS | 2–3 days | Phase 1 |
| 3 | Homepage | 2–3 days | Phase 2 |
| 4 | Product Pages | 3–4 days | Phase 2, 3 |
| 5 | Cart & WhatsApp Checkout | 1–2 days | Phase 4 |
| 6 | SEO | 1 day | Phase 3, 4, 5 |
| 7 | Testing & Polish | 2–3 days | Phase 6 |
| 8 | Deployment | 1 day | Phase 7 |

---

## Phase 1 — Project Setup

**Duration:** 1–2 days  
**Goal:** A clean, fully configured Next.js 16 project with all tooling, design system, global utilities, and stores in place — ready for feature development with zero configuration debt.

---

### Tasks

#### 1.1 · Tailwind CSS v4 + Design Tokens

- Confirm `tailwindcss@^4` and `@tailwindcss/postcss` are installed (already in `package.json`).
- Open `app/globals.css` and define CSS custom properties for the entire design system:
  - Color palette: `--color-primary`, `--color-primary-foreground`, `--color-secondary`, `--color-accent`, `--color-background`, `--color-foreground`, `--color-muted`, `--color-muted-foreground`, `--color-border`, `--color-destructive`.
  - Radius tokens: `--radius-sm`, `--radius-md`, `--radius-lg`.
  - Font tokens: `--font-sans`, `--font-heading`.
  - Spacing tokens (optional, Tailwind v4 uses CSS variables natively).
- Wire CSS variables into Tailwind config as semantic color names.
- Confirm `postcss.config.mjs` uses `@tailwindcss/postcss`.

#### 1.2 · Shadcn UI Initialization

- Run: `npx shadcn@latest init` — choose the TypeScript + Tailwind v4 preset.
- Install required components:
  ```
  npx shadcn@latest add button card dialog drawer input label
    select separator sheet skeleton slider tabs toast badge
    accordion scroll-area command popover
  ```
- Verify all components land in `components/ui/`.
- Do NOT modify generated Shadcn files directly — extend via wrapper components.

#### 1.3 · Typography / Fonts

- Install `next/font` for Inter (or chosen brand font):
  - Import in `app/layout.tsx` using `next/font/google`.
  - Apply font variable to `<html>` element.
  - Configure `font-display: swap` and Latin subset.
- Add heading font if separate (e.g., `Playfair Display` for luxury brands).

#### 1.4 · Path Aliases

- Open `tsconfig.json` and confirm `compilerOptions.paths`:
  ```json
  {
    "@/*": ["./*"],
    "@/components/*": ["components/*"],
    "@/lib/*": ["lib/*"],
    "@/hooks/*": ["hooks/*"],
    "@/store/*": ["store/*"],
    "@/sanity/*": ["sanity/*"],
    "@/types/*": ["types/*"]
  }
  ```
- All imports throughout the project must use these aliases — no relative `../../` paths crossing feature boundaries.

#### 1.5 · TypeScript Strict Mode

- Open `tsconfig.json`, ensure:
  ```json
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
  ```
- Fix any existing type errors that arise after enabling strict mode.

#### 1.6 · ESLint Configuration

- Open `eslint.config.mjs`. Add rules:
  - `no-console: ["warn", { allow: ["error"] }]`
  - `@typescript-eslint/no-explicit-any: "error"`
  - `@typescript-eslint/no-unused-vars: "error"`
- Run `npm run lint` — ensure it passes clean before any feature work.

#### 1.7 · Folder Structure Scaffold

Create all directories defined in `ARCHITECTURE.md § 32` so imports never break during development:

```
mkdir components/ui
mkdir components/layout
mkdir components/product
mkdir components/cart
mkdir components/search
mkdir components/filter
mkdir components/whatsapp
mkdir components/home
mkdir components/shared
mkdir hooks
mkdir lib
mkdir store
mkdir types
mkdir sanity/schemaTypes/documents
mkdir sanity/schemaTypes/objects
mkdir sanity/lib
mkdir sanity/types
```

#### 1.8 · Utility Functions

Create these pure utility files in `lib/`:

- `lib/cn.ts` — Tailwind class merge utility using `clsx` + `tailwind-merge`.
  - Install: `npm install clsx tailwind-merge`
  - Export: `export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }`

- `lib/formatCurrency.ts` — Currency formatter.
  - Export: `formatCurrency(amount: number, currency?: string, locale?: string): string`
  - Default: INR, `en-IN` locale.

- `lib/getProductUrl.ts` — Canonical product URL builder.
  - Export: `getProductUrl(slug: string): string` → `/products/${slug}`

- `lib/getCategoryUrl.ts` — Canonical category URL builder.
  - Export: `getCategoryUrl(slug: string): string` → `/categories/${slug}`

#### 1.9 · Global Types

Create `types/index.ts` with app-level TypeScript interfaces:
  - `CartItem` (matches cart store shape from `ARCHITECTURE.md § 15`)
  - `FilterState` (active filter values)
  - `SortOption` (union type of sort values)
  - `BadgeType` (union: `'new' | 'sale' | 'bestSeller' | 'limitedEdition' | 'comingSoon'`)

#### 1.10 · Zustand Stores

Install Zustand: `npm install zustand`

- **`store/cartStore.ts`**
  - State: `items: CartItem[]`
  - Derived: `totalItems`, `subtotal` (computed via Zustand selectors, not stored state)
  - Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  - Persistence: `persist` middleware, localStorage key `'rathtech-cart'`
  - Item uniqueness key: `id + JSON.stringify(variant)`

- **`store/uiStore.ts`**
  - State: `isCartOpen: boolean`, `isSearchOpen: boolean`, `isMobileNavOpen: boolean`
  - Actions: `openCart`, `closeCart`, `openSearch`, `closeSearch`, `toggleMobileNav`
  - No persistence (in-memory only)

#### 1.11 · Provider Wrapper

- Create `components/shared/Providers.tsx` — a Client Component that wraps Zustand providers and the Shadcn `<Toaster />`.
- Import and render `<Providers>` in `app/layout.tsx`.
- `app/layout.tsx` itself remains a Server Component — `Providers` is the only client boundary at the root.

#### 1.12 · Environment Variables

- Create `.env.example` with all variable names and placeholder values (no real secrets).
- Create `.env.local` with real development values.
- Verify `sanity/env.ts` reads `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` with `assertValue()` guard.

#### 1.13 · Next.js Config

Open `next.config.ts` and add:
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`).
- `images.remotePatterns` for `cdn.sanity.io`.
- `trailingSlash: false`.
- `poweredByHeader: false`.

#### 1.14 · Root Layout

Open `app/layout.tsx` and wire up:
- Font CSS variables on `<html>`.
- `<Providers>` wrapper.
- `lang="en"` on `<html>`.
- Placeholder `<Header />` and `<Footer />` imports (to be filled in Phase 3).
- `<main id="main-content">` wrapper for skip-nav link.
- Skip-to-content link: `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>`.
- `<Analytics />` from `@vercel/analytics`.
- `<SpeedInsights />` from `@vercel/speed-insights`.
- Install both: `npm install @vercel/analytics @vercel/speed-insights`.

---

### Files Created / Modified

```
Modified:
  app/layout.tsx
  app/globals.css
  next.config.ts
  tsconfig.json
  eslint.config.mjs

Created:
  .env.example
  components/shared/Providers.tsx
  lib/cn.ts
  lib/formatCurrency.ts
  lib/getProductUrl.ts
  lib/getCategoryUrl.ts
  types/index.ts
  store/cartStore.ts
  store/uiStore.ts
  components/ui/*          (Shadcn generated)
```

---

### Folder Structure After Phase 1

```
ecommerce/
├── app/
│   ├── layout.tsx          ✅ wired
│   ├── page.tsx            (placeholder)
│   └── globals.css         ✅ design tokens
├── components/
│   ├── ui/                 ✅ Shadcn components
│   ├── layout/             (empty, ready)
│   ├── product/            (empty, ready)
│   ├── cart/               (empty, ready)
│   ├── search/             (empty, ready)
│   ├── filter/             (empty, ready)
│   ├── whatsapp/           (empty, ready)
│   ├── home/               (empty, ready)
│   └── shared/
│       └── Providers.tsx   ✅
├── hooks/                  (empty, ready)
├── lib/
│   ├── cn.ts               ✅
│   ├── formatCurrency.ts   ✅
│   ├── getProductUrl.ts    ✅
│   └── getCategoryUrl.ts   ✅
├── store/
│   ├── cartStore.ts        ✅
│   └── uiStore.ts          ✅
├── types/
│   └── index.ts            ✅
├── sanity/
│   ├── env.ts              ✅ (exists)
│   ├── schemaTypes/
│   │   ├── documents/      (empty, ready)
│   │   └── objects/        (empty, ready)
│   ├── lib/                (empty, ready)
│   └── types/              (empty, ready)
├── .env.example            ✅
├── .env.local              ✅ (gitignored)
└── next.config.ts          ✅ headers + images
```

---

### Acceptance Criteria

- [ ] `npm run dev` starts without errors on `localhost:3000`
- [ ] `npm run build` completes with zero errors
- [ ] `npm run lint` returns zero warnings/errors
- [ ] TypeScript strict mode: zero type errors (`npx tsc --noEmit`)
- [ ] All Shadcn components installed and importable
- [ ] Cart store: add an item, refresh page — item persists in localStorage
- [ ] UI store: `isCartOpen` defaults to `false`
- [ ] `formatCurrency(1299)` returns `"₹1,299"`
- [ ] `cn("px-4", undefined, "py-2")` returns `"px-4 py-2"` without errors
- [ ] Security headers visible in browser DevTools Network tab → Response Headers
- [ ] Font loads without FOUT (check Network tab for font files)
- [ ] No `.env.local` visible in git status (covered by `.gitignore`)

---

### Estimated Time

| Task | Time |
|---|---|
| Tailwind + design tokens | 2 h |
| Shadcn init + component install | 1 h |
| Fonts + layout | 1 h |
| tsconfig + ESLint | 0.5 h |
| Folder scaffold | 0.5 h |
| Utility functions | 1 h |
| Types | 0.5 h |
| Zustand stores | 1.5 h |
| Providers + root layout | 1 h |
| next.config.ts | 1 h |
| `.env` files | 0.5 h |
| **Total** | **~11 h (1.5 days)** |

---

---

## Phase 2 — Sanity CMS

**Duration:** 2–3 days  
**Goal:** A complete, typed Sanity schema covering all content types, a configured Studio, working client libraries, all GROQ queries defined, and a functioning on-demand ISR revalidation webhook. The database layer is complete before any UI is built.

---

### Tasks

#### 2.1 · Object Type Schemas

Create reusable object types first (they are referenced by document types):

- **`sanity/schemaTypes/objects/imageWithAlt.ts`**
  - Fields: `asset` (image, required), `alt` (string, required, validation: min 1 char), `caption` (string, optional)

- **`sanity/schemaTypes/objects/seoFields.ts`**
  - Fields: `metaTitle` (string, max 70 chars), `metaDescription` (string, max 160 chars), `ogImage` (imageWithAlt), `noIndex` (boolean, default false)

- **`sanity/schemaTypes/objects/productVariant.ts`**
  - Fields: `label` (string, required — e.g., "Size"), `value` (string, required — e.g., "M"), `priceModifier` (number, default 0), `inStock` (boolean, default true), `sku` (string), `image` (imageWithAlt)

- **`sanity/schemaTypes/objects/priceObject.ts`**
  - Fields: `amount` (number, required), `currency` (string, default "INR")

- **`sanity/schemaTypes/objects/ctaButton.ts`**
  - Fields: `label` (string, required), `url` (url, required), `variant` (string enum: `primary | secondary | outline`)

- **`sanity/schemaTypes/objects/heroBanner.ts`**
  - Fields: `desktopImage` (imageWithAlt, required), `mobileImage` (imageWithAlt), `headline` (string, required), `subheadline` (string), `cta` (ctaButton), `textColorScheme` (string enum: `light | dark`)

- **`sanity/schemaTypes/objects/testimonial.ts`**
  - Fields: `quote` (string, required), `customerName` (string, required), `rating` (number, min 1 max 5), `avatar` (imageWithAlt)

- **`sanity/schemaTypes/objects/uspItem.ts`**
  - Fields: `iconName` (string, required — maps to an icon component), `title` (string, required), `subtitle` (string)

- **`sanity/schemaTypes/objects/navItem.ts`**
  - Fields: `label` (string, required), `url` (string), `children` (array of `navItem` reference — for sub-items)

#### 2.2 · Document Type Schemas

- **`sanity/schemaTypes/documents/product.ts`**  
  All fields from `ARCHITECTURE.md § 25`. Key implementation notes:
  - `slug` field: `source: 'name'`, `isUnique` validator
  - `images` field: `arrayOf(imageWithAlt)`, min 1, max 8, validation rule
  - `price` field: validation `Rule.min(0).error("Price cannot be negative")`
  - `salePrice` field: validation that `salePrice < price`
  - `categories` field: `arrayOf(reference({ to: [{ type: 'category' }] }))`, min 1
  - `publishedAt`: `datetime`, default to `new Date().toISOString()`
  - `badge` field: `string` with `list` of options: `[{title: 'New', value: 'new'}, ...]`

- **`sanity/schemaTypes/documents/category.ts`**  
  All fields from `ARCHITECTURE.md § 25`. Key notes:
  - `parent` field: `reference({ to: [{ type: 'category' }] })` — self-referential
  - Prevent circular references: validation that a category cannot reference itself

- **`sanity/schemaTypes/documents/staticPage.ts`**  
  Fields: `title`, `slug`, `body` (Portable Text with full block content), `seo`

- **`sanity/schemaTypes/documents/homePage.ts`**  
  This is a singleton. Mark it as such in Studio structure (only one document of this type can exist). All fields from `ARCHITECTURE.md § 25`.

- **`sanity/schemaTypes/documents/siteSettings.ts`**  
  Singleton. All fields from `ARCHITECTURE.md § 25`. The `whatsappNumber` field should have validation: must match E.164 pattern `/^\d{10,15}$/`.

#### 2.3 · Schema Index

- Open `sanity/schemaTypes/index.ts`.
- Replace the default blog-starter types (author, post, category, blockContent) with the new e-commerce types.
- Export all document types and object types as a single `schemaTypes` array.

#### 2.4 · Sanity Studio Structure

Open `sanity/structure.ts` and define the sidebar structure:

```
Content
├── 🏠 Homepage          (singleton — opens the one document directly)
├── ⚙️ Site Settings     (singleton)
│
Products
├── 📦 Products          (list of all product documents)
└── 🗂️ Categories        (list of all category documents)

Pages
└── 📄 Static Pages      (list of staticPage documents)
```

Singletons should use `S.editor()` not `S.documentList()` so only one document opens.

#### 2.5 · Sanity Clients

- **`sanity/lib/client.ts`** (CDN client — replace existing):
  ```typescript
  export const client = createClient({
    projectId, dataset, apiVersion,
    useCdn: true,
    perspective: 'published',
    stega: { enabled: false }
  });
  ```

- **`sanity/lib/serverClient.ts`** (Server-only client, new file):
  ```typescript
  // This file MUST NOT be imported in any client component.
  export const serverClient = createClient({
    projectId, dataset, apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    perspective: 'published',
  });
  ```

#### 2.6 · GROQ Queries

Create `sanity/lib/queries.ts` with all query constants. Define these fragments and queries:

**Fragments (reusable sub-projections):**
- `PRODUCT_CARD_FIELDS` — minimal fields for grid cards (id, name, slug, price, salePrice, badge, inStock, image with LQIP, category name)
- `SEO_FIELDS` — projection for SEO object
- `IMAGE_WITH_ALT_FIELDS` — projection including LQIP

**Full queries:**
- `HOMEPAGE_QUERY` — all homepage data in one request
- `SITE_SETTINGS_QUERY` — store name, whatsapp, nav, announcement bar
- `PRODUCTS_QUERY` — paginated, filterable, sortable product list
- `PRODUCT_COUNT_QUERY` — total count for pagination (same filters, no pagination)
- `PRODUCT_BY_SLUG_QUERY` — full product data for PDP
- `PRODUCT_STATIC_PATHS_QUERY` — slugs only, for `generateStaticParams`
- `CATEGORIES_QUERY` — all categories with parent reference
- `CATEGORY_BY_SLUG_QUERY` — full category + its products
- `CATEGORY_STATIC_PATHS_QUERY` — slugs only
- `SEARCH_SUGGESTIONS_QUERY` — top 5 name matches
- `SEARCH_RESULTS_QUERY` — paginated full-text search
- `STATIC_PAGE_BY_SLUG_QUERY` — full static page content
- `STATIC_PAGE_SLUGS_QUERY` — all static page slugs
- `FILTER_OPTIONS_QUERY` — available sizes, colors, price range for a given category

#### 2.7 · Typed Fetch Wrappers

Create `sanity/lib/fetch.ts` with one typed async function per query:

- `fetchHomepage(): Promise<HomepageData>`
- `fetchSiteSettings(): Promise<SiteSettings>`
- `fetchProducts(params: ProductQueryParams): Promise<{ products: ProductCard[]; total: number }>`
- `fetchProductBySlug(slug: string): Promise<Product | null>`
- `fetchProductStaticPaths(): Promise<{ slug: string }[]>`
- `fetchCategories(): Promise<Category[]>`
- `fetchCategoryBySlug(slug: string): Promise<CategoryWithProducts | null>`
- `fetchCategoryStaticPaths(): Promise<{ slug: string }[]>`
- `fetchSearchResults(query: string, params: SearchParams): Promise<SearchResults>`
- `fetchStaticPage(slug: string): Promise<StaticPage | null>`
- `fetchStaticPageSlugs(): Promise<{ slug: string }[]>`
- `fetchFilterOptions(categoryId?: string): Promise<FilterOptions>`

Each function wraps the GROQ query with correct `{ next: { revalidate, tags } }` options.

#### 2.8 · Sanity TypeGen

Run: `npx sanity typegen generate`

This generates `sanity/types/sanity.types.ts` — typed interfaces for all documents, objects, and query results.

Commit the generated file. Re-run whenever schemas change.

#### 2.9 · Revalidation Webhook Handler

Create `app/api/revalidate/route.ts`:

- Accept `POST` requests only.
- Read `SANITY_REVALIDATE_SECRET` from env.
- Validate `Authorization: Bearer <secret>` header — return 401 if invalid.
- Read `_type` from request body JSON.
- Map document types to cache tags and call `revalidateTag()`.
- Return `{ revalidated: true, type: _type }`.
- Use the `serverClient` (not CDN client) for any verification fetches.

```
_type mapping:
  'product'       → revalidateTag('products'), revalidateTag('homepage')
  'category'      → revalidateTag('categories'), revalidateTag('homepage')
  'homePage'      → revalidateTag('homepage')
  'siteSettings'  → revalidateTag('site')
  'staticPage'    → revalidateTag('pages')
```

#### 2.10 · Seed Test Data in Sanity Studio

Using the running Sanity Studio at `/studio`:
- Create 1 Site Settings document (store name, WhatsApp number, default SEO).
- Create 3–4 categories (e.g., "Men", "Women", "Accessories" with a "Shoes" sub-category under Men).
- Create 8–10 test products with images, prices, and categories assigned.
- Create 1 Homepage document with hero and 4 featured products.
- Create 1 "About" static page.

This seed data is required for Phase 3+ development.

#### 2.11 · Sanity Image Utility

- Open `sanity/lib/image.ts` (already exists from scaffold).
- Ensure it exports `urlFor(source: SanityImageSource)` using `@sanity/image-url`.
- Add a helper `urlForWithDimensions(source, width, height, quality?)` for common transforms.

---

### Files Created / Modified

```
Modified:
  sanity/schemaTypes/index.ts
  sanity/structure.ts
  sanity/lib/client.ts       (replace existing)
  sanity/lib/image.ts        (update)

Created:
  sanity/schemaTypes/objects/imageWithAlt.ts
  sanity/schemaTypes/objects/seoFields.ts
  sanity/schemaTypes/objects/productVariant.ts
  sanity/schemaTypes/objects/priceObject.ts
  sanity/schemaTypes/objects/ctaButton.ts
  sanity/schemaTypes/objects/heroBanner.ts
  sanity/schemaTypes/objects/testimonial.ts
  sanity/schemaTypes/objects/uspItem.ts
  sanity/schemaTypes/objects/navItem.ts
  sanity/schemaTypes/documents/product.ts
  sanity/schemaTypes/documents/category.ts
  sanity/schemaTypes/documents/staticPage.ts
  sanity/schemaTypes/documents/homePage.ts
  sanity/schemaTypes/documents/siteSettings.ts
  sanity/lib/serverClient.ts
  sanity/lib/queries.ts
  sanity/lib/fetch.ts
  sanity/types/sanity.types.ts  (auto-generated)
  app/api/revalidate/route.ts
```

---

### Folder Structure After Phase 2

```
sanity/
├── env.ts                      ✅
├── lib/
│   ├── client.ts               ✅ CDN client
│   ├── serverClient.ts         ✅ token client
│   ├── image.ts                ✅ urlFor helper
│   ├── queries.ts              ✅ all GROQ queries
│   └── fetch.ts                ✅ typed fetch wrappers
├── schemaTypes/
│   ├── index.ts                ✅ all types exported
│   ├── documents/
│   │   ├── product.ts          ✅
│   │   ├── category.ts         ✅
│   │   ├── staticPage.ts       ✅
│   │   ├── homePage.ts         ✅
│   │   └── siteSettings.ts     ✅
│   └── objects/
│       ├── imageWithAlt.ts     ✅
│       ├── seoFields.ts        ✅
│       ├── productVariant.ts   ✅
│       ├── priceObject.ts      ✅
│       ├── ctaButton.ts        ✅
│       ├── heroBanner.ts       ✅
│       ├── testimonial.ts      ✅
│       ├── uspItem.ts          ✅
│       └── navItem.ts          ✅
├── structure.ts                ✅
└── types/
    └── sanity.types.ts         ✅ (generated)

app/api/revalidate/route.ts     ✅
```

---

### Acceptance Criteria

- [ ] Sanity Studio loads at `localhost:3000/studio` without errors
- [ ] All 5 document types appear in the Studio sidebar under correct groups
- [ ] Homepage and Site Settings are singletons (only one document can be created)
- [ ] Creating a product with no image is blocked (Sanity validation error)
- [ ] Creating a product with `salePrice > price` is blocked (validation error)
- [ ] `sanity typegen generate` runs without errors
- [ ] `sanity/types/sanity.types.ts` contains typed interfaces for `Product`, `Category`, `SiteSettings`
- [ ] `fetchProductBySlug('test-slug')` returns typed data with zero TypeScript errors
- [ ] `POST /api/revalidate` with incorrect secret returns 401
- [ ] `POST /api/revalidate` with correct secret + `_type: 'product'` returns `{ revalidated: true }`
- [ ] 8+ test products visible in Studio and queryable via GROQ Vision tool
- [ ] Fetching homepage data in a test RSC renders product names correctly

---

### Estimated Time

| Task | Time |
|---|---|
| Object schemas (9 types) | 2 h |
| Document schemas (5 types) | 3 h |
| Studio structure | 1 h |
| Sanity clients | 0.5 h |
| GROQ queries file | 2 h |
| Typed fetch wrappers | 1.5 h |
| TypeGen + type review | 1 h |
| Revalidation webhook | 1.5 h |
| Seed test data | 1.5 h |
| **Total** | **~14 h (2 days)** |

---

---

## Phase 3 — Homepage

**Duration:** 2–3 days  
**Goal:** A fully rendered, CMS-driven homepage with working header (desktop mega-menu + mobile drawer), footer, announcement bar, and all homepage sections. The site looks shippable at the end of this phase.

---

### Tasks

#### 3.1 · Shared: `SanityImage` Component

Create `components/shared/SanityImage.tsx`:
- Props: `image: SanityImageSource`, `alt: string`, `width?: number`, `height?: number`, `sizes: string`, `priority?: boolean`, `fill?: boolean`, `className?: string`, `quality?: number`
- Internally: builds the Sanity CDN URL using `urlFor`, appends `?auto=format&q={quality}`.
- Renders Next.js `<Image>` with `placeholder="blur"` and `blurDataURL` from LQIP.
- Falls back to `alt=""` for decorative images when `alt` is explicitly passed as `""`.

#### 3.2 · Shared: `PortableText` Component

Create `components/shared/PortableText.tsx`:
- Install: `npm install @portabletext/react`
- Renders Sanity Portable Text blocks.
- Custom components for: `h1`, `h2`, `h3`, `h4`, `strong`, `em`, `blockquote`, `ul`, `ol`, `li`, `a` (opens external links in new tab with `rel="noopener noreferrer"`).
- Apply Tailwind prose classes for readable body text.

#### 3.3 · Layout: `AnnouncementBar`

Create `components/layout/AnnouncementBar.tsx` (Client Component):
- Props: `text: string`, `linkText?: string`, `linkUrl?: string`
- Renders a dismissible full-width strip above the header.
- Dismiss stores flag in `sessionStorage` — bar stays hidden for the session.
- Accessibility: dismiss button has `aria-label="Dismiss announcement"`.
- Hides itself completely (returns `null`) if dismissed.

#### 3.4 · Layout: `Header`

Create `components/layout/Header.tsx` (Server Component shell with Client sub-components):
- Fetches site settings (logo, nav structure) server-side via `fetchSiteSettings()`.
- Renders: `<AnnouncementBar />`, main header row (logo, nav, icons).
- Sticky behavior: handled via a Client Component wrapper `StickyHeader.tsx` that adds/removes classes on scroll using `useEffect`.
- Logo: `<SanityImage>` wrapped in `<Link href="/">`.
- Desktop nav: `<MegaMenu />`.
- Mobile: hamburger button triggers `uiStore.toggleMobileNav`.
- Icon group: `<SearchButton />`, `<WishlistButton />`, `<CartIcon />`.

#### 3.5 · Layout: `MegaMenu`

Create `components/layout/MegaMenu.tsx` (Client Component):
- Props: `navItems: NavItem[]`
- Renders top-level nav items as `<button>` elements (not links, since they have sub-menus).
- On hover over a top-level item: show the mega-menu panel.
- Panel layout: multi-column grid of sub-category links + optional featured image column.
- Keyboard: arrow keys navigate sub-items; Escape closes; Tab moves to next top-level item.
- `role="navigation"`, `aria-label="Main navigation"`, sub-menu items `role="menuitem"`.
- Close panel when mouse leaves the entire mega-menu area.

#### 3.6 · Layout: `MobileNav`

Create `components/layout/MobileNav.tsx` (Client Component):
- Uses Shadcn `<Sheet>` opened from the left (`side="left"`).
- Controlled by `uiStore.isMobileNavOpen`.
- Content: search bar at top, accordion navigation, social links at bottom.
- Each nav item with children renders an `<Accordion>` expand/collapse.
- Closes automatically on navigation (route change).

#### 3.7 · Layout: `CartIcon`

Create `components/cart/CartIcon.tsx` (Client Component):
- Reads `totalItems` from cart store.
- Renders a cart/bag icon with a badge showing the count.
- Badge animates (scale pulse) on count change using CSS transition.
- On click: `uiStore.openCart()`.
- Badge hidden (not rendered) when count is 0.

#### 3.8 · Layout: `Footer`

Create `components/layout/Footer.tsx` (Server Component):
- Fetches site settings (footer nav, social links, store name) server-side.
- Layout: 3–4 columns (About, Quick Links, Categories, Contact) + bottom bar (copyright).
- Social icons: SVG icons for Instagram, Facebook, Twitter, YouTube — linked from settings.
- WhatsApp icon linking to the store number.
- "Powered by" line (optional).

#### 3.9 · Home: `HeroSection`

Create `components/home/HeroSection.tsx` (Client Component — for carousel):
- Props: `slides: HeroBanner[]`
- Single slide: renders full-bleed `<SanityImage>` with overlay text and CTA button.
- Multi-slide: auto-advances every 5 s, pauses on hover/focus.
- Desktop image vs mobile image via `<picture>` with `srcset`.
- First slide image has `priority` prop (LCP candidate).
- Dots indicator with screen-reader text ("Slide 1 of 3").
- Prev/Next arrow buttons with `aria-label`.

#### 3.10 · Home: `CategoryChips`

Create `components/home/CategoryChips.tsx` (Server Component):
- Props: `categories: CategoryCard[]`
- Horizontal scroll on mobile (`overflow-x-auto`, `scroll-snap-type: x mandatory`).
- 4–6 column grid on desktop.
- Each chip: square `<SanityImage>` + category name + `<Link>` wrapping the whole card.

#### 3.11 · Home: `FeaturedProducts`

Create `components/home/FeaturedProducts.tsx` (Server Component):
- Props: `title: string`, `products: ProductCard[]`
- Section title (h2).
- Renders `<ProductGrid>` with the supplied products.
- "View all" link below the grid.

Note: `ProductGrid` and `ProductCard` are created in Phase 4. In Phase 3, use placeholder card shapes (gray boxes) to unblock layout work. Swap with real components in Phase 4.

#### 3.12 · Home: `PromoBanner`

Create `components/home/PromoBanner.tsx` (Server Component):
- Props: `banner: HeroBanner`
- Split layout: image left (60%), text right (40%) on desktop.
- Stacked (image top, text bottom) on mobile.
- Text: headline, body text, CTA button.
- Background color fallback if no image is provided.

#### 3.13 · Home: `UspBar`

Create `components/home/UspBar.tsx` (Server Component):
- Props: `items: UspItem[]`
- 3–4 column flex strip.
- Each item: icon (from `iconName` mapped to SVG) + title + subtitle.
- Light gray background. `role="list"` on the container.

#### 3.14 · Home: `TestimonialsSection`

Create `components/home/TestimonialsSection.tsx` (Client Component — carousel):
- Props: `testimonials: Testimonial[]`
- Mobile: single-item carousel with swipe.
- Desktop: 3-column grid.
- Each card: quote, star rating, customer name, optional avatar.
- Star rating rendered accessibly: `<span role="img" aria-label="X out of 5 stars">★★★★☆</span>`.

#### 3.15 · Homepage Page

Open `app/page.tsx` (Server Component):
- Call `fetchHomepage()` and `fetchSiteSettings()`.
- Add `{ next: { revalidate: 60, tags: ['homepage', 'site'] } }`.
- Render all home sections in order: `<HeroSection>`, `<CategoryChips>`, `<FeaturedProducts>`, `<PromoBanner>`, optional secondary products, `<TestimonialsSection>`, `<UspBar>`.
- No loading state needed at the page level (Suspense in layout handles it).

#### 3.16 · Homepage Loading State

Create `app/loading.tsx`:
- Full-page skeleton matching homepage sections.
- Hero: tall gray rectangle with `animate-pulse`.
- Category chips: row of 4 circular skeletons.
- Product grid: 8 card-shaped skeletons.

#### 3.17 · Static Pages (About, Contact, FAQ, etc.)

Create `app/[slug]/page.tsx` (Server Component):
- Call `fetchStaticPage(slug)`.
- If not found: `notFound()`.
- Render title as `<h1>` and body as `<PortableText>`.
- Generate metadata from `seo` override fields or page title.
- `generateStaticParams()` fetches all static page slugs.

---

### Files Created / Modified

```
Modified:
  app/layout.tsx          (add Header, Footer)
  app/page.tsx            (homepage RSC)

Created:
  app/loading.tsx
  app/[slug]/page.tsx
  components/shared/SanityImage.tsx
  components/shared/PortableText.tsx
  components/layout/AnnouncementBar.tsx
  components/layout/Header.tsx
  components/layout/StickyHeader.tsx
  components/layout/MegaMenu.tsx
  components/layout/MobileNav.tsx
  components/layout/Footer.tsx
  components/layout/Breadcrumb.tsx
  components/cart/CartIcon.tsx
  components/home/HeroSection.tsx
  components/home/CategoryChips.tsx
  components/home/FeaturedProducts.tsx
  components/home/PromoBanner.tsx
  components/home/UspBar.tsx
  components/home/TestimonialsSection.tsx
```

---

### Folder Structure After Phase 3

```
app/
├── layout.tsx          ✅ Header + Footer wired
├── page.tsx            ✅ Homepage RSC
├── loading.tsx         ✅ Homepage skeleton
├── [slug]/
│   └── page.tsx        ✅ Static pages
├── globals.css         ✅
└── api/revalidate/     ✅

components/
├── layout/
│   ├── Header.tsx          ✅
│   ├── StickyHeader.tsx    ✅
│   ├── MegaMenu.tsx        ✅
│   ├── MobileNav.tsx       ✅
│   ├── Footer.tsx          ✅
│   ├── AnnouncementBar.tsx ✅
│   └── Breadcrumb.tsx      ✅
├── cart/
│   └── CartIcon.tsx        ✅
├── home/
│   ├── HeroSection.tsx         ✅
│   ├── CategoryChips.tsx       ✅
│   ├── FeaturedProducts.tsx    ✅
│   ├── PromoBanner.tsx         ✅
│   ├── UspBar.tsx              ✅
│   └── TestimonialsSection.tsx ✅
└── shared/
    ├── Providers.tsx       ✅
    ├── SanityImage.tsx     ✅
    └── PortableText.tsx    ✅
```

---

### Acceptance Criteria

- [ ] Homepage renders all sections with real CMS data (no hardcoded content)
- [ ] Changing hero headline in Sanity and publishing updates the page within 60 s (ISR revalidation)
- [ ] Announcement bar dismisses on ✕ click and does not re-appear in same session
- [ ] Desktop mega-menu opens on hover, keyboard-navigable, closes on Escape
- [ ] Mobile drawer opens from hamburger, shows accordion categories, closes on navigation
- [ ] Footer shows correct store name, social links, and footer nav from CMS
- [ ] `SanityImage` renders blurred LQIP placeholder before full image loads
- [ ] Hero image has `priority` attribute (visible as `fetchpriority="high"` in source)
- [ ] Visiting `/about` renders the About page content from Sanity Portable Text
- [ ] `npm run build` — `app/page.tsx` shows as static/ISR in build output, not dynamic

---

### Estimated Time

| Task | Time |
|---|---|
| SanityImage + PortableText | 2 h |
| AnnouncementBar | 1 h |
| Header + StickyHeader | 2 h |
| MegaMenu | 3 h |
| MobileNav (drawer) | 2 h |
| CartIcon | 1 h |
| Footer | 1.5 h |
| Hero Section | 2.5 h |
| Other home sections (5×) | 3 h |
| Homepage page.tsx + loading | 1 h |
| Static pages | 1 h |
| **Total** | **~20 h (2.5 days)** |

---

---

## Phase 4 — Product Pages

**Duration:** 3–4 days  
**Goal:** Complete Product Listing Page (PLP), Product Detail Page (PDP), Category Page, Search, and Filter system — the core commerce experience.

---

### Tasks

#### 4.1 · `ProductBadge` Component

Create `components/product/ProductBadge.tsx`:
- Props: `badge: BadgeType`
- Renders a small colored `<span>` with text (New / Sale / Best Seller / etc.).
- Color mapping: `new` → green, `sale` → red, `bestSeller` → amber, `limitedEdition` → purple.
- Returns `null` if no badge.

#### 4.2 · `ProductPrice` Component

Create `components/product/ProductPrice.tsx`:
- Props: `price: number`, `salePrice?: number | null`, `currency?: string`
- If `salePrice` exists: renders sale price prominently + original price struck through.
- Accessible: `<span aria-label="Sale price: ₹X">₹X</span> <span aria-label="Original price: ₹Y" className="line-through">₹Y</span>`
- Uses `formatCurrency()` from `lib/`.

#### 4.3 · `ProductCard` Component

Create `components/product/ProductCard.tsx`:
- Props: `product: ProductCard`, `priority?: boolean`
- Layout: image container (1:1 aspect ratio) + info section.
- Image: `<SanityImage>` with `sizes="(max-width: 768px) 50vw, 25vw"`.
- On hover (desktop only, `@media (hover: hover)`): transition to secondary image if available.
- Badge overlay in top-left corner.
- Wishlist icon (♡) in top-right corner — from `useWishlist` hook.
- Info: category tag (small text), product name, star rating (if future-proofed), `<ProductPrice />`.
- Entire card wrapped in `<Link href={getProductUrl(slug)}>` with the info section overlapping the link for clean HTML.
- Out-of-stock overlay: semi-transparent layer + "Out of Stock" text.

#### 4.4 · `ProductGrid` Component

Create `components/product/ProductGrid.tsx`:
- Props: `products: ProductCard[]`, `columns?: 2 | 3 | 4`, `priority?: boolean` (passes to first card)
- CSS grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- `columns` prop overrides the default grid.
- Maps over products → `<ProductCard>` with `priority={i === 0 && priority}`.

#### 4.5 · `SortDropdown` Component

Create `components/filter/SortDropdown.tsx` (Client Component):
- Props: `value: SortOption`, `onChange: (sort: SortOption) => void`
- Uses Shadcn `<Select>`.
- Options: Newest, Price Low→High, Price High→Low, Best Sellers.

#### 4.6 · `FilterGroup` Component

Create `components/filter/FilterGroup.tsx` (Client Component):
- Props: `title: string`, `options: {label: string, value: string, count?: number}[]`, `selected: string[]`, `onChange: (values: string[]) => void`
- Renders Shadcn `<Accordion>` group.
- Each option: `<Checkbox>` + label + optional count badge.
- Active count badge on accordion header.

#### 4.7 · `ActiveFilters` Component

Create `components/filter/ActiveFilters.tsx` (Client Component):
- Props: `filters: Record<string, string[]>`, `onRemove: (key: string, value: string) => void`, `onClearAll: () => void`
- Renders removable chips for each active filter value.
- "Clear all" button if any filters are active.
- Returns `null` if no active filters.

#### 4.8 · `FilterSidebar` Component

Create `components/filter/FilterSidebar.tsx` (Client Component):
- Renders desktop left sidebar.
- Shows: Category `<FilterGroup>`, Size `<FilterGroup>`, Color `<FilterGroup>`, Price Range (Shadcn `<Slider>`), Availability toggle.
- "Clear all filters" link at top.
- Reads filter state from URL search params via `useSearchParams()` + `useRouter()`.

#### 4.9 · `FilterSheet` Component

Create `components/filter/FilterSheet.tsx` (Client Component):
- Mobile filter/sort bottom sheet using Shadcn `<Sheet side="bottom">`.
- Same filter groups as sidebar.
- "Apply Filters" (closes sheet + updates URL) and "Clear All" buttons.
- Trigger button: "Filter & Sort (n active filters)".

#### 4.10 · `useFilters` Hook

Create `hooks/useFilters.ts` (Client Hook):
- Reads current filter state from `useSearchParams()`.
- Returns: `activeFilters`, `setFilter(key, values)`, `clearFilter(key)`, `clearAll()`, `sortValue`, `setSort(value)`.
- All mutations update URL params via `router.push()` with the new query string.
- `page` param resets to `1` whenever any filter changes.

#### 4.11 · Product Listing Page (PLP)

Create `app/products/page.tsx` (Server Component):
- Reads `searchParams` (filters, sort, page).
- Calls `fetchProducts(params)` and `fetchFilterOptions()`.
- Renders: page title ("All Products"), `<ActiveFilters />`, sort + filter controls, `<ProductGrid />`, pagination.
- `generateMetadata()` for the page.
- Loading state: `app/products/loading.tsx` with 12 card skeletons.

#### 4.12 · `Pagination` Component

Create `components/shared/Pagination.tsx`:
- Props: `currentPage: number`, `totalPages: number`, `baseUrl: string`, `searchParams: Record<string, string>`
- Renders prev/next buttons + page number links.
- Each link is an `<a>` tag (not `<button>`) so search engines can crawl all pages.
- Active page highlighted. First/last page buttons disabled when at boundary.

#### 4.13 · Category Page

Create `app/categories/[slug]/page.tsx` (Server Component):
- Calls `fetchCategoryBySlug(slug)`.
- If not found: `notFound()`.
- Renders: category hero image, sub-category chips (if children exist), `<Breadcrumb>`, filter + product grid, category SEO description below grid.
- `generateStaticParams()` pre-builds top categories.
- `generateMetadata()` from category SEO fields.
- Loading state: `app/categories/[slug]/loading.tsx`.

#### 4.14 · `Breadcrumb` Component

Create `components/layout/Breadcrumb.tsx`:
- Props: `items: { label: string; href?: string }[]`
- Renders `<nav aria-label="Breadcrumb">` → `<ol>` → `<li>` items.
- Last item has no link (`aria-current="page"`).
- Separator: `›` character (not an image, no alt needed).
- Includes JSON-LD `BreadcrumbList` structured data via `<StructuredData>`.

#### 4.15 · Product Detail Page (PDP)

Create `app/products/[slug]/page.tsx` (Server Component):
- Calls `fetchProductBySlug(slug)`.
- If not found: `notFound()`.
- Renders: `<Breadcrumb>`, `<ProductGallery>`, `<ProductInfo>`, `<RelatedProducts>`.
- `generateStaticParams()` for top-N products.
- `generateMetadata()` with product-specific OG image.
- Structured data: JSON-LD `Product` schema via `<StructuredData>`.
- Loading: `app/products/[slug]/loading.tsx`.

#### 4.16 · `ProductGallery` Component

Create `components/product/ProductGallery.tsx` (Client Component):
- Props: `images: ImageWithAlt[]`
- Desktop: large main image + thumbnail strip below.
- Mobile: horizontally scrollable image list with CSS `scroll-snap`.
- Clicking a thumbnail updates the main image (local `useState`).
- Pinch-to-zoom: `touch-action: pinch-zoom` CSS on the main image container.
- Keyboard: thumbnail strip is arrow-key navigable.

#### 4.17 · `ProductVariantSelector` Component

Create `components/product/ProductVariantSelector.tsx` (Client Component):
- Props: `variants: ProductVariant[]`, `selectedVariant: ProductVariant | null`, `onChange: (variant: ProductVariant) => void`
- Groups variants by `label` (e.g., all "Size" variants together, all "Color" variants together).
- Size: pill buttons. Out-of-stock: strikethrough + `disabled`.
- Color: circular swatch buttons. Out-of-stock: diagonal line SVG overlay.
- Selected variant: distinct border/background.

#### 4.18 · `QuantitySelector` Component

Create `components/product/QuantitySelector.tsx` (Client Component):
- Props: `value: number`, `onChange: (n: number) => void`, `min?: number`, `max?: number`
- `−` button, number input, `+` button.
- Input is editable directly but clamped to `[min, max]` on blur.
- Accessible: `aria-label="Quantity"`, buttons have `aria-label="Decrease quantity"` / `"Increase quantity"`.

#### 4.19 · `ProductInfo` Component

Create `components/product/ProductInfo.tsx` (Server Component shell + Client children):
- Props: full `Product` object
- Renders: category tag, product name (h1), stock badge, `<ProductPrice>`, short description, variant selector (Client), quantity selector (Client), CTA buttons area (Client), USP strip, share button.

#### 4.20 · `WhatsAppButton` (Single Product)

Create `components/whatsapp/WhatsAppButton.tsx` (Client Component):
- Props: `product: Product`, `variant: ProductVariant | null`, `quantity: number`, `storeNumber: string`
- Creates `lib/generateWhatsAppMessage.ts`:
  - `generateSingleProductMessage(product, variant, qty)` → string
  - `generateCartMessage(items)` → string
  - Both encode the message with `encodeURIComponent`.
- Button label: "Order via WhatsApp" + WhatsApp SVG icon.
- On click: `window.open(waLink, '_blank')`.
- Fallback: if `window.open` doesn't trigger blur within 2 s, show `<WhatsAppFallbackModal>`.

#### 4.21 · `WhatsAppFallbackModal` Component

Create `components/whatsapp/WhatsAppFallbackModal.tsx` (Client Component):
- Shadcn `<Dialog>`.
- Content: message in a read-only `<textarea>`, "Copy Message" button, WhatsApp Web link.
- "Copy Message": uses `navigator.clipboard.writeText()`, shows "Copied!" confirmation.

#### 4.22 · `AddToCartButton` Component

Create a Client Component `components/product/AddToCartButton.tsx`:
- Props: `product: ProductCard`, `variant: ProductVariant | null`, `quantity: number`
- On click: calls `cartStore.addItem()`, then shows a success toast.
- Shows loading spinner for 300 ms after click (simulates feedback).
- Disabled when product is out of stock.

#### 4.23 · Sticky Mobile CTA Bar

Create `components/product/StickyProductCta.tsx` (Client Component):
- Visible only on mobile (`md:hidden`).
- Fixed to bottom of screen: quantity selector + "Order via WhatsApp" button.
- Hides when the main CTA buttons are visible in the viewport (IntersectionObserver).

#### 4.24 · `RelatedProducts` Component

Create `components/product/RelatedProducts.tsx` (Server Component):
- Props: `products: ProductCard[]`
- Renders a `<ProductGrid>` with max 4 products.
- Section heading: "You may also like".

#### 4.25 · Search System

Create `hooks/useSearch.ts`:
- Accepts `initialQuery: string`.
- Debounces query (300 ms) before fetching suggestions.
- Fetches via `fetchSearchSuggestions(debouncedQuery)`.
- Returns: `suggestions`, `isLoading`, `recentSearches` (from localStorage).

Create `components/search/SearchBar.tsx` (Client Component):
- Controlled input with clear (✕) button.
- Calls `useSearch` for live suggestions.
- Renders `<SearchSuggestions>` dropdown when focused + suggestions exist.
- On submit: navigates to `/search?q={query}`, saves to recent searches.

Create `components/search/SearchSuggestions.tsx` (Client Component):
- Dropdown list of up to 5 suggestions.
- Each item: thumbnail, name, price, category.
- Keyboard: Up/Down arrows navigate; Enter selects; Escape closes.
- "See all results for X" item at the bottom.

Create `components/search/SearchModal.tsx` (Client Component):
- Full-screen modal overlay for mobile search.
- Triggered by header search icon.
- Contains `<SearchBar>` + recent searches list.
- Controlled by `uiStore.isSearchOpen`.

Create `app/search/page.tsx` (Client Component — dynamic):
- Reads `q` from `useSearchParams()`.
- Calls `fetchSearchResults(q, params)` (client-side, no caching needed).
- Renders: result count heading, `<ProductGrid>`, filter/sort controls, zero-results state.

---

### Files Created / Modified

```
Modified:
  app/page.tsx            (replace placeholder FeaturedProducts with real ProductGrid)

Created:
  app/products/page.tsx
  app/products/loading.tsx
  app/products/[slug]/page.tsx
  app/products/[slug]/loading.tsx
  app/products/[slug]/not-found.tsx
  app/categories/[slug]/page.tsx
  app/categories/[slug]/loading.tsx
  app/search/page.tsx
  components/product/ProductBadge.tsx
  components/product/ProductPrice.tsx
  components/product/ProductCard.tsx
  components/product/ProductGrid.tsx
  components/product/ProductGallery.tsx
  components/product/ProductInfo.tsx
  components/product/ProductVariantSelector.tsx
  components/product/QuantitySelector.tsx
  components/product/AddToCartButton.tsx
  components/product/StickyProductCta.tsx
  components/product/RelatedProducts.tsx
  components/filter/FilterGroup.tsx
  components/filter/FilterSidebar.tsx
  components/filter/FilterSheet.tsx
  components/filter/ActiveFilters.tsx
  components/filter/SortDropdown.tsx
  components/whatsapp/WhatsAppButton.tsx
  components/whatsapp/WhatsAppCheckoutButton.tsx
  components/whatsapp/WhatsAppFallbackModal.tsx
  components/shared/StructuredData.tsx
  components/shared/Pagination.tsx
  components/shared/EmptyState.tsx
  components/layout/Breadcrumb.tsx
  components/search/SearchBar.tsx
  components/search/SearchSuggestions.tsx
  components/search/SearchModal.tsx
  hooks/useFilters.ts
  hooks/useSearch.ts
  hooks/useWishlist.ts
  lib/generateWhatsAppMessage.ts
```

---

### Folder Structure After Phase 4

```
app/
├── products/
│   ├── page.tsx            ✅ PLP
│   ├── loading.tsx         ✅
│   └── [slug]/
│       ├── page.tsx        ✅ PDP
│       ├── loading.tsx     ✅
│       └── not-found.tsx   ✅
├── categories/
│   └── [slug]/
│       ├── page.tsx        ✅
│       └── loading.tsx     ✅
└── search/
    └── page.tsx            ✅

components/
├── product/        ✅ (8 components)
├── filter/         ✅ (5 components)
├── whatsapp/       ✅ (3 components)
├── search/         ✅ (3 components)
└── shared/
    ├── StructuredData.tsx  ✅
    ├── Pagination.tsx      ✅
    └── EmptyState.tsx      ✅

hooks/
├── useFilters.ts   ✅
├── useSearch.ts    ✅
└── useWishlist.ts  ✅

lib/
└── generateWhatsAppMessage.ts  ✅
```

---

### Acceptance Criteria

- [ ] PLP shows a grid of products from CMS with images, names, and prices
- [ ] Selecting a size filter updates the URL (`?size=M`) and shows only matching products
- [ ] Multiple filters stack correctly (`?size=M&color=red` shows M AND red products)
- [ ] "Clear all" removes all filters from URL and shows all products
- [ ] Sorting by "Price Low→High" reorders the grid correctly
- [ ] Active filter chips appear; clicking × removes that specific filter
- [ ] Category page renders the hero image and sub-category chips from CMS
- [ ] PDP renders all product images in the gallery
- [ ] Switching variant updates price and stock status
- [ ] "Order via WhatsApp" generates a message with the correct product name, selected variant, quantity, and price
- [ ] "Add to Cart" adds the item; toast confirms; cart icon badge increments
- [ ] Out-of-stock product: WhatsApp button is replaced with "Out of Stock — Notify Me"
- [ ] Search: typing 3+ characters shows live suggestion dropdown
- [ ] Search results page shows products with filter/sort working
- [ ] Zero results page shows "No products found" + suggested products
- [ ] Breadcrumb on PDP shows correct path and links correctly
- [ ] Sticky bottom CTA bar visible on mobile PDP; hides when page-level buttons are in viewport

---

### Estimated Time

| Task | Time |
|---|---|
| ProductBadge + ProductPrice | 1 h |
| ProductCard + ProductGrid | 2 h |
| Filter components (5) | 4 h |
| useFilters hook | 1.5 h |
| PLP + Pagination | 2 h |
| Category page | 1.5 h |
| Breadcrumb | 1 h |
| ProductGallery | 2.5 h |
| ProductVariantSelector + Quantity | 2 h |
| ProductInfo + AddToCart | 1.5 h |
| WhatsApp components + message generator | 2 h |
| Sticky CTA bar | 1 h |
| PDP page.tsx | 1.5 h |
| Search (3 components + hook) | 3 h |
| Search results page | 1.5 h |
| EmptyState + StructuredData | 1 h |
| **Total** | **~29 h (3.5 days)** |

---

---

## Phase 5 — Cart

**Duration:** 1–2 days  
**Goal:** A fully functional cart — slide-over drawer, full cart page, correct line-item handling, quantity management, and the WhatsApp checkout button generating a complete order summary.

---

### Tasks

#### 5.1 · `CartItem` Component

Create `components/cart/CartItem.tsx` (Client Component):
- Props: `item: CartItem`, `onRemove: () => void`, `onUpdateQuantity: (qty: number) => void`
- Layout: product image (60×60), name, variant info, quantity controls, line total, remove button.
- Image uses `<SanityImage>` with `width=60 height=60`.
- Variant info: small gray text below name (e.g., "Size: M / Color: Red").
- Quantity: inline `−` count `+` buttons (reuse `<QuantitySelector>`).
- Line total: `formatCurrency(item.price * item.quantity)`.
- Remove: trash icon button with `aria-label="Remove {name} from cart"`.
- Subtle fade-out animation when removed.

#### 5.2 · `CartSummary` Component

Create `components/cart/CartSummary.tsx` (Client Component):
- Props: `subtotal: number`, `currency?: string`, `notes?: string`, `onNotesChange?: (v: string) => void`
- Renders: subtotal row, delivery note ("Delivery charges confirmed via WhatsApp"), order notes `<textarea>` (optional).
- Does NOT render the checkout button — that is the parent's responsibility.

#### 5.3 · `WhatsAppCheckoutButton` Component

Create `components/whatsapp/WhatsAppCheckoutButton.tsx` (Client Component):
- Props: `cart: CartItem[]`, `storeNumber: string`, `notes?: string`
- Calls `generateCartMessage(cart, notes)` from `lib/generateWhatsAppMessage.ts`.
- Full-width primary button with WhatsApp icon.
- Label: "Checkout via WhatsApp".
- Disabled if cart is empty.
- Same fallback behavior as `<WhatsAppButton>` (2-second blur detection).

#### 5.4 · `CartDrawer` Component

Create `components/cart/CartDrawer.tsx` (Client Component):
- Uses Shadcn `<Sheet side="right">`.
- Controlled by `uiStore.isCartOpen`.
- Header: "Your Cart (n items)", close button.
- Body: scrollable list of `<CartItem>` components.
- Footer (sticky at bottom of drawer): `<CartSummary>` + `<WhatsAppCheckoutButton>` + "Continue Shopping" link.
- Empty state: bag illustration + "Your cart is empty" + "Shop Now" link.
- Focus trap inside drawer when open.
- `aria-label="Shopping cart"`, `role="dialog"`.

#### 5.5 · Cart Page

Create `app/cart/page.tsx` (Client Component — user-specific state):
- Reads cart from `cartStore`.
- Full-page layout:
  - Left (60%): list of `<CartItem>` components.
  - Right (40%): order summary card + notes + `<WhatsAppCheckoutButton>`.
  - On mobile: stacked (items first, summary second).
- "Clear cart" button with confirmation dialog (Shadcn `<AlertDialog>`).
- Empty state if cart is empty.
- Breadcrumb: `Home > Cart`.

#### 5.6 · Post-Checkout Toast

After clicking the WhatsApp checkout button:
- Show a Shadcn toast: "Your order has been sent! Await confirmation from our team."
- The toast appears as soon as the WhatsApp link opens (not on confirmation, since that's external).
- "Continue Shopping" action in the toast.

#### 5.7 · "Add to Cart" Toast Upgrade

Update the toast shown after `AddToCartButton` click:
- Shows product image (thumbnail), product name, variant.
- "View Cart" action that opens the cart drawer.
- Auto-dismisses after 4 s.

#### 5.8 · Cart Persistence Verification

Test and verify:
- Add 3 items with different variants.
- Hard-refresh the page.
- All 3 items + correct variants still in cart.
- Cart total is correct.
- Verify localStorage key `'rathtech-cart'` in DevTools → Application → LocalStorage.

---

### Files Created / Modified

```
Modified:
  components/cart/CartIcon.tsx    (connect to drawer open)
  app/layout.tsx                  (add CartDrawer)

Created:
  app/cart/page.tsx
  components/cart/CartItem.tsx
  components/cart/CartSummary.tsx
  components/cart/CartDrawer.tsx
  components/whatsapp/WhatsAppCheckoutButton.tsx
```

---

### Folder Structure After Phase 5

```
app/
└── cart/
    └── page.tsx        ✅

components/
├── cart/
│   ├── CartIcon.tsx    ✅ (updated)
│   ├── CartItem.tsx    ✅
│   ├── CartSummary.tsx ✅
│   └── CartDrawer.tsx  ✅
└── whatsapp/
    ├── WhatsAppButton.tsx          ✅
    ├── WhatsAppCheckoutButton.tsx  ✅
    └── WhatsAppFallbackModal.tsx   ✅
```

---

### Acceptance Criteria

- [ ] Cart drawer opens from cart icon click on any page
- [ ] Cart drawer shows correct items, quantities, and prices
- [ ] Incrementing quantity in drawer updates line total in real time
- [ ] Removing item from drawer removes it immediately with fade animation
- [ ] Cart count badge in header updates instantly on add/remove
- [ ] Full `/cart` page matches drawer contents
- [ ] "Clear Cart" button requires confirmation; clears all items after confirm
- [ ] WhatsApp checkout button on `/cart` generates a message listing ALL cart items with variants, quantities, and prices
- [ ] WhatsApp message subtotal matches the displayed subtotal
- [ ] Adding the same product + variant a second time increments quantity (not duplicate line)
- [ ] Adding same product with DIFFERENT variant creates a separate line item
- [ ] Cart survives browser refresh (localStorage persistence)
- [ ] Empty cart shows empty state with "Shop Now" link (not a broken layout)
- [ ] Post-checkout toast appears after WhatsApp button click

---

### Estimated Time

| Task | Time |
|---|---|
| CartItem component | 1.5 h |
| CartSummary component | 0.5 h |
| CartDrawer | 2 h |
| Cart page | 2 h |
| WhatsAppCheckoutButton | 1 h |
| Toast upgrades | 1 h |
| Persistence testing | 0.5 h |
| **Total** | **~8.5 h (1 day)** |

---

---

## Phase 6 — SEO

**Duration:** 1 day  
**Goal:** Every public page scores 100 on Lighthouse SEO. All structured data validates. Sitemap and robots.txt are generated and correct.

---

### Tasks

#### 6.1 · Root Metadata

Open `app/layout.tsx` and define `metadata` export:
- `metadataBase`: `new URL(process.env.NEXT_PUBLIC_SITE_URL)`.
- `title.template`: `"%s | {Store Name}"`.
- `title.default`: `"{Store Name} — {Tagline}"`.
- `description`: default meta description from Site Settings.
- `openGraph`: site-level OG with store name, default OG image.
- `twitter.card`: `'summary_large_image'`.
- `robots`: `{ index: true, follow: true }`.

#### 6.2 · `generateMetadata` Per Page

Add `generateMetadata()` exports to every page that doesn't already have it:

| Page | Title Source | Description Source | OG Image |
|---|---|---|---|
| `/` | `Site Settings.storeName + tagline` | `Site Settings.defaultSeo` | Default OG image |
| `/products` | `"All Products"` | `"Shop our full collection"` | Default |
| `/products/[slug]` | `product.name` | `product.shortDescription` | `product.images[0]` |
| `/categories/[slug]` | `category.name` | `category.description` (plain text) | `category.heroImage` |
| `/search` | `"Search Results for \"{q}\""` | — | Default |
| `/cart` | `"Your Cart"` | — | Default |
| `/[slug]` (static) | `page.title` | From SEO override or body excerpt | Default |

All metadata respects the CMS SEO override fields (`seo.metaTitle`, `seo.metaDescription`, `seo.ogImage`) — if set, they take precedence over computed values.

#### 6.3 · Canonical Tags

Next.js `generateMetadata` automatically inserts `<link rel="canonical">` when `alternates.canonical` is set. Add it to:
- All paginated pages: canonical → page 1 URL.
- All filter URL variants: canonical → unfiltered URL.
- PDPs: canonical → `/products/[slug]`.

#### 6.4 · `StructuredData` Component

Create `components/shared/StructuredData.tsx`:
- Props: `data: Record<string, unknown>`
- Renders `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}>`
- Do not stringify in the caller — always pass a plain object.

Implement structured data in:

**Homepage (`app/page.tsx`):**
```json
{ "@type": "WebSite", "url": "...", "name": "...",
  "potentialAction": { "@type": "SearchAction",
    "target": ".../search?q={search_term_string}",
    "query-input": "required name=search_term_string" } }
```

**PDP (`app/products/[slug]/page.tsx`):**
```json
{ "@type": "Product",
  "name": "...", "image": [...], "description": "...",
  "sku": "...", "brand": { "@type": "Brand", "name": "..." },
  "offers": { "@type": "Offer", "priceCurrency": "INR",
    "price": "...", "availability": "InStock|OutOfStock",
    "url": "...", "seller": { "@type": "Organization", "name": "..." } } }
```

**PLP / Category (`BreadcrumbList`):**
```json
{ "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "..." },
    { "@type": "ListItem", "position": 2, "name": "...", "item": "..." }
  ] }
```

#### 6.5 · `robots.ts`

Create `app/robots.ts`:
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio/', '/api/'] }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
  };
}
```

#### 6.6 · `sitemap.ts`

Create `app/sitemap.ts`:
- Fetches all product slugs via `fetchProductStaticPaths()`.
- Fetches all category slugs via `fetchCategoryStaticPaths()`.
- Fetches all static page slugs via `fetchStaticPageSlugs()`.
- Returns `MetadataRoute.Sitemap` array with `url`, `lastModified` (from Sanity `_updatedAt`), `changeFrequency`, `priority`.

Priority mapping:
- Homepage: 1.0
- Category pages: 0.8
- Product pages: 0.7
- Static pages: 0.5

#### 6.7 · Open Graph Images

For product pages, the OG image should be the product's first image. Pass it in `generateMetadata`:
```typescript
images: [{
  url: urlFor(product.images[0]).width(1200).height(630).url(),
  width: 1200, height: 630, alt: product.images[0].alt
}]
```

#### 6.8 · `hreflang` (Placeholder)

No multi-language in v1. Leave a comment in `app/layout.tsx` marking where `alternates.languages` should be added in Phase 5 of the roadmap.

---

### Files Created / Modified

```
Modified:
  app/layout.tsx                      (root metadata)
  app/page.tsx                        (metadata + structured data)
  app/products/page.tsx               (metadata)
  app/products/[slug]/page.tsx        (metadata + structured data)
  app/categories/[slug]/page.tsx      (metadata + structured data)
  app/search/page.tsx                 (metadata)
  app/cart/page.tsx                   (metadata)
  app/[slug]/page.tsx                 (metadata)

Created:
  app/robots.ts
  app/sitemap.ts
  components/shared/StructuredData.tsx  (if not already done in Phase 4)
```

---

### Acceptance Criteria

- [ ] `curl https://localhost:3000/robots.txt` — correct allow/disallow rules
- [ ] `curl https://localhost:3000/sitemap.xml` — valid XML, all products and categories listed
- [ ] View page source on PDP: `<title>`, `<meta name="description">`, OG tags all correct and unique
- [ ] View page source on homepage: `<title>` different from PDP title
- [ ] View page source on PDP: `<script type="application/ld+json">` present with correct Product schema
- [ ] Google Rich Results Test (via browser): PDP structured data validates without errors
- [ ] PDP with CMS SEO override: meta title shows overridden value, not computed product name
- [ ] `/search` page has `<meta name="robots" content="noindex">` (search pages should not be indexed)
- [ ] Lighthouse SEO score ≥ 98 on homepage (run via Chrome DevTools)
- [ ] Lighthouse SEO score ≥ 98 on a PDP

---

### Estimated Time

| Task | Time |
|---|---|
| Root metadata + templates | 1 h |
| generateMetadata per page (7 pages) | 2 h |
| StructuredData component | 0.5 h |
| Structured data implementations (3) | 2 h |
| robots.ts + sitemap.ts | 1.5 h |
| OG image handling | 1 h |
| Canonical tags | 0.5 h |
| **Total** | **~8.5 h (1 day)** |

---

---

## Phase 7 — Testing & Polish

**Duration:** 2–3 days  
**Goal:** Lighthouse 95+ across all four categories on all key pages. Zero accessibility violations. All functional flows verified on both mobile and desktop.

---

### Tasks

#### 7.1 · Lighthouse Audit — All Key Pages

Run Lighthouse in Chrome DevTools (Mobile simulation, throttled) on:
- Homepage (`/`)
- PLP (`/products`)
- A PDP (`/products/[slug]`)
- A Category Page (`/categories/[slug]`)
- Cart (`/cart`)

Record baseline scores. Target: ≥ 95 Performance, 100 Accessibility, 100 Best Practices, 100 SEO.

#### 7.2 · Fix LCP Issues

Common LCP problems to check and resolve:
- Hero image not using `priority` prop → add `priority`.
- Hero image missing `fetchpriority="high"` → Next.js adds this automatically with `priority`.
- Large unoptimized image → verify Sanity URL has `?w=1440&auto=format&q=85`.
- Font blocking render → verify `next/font` is configured with `display: swap`.
- Third-party scripts running in `beforeInteractive` → move to `afterInteractive`.

#### 7.3 · Fix CLS Issues

Check for layout shifts:
- All `<SanityImage>` components have explicit `width` + `height` or use `fill` with a sized container.
- Font swap: `display: swap` on all fonts.
- Announcement bar: reserve its height in layout even before it loads (fixed height div).
- Cart drawer: does not shift page content (use `<Sheet>` overlay mode, not push mode).
- Product grid cards: all have identical aspect ratios via `aspect-square` or fixed height.

#### 7.4 · Accessibility Audit

Run Axe DevTools browser extension on:
- Homepage
- PDP (with variant selection)
- Cart drawer
- Mobile navigation drawer

Fix all Critical and Serious issues. Document any "Needs Review" issues with justification.

Common issues to pre-check:
- Color contrast on badge text (ensure 4.5:1 ratio).
- Focus visible on all buttons/links (Tailwind `focus-visible:ring-2`).
- Cart item remove button has `aria-label`.
- Modal/dialog focus management (Shadcn handles this, verify it works).
- Filter checkboxes have labels (not just visual icons).
- WhatsApp button has accessible label including product name.

#### 7.5 · Cross-Device Testing

Test manually on:
- iPhone SE (375px) — smallest supported viewport
- iPhone 14 (390px) — most common iOS
- Samsung Galaxy S21 (360px) — common Android
- iPad (768px) — tablet
- Desktop 1280px
- Desktop 1440px

For each device/viewport, verify:
- No horizontal scroll at any page.
- Navigation usable (mega-menu on desktop, drawer on mobile).
- Product images not cropped incorrectly.
- Cart drawer fits within viewport height.
- WhatsApp button easily tappable (≥44px touch target).
- Text readable without zooming.

#### 7.6 · Cross-Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest, macOS + iOS)
- Edge (latest)

Issues to watch for:
- CSS `scroll-snap` in product gallery (Safari quirks).
- `aspect-ratio` CSS (wide support, but verify).
- `Intl.NumberFormat` for currency (supported everywhere, but verify INR format).
- WhatsApp deep link (`wa.me`) opens correctly on all browsers.
- Backdrop blur CSS (`backdrop-filter`) — polyfill not needed for modern browsers.

#### 7.7 · Performance Optimizations

Run `npx @next/bundle-analyzer` (install `@next/bundle-analyzer`):
- Identify any large client-side dependencies.
- Check that heavy libraries (e.g., a date formatter, a full icon library) are not included in the bundle.
- Verify Zustand is ≤ 5 KB gzipped.
- Verify no `import * from` patterns that pull entire libraries into client bundles.

If a component library chunk is large, use `dynamic()` with `ssr: false`.

#### 7.8 · Image Audit

Using browser DevTools → Network → Images:
- Verify all product images served as WebP (not PNG/JPEG), confirmed by `?auto=format` in URL.
- Verify no images above the fold have `loading="lazy"` (should be `priority`).
- Verify LQIP blur shows before full image (slow-throttle network simulation).
- Verify largest image is ≤ 150 KB on mobile viewport.

#### 7.9 · Full Functional Flow Test

Execute the complete user journey:
1. Land on homepage → see hero image.
2. Click a featured category → category page with products.
3. Apply a size filter → results update.
4. Click a product → PDP loads.
5. Select a variant → price updates.
6. Click "Add to Cart" → toast appears, badge shows "1".
7. Open cart drawer → item visible.
8. Change quantity to 2 → subtotal updates.
9. Click "Checkout via WhatsApp" → WhatsApp opens with full order.
10. Message contains: both product name, variant, qty=2, correct price.
11. Close WhatsApp → site still open.
12. Search for a product by name → results appear.
13. Refresh page → cart still shows 2 items.

#### 7.10 · Empty & Edge State Testing

- Empty cart: `/cart` shows empty state, not a broken layout.
- Zero filter results: empty state with "Clear all filters" shown.
- Product with no images: fallback image/placeholder renders (no broken img).
- Very long product name: truncated with ellipsis in card, full in PDP h1.
- Product with no variants: variant selector not rendered on PDP.
- Out-of-stock product: WhatsApp buy button replaced with Notify Me.
- Category with no products: empty state shown below filters.

#### 7.11 · Final Lighthouse Scores

Run final Lighthouse audits after all fixes. Record and commit scores in a `LIGHTHOUSE.md` or embed in this document. All pages must clear acceptance criteria before Phase 8.

---

### Files Created / Modified

```
Modified (fixes only — no new features):
  Any file with a Lighthouse/accessibility issue
  components/product/ProductCard.tsx   (if CLS fix needed)
  components/layout/AnnouncementBar.tsx (if CLS fix needed)
  components/shared/SanityImage.tsx    (if missing dimensions)
  app/layout.tsx                       (if font/script issue)
```

---

### Acceptance Criteria

- [ ] Lighthouse Performance ≥ 95 on mobile — Homepage
- [ ] Lighthouse Performance ≥ 90 on mobile — PDP
- [ ] Lighthouse Accessibility = 100 — Homepage
- [ ] Lighthouse Accessibility = 100 — PDP
- [ ] Lighthouse Best Practices = 100 — all pages
- [ ] Lighthouse SEO = 100 — all pages
- [ ] Axe DevTools: zero Critical violations on Homepage
- [ ] Axe DevTools: zero Critical violations on PDP
- [ ] No horizontal scroll at 375px viewport width on any page
- [ ] All interactive elements have visible focus indicators
- [ ] WhatsApp checkout works on real mobile device (not just emulation)
- [ ] Cart persists after full browser close + reopen
- [ ] All images serve as WebP format
- [ ] CLS < 0.05 on all pages (check in Lighthouse or Web Vitals extension)
- [ ] Zero TypeScript errors: `npx tsc --noEmit`
- [ ] Zero lint errors: `npm run lint`
- [ ] Zero console errors in browser DevTools on all pages

---

### Estimated Time

| Task | Time |
|---|---|
| Baseline Lighthouse audits | 1 h |
| LCP fixes | 2 h |
| CLS fixes | 2 h |
| Accessibility audit + fixes | 3 h |
| Cross-device testing | 2 h |
| Cross-browser testing | 2 h |
| Bundle analysis + optimization | 2 h |
| Image audit | 1 h |
| Full functional flow test | 1.5 h |
| Edge state testing | 1.5 h |
| Final Lighthouse audits | 0.5 h |
| **Total** | **~18.5 h (2.5 days)** |

---

---

## Phase 8 — Deployment

**Duration:** 1 day  
**Goal:** The production site is live on a custom domain, all environment variables configured, Sanity webhooks active, and smoke tested end-to-end.

---

### Tasks

#### 8.1 · GitHub — Final Push

- Ensure all Phase 7 fixes are committed.
- Run `npm run build` locally — zero errors.
- Run `npm run lint` — zero errors.
- Push all branches to GitHub.
- Merge final feature branch to `main`.

#### 8.2 · Vercel Project Setup

1. Go to `vercel.com` → New Project → Import from GitHub repo.
2. Select `rathtech_ecommerce_withoutbackend`.
3. Set root directory to `ecommerce/` (since the repo has a subdirectory).
4. Framework: Next.js (auto-detected).
5. Build command: `next build` (default).
6. Install command: `npm install` (default).

#### 8.3 · Environment Variables (Vercel)

In Vercel project settings → Environment Variables, add ALL variables from `.env.example` with real values for the Production environment:

```
NEXT_PUBLIC_SANITY_PROJECT_ID      = (from sanity.io)
NEXT_PUBLIC_SANITY_DATASET         = production
NEXT_PUBLIC_SANITY_API_VERSION     = 2024-01-01
SANITY_API_TOKEN                   = (viewer token from sanity.io)
SANITY_REVALIDATE_SECRET           = (generate: openssl rand -base64 32)
NEXT_PUBLIC_SITE_URL               = https://yourdomain.com
NEXT_PUBLIC_STORE_NAME             = (store name)
NEXT_PUBLIC_GA4_MEASUREMENT_ID     = (optional)
```

Set `NEXT_PUBLIC_SITE_URL` to the final domain (not the `.vercel.app` URL) — this affects canonical tags and OG image URLs.

#### 8.4 · Custom Domain

In Vercel project → Domains:
1. Add your custom domain (e.g., `yourdomain.com`).
2. Add `www.yourdomain.com` as well (redirects to apex or vice versa).
3. Configure DNS at your domain registrar:
   - Apex domain: A record → `76.76.21.21` (Vercel's IP).
   - `www` subdomain: CNAME → `cname.vercel-dns.com`.
4. Wait for DNS propagation (5–60 min).
5. Vercel auto-provisions SSL certificate.
6. Verify HTTPS is active: `curl -I https://yourdomain.com`.

#### 8.5 · Sanity CORS Setup

In `sanity.io/manage` → Project → API → CORS Origins:

Add these origins with credentials allowed:
- `https://yourdomain.com`
- `https://www.yourdomain.com`
- `https://rathtech-ecommerce.vercel.app` (Vercel preview URL)
- `http://localhost:3000` (development)

Without this, the embedded Studio at `/studio` will fail to authenticate.

#### 8.6 · Sanity Webhook Setup

In `sanity.io/manage` → Project → API → Webhooks → Create webhook:

- **Name:** `Vercel ISR Revalidation`
- **URL:** `https://yourdomain.com/api/revalidate`
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete
- **Filter:** (leave empty — all document types)
- **HTTP Method:** POST
- **Secret:** Same value as `SANITY_REVALIDATE_SECRET`
- **HTTP Headers:** `Authorization: Bearer {SANITY_REVALIDATE_SECRET}`

Test the webhook using Sanity's "Send test notification" button. Verify it returns 200.

#### 8.7 · Vercel Region Configuration

In Vercel project → Settings → Functions:
- Set serverless function region to `bom1` (Mumbai) for lowest latency to Indian users.

#### 8.8 · Vercel Analytics + Speed Insights

In Vercel project dashboard:
- Enable Analytics (one click).
- Enable Speed Insights (one click).
- Both are already wired in `app/layout.tsx` (Phase 1).

#### 8.9 · Production Smoke Test

Run through this checklist on the live production URL:

```
URL Checks:
  [ ] https://yourdomain.com       → homepage loads
  [ ] https://yourdomain.com/products → PLP loads
  [ ] https://yourdomain.com/products/[slug] → PDP loads
  [ ] https://yourdomain.com/categories/[slug] → category loads
  [ ] https://yourdomain.com/studio → Sanity Studio, requires login
  [ ] https://yourdomain.com/api/revalidate → POST only (GET returns 405)
  [ ] https://yourdomain.com/sitemap.xml → valid XML
  [ ] https://yourdomain.com/robots.txt → correct rules

Functional Checks:
  [ ] Add item to cart → persists on refresh
  [ ] WhatsApp button → opens WhatsApp with correct message
  [ ] Search → returns results
  [ ] Filter → URL updates, products filter

CMS Integration Check:
  [ ] Edit a product name in Sanity Studio and publish
  [ ] Within 60 s, the new name appears on the live site
  [ ] Verify /api/revalidate webhook fired (check Sanity webhook logs)

Performance Check:
  [ ] Run Lighthouse on production URL (not localhost) — scores ≥ 95
  [ ] Check Vercel Speed Insights dashboard after 5+ page views
```

#### 8.10 · Google Search Console

1. Go to `search.google.com/search-console`.
2. Add property → Domain → enter `yourdomain.com`.
3. Verify ownership via DNS TXT record.
4. Submit sitemap: Sitemaps → Add sitemap URL → `https://yourdomain.com/sitemap.xml`.
5. Request indexing for the homepage.

#### 8.11 · Post-Deploy Git Tag

```bash
git tag v1.0.0 -m "Production launch"
git push origin v1.0.0
```

---

### Files Created / Modified

```
Created:
  vercel.json     (optional — only if custom Vercel settings needed beyond dashboard config)
```

---

### Acceptance Criteria

- [ ] Production site live at custom domain with HTTPS
- [ ] All pages return 200 (no 404s on key routes)
- [ ] `https://yourdomain.com/sitemap.xml` — valid, lists all products and categories
- [ ] `https://yourdomain.com/robots.txt` — correct rules
- [ ] Sanity Studio at `/studio` requires login and works correctly
- [ ] Editing a product in Sanity and publishing → change visible on site within 60 s
- [ ] Sanity webhook fires and returns 200 (check Sanity webhook delivery logs)
- [ ] WhatsApp checkout works on a real mobile device pointing to the production URL
- [ ] Lighthouse Production score ≥ 95 Performance (run on real URL, not localhost)
- [ ] Google Search Console: sitemap submitted, no errors
- [ ] Vercel Analytics: recording page views
- [ ] No CORS errors in browser console when using Sanity Studio
- [ ] `git tag v1.0.0` pushed to GitHub
- [ ] `.env.local` is NOT visible in the GitHub repository

---

### Estimated Time

| Task | Time |
|---|---|
| Final code push to GitHub | 0.5 h |
| Vercel project setup | 0.5 h |
| Environment variables | 0.5 h |
| Custom domain + DNS | 1 h |
| Sanity CORS + webhook | 1 h |
| Production smoke test | 2 h |
| Google Search Console | 0.5 h |
| Production Lighthouse | 1 h |
| Git tag + documentation | 0.5 h |
| **Total** | **~7.5 h (1 day)** |

---

---

## Master Checklist

### Before Starting Each Phase

- [ ] Previous phase acceptance criteria are all checked
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes (zero TypeScript errors)

### Total File Count Summary

| Phase | Files Created | Files Modified |
|---|---|---|
| 1 — Setup | 8 | 5 |
| 2 — Sanity CMS | 20 | 4 |
| 3 — Homepage | 18 | 2 |
| 4 — Product Pages | 28 | 1 |
| 5 — Cart | 5 | 2 |
| 6 — SEO | 3 | 8 |
| 7 — Testing | 0 | (fixes only) |
| 8 — Deployment | 1 | 0 |
| **Total** | **~83 files** | |

### Total Time Summary

| Phase | Estimate |
|---|---|
| Phase 1 | 1.5 days |
| Phase 2 | 2 days |
| Phase 3 | 2.5 days |
| Phase 4 | 3.5 days |
| Phase 5 | 1 day |
| Phase 6 | 1 day |
| Phase 7 | 2.5 days |
| Phase 8 | 1 day |
| **Total** | **~15 days** |

> Buffer estimate for blockers, dependency issues, and iteration: add 20% → **~18 days** total for a single developer working full days.

---

*This document is the implementation companion to `ARCHITECTURE.md`. Architecture decisions are documented there. This document answers: what to build, in what order, and how to know it is done.*
