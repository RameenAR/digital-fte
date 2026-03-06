# Feature Specification: Product Listing Page

**Feature Branch**: `002-product-listing`
**Created**: 2026-03-07
**Status**: Draft
**Input**: Perfume e-commerce product listing page with browse, filter by scent
family and price, search, and sort functionality.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse All Products (Priority: P1)

A visitor arrives on the `/products` page (via the homepage CTA or direct URL).
They want to see all available perfumes in a clean, browsable grid — with enough
information per card to make a selection decision without clicking into each one.

**Why this priority**: This is the core catalogue page. Without it, no product
can be discovered or purchased. Every other feature on this page depends on it.

**Independent Test**: Navigate to `/products`. Verify a grid of product cards
renders, each showing image, name, price, and scent family badge. No filters
applied — all active products visible.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to `/products`, **When** the page loads,
   **Then** all active products display in a responsive grid (2 columns mobile,
   3 tablet, 4 desktop).

2. **Given** the product grid renders, **When** a visitor views a card,
   **Then** they see: product image, name, price (PKR), scent family badge,
   and a "View" action.

3. **Given** a visitor clicks a product card, **When** navigation occurs,
   **Then** they land on `/products/[slug]`.

4. **Given** no active products exist, **When** the page loads,
   **Then** empty state shows: "No products available yet. Check back soon."

5. **Given** a visitor is on mobile (375px), **When** the page loads,
   **Then** a 2-column grid renders without horizontal scrolling.

---

### User Story 2 — Filter by Scent Family & Price (Priority: P2)

A visitor uses the filter panel to narrow results by scent family (Floral, Woody,
Oriental, Fresh, etc.) and/or price range. The grid updates without a page reload.

**Why this priority**: Filtering is the primary discovery tool for informed
shoppers. Without it, browsing a large catalogue is overwhelming.

**Independent Test**: Select "Floral" filter → only floral products appear.
Set price range Rs 3,000–5,000 → results narrow further. Clear all → full grid.

**Acceptance Scenarios**:

1. **Given** a visitor selects a scent family (e.g., "Woody"), **When** selected,
   **Then** the grid instantly shows only products tagged "woody" and the filter
   is visually highlighted.

2. **Given** a visitor sets a price range (min Rs 3,000 — max Rs 6,000),
   **When** applied, **Then** only products within that range are shown.

3. **Given** multiple scent families are selected, **When** active,
   **Then** products matching ANY selected family appear (OR logic).

4. **Given** active filters return zero results, **When** grid renders,
   **Then** message shows: "No products match your filters." with a
   "Clear Filters" button.

5. **Given** a visitor clicks "Clear All Filters", **When** clicked,
   **Then** all selections reset and the full grid reappears.

6. **Given** a visitor applies filters, **When** they share or bookmark the URL,
   **Then** the URL contains query params (e.g., `?family=floral&maxPrice=5000`)
   and opening it restores the same filtered state.

---

### User Story 3 — Search Products (Priority: P3)

A visitor types a search query in the search bar. The grid filters in real time
to show products matching the query by name or scent notes.

**Why this priority**: Search converts high-intent visitors fastest. Critical
discovery path for return customers who know what they want.

**Independent Test**: Type "Rose" → grid shows only products with "rose" in
name or scent notes (case-insensitive). Clear search → full grid reappears.

**Acceptance Scenarios**:

1. **Given** a visitor types a query (e.g., "Oud"), **When** they stop typing
   (300ms debounce), **Then** grid filters to products whose name or scent notes
   contain "oud" (case-insensitive).

2. **Given** a search matches no products, **When** grid renders,
   **Then** shows: "No results for '[query]'. Try a different search term."

3. **Given** the search bar is cleared, **When** empty,
   **Then** the full product grid reappears (respecting any active filters).

4. **Given** both search AND scent family filters are active,
   **When** combined, **Then** results satisfy BOTH criteria simultaneously.

---

### User Story 4 — Sort Products (Priority: P4)

A visitor sorts the product grid by price, newness, or bestselling rank.

**Why this priority**: Sorting helps price-sensitive and trend-aware shoppers
decide faster. Standard e-commerce expectation.

**Independent Test**: Select "Price: Low to High" → cheapest product appears
first. Select "Price: High to Low" → most expensive first.

**Acceptance Scenarios**:

