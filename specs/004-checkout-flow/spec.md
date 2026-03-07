# Feature Specification: Checkout Flow

**Feature Branch**: `004-checkout-flow`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Checkout flow — cart review page showing items with quantities and subtotal, customer information form (name, email, phone, shipping address), order summary with total price and PKR currency, place order button, order confirmation page with order number. Session-only cart (no payment gateway, no auth required)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Review Cart Before Checkout (Priority: P1)

A shopper who has added fragrances to their cart visits the cart review page at `/checkout/cart`. They see all their items with product name, quantity, unit price, and line subtotal. They can increase or decrease quantities or remove an item entirely. A running cart total in PKR is shown. When satisfied, they click "Proceed to Checkout" to continue.

**Why this priority**: The cart review page is the entry point to the checkout funnel. Without it, customers cannot verify their order before committing. Delivers immediate value as a standalone cart management screen even before payment or forms are added.

**Independent Test**: Navigate to `/checkout/cart` with at least one item in the session cart. Verify each item shows name, quantity controls (−/+), unit price, and subtotal. Change a quantity — subtotal updates instantly. Remove an item — it disappears and total recalculates. Click "Proceed to Checkout" — moves to the next step.

**Acceptance Scenarios**:

1. **Given** a cart with 2 items, **When** the user visits `/checkout/cart`, **Then** both items appear with name, quantity, unit price (PKR), line subtotal (PKR), and a grand total.
2. **Given** an item with quantity 2, **When** the user decreases quantity to 1, **Then** the line subtotal and grand total update immediately without a page reload.
3. **Given** a cart with 1 item, **When** the user removes that item, **Then** the cart empties and a "Your cart is empty" message with a link back to `/products` appears.
4. **Given** an empty cart, **When** the user navigates directly to `/checkout/cart`, **Then** they see "Your cart is empty" and a prompt to browse fragrances — the "Proceed to Checkout" button is absent.
5. **Given** a non-empty cart, **When** the user clicks "Proceed to Checkout", **Then** they are taken to the customer information step.

---

### User Story 2 — Enter Customer & Shipping Details (Priority: P2)

After reviewing their cart, the shopper fills in a customer information form at `/checkout/info`. Required fields are full name, email address, phone number, and full shipping address (street, city, province, postal code). Each field is validated before proceeding. On success, the user moves to the order review step.

**Why this priority**: Collecting delivery information is required to fulfil the order. Builds on US1 — the cart must be reviewed first. Independently testable as a form validation experience even before order submission is wired.

**Independent Test**: Arrive at `/checkout/info` with a non-empty cart. Submit the form with all fields blank — see inline validation errors on each required field. Fill all fields correctly and click "Continue to Review" — move to the order summary page. Navigate back — the entered values are retained in the current session.

**Acceptance Scenarios**:

1. **Given** the user is on the info form, **When** they submit without filling any field, **Then** each required field shows a clear inline error message.
2. **Given** an invalid email (e.g., "abc"), **When** the user submits, **Then** the email field shows "Please enter a valid email address."
3. **Given** a phone number shorter than 10 digits, **When** the user submits, **Then** the phone field shows "Please enter a valid phone number."
4. **Given** all fields are valid, **When** the user clicks "Continue to Review", **Then** they advance to the order summary page with their details intact.
5. **Given** the user has filled the form and moved forward, **When** they click "Back", **Then** the form re-displays with their previously entered values (within the same session).

---

### User Story 3 — Review Order Summary & Place Order (Priority: P3)

On the order summary page at `/checkout/review`, the shopper sees a read-only summary: cart items with quantities and prices, entered customer/shipping details, and the grand total in PKR. A "Place Order" button is prominently displayed. On confirmation, the order is recorded for the session, the cart is cleared, and the user is redirected to an order confirmation page at `/checkout/confirmation` showing a unique order number.

**Why this priority**: This is the final conversion step. Requires US1 (cart) and US2 (customer info) to be complete. Delivers the end-to-end checkout experience.

**Independent Test**: Arrive at `/checkout/review` after completing info step. Verify all cart items, customer details, and PKR grand total appear correctly. Click "Place Order" — land on `/checkout/confirmation` showing a unique order reference number. Check that the header cart badge now shows 0. Navigate back to `/checkout/review` — order cannot be re-submitted.

**Acceptance Scenarios**:

1. **Given** a completed cart and info form, **When** the user views `/checkout/review`, **Then** they see all cart items, their entered details, and the PKR total — all read-only.
2. **Given** the review page is showing, **When** the user clicks "Place Order", **Then** within 2 seconds they are redirected to `/checkout/confirmation`.
3. **Given** the confirmation page loads, **Then** a unique alphanumeric order reference number (e.g., "LP-2026-00042") is displayed prominently.
4. **Given** the order is placed, **Then** the session cart is cleared and the header cart badge shows 0.
5. **Given** the user navigates back from the confirmation page to `/checkout/review`, **Then** they are redirected away — the empty cart prevents re-submission.
6. **Given** the user tries to reach `/checkout/info` or `/checkout/review` with an empty cart, **Then** they are redirected to `/checkout/cart`.

