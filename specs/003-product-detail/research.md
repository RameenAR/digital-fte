# Research: Product Detail Page

**Feature**: 003-product-detail | **Date**: 2026-03-07

---

## Decision 1: Cart State Management Strategy

**Decision**: React Context + `useReducer` + `sessionStorage`

**Rationale**:
- Session-only cart (spec FR-008) means no cross-session persistence — sessionStorage
  is the exact primitive for this.
- React Context is built-in (no additional dependencies), integrates natively with
  Next.js App Router, and is sufficient for a single-page cart counter + item list.
- `useReducer` provides predictable state transitions (ADD_ITEM, REMOVE_ITEM, CLEAR)
  and is unit-testable with pure reducer functions.
- sessionStorage survives page navigations but resets on browser close — exactly
  matching the spec requirement.

**Alternatives considered**:
- **Zustand**: Excellent library, but adds a dependency. Overkill for a single
  cart feature with no complex selectors. Violates Principle VI.
- **localStorage**: Would persist across sessions — not what the spec requires for v1.
  Upgrade path if v2 needs cross-session cart.
- **URL state**: Not suitable for cart (items accumulate, shouldn't be in URL).
- **Redux Toolkit**: Too heavy for this scope; reserved for complex global state.
- **Server-side session (cookie)**: Requires an API route and auth middleware —
  adds significant complexity for no benefit in v1.

---

## Decision 2: Product `description` Field Storage

**Decision**: Add `description: string` to seed data and `Product` type. No DB migration.

**Rationale**:
- v1 uses seed data (no live DB). Adding a field to the TypeScript interface and
  the seed array costs nothing and unblocks the feature.
- Each of the 6 products will receive 50–120 word editorial descriptions written
  during implementation.
- v2 (Prisma + PostgreSQL) will add the column via a non-destructive `ALTER TABLE
  ADD COLUMN description TEXT NOT NULL DEFAULT ''` migration.

**Alternatives considered**:
- **Separate content management system (CMS)**: Contentful, Sanity — correct for
  a production site but premature for 6 seed products. ADR candidate for v2.
- **Markdown file per product**: Over-engineered for seed data. Keep all product
  data co-located in `featured-products-seed.ts`.

---

## Decision 3: Related Products Algorithm

**Decision**: Tag-overlap scoring — pure function `getRelatedProducts(current, all, limit=3)`

**Rationale**:
- "Related" defined in spec as: ≥1 overlapping `scentTag`, ranked by overlap count
  (desc), excluding the current product, limited to 3.
- Pure function: no side effects, fully unit-testable (matches Principle III).
- Consistent with filter logic already in `useProductFilters.ts` (no new mental
  model introduced).
- With 6 seed products all having 2–4 tags, every product has ≥2 related products.

**Alternatives considered**:
- **Same `category` field only**: Too coarse — "Floral" vs "floral + musky" loses
  nuance. Tag overlap is richer.
- **ML-based similarity**: Dramatically over-engineered for 6 products. Revisit at
  50+ products.
- **Manually curated**: Brittle — breaks when products are added/removed.

---

## Decision 4: Dynamic Route + notFound()

**Decision**: `app/products/[slug]/page.tsx` Server Component; `notFound()` for missing slugs

**Rationale**:
- Next.js App Router's `notFound()` function triggers the nearest `not-found.tsx`
  or the built-in 404 response — clean, zero custom error UI needed in v1.
- Server Component fetches product by slug synchronously before rendering. No
  client-side loading state for the initial product data (improves LCP).
- `loading.tsx` handles the Suspense fallback while the Server Component resolves.

**Alternatives considered**:
- **`redirect()` to `/products`**: Loses context — user doesn't know why they
  were redirected. `notFound()` is semantically correct.
- **Client-side fetch with `useEffect`**: Delays first contentful paint, hurts LCP.
  Server Component fetch is faster and SEO-friendly.

---

## Decision 5: Add to Cart UX — Optimistic + 2s Reset

**Decision**: Local `useState` flag in `AddToCart` component; dispatch to CartContext; 2000ms timer reset

**Rationale**:
- Cart add is instant (client-side only) — no async operation to wait for.
  Optimistic UI is trivially correct here (no failure case in v1).
- 2-second success state (spec FR-006) implemented via `setTimeout` — no external
  animation library needed.
- Button reverts automatically — shopper can add again without manual reset.

**Alternatives considered**:
- **Toast notification**: More flexible pattern, but adds a toast library dependency
  or a custom component. The in-button success state is simpler and sufficient.
- **Permanent "in cart" state**: Requires checking CartContext on render — adds
  complexity. Simpler to just reset.

---

## Decision 6: `generateStaticParams` for Static Generation

**Decision**: Export `generateStaticParams()` from `app/products/[slug]/page.tsx`

**Rationale**:
- With 6 known products, all slugs can be statically generated at build time.
  Result: instant page loads for all product pages, no server compute per request.
- `generateStaticParams` returns the list of slugs from seed data — trivial to
  implement, major performance win (LCP < 500ms on CDN).
- Falls back to dynamic rendering (SSR) for unknown slugs (which then 404).

**Alternatives considered**:
- **`dynamic = 'force-dynamic'`**: Every request hits the server — unnecessary when
  product data is static in v1. Hurts performance.
- **ISR (Incremental Static Regeneration)**: Correct for a real DB where products
  change — over-engineered for seed data that only changes on deploy.
