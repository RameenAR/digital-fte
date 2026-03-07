# Contracts: 005-Search & Filter

**Date**: 2026-03-07
**Branch**: `005-search-filter`

This feature has no new API endpoints — all filtering is client-side. The contracts here specify TypeScript interfaces and component prop contracts.

---

## TypeScript Interfaces (types/products.ts additions)

```ts
// New union types
export type Concentration = 'edp' | 'edt' | 'parfum'
export type Gender = 'men' | 'women' | 'unisex'

// Human-readable label maps
export const CONCENTRATION_LABELS: Record<Concentration, string> = {
  edp: 'Eau de Parfum',
  edt: 'Eau de Toilette',
  parfum: 'Parfum',
}

export const GENDER_LABELS: Record<Gender, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
}

// Extended Product (new required fields)
export interface Product extends FeaturedProduct {
  category: string        // existing — scent family (unchanged)
  concentration: Concentration  // NEW
  gender: Gender               // NEW
  createdAt: Date
  description: string
}

// Extended FilterState (new optional filter arrays)
export interface FilterState {
  families: string[]        // existing
  concentrations: string[]  // NEW — default []
  genders: string[]         // NEW — default []
  minPrice: number | null
  maxPrice: number | null
  query: string
  sort: SortOption
  page: number
}
```

---

## Pure Filter Functions (hooks/useProductFilters.ts additions)

```ts
/**
 * Filter products by concentration using OR logic.
 * Empty array → returns all products.
 */
export function filterByConcentration(
  products: Product[],
  concentrations: string[]
): Product[]

/**
 * Filter products by gender using OR logic.
 * Empty array → returns all products.
 */
export function filterByGender(
  products: Product[],
  genders: string[]
): Product[]
```

### Behaviour contracts

| Input | Expected output |
|---|---|
| `filterByConcentration(products, [])` | All products returned unchanged |
| `filterByConcentration(products, ['edp'])` | Only products where `concentration === 'edp'` |
| `filterByConcentration(products, ['edp', 'parfum'])` | Products where concentration is 'edp' OR 'parfum' |
| `filterByGender(products, [])` | All products returned unchanged |
| `filterByGender(products, ['women'])` | Only products where `gender === 'women'` |
| `filterByGender(products, ['women', 'unisex'])` | Products where gender is 'women' OR 'unisex' |

---

## useProductFilters Hook — New Return Values

```ts
interface UseProductFiltersResult {
  // existing...
  filterState: FilterState
  result: PaginatedResult
  setFamilies: (families: string[]) => void
  setPrice: (min: number | null, max: number | null) => void
  setQuery: (query: string) => void
  setSort: (sort: SortOption) => void
  setPage: (page: number) => void
  clearFilters: () => void
  // NEW:
  setConcentrations: (concentrations: string[]) => void
  setGenders: (genders: string[]) => void
  catalogMin: number  // derived from allProducts — slider lower bound
  catalogMax: number  // derived from allProducts — slider upper bound
}
```

---

## Component Props

### FilterPanel

```ts
interface FilterPanelProps {
  // existing
  families: string[]
  minPrice: number | null
  maxPrice: number | null
  onFilterChange: (families: string[], minPrice: number | null, maxPrice: number | null) => void
  onClearFilters: () => void
  // NEW
  concentrations: string[]
  genders: string[]
  catalogMin: number
  catalogMax: number
  onConcentrationChange: (concentrations: string[]) => void
  onGenderChange: (genders: string[]) => void
  onPriceChange: (min: number | null, max: number | null) => void
}
```

### PriceRangeSlider (new component)

```ts
interface PriceRangeSliderProps {
  min: number            // catalog minimum (lower bound)
  max: number            // catalog maximum (upper bound)
  value: [number, number]  // [currentMin, currentMax]
  onChange: (value: [number, number]) => void
  disabled?: boolean     // true when min === max
}
```

Renders two overlapping `<input type="range">` elements with:
- `aria-label="Minimum price"` / `"Maximum price"`
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` for accessibility
- Track fill via CSS custom properties `--min-pct` and `--max-pct` (inline style)
- Labels showing formatted PKR values for current min/max

### FilterChips (new component)

```ts
interface FilterChipsProps {
  filterState: FilterState
  catalogMin: number
  catalogMax: number
  onRemoveQuery: () => void
  onRemoveFamily: (family: string) => void
  onRemoveConcentration: (concentration: string) => void
  onRemoveGender: (gender: string) => void
  onRemovePrice: () => void
  onClearAll: () => void
}
```

Renders `null` when no filters are active (no chips, no "Clear All").

---

## Filter Pipeline Order

```
allProducts
  → filterBySearch(query)
  → filterByPrice(minPrice, maxPrice)
  → filterByFamily(families)
  → filterByConcentration(concentrations)   ← NEW
  → filterByGender(genders)                 ← NEW
  → sortProducts(sort)
  → paginate(page)
  = PaginatedResult
```
