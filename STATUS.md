# Project Status — RathTech E-Commerce Platform

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Shadcn UI v4 · Sanity CMS v5 · Vercel  
**Last Updated:** 2026-06-24  
**Overall Progress:** Phase 3 of 8 complete — 38%

> Reference documents: `ARCHITECTURE.md` (all technical decisions) · `IMPLEMENTATION_PLAN.md` (full task breakdown per phase)

---

## At a Glance

| Phase | Name | Status | Notes |
|---|---|---|---|
| 1 | Project Setup | ✅ **Complete** | Build · Lint · TS all pass |
| 2 | Sanity CMS | ✅ **Complete** | Typegen + seed data need Sanity credentials |
| 3 | Homepage | ✅ **Complete** | Build · Lint · TS all pass |
| 4 | Product Pages | 🔲 **Not Started** | Largest phase — core commerce UI |
| 5 | Cart & Checkout | 🔲 **Not Started** | Depends on Phase 4 |
| 6 | SEO | 🔲 **Not Started** | Depends on Phase 4 & 5 |
| 7 | Testing & Polish | 🔲 **Not Started** | Depends on Phase 6 |
| 8 | Deployment | 🔲 **Not Started** | Final phase |

---

## ✅ Phase 1 — Project Setup — COMPLETE

**Commit:** `feat(setup): complete Phase 1 — project setup and design system`

### Completed Tasks

- [x] Tailwind CSS v4 design tokens — orange primary `oklch(0.7 0.19 47)`, WhatsApp green, dark mode variables
- [x] Shadcn UI v4 initialized (`base-nova` style, Base UI primitives, oklch color tokens)
- [x] 20 Shadcn components installed: `button` `card` `dialog` `drawer` `input` `label` `select` `separator` `sheet` `skeleton` `slider` `tabs` `badge` `accordion` `scroll-area` `command` `popover` `sonner` `alert-dialog` `textarea`
- [x] Packages: `zustand@5` · `clsx` · `tailwind-merge` · `lucide-react` · `@vercel/analytics` · `@vercel/speed-insights`
- [x] Path aliases in `tsconfig.json` — `@/components/*` `@/lib/*` `@/hooks/*` `@/store/*` `@/sanity/*` `@/types/*`
- [x] TypeScript strict mode confirmed
- [x] ESLint rules — `no-console` · `no-explicit-any` · `no-unused-vars`
- [x] Full folder scaffold — `components/{layout,product,cart,search,filter,whatsapp,home,shared}` · `hooks/` · `store/` · `types/`
- [x] `lib/cn.ts` — Tailwind class merge utility
- [x] `lib/formatCurrency.ts` — INR formatter via `Intl.NumberFormat`
- [x] `lib/getProductUrl.ts` · `lib/getCategoryUrl.ts` — URL builders
- [x] `types/index.ts` — `CartItem` · `FilterState` · `SortOption` · `BadgeType`
- [x] `store/cartStore.ts` — Zustand v5 + persist middleware (localStorage key `rathtech-cart`)
- [x] `store/uiStore.ts` — cart/search/nav open state (no persistence)
- [x] `components/shared/Providers.tsx` — `ThemeProvider` + Sonner `<Toaster />`
- [x] `next.config.ts` — security headers (CSP, X-Frame-Options, etc.) + Sanity image domain
- [x] `.env.example` — all required variable names documented
- [x] `app/layout.tsx` — skip-nav link · Providers · metadata template · Analytics · SpeedInsights

---

## ✅ Phase 2 — Sanity CMS — COMPLETE

**Commit:** `feat(cms): complete Phase 2 — Sanity CMS schemas and data layer`

### Completed Tasks

