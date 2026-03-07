# Data Model: 005-Search & Filter

**Date**: 2026-03-07
**Branch**: `005-search-filter`

---

## Extended Product Type

### New fields added to `Product` (types/products.ts)

```ts
export type Concentration = 'edp' | 'edt' | 'parfum'
export type Gender = 'men' | 'women' | 'unisex'

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
```

`Product` interface gains:
```ts
concentration: Concentration
gender: Gender
```

Existing fields (`category`, `scentTags`, `scentNotes`, etc.) are unchanged.

---

## Extended FilterState

```ts
export interface FilterState {
  families: string[]        // existing — fragrance notes (OR logic)
  concentrations: string[]  // NEW — product type: edp | edt | parfum (OR logic)
  genders: string[]         // NEW — gender: men | women | unisex (OR logic)
  minPrice: number | null   // existing
  maxPrice: number | null   // existing
  query: string             // existing
  sort: SortOption          // existing
  page: number              // existing
}
```

Default state: `concentrations: []`, `genders: []` (no filter = show all).

---

## Filter Logic (AND across groups, OR within group)

```
filteredProducts =
  filterByConcentration(
    filterByGender(
      filterByFamily(
        filterByPrice(
          filterBySearch(allProducts, query),
          minPrice, maxPrice
        ),
        families
      ),
      genders
    ),
    concentrations
  )
```

Then: `sortProducts → paginate`

---

## URL Parameters

| FilterState field | URL param | Format | Example |
|---|---|---|---|
| `query` | `q` | string | `?q=rose` |
| `families` | `family` | CSV | `?family=floral,woody` |
| `concentrations` | `concentration` | CSV | `?concentration=edp,parfum` |
| `genders` | `gender` | CSV | `?gender=women,unisex` |
| `minPrice` | `minPrice` | number | `?minPrice=3000` |
| `maxPrice` | `maxPrice` | number | `?maxPrice=6000` |
| `sort` | `sort` | string | `?sort=price_asc` |
| `page` | `page` | number | `?page=2` |

Invalid or unrecognised values are silently ignored (fallback to default).

---

## Seed Data Update

Updated values for `data/featured-products-seed.ts`:

| Product | concentration | gender |
|---|---|---|
| Midnight Rose | `'edp'` | `'women'` |
| Saffron Dusk | `'parfum'` | `'unisex'` |
| Coastal Breeze | `'edt'` | `'unisex'` |
| Cedar Solstice | `'edp'` | `'men'` |
| Velvet Oud | `'parfum'` | `'men'` |
| Garden at Dawn | `'edt'` | `'women'` |

---

## Filter Chip Representation

Each active filter renders as one chip:

| Source | Chip label | Remove action |
|---|---|---|
| `query` | `Search: "rose"` | `setQuery('')` |
| `families[i]` | `"Floral"` (capitalised) | remove `families[i]` |
| `concentrations[i]` | `CONCENTRATION_LABELS[v]` | remove `concentrations[i]` |
| `genders[i]` | `GENDER_LABELS[v]` | remove `genders[i]` |
| price narrowed | `"PKR 3,000 – 6,000"` | reset both to catalog bounds |

"Clear All" chip/button resets `FilterState` to default (all `[]`, price to bounds, query `''`).

---

## Catalog Price Bounds

Derived at runtime from `allProducts`:
```ts
const catalogMin = Math.min(...allProducts.map(p => p.price))  // 3500
const catalogMax = Math.max(...allProducts.map(p => p.price))  // 6800
```

Slider is disabled (single handle or non-interactive) if `catalogMin === catalogMax`.
