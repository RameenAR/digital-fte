# Tasks: Checkout Flow

**Input**: Design documents from `/specs/004-checkout-flow/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅
**Branch**: `004-checkout-flow`
**Total Tasks**: 22

**Organization**: Tasks grouped by user story — each independently implementable,
testable, and deliverable as an MVP increment.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions, CartContext extension, and checkout layout scaffold — before any component work.

- [ ] T001 Add `REMOVE_ITEM` action to `types/cart.ts` — add `{ type: 'REMOVE_ITEM'; payload: { productId: string } }` to `CartAction` union; update `cartReducer` to handle it by filtering out the matching productId
- [ ] T002 Create `types/checkout.ts` — define `ProvinceCode` union, `CustomerInfo`, `OrderLineItem`, `Order`, `CheckoutState`, `CheckoutAction` (`SET_CUSTOMER_INFO` | `SET_COMPLETED_ORDER` | `CLEAR_CHECKOUT`), `ValidationErrors`, `CheckoutContextValue`; export `CHECKOUT_STORAGE_KEY = 'lumiere_checkout'`
- [ ] T003 Create `app/checkout/layout.tsx` — shell layout (Server Component): stripped-down header with Lumière Parfums wordmark linking to `/`; `{children}` below; no CartBadge, no main nav; imports for CheckoutProvider and CheckoutProgress left as TODO (filled in T009)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TDD RED tests + pure validation/utility fns + CheckoutContext + CheckoutProgress — required by ALL user stories.

**⚠️ CRITICAL**: Blocks all user story component work.

- [ ] T004 Write unit tests `tests/unit/checkout-validation.test.ts` — tests for `validateCustomerInfo`: valid full set returns `{}`, empty fullName returns error, short fullName (<2 chars) returns error, invalid email `"abc"` returns error, valid email `"x@y.com"` passes, phone `"0300"` (4 digits) returns error, phone `"03001234567"` (11 digits) passes, phone `"+923001234567"` passes, empty streetAddress returns error, empty city returns error, invalid province `"xyz"` returns error, valid province `"punjab"` passes, empty postalCode returns error (MUST FAIL before T006)
- [ ] T005 [P] Write unit tests `tests/unit/order-number.test.ts` — tests for `generateOrderNumber`: result matches `/^LP-\d{4}-\d{5}$/`, year segment matches current year, suffix is exactly 5 digits, two consecutive calls return different numbers (MUST FAIL before T006)
- [ ] T006 Create `lib/checkout.ts` — implement `validateCustomerInfo(info: Partial<CustomerInfo>): ValidationErrors` (pure fn: checks all 7 fields per data-model.md rules; phone regex `^(92)?0?3[0-9]{9}$` after stripping `\D`; province must be one of 7 valid `ProvinceCode` values); implement `generateOrderNumber(): string` returning `LP-${year}-${String(Date.now() % 99999).padStart(5, '0')}`; both tests go GREEN
- [ ] T007 [P] Create `context/CheckoutContext.tsx` — `'use client'`; `checkoutReducer` pure fn handling `SET_CUSTOMER_INFO`, `SET_COMPLETED_ORDER`, `CLEAR_CHECKOUT`; `CheckoutProvider` uses `useReducer` + sessionStorage hydration on mount + sync on change (key: `lumiere_checkout`); `placeOrder(cartItems: CartItem[]): Order` generates order number via `generateOrderNumber()`, builds `OrderLineItem[]` snapshots, computes grandTotal, dispatches `SET_COMPLETED_ORDER`; exports `CheckoutProvider` and `useCheckoutContext`
- [ ] T008 [P] Create `components/checkout/CheckoutProgress.tsx` — `'use client'`; uses `usePathname()` to derive active step from path (`/checkout/cart`→`cart`, `/checkout/info`→`info`, `/checkout/review`→`review`, `/checkout/confirmation`→`confirmation`); renders 4 labeled step pills connected by lines; active step styled `bg-brand-gold text-white`, completed steps styled `border-brand-gold text-brand-gold` with checkmark, future steps styled `border-brand-bark/30 text-brand-bark/40`
- [ ] T009 Update `app/checkout/layout.tsx` — add `import CheckoutProvider` and `import CheckoutProgress`; wrap `{children}` in `<CheckoutProvider>`; render `<CheckoutProgress />` between header and `{children}`

**Checkpoint**: Unit tests GREEN (validation + order number), CheckoutContext ready, progress bar renders on all /checkout/* routes.

---

## Phase 3: User Story 1 — Review Cart Before Checkout (Priority: P1) 🎯 MVP

**Goal**: Cart review page at `/checkout/cart` showing all session cart items with
quantity controls (−/+), remove button, PKR unit price, line subtotal, and grand total.
Empty cart state handled. "Proceed to Checkout" advances to `/checkout/info`.

**Independent Test**: With at least one item in the session cart, navigate to
`/checkout/cart`. Verify item name, qty controls, PKR unit price, and line subtotal are
visible. Change quantity — subtotal and grand total update instantly. Remove an item —
it disappears, total recalculates. Remove last item — "Your cart is empty" message
appears, "Proceed to Checkout" button absent. With items, click "Proceed to Checkout" →
navigates to `/checkout/info`.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create `components/checkout/EmptyCartMessage.tsx` — renders centered "Your cart is empty" heading (`font-serif text-2xl text-brand-black`), descriptive sentence, and `<Link href="/products">` styled as brand-gold bordered button; no props
- [ ] T011 [P] [US1] Create `components/checkout/CartLineItem.tsx` — accepts `item: CartItem`, `onQuantityChange(productId, qty)`, `onRemove(productId)` props; renders `next/image` thumbnail (80×80, object-cover), product name, qty −/+ buttons (min 1 max 10, 44px touch targets, `focus-visible:ring-2 focus-visible:ring-brand-gold`), PKR unit price, PKR line subtotal (`unitPrice × quantity`), remove button (× or trash, `aria-label="Remove {name}"`); uses `Intl.NumberFormat('en-PK', { style:'currency', currency:'PKR', maximumFractionDigits:0 })`
- [ ] T012 [US1] Create `components/checkout/CartReview.tsx` — `'use client'`; reads `CartContext` via `useCart()`; when `items.length === 0` renders `<EmptyCartMessage />`; otherwise renders list of `<CartLineItem />` for each item; dispatches `ADD_ITEM` (quantity delta) for qty changes and `REMOVE_ITEM` for removal via `useCart()`; shows PKR grand total (`computeCart(items).totalPrice`); "Proceed to Checkout" `<Link href="/checkout/info">` button styled `bg-brand-black text-brand-cream hover:bg-brand-gold` — hidden when cart empty
- [ ] T013 [US1] Create `app/checkout/cart/page.tsx` — `'use client'`; renders `<CartReview />`; page title metadata: `"Your Cart | Lumière Parfums"`; no step guard (entry point — always accessible)

**Checkpoint**: US1 complete — `/checkout/cart` fully functional as standalone cart management page.

---

## Phase 4: User Story 2 — Enter Customer & Shipping Details (Priority: P2)

**Goal**: Customer information form at `/checkout/info` collecting 7 required fields
(name, email, phone, street, city, province, postal code) with inline field-level
validation on submit. Valid submission stores info in CheckoutContext and advances to
`/checkout/review`. Back-navigation restores previously entered values.

**Independent Test**: Arrive at `/checkout/info` with a non-empty cart. Click submit
without filling fields — all 7 fields show inline error messages, data not cleared.
Enter invalid email → specific error. Enter short phone → specific error. Fill all
fields correctly → click submit → navigate to `/checkout/review`. Click browser back →
form shows previously entered values, not blank.

### Implementation for User Story 2

- [ ] T014 [US2] Create `components/checkout/CustomerInfoForm.tsx` — `'use client'`; 7 controlled inputs using `useState` initialized from `useCheckoutContext().customerInfo` (pre-fills on back-navigation); fields: fullName (text), email (email), phone (tel), streetAddress (text), city (text), province (select with 7 `ProvinceCode` options and display labels), postalCode (text); on submit calls `validateCustomerInfo(formState)` — if errors exist sets `errors` state and returns; if valid calls `checkoutContext.setCustomerInfo(formState)` then `router.push('/checkout/review')`; error messages rendered below each field in `text-red-600 font-sans text-xs`; all inputs have `focus-visible:ring-2 focus-visible:ring-brand-gold`; "Back" link to `/checkout/cart`
- [ ] T015 [US2] Create `app/checkout/info/page.tsx` — `'use client'`; step guard: `useEffect` checks `cartItems.length === 0` → `router.replace('/checkout/cart')`; renders `null` during guard check; renders `<CustomerInfoForm />` once guard passes; page title metadata: `"Shipping Info | Lumière Parfums"`

**Checkpoint**: US2 complete — customer info form fully functional with validation and session retention.

---

## Phase 5: User Story 3 — Review Order & Place (Priority: P3)

**Goal**: Read-only order summary at `/checkout/review` showing cart items, customer
details, and PKR grand total. "Place Order" generates order number, clears cart, and
redirects to `/checkout/confirmation` showing the order number (LP-YYYY-NNNNN).
Back-navigation from confirmation finds empty cart and redirects, preventing re-submission.

**Independent Test**: Arrive at `/checkout/review` with items in cart and customerInfo
in session. Verify read-only display of items, PKR prices, customer details, grand
total. Click "Place Order" → redirect to `/checkout/confirmation` within 2 seconds →
unique order number (LP-2026-NNNNN) displayed. Header cart badge shows 0. Navigate
back from confirmation → redirected to `/checkout/cart` (empty cart).

### Implementation for User Story 3

- [ ] T016 [P] [US3] Create `components/checkout/OrderReview.tsx` — `'use client'`; reads `useCart()` and `useCheckoutContext()`; renders read-only table of items (name, qty, PKR unit price, PKR line subtotal); renders customer details section (name, email, phone, full address, province label); shows PKR grand total; "Place Order" button: onClick calls `checkoutContext.placeOrder(cartItems)` then `router.push('/checkout/confirmation')`; "Back" link to `/checkout/info`
- [ ] T017 [P] [US3] Create `components/checkout/OrderConfirmation.tsx` — reads `useCheckoutContext().completedOrder`; renders order number (`completedOrder.orderNumber`) in large serif font (`font-serif text-3xl text-brand-gold`); renders snapshot of lineItems with quantities and PKR prices; renders delivery address from `completedOrder.customerInfo`; renders PKR grandTotal; "Continue Shopping" `<Link href="/products">` button styled with brand-gold border
- [ ] T018 [US3] Create `app/checkout/review/page.tsx` — `'use client'`; step guards via `useEffect`: (1) `cartItems.length === 0` → `router.replace('/checkout/cart')`; (2) `customerInfo === null` → `router.replace('/checkout/info')`; renders `null` during guard checks; renders `<OrderReview />` once guards pass; page title metadata: `"Review Order | Lumière Parfums"`
- [ ] T019 [US3] Create `app/checkout/confirmation/page.tsx` — `'use client'`; step guard via `useEffect`: `completedOrder === null` → `router.replace('/checkout/cart')`; renders `null` during guard check; renders `<OrderConfirmation />` once guard passes; page title metadata: `"Order Confirmed | Lumière Parfums"`

**Checkpoint**: US3 complete — all 3 user stories independently functional. Full checkout flow end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: E2E tests, accessibility, and PKR formatting consistency.

- [ ] T020 [P] Write Playwright E2E test `tests/e2e/checkout.spec.ts` — 7 scenarios from `quickstart.md`: (1) full happy-path checkout, (2) empty cart guard on all steps, (3) form validation failures, (4) back-navigation preserves form data, (5) quantity management on cart review, (6) post-order back navigation prevention, (7) keyboard-only navigation through all 4 steps
- [ ] T021 [P] Keyboard navigation audit — Tab through all interactive elements across all 4 checkout pages; verify `focus-visible:ring-2 focus-visible:ring-brand-gold` on: qty −/+ buttons, remove buttons, all form inputs, province select, submit/proceed/back buttons, "Continue Shopping" link; verify province dropdown navigable via keyboard
- [ ] T022 [P] PKR formatting audit — verify `Intl.NumberFormat('en-PK', { style:'currency', currency:'PKR', maximumFractionDigits:0 })` used consistently in `CartLineItem.tsx`, `CartReview.tsx`, `OrderReview.tsx`, `OrderConfirmation.tsx`; no hardcoded "Rs" or decimal prices anywhere in checkout components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user story components
- **US1 Cart Review (Phase 3)**: Depends on Phase 2 (needs CartContext REMOVE_ITEM + CheckoutContext layout)
- **US2 Customer Info (Phase 4)**: Depends on Phase 2 (needs validateCustomerInfo from lib/checkout.ts + CheckoutContext) + US1 (page.tsx needs to exist as prior step)
- **US3 Order Review/Confirm (Phase 5)**: Depends on Phase 2 (needs placeOrder + generateOrderNumber) + US1 + US2
- **Polish (Phase 6)**: Depends on all phases complete

### Parallel Opportunities

```bash
# Phase 1 — can run in parallel:
T001  Add REMOVE_ITEM to types/cart.ts
T002  Create types/checkout.ts
T003  Create app/checkout/layout.tsx shell

