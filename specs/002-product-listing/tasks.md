# Tasks: Product Listing Page

**Input**: Design documents from `/specs/002-product-listing/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅
**Branch**: `002-product-listing`
**Total Tasks**: 36

**Organization**: Tasks grouped by user story — each independently implementable,
testable, and deliverable as an MVP increment.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: New types, data fetcher, and route scaffold before component work.

- [x] T001 Create `types/products.ts` — define `Product`, `FilterState`, `SortOption`, `PaginatedResult` types (extends `types/homepage.ts`)
- [x] T002 Update `data/featured-products-seed.ts` — add `category` (string) and `createdAt` (Date) fields to all 6 seed products
- [x] T003 Create `lib/products.ts` — export `getAllProducts(): Promise<Product[]>` returning active products sorted by `displayOrder`
- [x] T004 Create route file `app/products/page.tsx` — Server Component shell: calls `getAllProducts()`, passes result to `<ProductListingClient>`
- [x] T005 Create `app/products/loading.tsx` — Next.js loading UI using `<ProductListingSkeleton>`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core filter/sort/search/paginate logic and skeleton — required by ALL user stories.

**⚠️ CRITICAL**: Blocks all user story component work.

- [x] T006 Write unit test `tests/unit/product-filters.test.ts` — tests for `filterByFamily`, `filterByPrice`, `filterBySearch`, `sortProducts`, `paginate` (MUST FAIL before T007)
- [x] T007 Create `hooks/useProductFilters.ts` — pure filter pipeline functions (`filterByFamily`, `filterByPrice`, `filterBySearch`, `sortProducts`, `paginate`) + custom hook that reads/writes `FilterState` via `useSearchParams` and `useRouter`
- [x] T008 [P] Create `components/products/ProductListingSkeleton.tsx` — grid of 12 animated skeleton cards matching `ProductCard` dimensions
- [x] T009 [P] Create `components/products/ProductGrid.tsx` — accepts `products: Product[]`; renders responsive grid (2/3/4 cols); renders `<ProductListingSkeleton>` when `isLoading`; renders empty state when `products.length === 0`

**Checkpoint**: Filter logic tested and passing, grid and skeleton ready.

---

## Phase 3: User Story 1 — Browse All Products (Priority: P1) 🎯 MVP

**Goal**: Full product grid at `/products` with all active products, result count,
and navigation to product detail pages.

**Independent Test**: Open `http://localhost:3000/products`. Verify 6 product
cards render in a 4-column grid (desktop), each with image, name, price badge,
scent family badge, and a link to `/products/[slug]`.

### Implementation for User Story 1

- [x] T010 [US1] Create `components/products/ProductListingClient.tsx` — `'use client'` wrapper: initialises `useProductFilters`, renders `<SearchBar>`, `<FilterPanel>`, `<SortDropdown>`, `<ProductGrid>`, `<Pagination>` (stubs for US2–US4)
- [x] T011 [US1] Wire `app/products/page.tsx` — call `getAllProducts()` server-side, pass `allProducts` prop to `<ProductListingClient>`, add page `<title>` and meta description for SEO
- [x] T012 [US1] Add result count display in `ProductListingClient.tsx`: "N products" (or "N product" singular) above the grid
- [x] T013 [US1] Add broken image fallback to `ProductCard` used on listing page: `onError` sets `src` to CSS gradient placeholder (`bg-brand-cream/40` div) replacing the `<Image>`

**Checkpoint**: US1 complete — `/products` fully browsable. Deploy/demo as MVP.

---

## Phase 4: User Story 2 — Filter by Scent Family & Price (Priority: P2)

**Goal**: Filter panel with scent family checkboxes and price range inputs.
Selections update the grid instantly and sync to URL query params.

**Independent Test**: Check "Floral" → only floral products visible, URL has
`?family=floral`. Set price Rs 4,000–6,000 → results narrow. Clear → full grid.

### Implementation for User Story 2

- [x] T014 [P] [US2] Create `components/products/FilterPanel.tsx` — renders: scent family checkboxes (Floral, Woody, Oriental, Fresh, Gourmand, Green, Musky), min/max price number inputs, "Clear All Filters" button; fires `onFilterChange` callback; shows active filter count badge
- [x] T015 [US2] Connect `FilterPanel` to `useProductFilters` in `ProductListingClient.tsx` — family and price changes update `FilterState` and push to URL params
- [x] T016 [US2] Add mobile filter toggle in `ProductListingClient.tsx` — "Filters" button shows/hides `<FilterPanel>` on screens < 1024px (collapsible drawer)
- [x] T017 [US2] Add zero-result empty state to `ProductGrid.tsx` for filter scenario: "No products match your filters." + "Clear Filters" `<button>` that calls `onClearFilters`
- [x] T018 [US2] Verify URL params restore filter state on page load — read `family`, `minPrice`, `maxPrice` from `useSearchParams` in `useProductFilters` initialisation

**Checkpoint**: US2 complete — filter panel functional with URL sync.

---

## Phase 5: User Story 3 — Search Products (Priority: P3)

**Goal**: Search bar filters product grid by name and scent notes with 300ms
debounce. Query synced to URL (`?q=`).

**Independent Test**: Type "Rose" → only products with "rose" in name/notes shown.
URL shows `?q=Rose`. Clear → full grid. Combined search + filter works.

### Implementation for User Story 3

