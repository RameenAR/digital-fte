# Data Model: Product Detail Page

**Feature**: 003-product-detail | **Date**: 2026-03-07

---

## Entities

### 1. ProductWithDescription (extends Product)

Extends the `Product` type from `types/products.ts` with a long-form editorial
description field required for the product detail page.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | string (uuid) | PK, required | Inherited |
| name | string | required, max 100 chars | Inherited |
| price | number | required, > 0 (PKR) | Inherited |
| imageUrl | string | required, valid path | Inherited |
| slug | string | required, unique | Inherited — used in `/products/[slug]` |
| scentNotes | ScentNotes | required | Inherited (top/heart/base arrays) |
| scentTags | string[] | required | Inherited — used for related products |
| displayOrder | integer | required, ≥ 1 | Inherited |
| isActive | boolean | default: true | Inherited |
| category | string | required | Inherited (e.g., "Floral") |
| createdAt | Date | required | Inherited |
| description | string | required, 50–150 words | New in 003 — editorial fragrance description |

**Note**: `description` is added to the `Product` interface in `types/products.ts`
and to all 6 entries in `data/featured-products-seed.ts`. The `getAllProducts()`
and new `getProductBySlug()` functions return this extended type.

---

### 2. CartItem

Represents a single line item in the cart. Captures price at time of adding
(prevents stale price bugs if prices change during a session).

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| productId | string | required | References Product.id |
| slug | string | required | For navigation to product page |
| name | string | required | Display in cart summary |
| imageUrl | string | required | Thumbnail in cart |
| unitPrice | number | required, > 0 (PKR) | Price snapshotted at add time |
| quantity | integer | required, 1 ≤ q ≤ 10 | Validated on add and update |

---

### 3. Cart

Transient UI state — not persisted to DB. Stored in React Context and synced
to `sessionStorage` (key: `lumiere_cart`).

| Field | Type | Notes |
|-------|------|-------|
| items | CartItem[] | Ordered by time of first addition |
| totalItems | number | Computed: `sum(item.quantity)` |
| totalPrice | number | Computed: `sum(item.quantity × item.unitPrice)` (PKR) |

**State transitions**:

```
Empty Cart
    │
    ▼ ADD_ITEM(productId, quantity)
Non-empty Cart ──┐
    │             │ ADD_ITEM(same productId) → quantity += n (capped at 10)
    │◄────────────┘
    │
    ▼ CLEAR_CART
Empty Cart
```

**Validation**:
- `quantity` must be ≥ 1 before dispatching ADD_ITEM (enforced in `AddToCart` UI).
- If `productId` already exists in `items`, quantity is incremented (not duplicated).
- Total quantity per line item capped at 10 — excess silently clamped.
- `sessionStorage` write occurs after every state change (in `useEffect`).
- On mount, `CartContext` reads `sessionStorage` and hydrates state.

---

## Type Definitions (additions/changes to existing types)

### `types/products.ts` — add `description` field

```typescript
export interface Product extends FeaturedProduct {
  category: string
  createdAt: Date
  description: string   // ← NEW in 003
}
```

### `types/cart.ts` — new file

```typescript
export interface CartItem {
  productId: string
  slug: string
  name: string
  imageUrl: string
  unitPrice: number
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity: number } }
  | { type: 'CLEAR_CART' }
```

---

## Related Products Algorithm

Implemented as a pure function in `lib/related-products.ts`:

```
getRelatedProducts(current: Product, all: Product[], limit = 3): Product[]

Pipeline:
  all[]
    │
    ▼ exclude(current.id)
    │
    ▼ score by scentTag intersection count with current.scentTags
    │   (products with 0 overlap are excluded)
    │
    ▼ sort by score DESC (highest overlap first)
    │
    ▼ slice(0, limit)
    │
    ▼ return Product[] (0–3 items)
```

**Edge cases**:
- No overlap → returns `[]` (related section hidden)
- Fewer than `limit` matches → returns all available matches
- Ties broken by `displayOrder` ASC (bestselling first)