---

### Edge Cases

- What happens when the user navigates directly to `/checkout/review` without completing the info form? → Redirect to `/checkout/info`.
- What happens when the user navigates directly to `/checkout/info` with an empty cart? → Redirect to `/checkout/cart`.
- What happens if the user refreshes the confirmation page? → Order number remains visible (stored in session for the duration of the visit).
- What happens when a product image fails to load on the cart review page? → A branded placeholder is shown (consistent with product listing).
- What happens when the cart quantity of an item reaches the maximum (10) on the cart review page? → The increment button is disabled for that item.
- What happens when the user opens checkout in two browser tabs simultaneously? → Each tab operates on the same session cart; last action wins.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a cart review page listing all session cart items with product name, quantity, unit price (PKR), and line subtotal (PKR).
- **FR-002**: Users MUST be able to increase or decrease item quantity (1–10) directly on the cart review page, with totals updating in real time.
- **FR-003**: Users MUST be able to remove individual items from the cart on the cart review page.
- **FR-004**: System MUST prevent access to checkout steps beyond cart review when the cart is empty — redirecting to `/checkout/cart`.
- **FR-005**: System MUST prevent access to the review step when customer info has not been submitted — redirecting to `/checkout/info`.
- **FR-006**: System MUST present a customer information form collecting: full name (required), email address (required, valid format), phone number (required, minimum 10 digits), street address (required), city (required), province (required, from Pakistan province list), postal code (required).
- **FR-007**: System MUST validate all form fields on submit and display field-level error messages without clearing entered data.
- **FR-008**: System MUST retain entered customer details within the browser session so the user can navigate back without re-entering data.
- **FR-009**: System MUST display a read-only order summary at the review step showing cart items, customer details, and PKR grand total.
- **FR-010**: System MUST generate a unique order reference number upon placement (format: LP-YYYY-NNNNN) and display it on the confirmation page.
- **FR-011**: System MUST clear the session cart immediately after successful order placement.
- **FR-012**: System MUST prevent re-submission of an already-placed order (navigating back from confirmation finds an empty cart and redirects accordingly).
- **FR-013**: System MUST display all monetary values in Pakistani Rupees (PKR) with no decimal places.
- **FR-014**: System MUST show a checkout progress indicator (e.g., "Cart → Info → Review → Confirmation") on all checkout steps.

### Key Entities

- **Cart** (from session): Items with productId, name, imageUrl, unitPrice, quantity — already maintained by existing cart system from `003-product-detail`.
- **CustomerInfo**: fullName, email, phone, streetAddress, city, province, postalCode — held in session for the duration of the checkout flow.
- **Order**: orderNumber (LP-YYYY-NNNNN), placedAt (timestamp), customerInfo snapshot, lineItems snapshot (cart at time of placement), grandTotal — stored in session for confirmation display only; no database persistence.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A shopper can complete the full checkout flow (cart review → info → review → confirmation) in under 3 minutes.
- **SC-002**: All required form fields display inline validation errors within one interaction cycle of a failed submission.
- **SC-003**: The order confirmation page loads and displays the order number within 2 seconds of clicking "Place Order".
- **SC-004**: 100% of successful order placements result in the session cart being cleared and the confirmation page showing a unique order number.
- **SC-005**: Navigating to any checkout step with an invalid precondition (empty cart, missing info) redirects the user to the correct step within one page load.
- **SC-006**: The entire checkout flow is navigable by keyboard alone, with all interactive elements reachable via Tab and activatable via Enter/Space.

---

## Assumptions

- **No payment gateway**: The "Place Order" action records the order intent for the session only. No real payment processing, no credit card fields.
- **No authentication required**: Any visitor with a non-empty session cart can complete checkout. No login prompt is shown.
- **No server-side persistence**: Orders are stored in the browser session for the confirmation display only. They are not written to a database or sent to a backend API.
- **No email confirmation**: An order confirmation email is out of scope for this feature.
- **Order number generation**: Order numbers are generated client-side (timestamp-based or counter) and are unique within the session. Global uniqueness across concurrent users is not guaranteed at this scope.
- **Shipping cost**: No shipping fee calculation. Grand total = sum of line subtotals only.
- **Province list**: Pakistan provinces/territories offered as a dropdown (Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory, AJK, Gilgit-Baltistan).
- **Cart source**: Existing session cart from `003-product-detail` is the authoritative source of truth for items and prices.

## Out of Scope

- Payment gateway integration (Stripe, JazzCash, EasyPaisa, etc.)
- User accounts or order history
- Email or SMS order confirmations
- Promo/discount codes
- Shipping cost calculation or carrier integration
- Order tracking after placement
- Admin order management panel
- VAT/GST calculation
- Multi-currency support
