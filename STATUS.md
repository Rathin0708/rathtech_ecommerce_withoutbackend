# Project Status — RathTech E-Commerce Platform

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Shadcn UI v4 · Sanity CMS v5 · Vercel  
**Last Updated:** 2026-06-25  
**Overall Progress:** Phase 8 of 8 complete — 100% 🎉

> Reference documents: `ARCHITECTURE.md` (all technical decisions) · `IMPLEMENTATION_PLAN.md` (full task breakdown per phase)

---

## 🔗 Portal Links

| Portal | URL | Status |
|---|---|---|
| **Live Site** | [https://yourdomain.com](https://yourdomain.com) | Replace after deploy |
| **Sanity Studio (CMS)** | [https://yourdomain.com/studio](https://yourdomain.com/studio) | Replace after deploy |
| **Sanity Manage** | [https://sanity.io/manage](https://sanity.io/manage) | Live now |
| **Vercel Dashboard** | [https://vercel.com/dashboard](https://vercel.com/dashboard) | After Vercel setup |
| **GitHub Repository** | [https://github.com/YOUR_USERNAME/YOUR_REPO](https://github.com/YOUR_USERNAME/YOUR_REPO) | After GitHub push |
| **Google Search Console** | [https://search.google.com/search-console](https://search.google.com/search-console) | After domain verified |

> **How to update these:** Once deployed, replace every `yourdomain.com` and `YOUR_USERNAME/YOUR_REPO` above with your actual domain and GitHub repo URL. Then commit.

---

## At a Glance

| Phase | Name | Status | Notes |
|---|---|---|---|
| 1 | Project Setup | ✅ **Complete** | Build · Lint · TS all pass |
| 2 | Sanity CMS | ✅ **Complete** | Typegen + seed data need Sanity credentials |
| 3 | Homepage | ✅ **Complete** | Build · Lint · TS all pass |
| 4 | Product Pages | ✅ **Complete** | Build · Lint · TS all pass |
| 5 | Cart & Checkout | ✅ **Complete** | Build · Lint · TS all pass |
| 6 | SEO | ✅ **Complete** | Build · Lint · TS all pass |
| 7 | Testing & Polish | ✅ **Complete** | Code fixes done · manual testing required |
| 8 | Deployment | ✅ **Complete** | Code artifacts done · deploy steps below |

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

## ✅ Phase 4 — Product Pages — COMPLETE

**Commit:** `feat(products): complete Phase 4 — product pages, filters, search, and WhatsApp checkout`

### Completed Tasks

**Product Components** (`components/product/`)
- [x] `ProductBadge.tsx` — colored chip: New · Sale · Best Seller · Limited Edition · Coming Soon
- [x] `ProductPrice.tsx` — sale price + strike-through original · accessible aria-labels · size variants
- [x] `ProductCard.tsx` — grid card: image · badge overlay · wishlist heart · name · price · out-of-stock overlay
- [x] `ProductGrid.tsx` — responsive CSS grid: 2-col mobile → 4-col desktop · configurable columns
- [x] `ProductGallery.tsx` — main image + thumbnail strip · CSS scroll-snap · keyboard navigation
- [x] `ProductVariantSelector.tsx` — size pills · color swatches · out-of-stock strikethrough state
- [x] `QuantitySelector.tsx` — +/− buttons · editable input · clamped on blur · accessible aria-labels
- [x] `ProductActions.tsx` — Client component: variant selector + qty + AddToCart + WhatsApp CTA + sticky mobile bar (IntersectionObserver)
- [x] `AddToCartButton.tsx` — adds to cart · Sonner toast with "View Cart" action · 250ms loading spinner
- [x] `RelatedProducts.tsx` — "You may also like" grid (max 4)

**Filter Components** (`components/filter/`)
- [x] `SortDropdown.tsx` — Newest · Price Low→High · High→Low · Best Sellers · A–Z · uses useFilters internally
- [x] `FilterGroup.tsx` — accordion checkbox group with active count badge · native checkbox for accessibility
- [x] `ActiveFilters.tsx` — removable filter chips + "Clear all" · reads currentFilters prop, uses useFilters internally
- [x] `FilterSidebar.tsx` — desktop left sidebar (240px) · price range slider with onValueCommitted
- [x] `FilterSheet.tsx` — mobile bottom sheet · pending state applied on "Apply" · synced from props on open

**WhatsApp Components** (`components/whatsapp/`)
- [x] `WhatsAppButton.tsx` — single-product CTA · popup + 2s blur detection + fallback modal
- [x] `WhatsAppCheckoutButton.tsx` — full cart checkout CTA · generates complete order message
- [x] `WhatsAppFallbackModal.tsx` — copy-to-clipboard + WhatsApp Web link fallback

**Search Components** (`components/search/`)
- [x] `SearchBar.tsx` — debounced input · clear button · live suggestions dropdown · submit to search page
- [x] `SearchSuggestions.tsx` — live dropdown: thumbnail · name · price · recent searches · "See all results" link
- [x] `SearchModal.tsx` — full-screen dialog overlay for mobile search · trigger button for header

**Shared**
- [x] `components/shared/Pagination.tsx` — crawlable `<a>` links (not buttons) · ellipsis · prev/next
- [x] `components/shared/StructuredData.tsx` — JSON-LD `<script>` tag wrapper

**Hooks** (`hooks/`)
- [x] `hooks/useFilters.ts` — URL navigation with `useRouter` + `usePathname` · setFilter · clearFilter · clearAll · setSort · setMultiple (combined update)
- [x] `hooks/useSearch.ts` — debounced 300ms fetch · lazy initializer for recentSearches · derived suggestions display
- [x] `hooks/useWishlist.ts` — localStorage toggle · lazy initializer (SSR-safe)

**Utility**
- [x] `lib/generateWhatsAppMessage.ts` — `generateSingleProductMessage()` · `generateCartMessage()` · `buildWhatsAppUrl()`

**Pages / Routes**
- [x] `app/products/page.tsx` — PLP: Server Component · filter + sort + grid + pagination
- [x] `app/products/loading.tsx` — 12-card skeleton with sidebar
- [x] `app/products/[slug]/page.tsx` — PDP: Server Component · generateStaticParams · Product JSON-LD · Breadcrumb
- [x] `app/products/[slug]/loading.tsx` — PDP skeleton
- [x] `app/products/[slug]/not-found.tsx` — product not found
- [x] `app/categories/[slug]/page.tsx` — category hero + sub-chips + filter + grid · BreadcrumbList JSON-LD
- [x] `app/categories/[slug]/loading.tsx` — category skeleton
- [x] `app/search/page.tsx` — CSR · derives isLoading from fetchedFor tracking (no synchronous setState in effects)

**Updated**
- [x] `components/home/FeaturedProducts.tsx` — replaced placeholder grid with real `ProductGrid` + `ProductCard`

### Breaking Changes Caught & Fixed
- Base UI Slider: `onValueChange` returns `number | readonly number[]` — fixed with `Array.isArray()` guard
- ESLint `react-hooks/set-state-in-effect`: moved all synchronous setState out of effect bodies:
  - `useWishlist`: lazy initializer instead of useEffect
  - `useSearch`: lazy initializer for recentSearches; moved setIsLoading(true) inside setTimeout callback; derived `suggestions` display
  - Search page: derived `isLoading` from `fetchedFor` tracking (no synchronous setState)

---

## ✅ Phase 5 — Cart & WhatsApp Checkout — COMPLETE

**Commit:** `feat(cart): complete Phase 5 — cart drawer, cart page, and WhatsApp checkout`

### Completed Tasks

**Cart Components** (`components/cart/`)
- [x] `CartItem.tsx` — product image (Next.js Image / placeholder) · name · variant text · QuantitySelector · line total · accessible remove button
- [x] `CartSummary.tsx` — subtotal row · optional order notes Textarea · delivery note
- [x] `CartDrawer.tsx` — Base UI Sheet (right side) · controlled by uiStore.isCartOpen · empty state with shop link · footer with CartSummary + WhatsAppCheckoutButton + view-full-cart link
- [x] `CartPageContent.tsx` (Client Component) — two-column desktop / stacked mobile · AlertDialog clear-cart confirmation · EmptyState fallback

**WhatsApp**
- [x] `WhatsAppCheckoutButton.tsx` — already created in Phase 4 ✅

**Pages**
- [x] `app/cart/page.tsx` — Server Component shell · fetches storeNumber · `noIndex: true` metadata

**Layout**
- [x] `app/layout.tsx` — made async · fetches storeNumber · CartDrawer wired inside Providers boundary

**Updates**
- [x] `AddToCartButton` — added `imageUrl` prop so cart items display product thumbnails
- [x] `ProductActions` — computes `imageUrl` via `urlForImage(product.images[0], 120)` and passes to AddToCartButton

---

## ✅ Phase 6 — SEO — COMPLETE

**Commit:** `feat(seo): complete Phase 6 — sitemap, robots, canonical tags, OG images`

### Completed Tasks

**New files**
- [x] `app/robots.ts` — `*` allow `/` · disallow `/studio/` `/api/` · sitemap pointer
- [x] `app/sitemap.ts` — homepage + products + categories + static pages with `_updatedAt`-based `lastModified` and priority weights (1.0 → 0.9 → 0.8 → 0.7 → 0.5)
- [x] `app/search/layout.tsx` — `noIndex: false, noFollow: false` for search pages (client page can't export metadata directly)
- [x] `components/shared/StructuredData.tsx` — created in Phase 4 ✅

**Pages updated**
- [x] `app/page.tsx` — full OG metadata · WebSite JSON-LD with SearchAction · fetches `defaultSeo.ogImage` from siteSettings
- [x] `app/products/page.tsx` — canonical → `/products` (ignores filter/sort params)
- [x] `app/products/[slug]/page.tsx` — canonical + Twitter card + OG `url` field · already had Product JSON-LD from Phase 4
- [x] `app/categories/[slug]/page.tsx` — canonical + Twitter card + OG `url` + description · already had BreadcrumbList JSON-LD from Phase 4
- [x] `app/search/page.tsx` — noIndex via `app/search/layout.tsx`
- [x] `app/cart/page.tsx` — `noIndex: true` set in Phase 5 ✅
- [x] `app/[slug]/page.tsx` — OG image support + canonical + openGraph url

---

## ✅ Phase 7 — Testing & Polish — COMPLETE (code fixes)

**Commit:** `fix(polish): Phase 7 code fixes — a11y, security, animations, search UX`

### Code Fixes Applied

**Accessibility**
- [x] `ProductBadge`: -600/-800 color variants for WCAG AA contrast (≥4.5:1 on white)
- [x] `ProductCard`: wishlist button increased to h-10 w-10 (40px) — WCAG 2.5.8 touch target
- [x] `FilterSidebar` + `FilterSheet`: `aria-label="Price range"` added to Slider
- [x] `Header`: SearchModal wired in (replaces plain `<Link href="/search">`) — live suggestions now work across the site

**Security**
- [x] `WhatsAppButton` + `WhatsAppCheckoutButton`: switched from `window.open()` to programmatic `<a rel="noopener noreferrer">` click — correct approach (noopener in window.open feature returns null on Chrome, breaking popup detection)

**UX / Toasts**
- [x] `WhatsAppButton`: "Opening WhatsApp…" toast with instructions
- [x] `WhatsAppCheckoutButton`: "Your order has been sent!" success toast with Continue Shopping action
- [x] Removed unreliable 2-second blur-detection timer (cross-origin popups can't access opener anyway)

**CSS / Animations**
- [x] `globals.css`: explicit `@keyframes scale-in`, `accordion-down`, `accordion-up` — no longer relies on undocumented tw-animate-css exports

**Already correct (no changes needed)**
- [x] LCP: HeroSection `priority` on first slide · ProductGrid `priority` on first card ✅
- [x] CLS: all `<SanityImage>` use `fill` with `aspect-square` or explicit `width`/`height` ✅
- [x] Edge states: empty cart · out-of-stock · zero search results · no category products — all handled ✅
- [x] All external links: `rel="noopener noreferrer"` in Footer social links ✅
- [x] Skip-to-content link in layout ✅
- [x] Focus indicators: `focus-visible:ring-2` on all interactive elements via Base UI ✅
- [x] Screen reader text on icons (`aria-label` on all icon-only buttons) ✅

### Manual Testing Required (not automatable in code)
- [ ] Lighthouse audit — run on production URL after Phase 8 deploy
- [ ] Cross-device testing: 375px · 390px · 768px · 1280px · 1440px
- [ ] Cross-browser: Chrome · Firefox · Safari · Edge
- [ ] Full end-to-end flow test on real mobile device
- [ ] Axe DevTools in-browser scan
- [ ] Bundle size: `npx @next/bundle-analyzer`

---

## ✅ Phase 8 — Deployment — COMPLETE (code) · Manual steps remain

**Commit:** `chore(deploy): Phase 8 deployment config`  
**Tag:** `v1.0.0` created locally

### Code Artifacts Done
- [x] `vercel.json` — region `bom1` (Mumbai), framework `nextjs`
- [x] `next.config.ts` — CSP `connect-src` updated with Vercel Analytics + Speed Insights domains
- [x] `.env.example` — all variables documented with generation hints
- [x] `git tag v1.0.0` created locally
- [x] Final `npm run build` passes — all 12 routes compile cleanly

---

### Manual Deployment Steps (do these in order)

#### Step 1 — Push to GitHub
```bash
# Inside ecommerce/ — create a new GitHub repo, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin master
git push origin v1.0.0
```

#### Step 2 — Sanity: Add Credentials
1. Go to [sanity.io/manage](https://sanity.io/manage) → your project
2. **API → Tokens** → Create a "Viewer" token → copy it → this is `SANITY_API_TOKEN`
3. Note your **Project ID** from the dashboard → this is `NEXT_PUBLIC_SANITY_PROJECT_ID`
4. Run locally with real credentials:
   ```bash
   npx sanity typegen generate
   git add sanity/types/sanity.types.ts && git commit -m "chore(types): add sanity typegen output"
   git push origin master
   ```

#### Step 3 — Vercel: Create Project
1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Framework: **Next.js** (auto-detected)
3. Root Directory: leave blank (the `vercel.json` in the repo root will be picked up) or set to `ecommerce/` if deploying the subfolder
4. **Environment Variables** — add these in the Production environment:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_TOKEN` | Viewer token from Step 2 |
| `SANITY_REVALIDATE_SECRET` | Run: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_STORE_NAME` | Your store name |

5. **Deploy** → wait for build to complete

#### Step 4 — Vercel: Enable Analytics
1. Project Dashboard → **Analytics** tab → **Enable**
2. Project Dashboard → **Speed Insights** tab → **Enable**
3. Project Settings → **Functions** → Region: confirm `bom1 (Bombay, India)` is selected (set by `vercel.json`)

#### Step 5 — Custom Domain
1. Vercel Project → **Settings → Domains** → Add your domain
2. At your registrar, add DNS records:
   - Apex (`yourdomain.com`): **A** record → `76.76.21.21`
   - `www`: **CNAME** → `cname.vercel-dns.com`
3. Vercel auto-provisions SSL (wait 5–60 min for DNS to propagate)
4. Update `NEXT_PUBLIC_SITE_URL` env var to the final domain URL → re-deploy

#### Step 6 — Sanity: Configure Production
1. **sanity.io/manage → Project → API → CORS Origins** → Add:
   - `https://yourdomain.com` (with credentials ✓)
   - `https://www.yourdomain.com` (with credentials ✓)
   - `https://YOUR-PROJECT.vercel.app` (Vercel preview URL)
   - `http://localhost:3000` (already there for dev)
2. **API → Webhooks** → Create webhook:
   - **URL:** `https://yourdomain.com/api/revalidate`
   - **Dataset:** `production`
   - **Triggers:** Create · Update · Delete
   - **HTTP Method:** POST
   - **Secret:** same value as `SANITY_REVALIDATE_SECRET`
   - **HTTP Headers:** `Authorization: Bearer YOUR_SECRET`
3. Click **"Send test notification"** → should return 200 ✓

#### Step 7 — Seed Content in Sanity Studio
Open `https://yourdomain.com/studio` and create:
- [ ] **Site Settings** — store name, WhatsApp number (E.164 format: `919876543210`), logo, social links, announcement bar
- [ ] **Homepage** — hero slides, featured categories, featured products, promo banner, testimonials
- [ ] **3–5 Categories** — with hero images and descriptions
- [ ] **10+ Products** — with images, prices, variants, categories assigned
- [ ] **Static Pages** — About, Contact, FAQ, Returns, Privacy Policy

#### Step 8 — Smoke Test
After DNS propagates, run through this checklist:

```
URLs (all should return 200):
  [ ] https://yourdomain.com
  [ ] https://yourdomain.com/products
  [ ] https://yourdomain.com/products/[a-real-slug]
  [ ] https://yourdomain.com/categories/[a-real-slug]
  [ ] https://yourdomain.com/studio  (requires Sanity login)
  [ ] https://yourdomain.com/sitemap.xml  (valid XML with all products)
  [ ] https://yourdomain.com/robots.txt  (allow / disallow /studio/ /api/)
  [ ] https://yourdomain.com/api/revalidate  (POST only — GET returns 405)

Functional:
  [ ] Search: type 3+ chars → live suggestions appear
  [ ] Add item to cart → badge shows count → drawer opens
  [ ] WhatsApp button → WhatsApp opens with correct message
  [ ] Cart drawer → Checkout via WhatsApp → correct order summary
  [ ] ISR: edit a product in Sanity Studio → publish → appears on site within 60s

Performance:
  [ ] Lighthouse run on https://yourdomain.com (not localhost) → ≥90 Performance
  [ ] Vercel Analytics dashboard shows page views after 5+ visits
```

#### Step 9 — Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. **Add Property → Domain** → enter `yourdomain.com`
3. Verify via DNS TXT record at your registrar
4. **Sitemaps** → Add `https://yourdomain.com/sitemap.xml`
5. **URL Inspection** → Request indexing for the homepage

#### Step 10 — Push Tag to GitHub
```bash
git push origin v1.0.0
```

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
