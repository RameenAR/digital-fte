# Tasks: Search & Filter (005-search-filter)

**Input**: Design documents from `/specs/005-search-filter/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅

**Context**: This is an **extension** of the existing 002-product-listing filter infrastructure. Substantial code already exists (`useProductFilters` hook, `FilterPanel`, `SearchBar`, `ProductGrid`). The work adds concentration + gender filter dimensions, upgrades the price UI to a dual-handle slider, and adds an active filter chips row. US1 (text search) is already fully implemented and is preserved by the foundational work.

**TDD**: Constitution Principle III — RED tests must FAIL before GREEN implementation begins.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Extend shared types and seed data before any story work begins.

- [x] T001 Extend `types/products.ts` — add `Concentration = 'edp' | 'edt' | 'parfum'` and `Gender = 'men' | 'women' | 'unisex'` union types; add `CONCENTRATION_LABELS` and `GENDER_LABELS` Record constants; add `concentration: Concentration` and `gender: Gender` to `Product` interface; add `concentrations: string[]` and `genders: string[]` to `FilterState` (both default `[]`)
- [x] T002 [P] Update `data/featured-products-seed.ts` — add `concentration` and `gender` to all 6 products per data-model.md: Midnight Rose → edp/women; Saffron Dusk → parfum/unisex; Coastal Breeze → edt/unisex; Cedar Solstice → edp/men; Velvet Oud → parfum/men; Garden at Dawn → edt/women
- [x] T003 [P] Update `makeProduct` fixture in `tests/unit/product-filters.test.ts` to include `concentration: 'edp'` and `gender: 'unisex'` defaults; update all 6 entries in the `PRODUCTS` array with their correct concentration + gender values; add `describe('filterByConcentration')` block (6 test cases) and `describe('filterByGender')` block (6 test cases) calling unimplemented functions — confirm tests FAIL with `npx vitest run tests/unit/product-filters.test.ts`

**Note**: T002 and T003 can run in parallel (different files). Both depend on T001.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the two new pure filter functions and extend the hook with new setters, URL params, and catalog bounds. All user story phases depend on this.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Implement `filterByConcentration(products: Product[], concentrations: string[]): Product[]` and `filterByGender(products: Product[], genders: string[]): Product[]` in `hooks/useProductFilters.ts` (OR logic, empty array = no filter — mirrors `filterByFamily`); update `parseSearchParams` to read `concentration` CSV param into `concentrations[]` and `gender` CSV param into `genders[]`; update `serializeToParams` to write them; add `setConcentrations` and `setGenders` setters; add `catalogMin` and `catalogMax` (derived with `useMemo` from `allProducts`); integrate both new functions into the filter pipeline after `filterByFamily`; confirm all tests GREEN with `npx vitest run tests/unit/product-filters.test.ts`

**Checkpoint**: Foundation ready — filter pipeline extended, URL params updated, 22 existing + 12 new unit tests all GREEN. US1 (text search) verified passing. User story implementation can now begin.

---

## Phase 3: User Story 2 — Concentration, Gender & Fragrance Note Filters (Priority: P2)

**Goal**: Shoppers can filter by product type (EDP/EDT/Parfum) and gender (Men/Women/Unisex) using checkboxes. The existing Scent Family checkboxes (fragrance notes) continue to work unchanged. Filters use OR within group and AND across groups.

**Independent Test**: Check "Eau de Parfum" → verify only Midnight Rose + Cedar Solstice shown. Also check "Women" → verify only Midnight Rose shown (EDP AND Women). URL shows `?concentration=edp&gender=women`.

- [x] T005 [P] [US2] Update `components/products/FilterPanel.tsx` — add `concentrations: string[]`, `genders: string[]`, `catalogMin: number`, `catalogMax: number`, `onConcentrationChange: (v: string[]) => void`, `onGenderChange: (v: string[]) => void`, `onPriceChange: (min: number | null, max: number | null) => void` to `FilterPanelProps`; add Concentration fieldset (checkboxes for 'edp'/'edt'/'parfum' with `CONCENTRATION_LABELS` display names) and Gender fieldset (checkboxes for 'men'/'women'/'unisex' with `GENDER_LABELS`) above the existing Scent Family fieldset; wire `toggleConcentration` and `toggleGender` handlers using the same pattern as `toggleFamily`
- [x] T006 [US2] Update `components/products/ProductListingClient.tsx` — destructure `concentrations`, `genders`, `setConcentrations`, `setGenders`, `catalogMin`, `catalogMax` from `useProductFilters`; pass them to `FilterPanel`; update `hasActiveFilters` to also check `filterState.concentrations.length > 0 || filterState.genders.length > 0`; update the mobile filter badge count to include concentrations + genders counts

**Checkpoint**: Concentration and Gender checkboxes visible in filter panel, functional, and URL-synced. All 3 filter groups (concentration, gender, scent family) use correct AND/OR logic.

---

## Phase 4: User Story 3 — Price Range Filter (Priority: P3)

**Goal**: The price text inputs are replaced with a dual-handle range slider bounded by the catalog min/max. Dragging handles updates the product grid in real-time. PKR values shown below handles.

**Independent Test**: Drag max handle to halfway (≈ PKR 5,150) → verify Velvet Oud (6,800) is excluded. Drag min handle to 4,000 → verify Garden at Dawn (3,500) + Coastal Breeze (3,800) are excluded. URL shows `?minPrice=4000&maxPrice=5150`.

- [x] T007 [P] [US3] Create `components/products/PriceRangeSlider.tsx` — `'use client'`; props: `min: number`, `max: number`, `value: [number, number]`, `onChange: (value: [number, number]) => void`, `disabled?: boolean`; render two overlapping `<input type="range">` elements stacked with `position: relative`; set `aria-label="Minimum price"` / `"Maximum price"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`; apply CSS `--min-pct` and `--max-pct` inline custom properties for track fill; call `onChange` on `onPointerUp`/`onTouchEnd` only (not on every drag tick) to avoid URL spam; display PKR-formatted current min and max below the slider using `toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })`; render non-interactive display when `disabled`
- [x] T008 [US3] Update `components/products/FilterPanel.tsx` — replace the min/max `<input type="number">` price fieldset with `<PriceRangeSlider>`; pass `min={catalogMin}` `max={catalogMax}` `value={[minPrice ?? catalogMin, maxPrice ?? catalogMax]}` `onChange={([min, max]) => onPriceChange(min === catalogMin ? null : min, max === catalogMax ? null : max)}`; keep the `fieldset` + `legend` wrapper with "Price Range (PKR)" label

**Checkpoint**: Price range slider renders with catalog bounds, dragging updates the grid, URL params `minPrice`/`maxPrice` update on handle release.

---

## Phase 5: User Story 4 — Active Filter Chips & Clear All (Priority: P4)

**Goal**: All active filters shown as removable chips between the controls bar and the product grid. Each chip's × button removes only that filter. "Clear All" button removes all. Result count always visible.

**Independent Test**: Activate search "rose" + concentration "edp" + gender "women" → verify 3 chips appear. Click × on "Women" chip → verify only gender removed, other two chips remain. Click "Clear All" → verify all 6 products shown, no chips.

- [x] T009 [P] [US4] Create `components/products/FilterChips.tsx` — `'use client'`; props: `filterState: FilterState`, `catalogMin: number`, `catalogMax: number`, `onRemoveQuery: () => void`, `onRemoveFamily: (f: string) => void`, `onRemoveConcentration: (c: string) => void`, `onRemoveGender: (g: string) => void`, `onRemovePrice: () => void`, `onClearAll: () => void`; derive chip list: one chip for `query` ("Search: "…""), one per `families[i]` (capitalised label), one per `concentrations[i]` (`CONCENTRATION_LABELS[v]`), one per `genders[i]` (`GENDER_LABELS[v]`), one for price if `minPrice !== null || maxPrice !== null` ("PKR X – Y"); each chip renders as `<span>` with label + `<button aria-label="Remove {label} filter">×</button>`; render a "Clear All" `<button>` when any chip is present; return `null` when no chips
- [x] T010 [US4] Update `components/products/ProductListingClient.tsx` — import and render `<FilterChips>` between the top controls `<div>` and the main `<div className="flex gap-8">` layout; pass `filterState`, `catalogMin`, `catalogMax`; wire `onRemoveQuery={() => setQuery('')}`, `onRemoveFamily` via `setFamilies(prev.filter(...))`, `onRemoveConcentration` via `setConcentrations(prev.filter(...))`, `onRemoveGender` via `setGenders(prev.filter(...))`, `onRemovePrice={() => setPrice(null, null)}`, `onClearAll={clearFilters}`; ensure `FilterChips` only renders when `filterState.query || filterState.families.length || filterState.concentrations.length || filterState.genders.length || filterState.minPrice !== null || filterState.maxPrice !== null`

**Checkpoint**: All filter chips render correctly, each × button removes only its filter, "Clear All" resets everything. Result count updates as filters change. US4 fully functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: E2E coverage of all filter dimensions and final test suite validation.

- [x] T011 [P] Create `tests/e2e/search-filter.spec.ts` — implement 10 Playwright test scenarios from `specs/005-search-filter/quickstart.md`: (1) text search real-time update + chip; (2) concentration filter single + multi; (3) gender filter single + multi; (4) cross-group AND logic (concentration + gender); (5) price slider drag; (6) individual chip removal; (7) Clear All; (8) URL state restore on direct navigation; (9) no-results empty state with clear-filters link; (10) mobile filter toggle
- [x] T012 Run full test suite — `npx vitest run` to confirm all unit tests pass (22 existing + 12 new = 34 total); verify TypeScript compiles with no errors (`npx tsc --noEmit`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately — T001 first, then T002 + T003 in parallel
- **Foundational (Phase 2)**: T004 after T003 (RED → GREEN) — BLOCKS all user stories
- **US2 (Phase 3)**: T005 + T007 + T009 can ALL start in parallel after T004 (different files!)
- **US3 (Phase 4)**: T007 (new file) can start in parallel with T005. T008 after T005 + T007.
- **US4 (Phase 5)**: T009 (new file) in parallel with T005 + T007. T010 after T006 + T008 + T009.
- **Polish (Phase 6)**: T011 in parallel with T012 (if T010 complete); T012 last

### File-level Dependency Map

```
T001 (types/products.ts)
  ├── T002 (seed data)
  └── T003 (test fixture + RED)
        └── T004 (filter functions + hook GREEN)
              ├── T005 (FilterPanel - concentration + gender)   [P with T007, T009]
              │     ├── T006 (ProductListingClient - props)
              │     └── T008 (FilterPanel - price slider)       ← after T005 + T007
              ├── T007 (PriceRangeSlider.tsx — new file)        [P with T005, T009]
              └── T009 (FilterChips.tsx — new file)             [P with T005, T007]
                    └── T010 (ProductListingClient - FilterChips)  ← after T006 + T008 + T009
                          └── T011 (E2E tests)
                                └── T012 (full test run)