**Object Schemas** (`sanity/schemaTypes/objects/`)
- [x] `imageWithAlt` — extends Sanity `image` type with required `alt` + optional `caption`
- [x] `seoFields` — metaTitle (70 chars) · metaDescription (160 chars) · ogImage · noIndex
- [x] `productVariant` — label · value · priceModifier · inStock · sku · image
- [x] `ctaButton` — label · url · variant (primary/secondary/outline)
- [x] `heroBanner` — desktop + mobile images · headline · subheadline · CTA · text color
- [x] `testimonial` — quote · customerName · rating (1–5) · avatar
- [x] `uspItem` — iconName (Lucide) · title · subtitle
- [x] `navItem` — label · url · children[] · featuredImage

**Document Schemas** (`sanity/schemaTypes/documents/`)
- [x] `product` — grouped fields · cross-field salePrice validation · badge enum · isFeatured
- [x] `category` — self-reference guard · hero image · parent hierarchy
- [x] `staticPage` — full Portable Text (h1–h4, lists, links, embedded images)
- [x] `homePage` — singleton (`documentId: singleton-homePage`) · all 8 homepage sections
- [x] `siteSettings` — singleton · E.164 WhatsApp validation · nav · footer · social links

**Studio & Clients**
- [x] Studio structure — singletons open as direct editors, not lists
- [x] `sanity/lib/client.ts` — CDN client (`useCdn:true`, `perspective:'published'`)
- [x] `sanity/lib/serverClient.ts` — token client (`useCdn:false`) — server-only
- [x] `sanity/lib/image.ts` — `urlFor()` + `urlForImage(src, w, h?, q?)` helper

**Queries & Fetching** (`sanity/lib/queries.ts` · `sanity/lib/fetch.ts`)
- [x] 18 GROQ queries — all projected (never `*`) · `$tagFilter` / `$searchTerm` to avoid Sanity reserved-key collisions
- [x] 11 typed async fetch wrappers with ISR cache tags
- [x] Intermediate TypeScript interfaces (replaced by typegen output after credentials added)

**API**
- [x] `app/api/revalidate/route.ts` — validates Bearer secret · maps `_type → cache tags` · `revalidateTag(tag, { expire: 0 })` (Next.js 16 signature)

### Pending (requires Sanity project credentials)
- [ ] `npx sanity typegen generate` → generates `sanity/types/sanity.types.ts`
- [ ] Seed test data in Sanity Studio (`/studio`)

---

## ✅ Phase 3 — Homepage — COMPLETE

**Commit:** `feat(homepage): complete Phase 3 — homepage, layout, and shared components`

### Completed Tasks

**Shared Components** (`components/shared/`)
- [x] `SanityImage` — wraps `next/image` + Sanity CDN URL builder · LQIP blur placeholder · handles fill vs fixed modes
- [x] `PortableText` — custom renderers for h1–h4 · blockquote · bullet/numbered lists · bold/em · external links
- [x] `EmptyState` — icon + title + description + action slot
- [x] `Providers.tsx` — updated with `ThemeProvider` (fixes Sonner `useTheme` dependency)

**Layout Components** (`components/layout/`)
- [x] `Header` — Server Component · fetches site settings · graceful fallback if Sanity not configured
- [x] `AnnouncementBar` — Client · sessionStorage dismiss via lazy initializer (avoids `useEffect→setState` lint error)
- [x] `MegaMenu` — Client · hover with 150ms timeout · Escape closes · `aria-expanded` / `role="menu"`
- [x] `MobileNav` — Client · Base UI `Sheet` from left · Base UI `Accordion` (`multiple` prop, no `type`)
- [x] `Footer` — Server · inline SVG social icons (lucide v1 removed brand icons) · WhatsApp CTA
- [x] `Breadcrumb` — JSON-LD `BreadcrumbList` + accessible `<nav aria-label="Breadcrumb">`
- [x] `CartIcon` — Client · reads `cartStore` · badge count · opens via `uiStore`

**Homepage Sections** (`components/home/`)
- [x] `HeroSection` — Client · 5s auto-carousel · pause on hover/focus · prev/next arrows · dot indicators
- [x] `CategoryChips` — horizontal scroll on mobile · 6-col grid on desktop
- [x] `FeaturedProducts` — minimal product grid (**placeholder** — Phase 4 replaces with real `ProductCard`)
- [x] `PromoBanner` — full-width image overlay + CTA
- [x] `UspBar` — Lucide icons mapped from CMS `iconName` string
- [x] `TestimonialsSection` — Client · mobile single-card carousel · desktop 3-col grid · star rating with `aria-label`

