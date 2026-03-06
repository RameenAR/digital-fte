# Implementation Plan: Product Listing Page

**Branch**: `002-product-listing` | **Date**: 2026-03-07 | **Spec**: specs/002-product-listing/spec.md
**Input**: Feature specification from `/specs/002-product-listing/spec.md`

## Summary

Build the `/products` page — a fully-filterable, searchable, sortable, and
paginated perfume catalogue. Filter/search/sort/page state lives in the URL as
query parameters (enabling shareability and browser-back support). Filtering is
done client-side in v1 (all products fetched once, filtered in-memory via React
state + `useSearchParams`). Pagination is client-side over the filtered result
set. The page reuses the `ProductCard` component from the homepage.

## Technical Context

**Language/Version**: TypeScript 5.x · Node.js 20 LTS
**Primary Dependencies**: Next.js 14 (App Router) · React 18 · Tailwind CSS 3 · Prisma 5
**Storage**: PostgreSQL via Prisma (same DB as homepage); seed data from `data/featured-products-seed.ts` in v1
**Testing**: Vitest (unit — filter/sort logic) · Playwright (E2E — full filter/search/sort/paginate flow)
**Target Platform**: Web — Vercel (SSR for initial load, client-side filtering)
**Project Type**: Web application — extends existing Next.js fullstack project
**Performance Goals**: LCP ≤ 2.5s · Filter response ≤ 300ms · Lighthouse Perf ≥ 85
**Constraints**: WCAG 2.1 AA · Mobile-first 320px–1920px · URL-synced state (query params)
**Scale/Scope**: Single page (`/products`) · 0 new API routes (client-side filter) · 5 new components

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. User-First | Mobile-first grid; skeleton loading; 44px touch targets on filter/sort controls | ✅ PASS |
| II. Component-Driven | FilterPanel, SearchBar, SortDropdown, ProductGrid, Pagination are isolated components | ✅ PASS |
| III. Test-First | Unit tests for filter/sort logic before implementation; E2E for full flow | ✅ PASS |
| IV. Secure by Default | Query params sanitized before use; no secrets on this page | ✅ PASS |
| V. Performance Budget | Products fetched once (server); client-side filter avoids repeated API calls | ✅ PASS |
| VI. Simplicity | Client-side filter in v1 (no extra API route); `useSearchParams` for URL sync | ✅ PASS |

**All gates PASS — Phase 0 research may proceed.**

## Project Structure

### Documentation (this feature)

```text
specs/002-product-listing/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── products-api.md  # GET /api/products contract
├── tasks.md             # Phase 2 output (/sp.tasks)
└── checklists/
    └── requirements.md
```

### Source Code

```text
# Extends existing Next.js App Router project

app/
└── products/
    └── page.tsx                          # /products route — SSR fetch + client filter shell

components/
└── products/
    ├── ProductGrid.tsx                   # US1: responsive product grid wrapper
    ├── FilterPanel.tsx                   # US2: scent family checkboxes + price range
    ├── SearchBar.tsx                     # US3: debounced search input
    ├── SortDropdown.tsx                  # US4: sort options select
    ├── Pagination.tsx                    # Edge case: page controls
    └── ProductListingSkeleton.tsx        # Edge case: loading skeleton

hooks/
└── useProductFilters.ts                  # Custom hook: filter/sort/search/paginate logic
                                          # reads & writes URL query params via useSearchParams

lib/
└── products.ts                           # Server fn: getAllProducts(): Promise<Product[]>

types/
└── products.ts                           # FilterState, SortOption, PaginatedResult types

tests/
├── unit/
│   └── product-filters.test.ts           # Unit: filter, sort, search, paginate logic
└── e2e/
    └── product-listing.spec.ts           # E2E: full page interactions
```

**Structure Decision**: Extends existing single Next.js project. New components
under `components/products/` (separate from `components/homepage/`). No new API
route needed — products fetched server-side in `page.tsx`, filtering done client-side.

## Complexity Tracking

> No constitution violations.

## Key Design Decisions

### 1. Client-Side Filtering (v1)
All active products fetched once on server render. Filter/search/sort applied
in-memory via `useProductFilters` hook. Avoids repeated API calls on every
filter change — fast UX, simple implementation. v2 can move to server-side
filtering (API route) if catalogue grows beyond ~200 products.

### 2. URL-Synced State via `useSearchParams`
Filter/search/sort/page state stored in URL query params. Enables: browser back/forward,
shareable URLs, and bookmark support — all required by FR-005, FR-007, FR-008, FR-010.
Next.js `useSearchParams` + `useRouter` provides this without external state libraries.

### 3. Reuse `ProductCard` from Homepage
`components/homepage/ProductCard.tsx` already satisfies FR-002. No duplication.
`ProductGrid` simply wraps an array of `ProductCard` instances in the grid layout.

### 4. Pagination: Client-Side Slice
After filtering/sorting, paginate the result array by slicing `[page * 12, (page+1) * 12]`.
Simple, zero additional fetches, consistent with client-side filtering decision.

### 5. Debounce via Custom Hook
Search debounce (300ms) implemented inside `useProductFilters` using `setTimeout`/`clearTimeout`.
No external debounce library needed — keeps bundle lean.

## API Routes

### GET /api/products (optional — for future server-side filtering)
In v1, products are fetched directly in `page.tsx` via `lib/products.ts` (server component).
No HTTP API route is created in this feature. Documented here for v2 reference only.

| Parameter | Type | Notes |
|-----------|------|-------|
| family | string (CSV) | e.g., `floral,woody` |
| minPrice | number | PKR |
| maxPrice | number | PKR |
| q | string | Search query |
| sort | string | `bestselling\|price_asc\|price_desc\|newest` |
| page | number | 1-indexed |
| limit | number | Default 12 |
