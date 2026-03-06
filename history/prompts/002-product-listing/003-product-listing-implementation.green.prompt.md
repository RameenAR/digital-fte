---
id: 003
title: Product Listing Page Implementation
stage: green
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 002-product-listing
branch: 002-product-listing
user: hp
command: /sp.implement
labels: ["green","product-listing","filter","search","sort","pagination","url-state","client-side","tdd"]
links:
  spec: specs/002-product-listing/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - types/products.ts
  - data/featured-products-seed.ts
  - lib/products.ts
  - app/products/page.tsx
  - app/products/loading.tsx
  - hooks/useProductFilters.ts
  - components/products/ProductListingSkeleton.tsx
  - components/products/ProductGrid.tsx
  - components/products/ProductListingClient.tsx
  - components/products/FilterPanel.tsx
  - components/products/SearchBar.tsx
  - components/products/SortDropdown.tsx
  - components/products/Pagination.tsx
  - components/homepage/ProductCard.tsx
  - tests/unit/product-filters.test.ts
  - tests/e2e/product-listing.spec.ts
  - vitest.config.ts
  - specs/002-product-listing/tasks.md
tests:
  - tests/unit/product-filters.test.ts (23 tests — filterByFamily, filterByPrice, filterBySearch, sortProducts, paginate)
  - tests/unit/newsletter.test.ts (8 tests — pre-existing)
  - tests/unit/quiz-engine.test.ts (4 tests — pre-existing)
  - tests/e2e/product-listing.spec.ts (14 E2E scenarios)
---

## Prompt

(Continuation from previous session — /sp.implement invoked for 002-product-listing)

## Response snapshot

Implemented all 34 tasks across 8 phases for the product listing page:

**Phase 1 (Setup)**: `types/products.ts` (Product, FilterState, SortOption, PaginatedResult), updated seed data with category+createdAt, `lib/products.ts` getAllProducts(), `app/products/page.tsx` SSR Server Component with metadata, `app/products/loading.tsx` skeleton route.

**Phase 2 (Foundational)**: Unit tests RED first (`tests/unit/product-filters.test.ts` — 23 tests), then `hooks/useProductFilters.ts` with 5 pure functions (filterByFamily, filterByPrice, filterBySearch, sortProducts, paginate) + custom hook with URL-synced state via useSearchParams/useRouter. Tests GREEN (23/23 pass).

**Phase 3 (US1)**: `ProductListingClient.tsx` ('use client' Suspense wrapper), result count display (N products/product), broken image fallback in ProductCard (useState + onError → gradient div).

**Phase 4 (US2)**: `FilterPanel.tsx` — 7 scent family checkboxes (Floral/Woody/Oriental/Fresh/Gourmand/Green/Musky), min/max price inputs, active filter count badge, Clear All button. Connected to useProductFilters in ProductListingClient. Mobile filter toggle (< lg screens). Zero-result filter state in ProductGrid.

**Phase 5 (US3)**: `SearchBar.tsx` — controlled input, 300ms debounce handled by hook, clear (×) button, aria-label. URL ?q= sync. Search-specific zero-result state: "No results for '[query]'. Try a different search term."

**Phase 6 (US4)**: `SortDropdown.tsx` — 4 options (Bestselling/Price Low-High/Price High-Low/Newest First), 44px min height, aria-label. URL ?sort= sync, default to 'bestselling'.

**Phase 7 (Pagination)**: `Pagination.tsx` — Previous/Next buttons, page N of M display, disabled states, keyboard accessible 44px buttons. Scroll to #product-grid on page change.

**Phase 8 (Polish)**: E2E test suite (14 scenarios covering US1-US4 + URL state restoration), SEO meta+OG tags in page.tsx, id="product-grid" anchor in ProductGrid, excluded E2E from Vitest config.

All 35 unit tests pass (3 test files). Tasks.md marked 34/34 [x].

## Outcome

- ✅ Impact: Complete /products page — filterable, searchable, sortable, paginated, URL-synced product catalogue.
- 🧪 Tests: 35/35 unit tests pass; 14 E2E scenarios written (require dev server to run).
- 📁 Files: 18 files created/modified across types/, lib/, hooks/, app/products/, components/products/, components/homepage/, tests/
- 🔁 Next prompts: commit + push 002-product-listing → create PR → merge to master
- 🧠 Reflection: Seed data type change (FeaturedProduct→Product) was non-breaking since Product extends FeaturedProduct. Needed to exclude E2E from Vitest config to avoid Playwright/Vitest conflict.

## Evaluation notes (flywheel)

- Failure modes observed: E2E tests collected by Vitest (fixed by adding exclude pattern); node_modules missing on start (npm install required)
- Graders run and results (PASS/FAIL): Unit tests — 35/35 PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run Playwright E2E after dev server start; consider adding scent family badge to ProductCard for listing page context
