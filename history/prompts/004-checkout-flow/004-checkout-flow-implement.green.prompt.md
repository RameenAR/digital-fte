---
id: 004
title: checkout-flow-implement
stage: green
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 004-checkout-flow
branch: 004-checkout-flow
user: hp
command: /sp.implement
labels: [implementation, checkout, cart-review, customer-form, order-confirmation, tdd]
links:
  spec: specs/004-checkout-flow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - types/cart.ts
  - types/checkout.ts
  - hooks/useCart.ts
  - lib/checkout.ts
  - context/CheckoutContext.tsx
  - app/checkout/layout.tsx
  - app/checkout/cart/page.tsx
  - app/checkout/info/page.tsx
  - app/checkout/review/page.tsx
  - app/checkout/confirmation/page.tsx
  - components/checkout/CheckoutProgress.tsx
  - components/checkout/EmptyCartMessage.tsx
  - components/checkout/CartLineItem.tsx
  - components/checkout/CartReview.tsx
  - components/checkout/CustomerInfoForm.tsx
  - components/checkout/OrderReview.tsx
  - components/checkout/OrderConfirmation.tsx
  - tests/unit/checkout-validation.test.ts
  - tests/unit/order-number.test.ts
  - tests/e2e/checkout.spec.ts
  - specs/004-checkout-flow/tasks.md
tests:
  - tests/unit/checkout-validation.test.ts (16 tests — GREEN)
  - tests/unit/order-number.test.ts (5 tests — GREEN)
  - tests/e2e/checkout.spec.ts (14 E2E scenarios — written)
---

## Prompt

implement karo

## Response snapshot

Implemented all 22 tasks across 6 phases for 004-checkout-flow:

**Phase 1 — Setup**: Added REMOVE_ITEM to CartAction + cartReducer; exposed removeFromCart in useCart hook; created types/checkout.ts (ProvinceCode, CustomerInfo, Order, CheckoutState, CHECKOUT_STORAGE_KEY); scaffolded app/checkout/layout.tsx shell.

**Phase 2 — Foundational (TDD)**: Wrote RED unit tests for validateCustomerInfo (16 cases) and generateOrderNumber (5 cases); implemented lib/checkout.ts (phone regex ^(92)?0?3[0-9]{9}$ after stripping \D, email regex, province enum check); created CheckoutContext.tsx (checkoutReducer + sessionStorage sync + placeOrder(cartItems, clearCart)); created CheckoutProgress.tsx (usePathname() → 4 step pills, brand-gold active state).

**Phase 3 — US1 Cart Review**: EmptyCartMessage, CartLineItem (qty −/+, remove, PKR line subtotal), CartReview (reads CartContext, dispatches REMOVE_ITEM/ADD_ITEM delta, shows grand total), /checkout/cart page.

**Phase 4 — US2 Customer Info**: CustomerInfoForm (7 controlled inputs, validateCustomerInfo on submit, inline errors, pre-fills from CheckoutContext on back-nav, province select with 7 Pakistan options), /checkout/info page (step guard: empty cart → /checkout/cart).

**Phase 5 — US3 Order Review+Confirm**: OrderReview (read-only items + customer details + PKR total, Place Order → placeOrder() + router.push), OrderConfirmation (LP-YYYY-NNNNN order number in brand-gold serif, line items snapshot, delivery address), /checkout/review (dual step guards), /checkout/confirmation (order null guard).

**Phase 6 — Polish**: 14 Playwright E2E scenarios; all interactive elements have focus-visible:ring-2 ring-brand-gold; PKR Intl.NumberFormat used consistently.

**Unit test suite**: 73/73 GREEN across 7 test files.

## Outcome

- ✅ Impact: Full 4-step checkout at /checkout/* — cart review, info form, order review, confirmation — session-only, no payment, no auth
- 🧪 Tests: 73/73 unit tests GREEN (21 new); 14 E2E scenarios written
- 📁 Files: 21 files created/modified
- 🔁 Next prompts: merge karo → next feature
- 🧠 Reflection: placeOrder() accepts clearCart as a parameter to avoid cross-context coupling — cleaner than accessing CartContext inside CheckoutContext

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): vitest run — 73/73 PASS
- Prompt variant (if applicable): sp.implement v1
- Next experiment: n/a
