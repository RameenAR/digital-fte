# Tasks: Product Detail Page

**Input**: Design documents from `/specs/003-product-detail/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅
**Branch**: `003-product-detail`
**Total Tasks**: 31

**Organization**: Tasks grouped by user story — each independently implementable,
testable, and deliverable as an MVP increment.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type extensions, new data fields, route scaffold, and cart types — before any component work.

- [x] T001 Add `description: string` field to `Product` interface in `types/products.ts`
- [x] T002 Update `data/featured-products-seed.ts` — add 50–120 word editorial `description` to all 6 products
- [x] T003 Add `getProductBySlug(slug: string): Promise<Product | null>` to `lib/products.ts` — returns active product or null
- [x] T004 Create `types/cart.ts` — define `CartItem`, `Cart`, `CartAction` interfaces and `cartReducer` pure function
- [x] T005 Create dynamic route `app/products/[slug]/page.tsx` — Server Component shell: calls `getProductBySlug`, triggers `notFound()` if null, exports `generateStaticParams`
- [x] T006 Create `app/products/[slug]/loading.tsx` — skeleton loading UI matching product detail layout

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TDD RED tests + cart context + related products logic — required by ALL user stories.

**⚠️ CRITICAL**: Blocks all user story component work.

- [x] T007 Write unit test `tests/unit/cart.test.ts` — tests for `cartReducer`: ADD_ITEM (new), ADD_ITEM (accumulate), quantity cap at 10, CLEAR_CART, totalItems, totalPrice (MUST FAIL before T009)
- [x] T008 [P] Write unit test `tests/unit/related-products.test.ts` — tests for `getRelatedProducts`: tag overlap scoring, exclude self, limit 3, ranks by overlap count, returns [] when no match (MUST FAIL before T010)
- [x] T009 Create `context/CartContext.tsx` — `useReducer` with `cartReducer` from `types/cart.ts`, sessionStorage hydration on mount, sync on change, exports `CartProvider` and `CartContext`
- [x] T010 [P] Create `hooks/useCart.ts` — consumer hook: reads `CartContext`, exposes `items`, `totalItems`, `totalPrice`, `addToCart`, `clearCart`
- [x] T011 Create `lib/related-products.ts` — pure fn `getRelatedProducts(current: Product, all: Product[], limit?: number): Product[]` — tag-overlap scoring, exclude self, sort by score DESC then displayOrder ASC, slice to limit
- [x] T012 Wrap `app/layout.tsx` body in `<CartProvider>` from `context/CartContext.tsx` — cart state available site-wide

**Checkpoint**: Unit tests GREEN (cart reducer + related products), CartProvider wired, getRelatedProducts ready.

---

## Phase 3: User Story 1 — View Full Product Details (Priority: P1) 🎯 MVP

**Goal**: Full product detail page at `/products/[slug]` with hero image, name,
price, scent family badge, scent notes pyramid, description, and breadcrumb.

**Independent Test**: Open `http://localhost:3000/products/midnight-rose`. Verify
name ("Midnight Rose"), price ("Rs 4,500"), hero image, "Floral" badge, three
scent tiers (Top/Heart/Base), editorial description paragraph, and breadcrumb
navigation (Home → All Fragrances → Midnight Rose) are all visible. Open
`/products/xyz-does-not-exist` → "Product not found" message appears.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create `components/product-detail/Breadcrumb.tsx` — renders "Home / All Fragrances / [name]" with `<Link>` on first two segments; `aria-label="Breadcrumb"`
- [x] T014 [P] [US1] Create `components/product-detail/ProductDetailHero.tsx` — `next/image` hero (priority, fill), product name `<h1>`, PKR-formatted price, scent family badge (pill styled with brand-gold border)
- [x] T015 [P] [US1] Create `components/product-detail/ScentNotesPyramid.tsx` — three labelled tiers (Top Notes / Heart Notes / Base Notes), each rendering a comma-separated or pill list of note strings
- [x] T016 [P] [US1] Create `components/product-detail/ProductDescription.tsx` — renders `product.description` in a styled paragraph block with serif font
- [x] T017 [US1] Wire `app/products/[slug]/page.tsx` — compose `<Breadcrumb>`, `<ProductDetailHero>`, `<ScentNotesPyramid>`, `<ProductDescription>`; add `generateStaticParams` returning all active slugs; add `metadata` export with title `"[Name] | Lumière Parfums"` and meta description
- [x] T018 [US1] Create `app/products/[slug]/not-found.tsx` — "Product not found" heading, descriptive message, `<Link>` back to `/products`

**Checkpoint**: US1 complete — `/products/[slug]` fully browsable, 404 handled. Deploy/demo as MVP.

---

## Phase 4: User Story 2 — Add to Cart (Priority: P2)

**Goal**: Quantity selector (1–10) + "Add to Cart" button with "Added ✓" success
state. Cart item count updates in site header. Cart persists for browser session.

**Independent Test**: On `/products/midnight-rose`, set quantity to 2, click
"Add to Cart". Button shows "Added ✓" for ~2 seconds. Header shows cart count
badge "2". Navigate to `/products`, return — count still "2". Add 1 more from
another product — count becomes "3".

### Implementation for User Story 2