**Page Files**
- [x] `app/layout.tsx` — Header + Footer wired in · `suppressHydrationWarning` on `<html>`
- [x] `app/page.tsx` — RSC · `revalidate = 60` · all home sections · Sanity fallback message
- [x] `app/loading.tsx` — full page skeleton matching hero + USP + chips + product grid
- [x] `app/[slug]/page.tsx` — static pages (About/FAQ/etc.) · `generateStaticParams` · `params` as `Promise` (Next.js 16)

### Breaking Changes Caught & Fixed
- Shadcn v4 / Base UI: `asChild` prop → `render={<Link />}` pattern
- Base UI `Accordion`: no `type="single"` prop — uses `multiple?: boolean` instead
- Lucide v1: brand social icons removed — replaced with inline SVGs
- `@sanity/image-url`: deprecated default import → named `createImageUrlBuilder`
- Next.js 16: `revalidateTag(tag)` → `revalidateTag(tag, { expire: 0 })` (2-arg required)
- Next.js 16: `params` is a `Promise<{ slug: string }>` — must `await params`

---

## 🔲 Phase 4 — Product Pages — NOT STARTED

**Estimated time:** 3.5 days  
**Depends on:** Phase 2 (fetch wrappers) · Phase 3 (SanityImage, Breadcrumb)

### All files to create

**Product Components** (`components/product/`)
- [ ] `ProductBadge.tsx` — colored chip: New · Sale · Best Seller · Limited Edition
- [ ] `ProductPrice.tsx` — sale price + strike-through original · accessible aria-label
- [ ] `ProductCard.tsx` — grid card: image · badge · name · price · out-of-stock overlay
- [ ] `ProductGrid.tsx` — responsive CSS grid: 2-col mobile → 4-col desktop
- [ ] `ProductGallery.tsx` — main image + thumbnail strip · CSS scroll-snap swipe on mobile
- [ ] `ProductVariantSelector.tsx` — size pills · color swatches · out-of-stock state
- [ ] `QuantitySelector.tsx` — +/− buttons · accessible aria-labels
- [ ] `ProductInfo.tsx` — name (h1) · price · stock badge · short description · variant + qty
- [ ] `AddToCartButton.tsx` — adds to cart · Sonner toast · loading spinner
- [ ] `StickyProductCta.tsx` — fixed mobile bottom bar (qty + WhatsApp button)
- [ ] `RelatedProducts.tsx` — "You may also like" grid (max 4)

**Filter Components** (`components/filter/`)
- [ ] `SortDropdown.tsx` — Newest · Price Low→High · High→Low · Best Sellers · A–Z
- [ ] `FilterGroup.tsx` — accordion checkbox group with active count badge
- [ ] `ActiveFilters.tsx` — removable filter chips + "Clear all"
- [ ] `FilterSidebar.tsx` — desktop left sidebar (280px wide)
- [ ] `FilterSheet.tsx` — mobile bottom sheet with Apply/Clear buttons

**WhatsApp Components** (`components/whatsapp/`)
- [ ] `WhatsAppButton.tsx` — single-product CTA · generates message · fallback detection
- [ ] `WhatsAppCheckoutButton.tsx` — full cart checkout CTA
- [ ] `WhatsAppFallbackModal.tsx` — copy-to-clipboard fallback for desktop

**Search Components** (`components/search/`)
- [ ] `SearchBar.tsx` — debounced input · clear button · accessible
- [ ] `SearchSuggestions.tsx` — live dropdown: thumbnail · name · price · keyboard navigation
- [ ] `SearchModal.tsx` — full-screen overlay for mobile search

**Shared**
- [ ] `components/shared/Pagination.tsx` — page number links (crawlable `<a>` tags)

