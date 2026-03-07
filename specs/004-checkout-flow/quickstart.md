# Quickstart: Checkout Flow (004-checkout-flow)

**Date**: 2026-03-07

---

## Integration Scenarios for Testing

These scenarios describe how the checkout flow integrates with existing features (CartContext from 003-product-detail) and how the steps chain together.

---

## Scenario 1: Full Happy-Path Checkout

**Setup**: At least one product added to the session cart (from any product detail page).

**Steps**:
1. Navigate to `/checkout/cart`
2. Verify item(s) shown with name, quantity, unit price (PKR), line subtotal
3. Change quantity of one item → verify subtotal and grand total update instantly
4. Click "Proceed to Checkout"
5. Fill in the customer info form:
   - Full Name: `Rameen Ahmed`
   - Email: `rameen@example.com`
   - Phone: `03001234567`
   - Street: `House 12, Street 5, F-7/3`
   - City: `Islamabad`
   - Province: `Islamabad Capital Territory`
   - Postal Code: `44000`
6. Click "Continue to Review"
7. Verify order summary shows all items, customer details, and PKR total
8. Click "Place Order"
9. Verify redirect to `/checkout/confirmation`
10. Verify order number displayed (format: `LP-2026-NNNNN`)
11. Verify header cart badge shows `0`

**Expected result**: Confirmation page with unique order number; cart cleared.

---

## Scenario 2: Empty Cart Guard

**Setup**: Session cart is empty (or cleared).

**Steps**:
1. Navigate directly to `/checkout/cart`
2. Verify "Your cart is empty" message and link to `/products`
3. Try navigating directly to `/checkout/info`
4. Verify redirect to `/checkout/cart`
5. Try navigating directly to `/checkout/review`
6. Verify redirect to `/checkout/cart`

**Expected result**: All checkout steps beyond cart are inaccessible with an empty cart.

---

## Scenario 3: Form Validation Failures

**Setup**: Cart has at least one item.

**Steps**:
1. Navigate to `/checkout/cart` → click "Proceed to Checkout"
2. On `/checkout/info`, click "Continue to Review" without filling any field
3. Verify all 7 fields show inline error messages
4. Enter invalid email `abc` → submit → verify "Please enter a valid email address."
5. Enter phone `0300` (too short) → submit → verify "Please enter a valid phone number (min 10 digits)."
6. Fill all fields correctly → click "Continue to Review"
7. Verify navigation to `/checkout/review`

**Expected result**: Errors shown on invalid submit; valid data progresses to review.

---

## Scenario 4: Back-Navigation Preserves Form Data

**Setup**: Cart has items; customer info form filled.

**Steps**:
1. Complete `/checkout/info` and advance to `/checkout/review`
2. Click "Back" (browser back or explicit back link)
3. Verify `/checkout/info` shows previously entered values — form not blank

**Expected result**: CustomerInfo restored from session; no re-entry required.

---

## Scenario 5: Quantity Management on Cart Review

**Setup**: Cart has 2+ items.

**Steps**:
1. Navigate to `/checkout/cart`
2. Increment one item to 3 → verify line subtotal = `unitPrice × 3`
3. Decrement same item to 1 → verify subtotal updates
4. Remove one item → verify item gone, total recalculates
5. Remove last item → verify empty cart state, "Proceed to Checkout" hidden/disabled

**Expected result**: Cart mutations update totals in real time; empty state shown when all items removed.

---

## Scenario 6: Post-Order Back Navigation Prevention

**Setup**: Order just placed; on `/checkout/confirmation`.

**Steps**:
1. Click browser back button
2. Verify redirect to `/checkout/cart` (empty cart detected)
3. Navigate directly to `/checkout/review`
4. Verify redirect to `/checkout/cart` (empty cart)

**Expected result**: Post-order double submission is impossible; empty cart guard redirects.

---

## Scenario 7: Keyboard-Only Navigation

**Setup**: Cart has one item.

**Steps**:
1. Tab to "Proceed to Checkout" button on cart page → Enter
2. Tab through all 7 form fields on info page → fill each → Tab to submit → Enter
3. Tab to "Place Order" on review page → Enter
4. Verify `focus-visible:ring-2 focus-visible:ring-brand-gold` visible on all interactive elements throughout

**Expected result**: Full checkout completable without a mouse; all focus rings visible.

---

## Key Session Keys for Manual Testing

Open browser DevTools → Application → Session Storage → `http://localhost:3000`:

| Key | Contains |
|-----|---------|
| `lumiere_cart` | `{ items: [...] }` — set by CartContext |
| `lumiere_checkout_info` | `CustomerInfo` object — set after info form submission |
| `lumiere_completed_order` | `Order` object — set after "Place Order" |

**To reset**: Clear all sessionStorage keys and refresh.
