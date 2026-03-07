# Feature Specification: Search & Filter

**Feature Branch**: `005-search-filter`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Search & Filter — product search bar with real-time filtering, filter by category (eau de parfum, eau de toilette, parfum), price range slider, gender (men, women, unisex), fragrance notes (floral, woody, oriental, fresh, citrus). Filters apply instantly without page reload. Active filters shown as removable chips. Result count displayed. URL reflects active filters for shareable links. No backend search — client-side filtering of existing product catalog."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real-Time Text Search (Priority: P1)

A shopper on the product listing page types a keyword (e.g., "rose" or "oud") into a search bar. As they type, the product grid updates instantly to show only matching products — no button press or page reload required. If they clear the search term, all products reappear.

**Why this priority**: Text search is the fastest path to discovery for a shopper who already has a fragrance in mind. It delivers immediate, visible value and is the foundation on which other filters build.

**Independent Test**: Visit `/products`, type "oud" in the search bar, and verify only products whose name, brand, or fragrance notes contain "oud" are shown. Clear the field and verify all products reappear.

**Acceptance Scenarios**:

1. **Given** a shopper is on the product listing page, **When** they type a keyword, **Then** the product grid updates within 300 ms to show only products where the keyword appears in the product name, brand name, or fragrance notes (case-insensitive, partial match).
2. **Given** a search term is active, **When** the shopper clears the search bar, **Then** all products reappear without a page reload.
3. **Given** a search term returns no matches, **When** the grid would be empty, **Then** a "No products found" message is displayed with a prompt to clear filters.
4. **Given** a search term is typed, **When** the URL updates, **Then** the `q` query parameter reflects the current search term so the URL is shareable.

---

### User Story 2 - Category, Gender & Fragrance Note Filters (Priority: P2)

A shopper wants to narrow the catalog by product type (Eau de Parfum, Eau de Toilette, Parfum), target gender (Men, Women, Unisex), and/or fragrance family (Floral, Woody, Oriental, Fresh, Citrus). Each filter group shows checkboxes; selecting multiple options within the same group returns products matching any of those options. Selecting across groups returns only products matching all active groups simultaneously.

**Why this priority**: These filters are the second most common discovery path — shoppers who do not have a specific product in mind use category/gender/note filters to browse by preference.

**Independent Test**: Check "Eau de Parfum" and "Women" — verify only women's EDP products are shown. Additionally check "Floral" — verify results narrow to floral women's EDPs.

**Acceptance Scenarios**:

1. **Given** no filters are active, **When** a shopper selects one category (e.g., Eau de Parfum), **Then** only products of that category are shown.
2. **Given** multiple categories are selected (e.g., EDP + Parfum), **When** the grid updates, **Then** products matching either category are shown (OR within group).
3. **Given** filters from two groups are active (e.g., category = EDP, gender = Women), **When** the grid updates, **Then** only products satisfying both conditions are shown (AND across groups).
4. **Given** one or more fragrance notes are selected, **When** the grid updates, **Then** products that include any of the selected notes are shown.
5. **Given** filter selections are active, **When** the URL is copied and opened in a new tab, **Then** the same filters are applied and the same products are shown.

---

### User Story 3 - Price Range Filter (Priority: P3)

A shopper can set a minimum and maximum price using a dual-handle range slider. The product grid immediately updates to show only products priced within the selected range. The slider's boundaries are determined by the cheapest and most expensive products in the catalog. Prices are displayed in PKR.

**Why this priority**: Price is a key decision factor for luxury goods. A range slider provides intuitive budget control and completes the full filtering experience.

**Independent Test**: Drag the price slider max handle to halfway — verify products above that price are excluded. Reset to full range — verify all products return.

**Acceptance Scenarios**:

1. **Given** a shopper opens the price filter, **When** the slider renders, **Then** the minimum and maximum boundaries match the lowest and highest prices in the catalog.
2. **Given** a price range is set, **When** the grid updates, **Then** only products priced within the selected range (inclusive) are shown.
3. **Given** a price range is selected, **When** the URL is updated, **Then** `minPrice` and `maxPrice` query parameters reflect the selected values.
4. **Given** a price range is active, **When** the shopper resets it to the full catalog range, **Then** all previously excluded products reappear.

---

### User Story 4 - Active Filter Chips & Clear All (Priority: P4)

All active filters (search text, categories, genders, notes, price range if narrowed from default) are displayed as individual removable chips. Each chip shows the filter label and an × button to remove just that filter. A "Clear All" button resets every active filter at once. A result count ("X products found") is always visible.

**Why this priority**: Filter management is essential UX — shoppers must see and undo individual filter selections without losing other active filters. Delivered last because it wraps around all other filter stories.

**Independent Test**: Apply a search term and two checkbox filters. Verify chips appear for each. Click × on one chip and verify only that filter is removed. Click "Clear All" and verify all products return.

**Acceptance Scenarios**:

