# Contract: Checkout State (004-checkout-flow)

**Type**: Client-side state contract (no API routes — session-only)
**Storage**: `sessionStorage`
**Date**: 2026-03-07

---

## sessionStorage Keys

| Key | Type | Set by | Cleared by |
|-----|------|--------|-----------|
| `lumiere_cart` | `{ items: CartItem[] }` | CartContext (003) | CartContext CLEAR_CART |
| `lumiere_checkout_info` | `CustomerInfo \| null` | CheckoutContext | CheckoutContext CLEAR |
| `lumiere_completed_order` | `Order \| null` | CheckoutContext | CheckoutContext CLEAR |

---

## TypeScript Interfaces

### CustomerInfo

```typescript
export type ProvinceCode =
  | 'punjab'
  | 'sindh'
  | 'kpk'
  | 'balochistan'
  | 'ict'
  | 'ajk'
  | 'gilgit-baltistan'

export interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  streetAddress: string
  city: string
  province: ProvinceCode
  postalCode: string
}
```

### OrderLineItem

```typescript
export interface OrderLineItem {
  productId: string
  name: string
  imageUrl: string
  unitPrice: number   // PKR, no decimals
  quantity: number    // 1–10
  lineSubtotal: number // unitPrice × quantity
}
```

### Order

```typescript
export interface Order {
  orderNumber: string   // Format: LP-YYYY-NNNNN
  placedAt: string      // ISO 8601 timestamp
  customerInfo: CustomerInfo
  lineItems: OrderLineItem[]
  grandTotal: number    // PKR, sum of all lineSubtotals
}
```

### CheckoutState (CheckoutContext value)

```typescript
export interface CheckoutState {
  customerInfo: CustomerInfo | null
  completedOrder: Order | null
}

export type CheckoutAction =
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo }
  | { type: 'SET_COMPLETED_ORDER'; payload: Order }
  | { type: 'CLEAR_CHECKOUT' }

export interface CheckoutContextValue extends CheckoutState {
  setCustomerInfo: (info: CustomerInfo) => void
  placeOrder: (items: CartItem[]) => Order
  clearCheckout: () => void
}
```

---

## Validation Contract

### `validateCustomerInfo(info: Partial<CustomerInfo>): ValidationErrors`

```typescript
export type ValidationErrors = Partial<Record<keyof CustomerInfo, string>>

// Returns an empty object {} if all fields are valid.
// Returns field-keyed error messages for any invalid fields.
```

**Rules**:

| Field | Rule | Error message |
|-------|------|--------------|
| `fullName` | Non-empty, min 2 chars | `"Please enter your full name."` |
| `email` | Matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `"Please enter a valid email address."` |
| `phone` | After stripping `\D`, matches `/^(92)?0?3[0-9]{9}$/` | `"Please enter a valid phone number (min 10 digits)."` |
| `streetAddress` | Non-empty | `"Please enter your street address."` |
| `city` | Non-empty | `"Please enter your city."` |
| `province` | One of 7 valid `ProvinceCode` values | `"Please select a province."` |
| `postalCode` | Non-empty | `"Please enter your postal code."` |

---

## Order Number Contract

### `generateOrderNumber(): string`

```typescript
// Returns: "LP-{year}-{suffix}" where suffix is 5-digit zero-padded
// Example: "LP-2026-04731"
// Guaranteed unique within a single sequential checkout session
```

---

## Step Guard Contract

| Route | Precondition check | Redirect if failed |
|-------|-------------------|-------------------|
| `/checkout/info` | `cartItems.length > 0` | `/checkout/cart` |
| `/checkout/review` | `cartItems.length > 0 AND customerInfo !== null` | `/checkout/info` |
| `/checkout/confirmation` | `completedOrder !== null` | `/checkout/cart` |

**Implementation pattern** (each guarded page):
1. On mount (`useEffect`), read preconditions from context
2. If precondition fails: call `router.replace(redirectTarget)`; render `null`
3. If precondition passes: render page content

---

## Component Props Contracts

### `<CheckoutProgress step={CheckoutStep} />`

```typescript
type CheckoutStep = 'cart' | 'info' | 'review' | 'confirmation'

interface CheckoutProgressProps {
  // step derived from usePathname() internally — no props needed
}
```

### `<CartLineItem item={CartItem} />`

```typescript
interface CartLineItemProps {
  item: CartItem  // from types/cart.ts
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}
```

### `<CustomerInfoForm />`

```typescript
// No props — reads/writes CheckoutContext directly
// Validates on submit, stores validated CustomerInfo via setCustomerInfo()
```

### `<OrderReview />`

```typescript
// No props — reads CartContext + CheckoutContext
// Read-only display of items + customerInfo + grandTotal
```

### `<OrderConfirmation />`

```typescript
// No props — reads CheckoutContext.completedOrder
// Displays orderNumber, placedAt, lineItems, grandTotal, customerInfo
```
