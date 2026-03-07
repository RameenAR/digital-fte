# Contract: Cart State (v1 — Client-Side Only)

**Feature**: 003-product-detail | **Date**: 2026-03-07

> **v1 Note**: No HTTP API route is created in this feature. Cart state is managed
> entirely client-side via React Context + sessionStorage. This contract documents
> the CartContext interface, sessionStorage schema, and future API shape for v2.

---

## v1: CartContext Interface

### Provider

`context/CartContext.tsx` wraps the application in `<CartProvider>`. Must be
added to `app/layout.tsx` as a client-side wrapper.

### Consumer hook

```typescript
// hooks/useCart.ts
interface UseCartResult {
  items: CartItem[]       // All line items
  totalItems: number      // Sum of all quantities
  totalPrice: number      // Sum of (quantity × unitPrice) in PKR
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
  clearCart: () => void
}
```

### Behaviour

| Action | Input | Result |
|--------|-------|--------|
| `addToCart` (new product) | CartItem fields + quantity | New CartItem appended to items |
| `addToCart` (existing product) | Same productId + quantity | Existing item's quantity incremented (max 10) |
| `clearCart` | — | items cleared; sessionStorage entry removed |
| Mount (hydration) | — | Reads `lumiere_cart` from sessionStorage; restores state |

### sessionStorage schema

**Key**: `lumiere_cart`

**Value** (JSON):

```json
{
  "items": [
    {
      "productId": "prod-001",
      "slug": "midnight-rose",
      "name": "Midnight Rose",
      "imageUrl": "/images/products/midnight-rose.webp",
      "unitPrice": 4500,
      "quantity": 2
    }
  ]
}
```

**Notes**:
- `totalItems` and `totalPrice` are computed on read — not stored.
- Invalid/corrupted sessionStorage data is silently discarded; cart initialises empty.
- Key is namespaced (`lumiere_cart`) to avoid collisions with other apps.

---

## v2: POST /api/cart (Future Reference)

For a future server-side cart (e.g., authenticated users, cross-device sync):

**Endpoint**: `POST /api/cart/items`
**Authentication**: Session cookie (NextAuth)

### Request Body

```json
{
  "productId": "prod-001",
  "quantity": 2
}
```

### Response — 200 OK

```json
{
  "cartId": "cart-abc123",
  "items": [...],
  "totalItems": 2,
  "totalPrice": 9000
}
```

### Response — 400 Bad Request

```json
{
  "error": "INVALID_QUANTITY",
  "message": "Quantity must be between 1 and 10."
}
```

### Response — 404 Not Found

```json
{
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product prod-999 does not exist."
}
```

---

## v1: `lib/products.ts` — New Function

### `getProductBySlug(slug: string): Promise<Product | null>`

```typescript
getProductBySlug(slug: string): Promise<Product | null>
```

**Returns**: The matching active product, or `null` if not found / inactive.
**Source**: Seed data array (v1); Prisma query (v2).
**Called from**: `app/products/[slug]/page.tsx` (Server Component).

**Behaviour**:
- Unknown slug → returns `null` → caller invokes `notFound()`
- Inactive product → returns `null` (treated same as not found)
