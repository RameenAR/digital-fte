# Research: Product Listing Page

**Feature**: 002-product-listing | **Date**: 2026-03-07 | **Phase**: 0

---

## Decision 1: Client-Side vs Server-Side Filtering

**Decision**: Client-side filtering in v1 (all products fetched once, filtered in-memory)
**Rationale**: Catalogue size in v1 is small (~6–50 products). Fetching all once
on server render and filtering with JavaScript avoids a round-trip on every filter
change — result is instant UI response (< 16ms), far under the 300ms SC-002 target.
When catalogue grows beyond ~200 products, migrate to server-side filtering via
a GET /api/products route (query param → Prisma WHERE clause).
**Alternatives considered**:
- Server-side filtering (API route per filter change) — correct for large catalogues;
  overkill for v1 with ~6 seed products; adds network latency per interaction
- SWR/React Query with server filtering — powerful but over-engineered for v1;
  introduces dependencies that violate the Simplicity principle
- Algolia/Meilisearch — full-text search service; unnecessary external dependency
  at this scale; reserved for v3 if catalogue exceeds 500 products

---

## Decision 2: URL State Management

**Decision**: Next.js `useSearchParams` + `useRouter.push` for URL-synced filter state
**Rationale**: Built into Next.js App Router — zero additional dependencies.
Provides: shareable URLs (FR-005), browser back/forward support, and bookmark
compatibility. State is derived from URL on every render, making the component
fully controlled and easy to test.
**Alternatives considered**:
- Zustand/Redux for filter state — powerful but overkill; state would not survive
  page refresh or link sharing; violates Simplicity principle
- React Context — same problem as Zustand (state lost on refresh)
- nuqs library — elegant URL state helper but adds a dependency; native
  `useSearchParams` is sufficient for this feature's complexity

---

## Decision 3: Search Implementation

**Decision**: Client-side string matching with 300ms debounce via `setTimeout`
**Rationale**: Case-insensitive substring match on `product.name` and
`product.scentNotes` (joined string). Pure JavaScript, zero dependencies,
perfectly fast for <200 products. 300ms debounce prevents excessive re-renders
during typing and matches SC-002.
**Alternatives considered**:
- Fuse.js (fuzzy search) — better for typos but adds 10KB dependency; overkill
  for simple name/notes search; can add in v2 if user feedback demands it
- Server-side full-text search (PostgreSQL `tsvector`) — correct for large
  catalogues; deferred to v2

---

## Decision 4: Pagination Strategy

**Decision**: Client-side array slice — `filteredProducts.slice(offset, offset + 12)`
**Rationale**: Consistent with client-side filtering decision. No additional
API calls. Pagination state (page number) stored in URL (`?page=2`). Simple,
predictable, and testable as a pure function.
**Alternatives considered**:
- Server-side pagination (LIMIT/OFFSET in Prisma) — required for large catalogues;
  deferred to v2 alongside server-side filtering migration
- Infinite scroll — UX pattern not specified in spec; adds complexity without
  a clear requirement; deferred

---

## Decision 5: Component Architecture

**Decision**: Reuse `ProductCard` from homepage; add 5 new components under `components/products/`
**Rationale**: `ProductCard` already implements FR-002 (image, name, price, scent notes).
Reuse satisfies the Simplicity and Component-Driven principles simultaneously.
New components (`FilterPanel`, `SearchBar`, `SortDropdown`, `ProductGrid`, `Pagination`)
are isolated and independently testable — they receive props and fire callbacks,
containing no business logic.
**Alternatives considered**:
- Duplicate ProductCard for the listing page — violates DRY; any future change
  requires updating two components
- Single monolithic `ProductListingPage` component — violates Component-Driven
  principle; untestable in isolation

---

## Decision 6: Filter Logic

**Decision**: OR logic for scent families; AND logic between family and price range
**Rationale**: Matches real-world e-commerce UX expectations. Shoppers who select
"Floral" AND "Woody" want to see products from either family, not products that
are simultaneously both (which may be 0). Price range always applies on top of
family selection as a narrowing filter.
**Alternatives considered**:
- AND logic for families — would produce zero results for most multi-family
  selections; poor UX for a small catalogue
- Separate price sliders per family — over-engineered for current catalogue size

---

## Resolved Items from Spec Assumptions

| Assumption | Resolution |
|-----------|-----------|
| Client-side vs server-side filter | Client-side (v1); server-side in v2 |
| "Bestselling" sort proxy | `displayOrder` ascending (curated ranking) |
| Broken image placeholder | Grey gradient CSS fallback (`bg-brand-cream/40`) in v1; branded asset in v2 |
| Search scope | Name + all scent notes (top/heart/base joined) |
| Page size | 12 products per page (matches 4-column grid × 3 rows) |
