---
id: 004
title: search-filter-implement
stage: green
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 005-search-filter
branch: 005-search-filter
user: hp
command: /sp.implement
labels: [search, filter, concentration, gender, price-slider, filter-chips, tdd, url-state, green]
links:
  spec: specs/005-search-filter/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - types/products.ts
  - data/featured-products-seed.ts
  - hooks/useProductFilters.ts
  - components/products/FilterPanel.tsx
  - components/products/FilterChips.tsx
  - components/products/PriceRangeSlider.tsx
  - components/products/ProductListingClient.tsx
  - tests/unit/product-filters.test.ts
  - tests/e2e/search-filter.spec.ts
  - specs/005-search-filter/tasks.md
tests:
  - tests/unit/product-filters.test.ts (35/35 GREEN)
  - tests/unit/newsletter.test.ts (8/8)
  - tests/unit/order-number.test.ts (5/5)
  - tests/unit/related-products.test.ts (7/7)
  - tests/unit/checkout-validation.test.ts (16/16)
  - tests/unit/cart.test.ts (10/10)
  - tests/unit/quiz-engine.test.ts (4/4)
  - All 85/85 unit tests passing
---

## Prompt

implement karo

## Response snapshot

Implemented all 12 tasks for 005-search-filter. All 85/85 unit tests GREEN. Committed and pushed to origin/005-search-filter.

**T001**: Extended `types/products.ts` with `Concentration = 'edp' | 'edt' | 'parfum'`, `Gender = 'men' | 'women' | 'unisex'`, `CONCENTRATION_LABELS`, `GENDER_LABELS`; added `concentration` + `gender` to `Product`; added `concentrations: string[]` + `genders: string[]` to `FilterState`.

**T002**: Updated seed data — all 6 products now have `concentration` + `gender` (balanced: 2 EDP/EDT/Parfum, 2 Men/Women/Unisex).

**T003**: Updated `makeProduct` fixture + added 12 RED tests for `filterByConcentration` (6) + `filterByGender` (6) → confirmed FAIL.

**T004**: Implemented `filterByConcentration` + `filterByGender` in `useProductFilters.ts`; updated `parseSearchParams`/`serializeToParams` for `concentration` + `gender` CSV params; added `setConcentrations`, `setGenders`, `catalogMin`, `catalogMax` to hook → 35/35 GREEN.

**T005**: Rewrote `FilterPanel.tsx` — 3 new fieldsets (Category/Gender/Fragrance Notes); PriceRangeSlider integrated; existing Scent Family renamed to "Fragrance Notes" with Citrus added.

**T007**: Created `PriceRangeSlider.tsx` — dual-handle overlapping range inputs, CSS gradient track fill, PKR labels, `onPointerUp`/`onTouchEnd` commit pattern.

**T009**: Created `FilterChips.tsx` — chips for query/concentrations/genders/families/price; `null` when no active filters; CONCENTRATION_LABELS + GENDER_LABELS for display.

**T006 + T010**: Updated `ProductListingClient.tsx` — all new setters wired; `FilterChips` rendered between controls bar and main flex; `hasActiveFilters` + badge count updated.

**T011**: Created `tests/e2e/search-filter.spec.ts` — 10 scenarios (text search, concentration single/multi, gender single/multi, AND cross-group, price URL, chip removal, clear all, URL restore, no results, result count).

**T012**: `npx vitest run` → 85/85 GREEN across all 7 test files.

## Outcome

- ✅ Impact: Full search & filter feature — concentration/gender filters, price slider, active chips, URL state
- 🧪 Tests: 85/85 unit tests GREEN (35 product-filter tests incl. 12 new)
- 📁 Files: 7 modified + 3 new source files; tasks.md 12/12 complete
- 🔁 Next prompts: merge karo
- 🧠 Reflection: Extending existing infrastructure (not rebuilding) saved significant time. The T005+T007+T009 parallel execution was effective since all 3 are different files. PriceRangeSlider's `localValue` state pattern needed to keep slider responsive while committing to URL only on release.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): 85/85 GREEN
- Prompt variant (if applicable): sp.implement v1
- Next experiment: n/a