1. **Given** a visitor selects "Price: Low to High", **When** selected,
   **Then** products reorder from lowest to highest price.

2. **Given** "Price: High to Low" is selected, **When** selected,
   **Then** products order from highest to lowest price.

3. **Given** "Newest First" is selected, **When** selected,
   **Then** products order by addition date, most recent first.

4. **Given** "Bestselling" is selected (default), **When** selected,
   **Then** products order by curated bestseller ranking.

5. **Given** sort AND filters are both active, **When** combined,
   **Then** filtered results are correctly sorted.

---

### Edge Cases

- Large catalogue (50+ products): Pagination MUST show 12 products per page
  with Previous/Next controls. Page number synced to URL (`?page=2`).
- Filter + search = 0 results: Empty state with "Clear Filters" CTA — never
  a blank or broken grid.
- Product image fails to load: A branded placeholder MUST render instead of
  a broken image icon.
- Shared filtered URL: Opening in a new tab MUST restore filter/search/sort/page
  state from query parameters.
- Slow connection: Product images MUST lazy-load; skeleton loading state shown
  while data fetches (prevents layout shift).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `/products` MUST display all active products in a responsive grid:
  2 columns (≤640px), 3 columns (641–1024px), 4 columns (>1024px).

- **FR-002**: Each product card MUST show: image, name, price (PKR), scent
  family badge, and a "View" link to `/products/[slug]`.

- **FR-003**: A filter panel MUST provide: scent family checkboxes (Floral,
  Woody, Oriental, Fresh, Gourmand, Green, Musky) and min/max price range inputs.

- **FR-004**: Filters MUST update the grid without a full page reload.
  Multiple families = OR logic. Price range = AND with family filters.

- **FR-005**: Active filters MUST be reflected in URL query params
  (e.g., `?family=floral,woody&minPrice=3000&maxPrice=6000`).

- **FR-006**: A "Clear All Filters" button MUST reset all filters and restore
  the full product grid.

- **FR-007**: A search bar MUST filter products by name and scent notes with
  300ms debounce. Query MUST sync to URL (`?q=rose`).

- **FR-008**: A sort dropdown MUST offer: Bestselling (default), Price: Low to
  High, Price: High to Low, Newest First. Sort MUST sync to URL (`?sort=price_asc`).

- **FR-009**: The page MUST display a result count: e.g., "24 products".

- **FR-010**: Pagination MUST show 12 products per page with Previous/Next
  controls and current page synced to URL (`?page=2`).

- **FR-011**: A skeleton loading state MUST appear while products fetch.

- **FR-012**: Broken product images MUST fall back to a branded placeholder.

- **FR-013**: All interactive elements (filters, search, sort, cards) MUST be
  keyboard-navigable (Tab, Enter, Space).

- **FR-014**: Page MUST achieve Lighthouse Accessibility score ≥ 90.

### Key Entities

- **Product**: Extends FeaturedProduct (homepage). Adds `createdAt` (for Newest
  sort) and `category` (scent family display label).

- **FilterState**: UI state. Fields: `families: string[]`, `minPrice: number | null`,
  `maxPrice: number | null`, `query: string`, `sort: SortOption`, `page: number`.

- **SortOption**: `bestselling | price_asc | price_desc | newest`.

- **PaginatedResult**: `products: Product[]`, `total: number`, `page: number`,
  `totalPages: number`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `/products` initial load (no filters) completes with LCP ≤ 2.5s
  on standard broadband.

- **SC-002**: Applying a filter or search updates the grid within 300ms
  (client-side) or 1 second (server-side).

- **SC-003**: Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90.

- **SC-004**: A shareable filtered URL restores the exact same grid state when
  opened in a new tab.

- **SC-005**: Zero blank/broken grid states — empty state shown for all
  zero-result scenarios.

- **SC-006**: Renders correctly on Chrome, Firefox, Safari, Edge (latest) at
  320px, 768px, and 1440px viewports.

- **SC-007**: All filters, search, sort, and product cards operable via keyboard.

---

## Assumptions

- Products data comes from the same Prisma/seed source as the homepage (v1).
- Scent family tags are inherited from `scentTags` defined in the homepage seed.
- Client-side vs server-side filtering is a technical decision deferred to plan.
- "Bestselling" sort uses `displayOrder` as a proxy for sales rank in v1.
- No authentication required — public route.
- Broken image placeholder asset provided by design team; grey gradient used in v1.