# Phase 2 — RED tests in parallel:
T004  checkout-validation.test.ts (RED)
T005  order-number.test.ts (RED)

# Phase 2 — after T004+T005 confirmed RED, implement in parallel:
T006  lib/checkout.ts (goes GREEN)
T007  context/CheckoutContext.tsx
T008  components/checkout/CheckoutProgress.tsx

# Phase 3 — US1 components in parallel:
T010  EmptyCartMessage.tsx
T011  CartLineItem.tsx

# Phase 5 — US3 components in parallel:
T016  OrderReview.tsx
T017  OrderConfirmation.tsx

# Phase 6 — all in parallel:
T020  E2E tests
T021  Keyboard audit
T022  PKR formatting audit
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational — TDD RED→GREEN, CheckoutContext ready)
3. Complete Phase 3 (US1 — cart review fully functional)
4. **STOP and VALIDATE**: `/checkout/cart` shows items, qty controls, remove, grand total
5. Deploy as MVP — cart management page live

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 Cart Review → **MVP: cart page live**
3. US2 Customer Info → form with validation live
4. US3 Order Review + Confirmation → full checkout end-to-end
5. Polish → production-ready

---

## Notes

- [P] = parallelizable (different files, no blocking dependencies)
- [USn] = maps task to user story for traceability
- T004 and T005 (unit tests) MUST be written and confirmed FAILING before T006 (implementation) — constitution Principle III
- `validateCustomerInfo` and `generateOrderNumber` in `lib/checkout.ts` MUST be pure functions — export directly for unit testing without mocking context
- `checkoutReducer` in `CheckoutContext.tsx` should also be exported as a pure function for potential unit testing
- `placeOrder()` in `CheckoutContext` must dispatch both `SET_COMPLETED_ORDER` (CheckoutContext) and `CLEAR_CART` (CartContext) — it needs access to both contexts; implement by accepting `cartDispatch` as a parameter or by calling `cartContext.clearCart()` from the component before calling `placeOrder()`
- Reuse `useCart()` hook from `hooks/useCart.ts` — do NOT duplicate cart state reading
- `CartLineItem.tsx` should use the same `Intl.NumberFormat` pattern as `ProductDetailHero.tsx` for PKR formatting consistency
- Step guard pages render `null` (not a spinner) during the guard `useEffect` check — this prevents a flash of protected content
