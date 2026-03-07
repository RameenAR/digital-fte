# Implementation Plan: Search & Filter

**Branch**: `005-search-filter` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-search-filter/spec.md`

## Summary

Extend the existing 002-product-listing filter infrastructure to add concentration (EDP/EDT/Parfum) and gender (Men/Women/Unisex) filter dimensions, replace the price text inputs with a dual-handle range slider, and add an active filter chips row. All filtering remains client-side with URL query-param state. This is an **extension** of existing code — 7 existing files are modified, 3 new components are created.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14 App Router · React 18 · Tailwind CSS 3 · Vitest · Playwright
**Storage**: N/A (client-side filtering of seed data)
**Testing**: Vitest (unit — pure filter functions) · Playwright (E2E)
**Target Platform**: Web — desktop (≥ 1024 px) + mobile (< 1024 px)
**Performance Goals**: Filter grid update ≤ 300 ms after any user interaction
**Constraints**: No new npm dependencies · No backend calls during filtering · URL must be shareable
**Scale/Scope**: 6 seed products; architecture scales to hundreds client-side

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. User-First, Luxury Experience | ✅ PASS | Chips row + slider improve UX; mobile toggle preserved |
| II. Component-Driven Development | ✅ PASS | `FilterChips`, `PriceRangeSlider` are isolated, stateless components |
| III. Test-First (NON-NEGOTIABLE) | ✅ PASS | `filterByConcentration` and `filterByGender` written RED before GREEN |
| IV. Secure by Default | ✅ PASS | No user input reaches server; URL params parsed with validation |
| V. Performance Budget | ✅ PASS | No new JS dependencies; custom slider = ~50 lines |
| VI. Simplicity & Smallest Viable Change | ✅ PASS | 7 modified files, 3 new files; no speculative features |

## Project Structure

### Documentation (this feature)

```text
specs/005-search-filter/
├── plan.md              ← this file
├── research.md          ← architectural decisions
├── data-model.md        ← types + seed data + filter logic
├── contracts/
│   └── filter-state.md  ← TypeScript interfaces + component prop contracts
├── quickstart.md        ← 10 E2E integration scenarios
└── tasks.md             ← /sp.tasks output (not yet created)
```

### Source Code Changes

```text
MODIFIED (7 files):
types/
└── products.ts              ← add Concentration, Gender types + LABELS; extend Product + FilterState

data/
└── featured-products-seed.ts ← add concentration + gender to all 6 products

hooks/
└── useProductFilters.ts      ← add filterByConcentration, filterByGender; update URL parse/serialize;
                                 add setConcentrations, setGenders, catalogMin, catalogMax to hook return

components/products/
├── FilterPanel.tsx           ← add Concentration + Gender fieldsets; replace price inputs with PriceRangeSlider
└── ProductListingClient.tsx  ← add FilterChips render; pass new setters + catalogMin/Max to FilterPanel

tests/unit/
└── product-filters.test.ts   ← add tests for filterByConcentration + filterByGender

tests/e2e/
└── search-filter.spec.ts     ← new E2E covering 10 quickstart scenarios (some already from 002)

NEW (3 files):
components/products/
├── FilterChips.tsx           ← active filter chips row + Clear All button
└── PriceRangeSlider.tsx      ← dual-handle range slider (no dependencies)

tests/e2e/
└── search-filter.spec.ts     ← new E2E test file (replaces/extends existing product-listing E2E)
```

## Key Architecture Decisions

### 1. Extend existing FilterState — not replace
`types/products.ts` gains `concentrations: string[]` and `genders: string[]`, both defaulting to `[]`. Existing `families` filter is unchanged. All existing tests continue to pass without modification.

### 2. Concentration field name: `concentration: 'edp' | 'edt' | 'parfum'`
New field on `Product`. Existing `category` field (scent family string) is NOT renamed or repurposed — leaving it avoids breaking 22 existing unit tests.

### 3. Filter pipeline order (updated)
```
filterBySearch → filterByPrice → filterByFamily → filterByConcentration → filterByGender → sortProducts → paginate
```

### 4. Price slider — custom, no dependencies
Two overlapping `<input type="range">` with CSS `--min-pct`/`--max-pct` custom properties for track fill. `catalogMin` and `catalogMax` are derived inside `useProductFilters` from `allProducts` and passed through to the slider. Slider calls `onPriceChange` only on `pointerup`/`touchend` to avoid URL spam on drag.

### 5. URL parameter names
| New param | FilterState field | Format |
|---|---|---|
| `concentration` | `concentrations` | CSV: `edp,parfum` |
| `gender` | `genders` | CSV: `women,unisex` |

Invalid values are silently dropped by `parseSearchParams` (matches existing pattern for `family`).

### 6. FilterChips renders `null` when no filters active
No empty `<div>` in the DOM. Each chip has `aria-label="Remove {label} filter"`. "Clear All" button only visible when ≥ 1 filter is active.

### 7. Mobile filter panel — preserved, extended
The existing `filterPanelOpen` toggle in `ProductListingClient` already handles mobile. New filter groups (Concentration, Gender, Slider) are added inside `FilterPanel` — the toggle behaviour is unchanged.

### 8. Seed data distribution — balanced
6 products cover all filter values at least once, ensuring no filter returns zero results in isolation.

## Complexity Tracking

No constitution violations. All changes are smallest-viable extensions of existing patterns.

## Implementation Notes

- `useProductFilters.ts` exports all pure functions — new functions (`filterByConcentration`, `filterByGender`) follow the same export pattern for unit testability.
- `PriceRangeSlider.tsx` is a pure presentational component — it receives `[min, max]` value tuple and calls `onChange` — no internal state for the price values themselves (controlled by `useProductFilters`).
- `FilterChips.tsx` computes chip list from `filterState` props — no internal state.
- `catalogMin` / `catalogMax` are computed once with `useMemo` inside `useProductFilters` and flow down as props.