**Hooks** (`hooks/`)
- [ ] `hooks/useFilters.ts` — URL query param filter state via `useSearchParams` + `useRouter`
- [ ] `hooks/useSearch.ts` — debounced (300ms) search suggestions
- [ ] `hooks/useWishlist.ts` — localStorage wishlist toggle

**Utility**
- [ ] `lib/generateWhatsAppMessage.ts` — `generateSingleProductMessage()` + `generateCartMessage()`

**Pages / Routes**
- [ ] `app/products/page.tsx` — PLP: filter + sort + grid + pagination (RSC)
- [ ] `app/products/loading.tsx` — 12-card skeleton
- [ ] `app/products/[slug]/page.tsx` — PDP: gallery + info + variants + related (RSC)
- [ ] `app/products/[slug]/loading.tsx` — PDP skeleton
- [ ] `app/products/[slug]/not-found.tsx` — product not found
- [ ] `app/categories/[slug]/page.tsx` — category hero + sub-chips + grid (RSC)
- [ ] `app/categories/[slug]/loading.tsx` — category skeleton
- [ ] `app/search/page.tsx` — search results (CSR, dynamic)

---

## 🔲 Phase 5 — Cart & WhatsApp Checkout — NOT STARTED

**Estimated time:** 1 day  
**Depends on:** Phase 4 (WhatsApp message generator, product types)

### All files to create

**Cart Components** (`components/cart/`)
- [ ] `CartItem.tsx` — image · name · variant · qty controls · line total · remove
- [ ] `CartSummary.tsx` — subtotal · delivery note · optional order notes textarea
- [ ] `CartDrawer.tsx` — Shadcn Sheet (right side) · item list · summary · checkout CTA · empty state

**WhatsApp**
- [ ] `components/whatsapp/WhatsAppCheckoutButton.tsx` — full cart message generator

**Pages**
- [ ] `app/cart/page.tsx` — full cart page (mobile-friendly alternative to drawer)

**Layout update**
- [ ] `app/layout.tsx` — add `<CartDrawer />` alongside Providers

---

## 🔲 Phase 6 — SEO — NOT STARTED

**Estimated time:** 1 day  
**Depends on:** Phase 4 & 5 (all page routes must exist first)

### All files to create / update

**New files**
- [ ] `app/robots.ts` — allow `*` / disallow `/studio` `/api`
- [ ] `app/sitemap.ts` — all product + category + static page slugs with `lastModified`
- [ ] `components/shared/StructuredData.tsx` — `<script type="application/ld+json">`

**Pages to update with `generateMetadata`**
- [ ] `app/page.tsx` — homepage OG + title template
- [ ] `app/products/page.tsx` — "All Products" meta
- [ ] `app/products/[slug]/page.tsx` — product name · description · OG image from first product image · JSON-LD `Product` schema
- [ ] `app/categories/[slug]/page.tsx` — category name · hero OG image · JSON-LD `BreadcrumbList`
- [ ] `app/search/page.tsx` — `noIndex: true` (search pages must not be indexed)
- [ ] `app/cart/page.tsx` — `noIndex: true`
- [ ] `app/[slug]/page.tsx` — already has basic metadata ✅ · needs OG image support

---

## 🔲 Phase 7 — Testing & Polish — NOT STARTED

**Estimated time:** 2.5 days  
**Depends on:** All Phase 4, 5, 6 complete

### All tasks

- [ ] Lighthouse audit baseline on all key pages (Homepage · PDP · PLP · Category · Cart)
- [ ] Fix LCP — hero `priority` · first product card `priority` · image sizing
- [ ] Fix CLS — all `<SanityImage>` have explicit width/height or fill container
- [ ] Axe DevTools accessibility audit — zero Critical violations
- [ ] Cross-device test: 375px (iPhone SE) · 390px (iPhone 14) · 768px (tablet) · 1280px · 1440px
- [ ] Cross-browser: Chrome · Firefox · Safari (macOS + iOS) · Edge
- [ ] Bundle analysis — `npx @next/bundle-analyzer` — initial JS ≤ 150KB gzipped
- [ ] Image audit — all images served as WebP · no above-fold `loading="lazy"`
- [ ] Full end-to-end flow: Home → Category → PDP → Add to cart → WhatsApp checkout
- [ ] Edge states: empty cart · out-of-stock · zero search results · no category products
- [ ] Final Lighthouse scores — all pages ≥ 95 Performance · 100 Accessibility · 100 SEO