1. **Given** any filter is active, **When** the page renders, **Then** a chip appears for each active filter showing its label.
2. **Given** a chip is displayed, **When** the shopper clicks its × button, **Then** only that filter is removed and the grid updates; all other filters remain.
3. **Given** multiple filters are active, **When** the shopper clicks "Clear All", **Then** all filters reset, all products show, and all chips disappear.
4. **Given** any filter state, **When** the product grid renders, **Then** a result count in the format "X products found" is displayed above the grid.
5. **Given** no filters are active, **When** the result count renders, **Then** it shows the full catalog count.

---

### Edge Cases

- **No results**: When combined filters produce zero matches, show "No products found" with a "Clear all filters" link — never show a silent empty grid.
- **Invalid URL parameters**: When the page loads with unrecognised filter values in the URL, those values are silently ignored and valid ones are applied.
- **Single product catalog**: If the catalog contains only one product, the price slider renders as disabled (min = max).
- **Long search term**: Search input accepts up to 100 characters; longer pastes are trimmed to 100.
- **Special characters in search**: Non-alphanumeric characters are treated as literal text and do not cause errors.
- **Mobile filter panel**: On small screens the filter panel is hidden by default; chips and result count remain visible at all times.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a text search bar on the product listing page that filters products in real-time as the user types, without requiring a button press or page reload.
- **FR-002**: Search MUST match against product name, brand name, and fragrance notes using case-insensitive partial matching.
- **FR-003**: System MUST provide checkbox filters for Category (Eau de Parfum, Eau de Toilette, Parfum), Gender (Men, Women, Unisex), and Fragrance Notes (Floral, Woody, Oriental, Fresh, Citrus).
- **FR-004**: Within a single filter group, selected options MUST use OR logic (product matches any checked option in that group).
- **FR-005**: Across multiple filter groups, active groups MUST use AND logic (product must satisfy all active groups simultaneously).
- **FR-006**: System MUST provide a dual-handle price range slider whose minimum and maximum bounds are derived from the actual catalog price range.
- **FR-007**: All active filters MUST be reflected in the page URL as query parameters (`q`, `category`, `gender`, `notes`, `minPrice`, `maxPrice`).
- **FR-008**: On page load with filter query parameters present, the system MUST restore and apply the filter state before first render.
- **FR-009**: System MUST display each active filter as a removable chip; clicking the chip's × button removes only that filter.
- **FR-010**: System MUST provide a "Clear All" button that removes every active filter simultaneously.
- **FR-011**: System MUST display a result count in the format "X products found" at all times, updating as filters change.
- **FR-012**: When no products match active filters, system MUST display a "No products found" empty state with a "Clear all filters" link.
- **FR-013**: All filtering MUST be performed client-side using existing product data; no additional network requests are made during filtering.
- **FR-014**: On mobile viewports (below 1024 px), filter controls MUST be hidden behind a "Show Filters" toggle; chips and result count MUST always be visible.
- **FR-015**: Price values in the filter UI MUST use PKR formatting, consistent with the rest of the site.

### Key Entities

- **FilterState**: The complete set of active filters at any point — search query string, selected category values, selected gender values, selected fragrance note values, min price, max price.
- **FilterChip**: A visual token representing one active filter dimension, carrying a human-readable label and a dismiss action.
- **FilteredProductSet**: The subset of the full product catalog that satisfies all active filter conditions simultaneously.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Product grid updates are visible within 300 ms of any filter change (search keystroke, checkbox toggle, slider handle release).
- **SC-002**: A filtered URL opened in a new browser tab produces an identical product grid to the original filtered view, 100% of the time.
- **SC-003**: The "No products found" empty state appears for every combination of filters that yields zero results — no silent empty grid.
- **SC-004**: A shopper can remove any single active filter without affecting any other active filter, 100% of the time.
- **SC-005**: All 15 functional requirements pass their acceptance scenarios on both desktop (≥ 1024 px) and mobile (≤ 768 px) viewports.
- **SC-006**: Correct filtered results are returned for all combinations of the five filter dimensions (search, category, gender, notes, price).

## Assumptions

- **Search scope**: Search matches product name, brand, and fragrance notes only — not description or other metadata.
- **Multi-note logic**: A product tagged with ["Floral", "Woody"] matches if either "Floral" OR "Woody" is selected (OR within the notes group).
- **Filter persistence**: Filter state is URL-only; it is not stored in localStorage or cookies. Closing the tab without bookmarking the URL discards the state.
- **Price currency**: All price comparisons and displays use PKR, matching the existing site.
- **Price slider granularity**: The slider snaps to the nearest whole PKR value.
- **Sort order**: Filtered results maintain the default sort order of the existing product listing; no new sort controls are added.
- **Product data completeness**: All products already have `category`, `gender`, and `notes` fields in the catalog data used by the product listing page.
- **Filter layout**: Desktop (≥ 1024 px) shows a persistent left sidebar; mobile (< 1024 px) shows a slide-in drawer opened by a "Show Filters" button.

## Out of Scope

- Server-side search or any external search engine integration
- Saving or persisting filter presets across browser sessions
- Sort order controls (price asc/desc, newest first) — a separate feature
- Changes to pagination or infinite scroll behaviour
- Product availability or stock-level filtering
- User authentication or personalised search history