- [x] T019 [P] [US3] Create `components/products/SearchBar.tsx` — controlled `<input type="search">` with label "Search fragrances…"; fires `onSearch` callback; 44px min height; clear button (×) when non-empty; `aria-label` set
- [x] T020 [US3] Connect `SearchBar` to `useProductFilters` in `ProductListingClient.tsx` — query changes update `FilterState.query` and URL `?q=` param with 300ms debounce
- [x] T021 [US3] Add zero-result empty state for search in `ProductGrid.tsx`: "No results for '[query]'. Try a different search term." (distinct from filter empty state)
- [x] T022 [US3] Read `?q=` from `useSearchParams` on initial load and pre-populate `SearchBar` value in `useProductFilters`

**Checkpoint**: US3 complete — search functional with debounce and URL sync.

---

## Phase 6: User Story 4 — Sort Products (Priority: P4)

**Goal**: Sort dropdown (Bestselling / Price Low-High / Price High-Low / Newest).
Selection reorders the grid and syncs to URL (`?sort=`).

**Independent Test**: Select "Price: Low to High" → Rs 3,500 product appears first.
URL shows `?sort=price_asc`. Apply filter + sort → filtered results correctly ordered.

### Implementation for User Story 4

- [x] T023 [P] [US4] Create `components/products/SortDropdown.tsx` — `<select>` with 4 options (Bestselling, Price: Low to High, Price: High to Low, Newest First); fires `onSortChange`; 44px min height; `aria-label="Sort products"`
- [x] T024 [US4] Connect `SortDropdown` to `useProductFilters` in `ProductListingClient.tsx` — sort change updates `FilterState.sort` and URL `?sort=` param
- [x] T025 [US4] Read `?sort=` from `useSearchParams` on initial load in `useProductFilters`; default to `'bestselling'` for unknown/missing values

**Checkpoint**: US4 complete — all 4 user stories independently functional.

---

## Phase 7: Pagination (Cross-Cutting)

**Purpose**: 12-products-per-page controls with URL sync (`?page=`).

- [x] T026 [P] Create `components/products/Pagination.tsx` — renders Previous / page-number display / Next buttons; disables Previous on page 1, Next on last page; fires `onPageChange`; keyboard accessible (44px buttons)
- [x] T027 Connect `Pagination` to `useProductFilters` in `ProductListingClient.tsx` — page change updates `FilterState.page` and URL `?page=` param; resets to page 1 when filters/search/sort change
- [x] T028 Scroll to top of product grid on page change (smooth scroll to `#product-grid` anchor) in `ProductListingClient.tsx`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, SEO, performance, and E2E tests.

- [x] T029 [P] Write Playwright E2E test `tests/e2e/product-listing.spec.ts` — covers: grid loads, filter by family, price range, clear filters, search with debounce, sort, pagination, shared URL restores state, empty states
- [x] T030 [P] Add `<meta>` description and Open Graph tags to `app/products/page.tsx` for SEO (e.g., "Browse our full collection of luxury handcrafted perfumes")
- [x] T031 [P] Keyboard navigation audit — Tab through FilterPanel checkboxes, price inputs, SearchBar, SortDropdown, ProductCard links, Pagination buttons; fix any missing `focus-visible` ring styles
- [x] T032 [P] Run Lighthouse CI on `/products` — fix any issues below: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90
- [x] T033 Add `id="product-grid"` anchor to `ProductGrid.tsx` wrapper for scroll-to-top on page change
- [x] T034 [P] Cross-browser smoke test: Chrome, Firefox, Safari, Edge — verify grid layout at 320px, 768px, 1440px; filter panel collapses correctly on mobile

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all components
- **US1 Browse (Phase 3)**: Depends on Phase 2 (needs `ProductGrid`, `useProductFilters`)
- **US2 Filter (Phase 4)**: Depends on Phase 2 + US1 (`ProductListingClient` must exist)
- **US3 Search (Phase 5)**: Depends on Phase 2 + US1
- **US4 Sort (Phase 6)**: Depends on Phase 2 + US1
- **Pagination (Phase 7)**: Depends on Phase 2 + US1
- **Polish (Phase 8)**: Depends on ALL phases complete

### Parallel Opportunities

```bash
# Phase 1 — run in parallel:
T002  Update seed data (category + createdAt)
T003  Create lib/products.ts
T005  Create loading.tsx skeleton route

# Phase 2 — run in parallel after T006 RED test:
T008  ProductListingSkeleton component
T009  ProductGrid component

# Phase 4 US2 — run in parallel:
T014  FilterPanel component (independent of ProductListingClient)

# Phase 5 US3 — run in parallel:
T019  SearchBar component

# Phase 6 US4 — run in parallel:
T023  SortDropdown component

# Phase 7 — run in parallel:
T026  Pagination component

# Phase 8 — run in parallel:
T029  E2E tests
T030  SEO meta tags
T031  Keyboard audit
T032  Lighthouse CI
T034  Cross-browser smoke test
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational — filter logic + grid)
3. Complete Phase 3 (US1 — browse grid)
4. **STOP and VALIDATE**: `/products` shows all products, cards link correctly
5. Deploy as MVP — catalogue browsable

### Incremental Delivery

1. Setup + Foundational → core ready
2. US1 Browse → **MVP: catalogue live**
3. US2 Filter → discovery improved
4. US3 Search → high-intent shoppers served
5. US4 Sort → purchase decision accelerated
6. Pagination + Polish → production-ready

---

## Notes

- [P] = parallelizable (different files, no blocking dependencies)
- [USn] = maps task to user story for traceability
- T006 (unit test) MUST be written and confirmed FAILING before T007 (implementation)
- Filter/sort/paginate functions in `useProductFilters.ts` MUST be pure (no side effects)
- All URL param reads MUST handle missing/invalid values gracefully (default to safe values)
- `ProductCard` imported from `components/homepage/ProductCard.tsx` — do NOT duplicate
