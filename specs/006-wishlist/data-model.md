# Data Model: Wishlist / Favourites (006-wishlist)

**Date**: 2026-03-07
**Branch**: `006-wishlist`

---

## Entities

### WishlistItem

A snapshot of a product at the time it was saved to the wishlist. Stored in localStorage as part of the Wishlist array.

| Field       | Type     | Required | Notes                                            |
|-------------|----------|----------|--------------------------------------------------|
| `productId` | `string` | ✅       | Unique product identifier (matches `Product.id`) |
| `slug`      | `string` | ✅       | URL slug for linking to the product detail page  |
| `name`      | `string` | ✅       | Product name at time of saving                   |
| `imageUrl`  | `string` | ✅       | Image URL at time of saving                      |
| `price`     | `number` | ✅       | Price in PKR (integer paise) at time of saving   |
| `addedAt`   | `string` | ✅       | ISO 8601 date string — when the item was saved   |

**Key constraint**: `productId` is the deduplication key. A product can appear in the wishlist at most once.

---

### Wishlist (aggregate)

The full wishlist state, computed from the array of `WishlistItem`.

| Field        | Type             | Notes                                     |
|--------------|------------------|-------------------------------------------|
| `items`      | `WishlistItem[]` | Ordered by `addedAt` descending (newest first) |
| `totalItems` | `number`         | `items.length`                            |

---

## State Transitions

```
(empty wishlist)
      │
      │ toggle(product) — product NOT in wishlist
      ▼
(item added to wishlist)
      │
      ├──── toggle(product) — product IS in wishlist → (item removed)
      │
      ├──── removeItem(productId)                    → (item removed)
      │
      └──── moveToCart(item)                         → (item removed + cart updated)
```

**Idempotency**: `toggle` on an already-saved product removes it. `toggle` on an unsaved product adds it. No duplicates are ever created.

---

## Actions (Reducer)

| Action Type       | Payload                  | Effect                                             |
|-------------------|--------------------------|----------------------------------------------------|
| `TOGGLE_ITEM`     | `WishlistItem`           | Add if not present; remove if already present      |
| `REMOVE_ITEM`     | `{ productId: string }`  | Remove the item with matching productId            |
| `CLEAR_WISHLIST`  | none                     | Empty the entire wishlist                          |

---

## Persistence

| Storage      | Key                 | Format                                       |
|--------------|---------------------|----------------------------------------------|
| localStorage | `lumiere_wishlist`  | `JSON.stringify({ items: WishlistItem[] })`  |

**Hydration**: On `WishlistProvider` mount, `localStorage` is read via a `try/catch` to handle private browsing or storage quota errors. If reading fails, the wishlist initialises empty.

**Persistence**: `useEffect` writes to `localStorage` whenever `items` changes.

---

## Relationship to Existing Types

```
Product (types/products.ts)
  id         → WishlistItem.productId
  slug       → WishlistItem.slug
  name       → WishlistItem.name
  imageUrl   → WishlistItem.imageUrl
  price      → WishlistItem.price
  (all other fields are NOT stored in wishlist — snapshot only)

CartItem (types/cart.ts)
  productId  ← WishlistItem.productId
  slug       ← WishlistItem.slug
  name       ← WishlistItem.name
  imageUrl   ← WishlistItem.imageUrl
  unitPrice  ← WishlistItem.price
  quantity   ← hardcoded 1 (move to cart default)
```
