# Data Model: Product Listing Page

**Feature**: 002-product-listing | **Date**: 2026-03-07

---

## Entities

### 1. Product (extends FeaturedProduct)

Extends the `FeaturedProduct` type from `types/homepage.ts` with listing-specific fields.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | string (uuid) | PK, required | Inherited |
| name | string | required, max 100 chars | Inherited |
| price | number | required, > 0 (PKR) | Inherited |
| imageUrl | string | required, valid URL | Inherited |
| slug | string | required, unique | Inherited — used in `/products/[slug]` |
| scentNotes | ScentNotes | required | Inherited (top/heart/base arrays) |
| scentTags | string[] | required | Inherited — used for filter matching |
| displayOrder | integer | required, ≥ 1 | Inherited — used for Bestselling sort |
| isActive | boolean | default: true | Inherited — only active shown |
| category | string | required | Scent family display label (e.g., "Floral") |
| createdAt | Date | required | Used for "Newest First" sort |

**`category`** is derived from the dominant `scentTags` entry:
- `floral` → "Floral"
- `woody` / `oriental` → "Woody" / "Oriental"
- `fresh` / `citrus` / `green` → "Fresh"
- `gourmand` / `musky` → "Gourmand" / "Musky"

---

### 2. FilterState

Transient UI state — not persisted to DB. Lives in URL query params and React state.

| Field | Type | Default | URL Param |
|-------|------|---------|-----------|
| families | string[] | [] | `?family=floral,woody` |
| minPrice | number \| null | null | `?minPrice=3000` |
| maxPrice | number \| null | null | `?maxPrice=6000` |
| query | string | '' | `?q=rose` |
| sort | SortOption | 'bestselling' | `?sort=price_asc` |
| page | number | 1 | `?page=2` |

**Validation**: `minPrice` must be ≥ 0. `maxPrice` must be > `minPrice` if both set.
Negative or non-numeric URL params are silently ignored (reset to default).

---

### 3. SortOption

```typescript
type SortOption = 'bestselling' | 'price_asc' | 'price_desc' | 'newest'
```

| Value | Label | Sort Key |
|-------|-------|----------|
| `bestselling` | Bestselling | `displayOrder` ASC |
| `price_asc` | Price: Low to High | `price` ASC |
| `price_desc` | Price: High to Low | `price` DESC |
| `newest` | Newest First | `createdAt` DESC |

---

### 4. PaginatedResult

Output of the filter + paginate pipeline. Computed in `useProductFilters`.

| Field | Type | Notes |
|-------|------|-------|
| products | Product[] | Slice of filtered+sorted array for current page |
| total | number | Total count of filtered products (before pagination) |
| page | number | Current 1-indexed page |
| totalPages | number | `Math.ceil(total / PAGE_SIZE)` where PAGE_SIZE = 12 |

---

## Filter Pipeline

```
allProducts[]  (fetched once server-side, passed as prop)
    │
    ▼
filterByFamily()   → families.length === 0 ? all : products where scentTags ∩ families ≠ ∅
    │
    ▼
filterByPrice()    → minPrice/maxPrice applied if set
    │
    ▼
filterBySearch()   → query matched against name + scentNotes (case-insensitive substring)
    │
    ▼
sortProducts()     → apply SortOption comparator
    │
    ▼
paginate()         → slice(offset, offset + PAGE_SIZE), return PaginatedResult
```

All steps are pure functions — no side effects, fully unit-testable.

---

## Type Definitions (additions to `types/products.ts`)

```typescript
import type { FeaturedProduct } from './homepage'

export interface Product extends FeaturedProduct {
  category: string
  createdAt: Date
}

export type SortOption = 'bestselling' | 'price_asc' | 'price_desc' | 'newest'

export interface FilterState {
  families: string[]
  minPrice: number | null
  maxPrice: number | null
  query: string
  sort: SortOption
  page: number
}

export interface PaginatedResult {
  products: Product[]
  total: number
  page: number
  totalPages: number
}
```
