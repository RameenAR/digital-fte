# Data Model: Checkout Flow (004-checkout-flow)

**Date**: 2026-03-07
**Storage**: Browser `sessionStorage` only — no database, no API persistence.

---

## Entities

### CustomerInfo

Collected on the `/checkout/info` form. Stored in `sessionStorage` under key `lumiere_checkout_info`.

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| `fullName` | `string` | Required, min 2 chars | Customer's full name |
| `email` | `string` | Required, valid email format | Contact email |
| `phone` | `string` | Required, ≥10 digits (after stripping non-digits) | Pakistani phone numbers: 03XX-XXXXXXX |
| `streetAddress` | `string` | Required, non-empty | Street + building/flat number |
| `city` | `string` | Required, non-empty | City name |
| `province` | `ProvinceCode` | Required, one of 7 valid values | See ProvinceCode enum below |
| `postalCode` | `string` | Required, non-empty | 5-digit Pakistani postal code |

**ProvinceCode enum**:
```
'punjab' | 'sindh' | 'kpk' | 'balochistan' | 'ict' | 'ajk' | 'gilgit-baltistan'
```

**Display labels**:
- `punjab` → Punjab
- `sindh` → Sindh
- `kpk` → Khyber Pakhtunkhwa
- `balochistan` → Balochistan
- `ict` → Islamabad Capital Territory
- `ajk` → AJK
- `gilgit-baltistan` → Gilgit-Baltistan

---

### OrderLineItem

A snapshot of a cart item at the moment the order is placed. Immutable after creation.

| Field | Type | Source |
|-------|------|--------|
| `productId` | `string` | From `CartItem.productId` |
| `name` | `string` | From `CartItem.name` |
| `imageUrl` | `string` | From `CartItem.imageUrl` |
| `unitPrice` | `number` | From `CartItem.unitPrice` (PKR) |
| `quantity` | `number` | From `CartItem.quantity` |
| `lineSubtotal` | `number` | Computed: `unitPrice × quantity` (PKR) |

---

### Order

Created on "Place Order" button click. Stored in `sessionStorage` under key `lumiere_completed_order`. Cleared when the user starts a new cart session.

| Field | Type | Notes |
|-------|------|-------|
| `orderNumber` | `string` | Format: `LP-YYYY-NNNNN` (e.g., `LP-2026-04231`) |
| `placedAt` | `string` | ISO 8601 timestamp |
| `customerInfo` | `CustomerInfo` | Snapshot — not linked to a live object |
| `lineItems` | `OrderLineItem[]` | Snapshot of cart at placement |
| `grandTotal` | `number` | Sum of all `lineSubtotal` values (PKR) |

---

### CheckoutStep (UI State)

Used by `CheckoutProgress` component to show active/completed state.

```
'cart' | 'info' | 'review' | 'confirmation'
```

Step order: `cart → info → review → confirmation`

---

## State Flow

```
sessionStorage['lumiere_cart']          ← CartContext (from 003-product-detail)
sessionStorage['lumiere_checkout_info'] ← CheckoutContext (new in 004)
sessionStorage['lumiere_completed_order'] ← CheckoutContext (new in 004)
```

**Lifecycle**:
1. User adds items → `lumiere_cart` populated
2. User completes info form → `lumiere_checkout_info` populated
3. User places order → `lumiere_completed_order` created, `lumiere_cart` cleared (via CartContext `CLEAR_CART` dispatch)
4. User sees confirmation → reads `lumiere_completed_order`
5. New shopping session → `lumiere_completed_order` cleared when cart is repopulated

---

## Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|--------------|
| `fullName` | Non-empty, ≥2 chars | "Please enter your full name." |
| `email` | Matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Please enter a valid email address." |
| `phone` | Digits ≥10 after stripping `+`, `-`, spaces | "Please enter a valid phone number (min 10 digits)." |
| `streetAddress` | Non-empty | "Please enter your street address." |
| `city` | Non-empty | "Please enter your city." |
| `province` | One of 7 valid ProvinceCode values | "Please select a province." |
| `postalCode` | Non-empty | "Please enter your postal code." |