- [x] T019 [US2] Create `components/product-detail/AddToCart.tsx` — quantity selector with decrement/increment buttons (min 1, max 10, 44px touch targets), "Add to Cart" button, 2000ms `added` success state using `useCart().addToCart`; `'use client'`
- [x] T020 [US2] Wire `<AddToCart>` into `app/products/[slug]/page.tsx` — pass product id, slug, name, imageUrl, price as props below `<ProductDetailHero>`
- [x] T021 [US2] Add cart count badge to site header in `app/layout.tsx` — renders `useCart().totalItems` in a gold badge when > 0; links to `/products` (cart page is out of scope); `'use client'` wrapper component `components/layout/CartBadge.tsx`

**Checkpoint**: US2 complete — add-to-cart functional with session persistence and header count.

---

## Phase 5: User Story 3 — Discover Related Fragrances (Priority: P3)

**Goal**: "You Might Also Like" section at page bottom shows up to 3 products
with overlapping scent tags. Each card links to its detail page. Section hidden
when no matches.

**Independent Test**: On `/products/midnight-rose` (floral, oriental, woody, musky),
scroll to bottom. Verify up to 3 related product cards visible — "Midnight Rose"
absent. Click one → navigates to correct product page. On a product with no
overlapping tags (manually test by clearing scentTags in seed) → section hidden.

### Implementation for User Story 3

- [x] T022 [P] [US3] Create `components/product-detail/RelatedProducts.tsx` — accepts `products: Product[]`; renders "You Might Also Like" `<h2>`, grid of `<ProductCard>` (reused from `components/homepage/`); returns `null` when `products.length === 0`
- [x] T023 [US3] Wire `<RelatedProducts>` into `app/products/[slug]/page.tsx` — call `getAllProducts()` server-side, pass result through `getRelatedProducts(currentProduct, allProducts)`, render at page bottom

**Checkpoint**: US3 complete — all 3 user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Tests, accessibility, SEO, and loading state.

- [x] T024 [P] Write Playwright E2E test `tests/e2e/product-detail.spec.ts` — covers: page loads with all fields, breadcrumb links work, add to cart increments header count, session persists on navigation, related products render and link correctly, 404 for invalid slug
- [x] T025 [P] Update `app/products/[slug]/loading.tsx` — full skeleton matching layout: image placeholder (aspect-[3/4]), two text lines for name/price, three scent tier placeholders, description block
- [x] T026 [P] Keyboard navigation audit — Tab through breadcrumb links, quantity decrement/increment, Add to Cart button, related product cards; verify `focus-visible:ring-2 focus-visible:ring-brand-gold` on all interactive elements
- [x] T027 [P] Verify SEO completeness in `app/products/[slug]/page.tsx` — confirm `metadata` export includes `title`, `description`, and `openGraph` (title, description, images array with product imageUrl, type: "website")

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all components
- **US1 View Details (Phase 3)**: Depends on Phase 2 (needs Product type with description, getProductBySlug)
- **US2 Add to Cart (Phase 4)**: Depends on Phase 2 (needs CartContext + useCart) + US1 (page.tsx must exist)
- **US3 Related Products (Phase 5)**: Depends on Phase 2 (needs getRelatedProducts) + US1 (page.tsx must exist)
- **Polish (Phase 6)**: Depends on all phases complete

### Parallel Opportunities

```bash
# Phase 1 — run in parallel:
T002  Update seed data (descriptions)
T003  Add getProductBySlug to lib/products.ts
T004  Create types/cart.ts

# Phase 2 — write RED tests in parallel:
T007  cart.test.ts (RED)
T008  related-products.test.ts (RED)

# Phase 2 — implement in parallel after RED:
T009  CartContext.tsx
T010  useCart.ts
T011  related-products.ts

# Phase 3 (US1) — all components in parallel:
T013  Breadcrumb.tsx
T014  ProductDetailHero.tsx
T015  ScentNotesPyramid.tsx
T016  ProductDescription.tsx

# Phase 5 (US3):
T022  RelatedProducts.tsx (independent of AddToCart)

# Phase 6 — all in parallel:
T024  E2E tests
T025  loading.tsx skeleton
T026  Keyboard audit
T027  SEO verification
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational — TDD RED→GREEN, cart + related fns)
3. Complete Phase 3 (US1 — product detail view)
4. **STOP and VALIDATE**: `/products/[slug]` shows full product info, 404 for bad slugs
5. Deploy as MVP — product pages fully browsable from catalogue

### Incremental Delivery

1. Setup + Foundational → core ready
2. US1 View Details → **MVP: product pages live**
3. US2 Add to Cart → conversion action available
4. US3 Related Products → discovery + cross-sell enabled
5. Polish → production-ready

---

## Notes

- [P] = parallelizable (different files, no blocking dependencies)
- [USn] = maps task to user story for traceability
- T007 and T008 (unit tests) MUST be written and confirmed FAILING before T009/T011 (implementations)
- `cartReducer` in `types/cart.ts` MUST be a pure function — export it for direct unit testing
- `getRelatedProducts` in `lib/related-products.ts` MUST be pure (no side effects, fully testable)
- `ProductCard` imported from `components/homepage/ProductCard.tsx` — do NOT duplicate
- `<CartProvider>` MUST be a `'use client'` component — wrap in a client boundary before adding to `app/layout.tsx` (which is a Server Component)
- `generateStaticParams` in `page.tsx` must call `getAllProducts()` to return all slugs at build time
