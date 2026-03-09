# Data Model: Perfume E-Commerce Static Website

**Feature**: 008-perfume-static-site | **Date**: 2026-03-09

---

## Entities

### Product

The central entity. Stored in `js/data/products.js` as a static array.

```javascript
{
  id: Number,           // Unique identifier (1, 2, 3...)
  name: String,         // Display name, e.g., "Midnight Rose"
  brand: String,        // Brand name, e.g., "Essence Noir"
  category: String,     // "Men" | "Women" | "Unisex"
  scentFamily: String,  // "Floral" | "Woody" | "Fresh" | "Oriental"
  price: Number,        // Price in USD (decimal), e.g., 89.99
  rating: Number,       // 1.0–5.0, one decimal, e.g., 4.5
  reviewCount: Number,  // Total review count, e.g., 128
  sizes: Array<String>, // Available sizes, e.g., ["30ml", "50ml", "100ml"]
  image: String,        // Image URL (picsum.photos seed URL)
  description: String,  // Short description (1–2 sentences)
  featured: Boolean,    // Show on home page featured section
  tags: Array<String>   // Search/filter tags, e.g., ["evening", "luxury"]
}
```

**Validation Rules**:
- `price` must be > 0
- `rating` must be between 1.0 and 5.0
- `category` must be one of: "Men", "Women", "Unisex"
- `scentFamily` must be one of: "Floral", "Woody", "Fresh", "Oriental"
- `sizes` must have at least one entry

---

### CartItem

Represents a single line item in the cart. Stored in `localStorage` as part of the Cart.

```javascript
{
  productId: Number,   // References Product.id
  name: String,        // Denormalized for display (avoid re-lookup)
  image: String,       // Denormalized product image URL
  size: String,        // Selected size, e.g., "50ml"
  price: Number,       // Unit price at time of add (denormalized)
  quantity: Number     // Must be >= 1
}
```

**Validation Rules**:
- `quantity` must be >= 1 (remove item if decremented to 0)
- `productId` must match a product in `window.PRODUCTS`

---

### Cart

The top-level cart object stored as a single JSON value in localStorage under key `"perfume_cart"`.

```javascript
{
  items: Array<CartItem>,  // All line items
  updatedAt: String        // ISO timestamp of last modification
}
```

**Computed Values** (not stored, calculated on render):
- `subtotal`: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`
- `itemCount`: `items.reduce((sum, item) => sum + item.quantity, 0)`

---

### Category (UI entity only)

Used on the Home page category highlights section. Not persisted.

```javascript
{
  name: String,    // e.g., "Women's Fragrances"
  filter: String,  // Maps to Product.category, e.g., "Women"
  image: String,   // Category hero image URL
  count: Number    // Number of products in this category (derived)
}
```

---

## State Transitions

### Cart Item Lifecycle

```
[Not in cart]
     │
     ▼ addToCart(productId, size, quantity)
[In cart: quantity = N]
     │
     ├──▶ updateQuantity(+1) ──▶ [In cart: quantity = N+1]
     ├──▶ updateQuantity(-1) ──▶ [In cart: quantity = N-1]  (if N-1 >= 1)
     ├──▶ updateQuantity(-1) ──▶ [Removed from cart]        (if N-1 = 0)
     └──▶ removeItem()       ──▶ [Removed from cart]
```

### Filter State (Shop Page)

```
[All products shown]
     │
     ├──▶ selectFilter(type, value) ──▶ [Filtered view]
     ├──▶ selectSort(option)        ──▶ [Sorted view]
     └──▶ clearFilters()            ──▶ [All products shown]
```

---

## localStorage Schema

**Key**: `perfume_cart`
**Value**: JSON string of Cart object

```json
{
  "items": [
    {
      "productId": 3,
      "name": "Midnight Rose",
      "image": "https://picsum.photos/seed/3/400/500",
      "size": "50ml",
      "price": 89.99,
      "quantity": 2
    }
  ],
  "updatedAt": "2026-03-09T10:30:00.000Z"
}
```