---

## 🔲 Phase 8 — Deployment — NOT STARTED

**Estimated time:** 1 day  
**Depends on:** Phase 7 complete + Sanity project configured + domain purchased

### All tasks

**GitHub**
- [ ] All feature branches merged to `main`
- [ ] Final `npm run build` pass on clean clone

**Vercel**
- [ ] New project created → import from GitHub repo
- [ ] Root directory set to `ecommerce/`
- [ ] All environment variables added (Production environment):
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
  - `SANITY_API_TOKEN`
  - `SANITY_REVALIDATE_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_STORE_NAME`
- [ ] Region set to `bom1` (Mumbai) for Indian users
- [ ] Vercel Analytics enabled
- [ ] Vercel Speed Insights enabled

**Domain & SSL**
- [ ] Custom domain added in Vercel dashboard
- [ ] DNS records configured at registrar (A record / CNAME)
- [ ] SSL certificate auto-provisioned by Vercel

**Sanity**
- [ ] CORS origin added: `https://yourdomain.com` · `https://www.yourdomain.com`
- [ ] Webhook created: URL = `https://yourdomain.com/api/revalidate` · secret = `SANITY_REVALIDATE_SECRET` · triggers = create/update/delete
- [ ] `sanity typegen generate` run with production credentials → `sanity/types/sanity.types.ts` committed
- [ ] All seed content published (Site Settings · Homepage · Categories · Products · Static Pages)

**Smoke Test**
- [ ] All key URLs return 200 (homepage · products · a PDP · a category · studio)
- [ ] `/sitemap.xml` valid and lists all pages
- [ ] `/robots.txt` correct allow/disallow rules
- [ ] WhatsApp button tested on a real mobile device pointing to production URL
- [ ] Publish a product change in Sanity → appears on site within 60s (ISR verification)
- [ ] Vercel Analytics recording page views

**Post-launch**
- [ ] Google Search Console → sitemap submitted
- [ ] Git tag `v1.0.0` pushed to GitHub

---

## Known Issues / Pending Decisions

| Issue | Impact | Resolution |
|---|---|---|
| `sanity typegen generate` not yet run | Fetch types are hand-written interfaces, not auto-generated | Run after adding real Sanity project ID to `.env.local` |
| Sanity Studio seed data not created | Homepage, products, categories return null — site shows fallback | Open `/studio` and create documents |
| `FeaturedProducts` uses placeholder grid | Homepage product cards are minimal (no ProductCard component yet) | Replaced in Phase 4 |
| `CartDrawer` not wired into layout | Cart icon opens `uiStore.isCartOpen` but no drawer renders yet | Added in Phase 5 |
| No `generateWhatsAppMessage` utility | WhatsApp buttons cannot be built | Created in Phase 4 |

---

## File Count

| Phase | Files Created | Files Modified | Total |
|---|---|---|---|
| 1 — Setup | 8 | 5 | 13 |
| 2 — Sanity CMS | 20 | 4 | 24 |
| 3 — Homepage | 18 | 4 | 22 |
| **Phases 1–3 done** | **46 created** | **13 modified** | **59** |
| 4 — Product Pages | ~28 needed | ~0 | 28 |
| 5 — Cart | ~5 needed | ~1 | 6 |
| 6 — SEO | ~3 needed | ~7 | 10 |
| 7 — Testing | 0 | fixes only | — |
| 8 — Deployment | ~1 | 0 | 1 |
| **Phases 4–8 remaining** | **~37 needed** | **~8** | **~45** |
