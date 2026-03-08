# Contract: WishlistContext & useWishlist Hook

**Feature**: 006-wishlist
**Date**: 2026-03-07

---

## WishlistItem Type

```typescript
// types/wishlist.ts
export interface WishlistItem {
  productId: string
  slug: string
  name: string
  imageUrl: string
  price: number
  addedAt: string   // ISO 8601 string
}

export interface Wishlist {
  items: WishlistItem[]
  totalItems: number
}

export type WishlistAction =
  | { type: 'TOGGLE_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_WISHLIST' }

export const WISHLIST_STORAGE_KEY = 'lumiere_wishlist'
```

---

## WishlistContext Shape

```typescript
// context/WishlistContext.tsx
interface WishlistContextValue extends Wishlist {
  dispatch: React.Dispatch<WishlistAction>
}
```

**Provider**: `WishlistProvider` — mounts in `app/layout.tsx`, reads from `localStorage` on mount, writes to `localStorage` on every state change.

---

## useWishlist Hook API

```typescript
// hooks/useWishlist.ts
interface UseWishlistResult {
  items: WishlistItem[]
  totalItems: number
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (productId: string) => void
  moveToCart: (item: WishlistItem) => void
  clearWishlist: () => void
}
```

### Function Contracts

#### `isInWishlist(productId: string): boolean`
- Returns `true` if the product is currently in the wishlist
- O(n) lookup via `items.find()`
- Pure read — no side effects

#### `toggleWishlist(item: Omit<WishlistItem, 'addedAt'>): void`
- If `productId` is NOT in wishlist → dispatches `TOGGLE_ITEM` with `addedAt = new Date().toISOString()`
- If `productId` IS in wishlist → dispatches `REMOVE_ITEM`
- Idempotent: calling multiple times on the same product toggles alternately

#### `removeFromWishlist(productId: string): void`
- Dispatches `REMOVE_ITEM`
- No-op if product is not in wishlist

#### `moveToCart(item: WishlistItem): void`
- Calls `addToCart` from `useCart` with `{ productId, slug, name, imageUrl, unitPrice: item.price }`, `quantity = 1`
- Then calls `removeFromWishlist(item.productId)`
- Net result: item removed from wishlist, added to cart

#### `clearWishlist(): void`
- Dispatches `CLEAR_WISHLIST`
- Empties the entire wishlist

---

## WishlistBadge Component Contract

```typescript
// components/layout/WishlistBadge.tsx
// Props: none
// Reads: useWishlist().totalItems
// Renders: heart SVG + count badge (hidden when totalItems === 0)
// Links to: /wishlist
```

---

## WishlistToggle Component Contract

```typescript
// components/wishlist/WishlistToggle.tsx
interface WishlistToggleProps {
  product: {
    productId: string
    slug: string
    name: string
    imageUrl: string
    price: number
  }
  className?: string
}
// Renders: <button> with filled/outline heart SVG
// aria-label: "Add {name} to wishlist" | "Remove {name} from wishlist"
// onClick: e.stopPropagation() + toggleWishlist(product)
```

---

## Wishlist Reducer Contract

```typescript
export function wishlistReducer(items: WishlistItem[], action: WishlistAction): WishlistItem[]
```

| Input action   | Pre-condition              | Post-condition                                  |
|----------------|----------------------------|-------------------------------------------------|
| `TOGGLE_ITEM`  | product NOT in items       | items contains the new WishlistItem             |
| `TOGGLE_ITEM`  | product IS in items        | item with matching productId removed            |
| `REMOVE_ITEM`  | any                        | item with matching productId removed            |
| `CLEAR_WISHLIST` | any                      | items = []                                      |

**Invariants**:
- `items` never contains two entries with the same `productId`
- `items` order is insertion order (newest appended to end, reversed for display)