```

### Parallel Opportunities (fastest execution path)

```bash
# After T001:
T002 (seed data) + T003 (RED tests) — run in parallel

# After T004 (GREEN):
T005 (FilterPanel) + T007 (PriceRangeSlider) + T009 (FilterChips) — run in parallel

# After T005 + T007:
T006 (ProductListingClient US2) + T008 (FilterPanel slider) — run in parallel

# After T006 + T008 + T009:
T010 (ProductListingClient US4) → T011 → T012
```

---

## Implementation Strategy

### MVP First (US2 — Concentration + Gender Filters)

1. Complete Phase 1: T001 → T002 + T003
2. Complete Phase 2: T004 (GREEN)
3. Complete Phase 3: T005 → T006
4. **STOP AND VALIDATE**: Visit `/products`, check "Eau de Parfum", verify grid filters by concentration. URL shows `?concentration=edp`.
5. US2 delivers the most visible new filter capability.

### Incremental Delivery

1. T001-T004 → Extended hook ready, all existing tests still GREEN
2. T005-T006 → Concentration + Gender filters functional (US2)
3. T007-T008 → Price slider upgrade (US3)
4. T009-T010 → Filter chips + Clear All (US4)
5. T011-T012 → E2E coverage + final validation

---

## Notes

- All modifications to existing files are additive — existing tests must remain GREEN throughout
- `FilterPanel.tsx` is modified in T005 AND T008 — complete T005 before starting T008
- `ProductListingClient.tsx` is modified in T006 AND T010 — complete T006 before starting T010
- `useProductFilters.ts` exports all pure functions — `filterByConcentration` + `filterByGender` follow the same export pattern as `filterByFamily` for unit testability
- `PriceRangeSlider` is a stateless, controlled component — no internal state for price values; state lives in `useProductFilters`
- `FilterChips` returns `null` when no filters active — no empty DOM nodes
