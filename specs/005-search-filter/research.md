# Research: 005-Search & Filter

**Date**: 2026-03-07
**Branch**: `005-search-filter`

---

## Discovery: Existing Infrastructure

A thorough audit of the 002-product-listing implementation reveals substantial filter infrastructure already in place. This feature is an **extension**, not a greenfield build.

### What already exists

| Component / File | What it does |
|---|---|
| `hooks/useProductFilters.ts` | URL sync via `useSearchParams` + `router.push`, debounced search, `filterByFamily`, `filterByPrice`, `filterBySearch`, `sortProducts`, `paginate` — all exported as pure functions |
| `components/products/FilterPanel.tsx` | Scent-family checkboxes (Floral/Woody/Oriental/Fresh/Gourmand/Green/Musky) + min/max price text inputs |
| `components/products/SearchBar.tsx` | Controlled input, 300 ms debounce delegated to hook, clear button |
| `components/products/ProductListingClient.tsx` | Full layout: search bar + mobile filter toggle + sort dropdown + filter sidebar + result count + pagination |
| `types/products.ts` | `FilterState { families, minPrice, maxPrice, query, sort, page }` |
| `data/featured-products-seed.ts` | 6 products with `scentTags`, `scentNotes`, `category` (scent family), **no `concentration` or `gender` fields** |
| `tests/unit/product-filters.test.ts` | 22 passing tests covering all existing pure functions |

### What is missing (gaps to fill)

1. **Concentration filter** (Eau de Parfum / Eau de Toilette / Parfum) — product type dimension, not present in any field
2. **Gender filter** (Men / Women / Unisex) — not a field in `Product` type or seed data
3. **Dual-handle price range slider** — existing UI uses two text inputs (apply on blur)
4. **Active filter chips row** — no chip component exists
5. **Concentration & gender in URL serialization** — `parseSearchParams`/`serializeToParams` only handle `family`, `minPrice`, `maxPrice`, `q`, `sort`, `page`

---

## Decision 1: Naming — `category` vs `concentration`

**Problem**: The existing `Product.category` field contains scent family values ("Floral", "Oriental", "Fresh", "Woody"). The spec wants a separate filter for product type (EDP / EDT / Parfum), which is commonly called "concentration".

**Decision**: Add a new `concentration: 'edp' | 'edt' | 'parfum'` field to `Product`. Do NOT rename or repurpose the existing `category` field — tests and existing code reference it.

**Rationale**: Smallest viable change; zero risk of breaking existing filter tests. The existing `families` filter (which uses `scentTags`) maps directly to the spec's "fragrance notes" filter.

**Alternatives considered**:
- Repurpose `category` → breaks 22 existing tests and all seed data
- Use a separate `productType` field → equivalent but less industry-standard; "concentration" is the perfumery term

---

## Decision 2: FilterState extension — `concentrations` and `genders`

**Decision**: Extend `FilterState` in `types/products.ts` with two new fields:
```ts
concentrations: string[]   // [] = no filter, ['edp', 'edt', ...] = filter active
genders: string[]           // [] = no filter, ['men', 'women', 'unisex'] = filter active
```

Both default to `[]`. Both use OR logic within group, AND logic across groups (matching existing `families` pattern).

**Rationale**: Mirrors the established `families: string[]` pattern. Backward-compatible: existing code that doesn't touch these fields continues to work because `[]` means "no filter".

**URL params**: `concentration` (CSV) and `gender` (CSV) — mirrors `family` param pattern already in place.

---

## Decision 3: Price range slider — custom dual-input vs library

**Decision**: Custom implementation using two overlapping `<input type="range">` elements.

**Rationale**:
- No new package dependency (constitution Principle VI: smallest viable change)
- Native `<input type="range">` is supported in all modern browsers, including mobile
- Dual-handle pattern with two overlapping inputs is well-understood and WCAG 2.1 AA accessible with correct `aria-label` and `aria-valuemin`/`aria-valuemax`
- Track fill implemented via CSS custom property (`--min-pct`, `--max-pct`) set by inline style, updating as handles move
- Fits the existing Tailwind styling approach

**Alternatives considered**:
- `@radix-ui/react-slider` — adds ~8 KB gzip; no Radix UI used elsewhere in project; overkill for a single slider
- `rc-slider` — older API, adds bundle size
- Separate min/max text inputs (existing) — kept as fallback within the same component; removed in favour of slider per spec

---

## Decision 4: Filter chips — where and how

**Decision**: New `FilterChips.tsx` component rendered inside `ProductListingClient` between the top controls row and the main flex layout (sidebar + grid). It reads all active filter dimensions and renders one chip per active value (not per group).

**Chip layout**: Each chip = `[label] ×` button. Clicking × calls the appropriate setter in `useProductFilters` to remove just that value. A "Clear All" button appears when any filter (including search) is active.

**Rationale**: Placing chips between the controls bar and the content area matches standard e-commerce UX patterns (used by Zalando, ASOS, SSENSE). It is always visible without scrolling and works on both desktop and mobile.

**Chip sources**:
- `query` → one chip: `Search: "{value}"`
- `families[]` → one chip per family: `"Floral"`, `"Woody"`, etc.
- `concentrations[]` → one chip per value: `"Eau de Parfum"`, etc. (display label from a constant map)
- `genders[]` → one chip per value: `"Men"`, `"Women"`, `"Unisex"`
- `minPrice` or `maxPrice` narrowed from catalog bounds → one chip: `"PKR X – Y"` covering both handles together

---

## Decision 5: Integration point — what changes in `ProductListingClient`

**Decision**: `ProductListingClient` (the `ProductListingInner` function) receives new setters from the expanded `useProductFilters` return:
- `setConcentrations(concentrations: string[])`
- `setGenders(genders: string[])`
- `removeFilter(type, value)` — convenience setter for chip × buttons

`FilterPanel` receives the new filter props. `FilterChips` is rendered as a new section. No other components change.

**Rationale**: All state lives in `useProductFilters` (URL-synced). Components stay stateless with respect to filter logic. This matches the existing architecture exactly.

---

## Decision 6: Seed data — adding `concentration` and `gender`

**Decision**: Add realistic `concentration` and `gender` values to all 6 existing seed products. Distribution:
- Concentrations: 2 Parfum, 2 EDP, 2 EDT (varied; luxury-appropriate)
- Genders: 2 Women, 2 Men, 2 Unisex (balanced)

Product assignments (to be confirmed in data-model.md):
| Product | Concentration | Gender |
|---|---|---|
| Midnight Rose | EDP | Women |
| Saffron Dusk | Parfum | Unisex |
| Coastal Breeze | EDT | Unisex |
| Cedar Solstice | EDP | Men |
| Velvet Oud | Parfum | Men |
| Garden at Dawn | EDT | Women |

**Rationale**: Balanced distribution ensures all filter values return at least one result, which is essential for testing and UX.
