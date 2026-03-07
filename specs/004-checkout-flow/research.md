# Research: Checkout Flow (004-checkout-flow)

**Date**: 2026-03-07
**Branch**: `004-checkout-flow`

---

## Decision 1: Multi-Step Checkout State Management

**Decision**: React Context (`CheckoutContext`) + `sessionStorage`, mirroring the existing `CartContext` pattern from `003-product-detail`.

**Rationale**:
- Consistent with the established project pattern — `CartContext` already uses `useReducer` + `sessionStorage`. Adding `CheckoutContext` with the same shape keeps the mental model identical for future developers.
- `sessionStorage` satisfies the spec requirement: data persists for the browser session so users can navigate back without re-entering info, but is cleared when the tab closes (privacy-appropriate for customer PII like addresses).
- No external library (Zustand, Redux) needed — the feature scope is small (4 steps, 2 state objects).

**Alternatives considered**:
- **URL search params** (e.g., `?step=info&name=Ahmed`): Rejected — exposes customer PII in the URL (browser history, server logs), violates constitution Principle IV (Secure by Default).
- **Server-side session (cookies)**: Rejected — requires API routes and a session store; spec explicitly states session-only with no backend persistence.
- **Zustand**: Rejected — adds a dependency for a 4-step flow; YAGNI (constitution Principle VI).

---

## Decision 2: Client-Side Form Validation (No Library)

**Decision**: Pure validation functions in `lib/checkout.ts` — regex for email, digit-count for phone, non-empty check for required fields. Exported as pure functions for direct unit testing.

**Rationale**:
- Keeps the bundle small (no validation library like Yup or Zod adds ~10–30KB).
- Pure functions are trivially unit-testable with Vitest (no mocking needed).
- The field set is fixed and simple: 7 fields, no complex conditional rules.
- Consistent with project pattern: `lib/related-products.ts`, `lib/products.ts` are all pure utility modules.

**Validation rules**:
- `fullName`: non-empty, min 2 characters
- `email`: RFC 5322 simplified regex — `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `phone`: digits only after stripping `+`, `-`, spaces — minimum 10 digits (covers Pakistani numbers: 03XX-XXXXXXX = 11 digits)
- `streetAddress`, `city`, `postalCode`: non-empty
- `province`: must be one of the 7 valid Pakistan provinces

**Alternatives considered**:
- **React Hook Form + Zod**: Powerful but adds ~25KB and complexity for 7 fields. Recommended for >20 field forms or dynamic schemas.
- **HTML5 `required` + `type="email"`**: Browser-native but not customizable — error messages aren't on-brand and behaviour differs across browsers.

---

## Decision 3: Checkout Step Guard (Redirect Pattern)

**Decision**: `useEffect` redirect inside each `'use client'` page — check sessionStorage preconditions on mount, call `router.replace()` if not met.

**Rationale**:
- Next.js App Router does not support server-side redirect for client state (sessionStorage is not available on the server).
- `useEffect` + `router.replace()` is the canonical Next.js App Router pattern for client-state-based guards.
- `router.replace()` (not `push`) prevents the broken page from appearing in browser history.

**Guard rules**:
- `/checkout/info` → redirect to `/checkout/cart` if `cartItems.length === 0`
- `/checkout/review` → redirect to `/checkout/info` if `customerInfo` is null/incomplete
- `/checkout/review` → redirect to `/checkout/cart` if cart is empty
- `/checkout/confirmation` → redirect to `/checkout/cart` if no `completedOrder` in session

**Alternatives considered**:
- **Next.js Middleware**: Cannot read `sessionStorage` (runs on the server/edge). Only suitable for cookie-based auth guards.
- **Higher-order component `withCheckoutGuard`**: Over-engineered for 4 pages — inline `useEffect` is clearer.

---

## Decision 4: Order Number Generation

**Decision**: Client-side generation: `LP-${year}-${counter}` where counter is a zero-padded 5-digit number derived from `Date.now() % 100000`. Stored in `sessionStorage` on placement.

**Format**: `LP-2026-04231` (LP = Lumière Parfums, year = current year, 5-digit suffix)

**Rationale**:
- Spec states no database — so true sequential global IDs are impossible.
- Timestamp modulo gives sufficient uniqueness within a single user session (collision probability within the same ms is negligible for a single-user browser session).
- Readable and on-brand (LP prefix matches the brand name Lumière Parfums).

**Alternatives considered**:
- **UUID v4**: Universally unique but ugly (e.g., `550e8400-e29b-41d4-a716-446655440000`) — poor UX for a visible order number.
- **Crypto.randomUUID()**: Same issue as UUID — not human-readable.
- **Sequential counter in localStorage**: Would persist across sessions and accumulate; overkill for spec scope.

---

## Decision 5: Checkout Layout & Progress Indicator

**Decision**: Dedicated `app/checkout/layout.tsx` — a lightweight layout wrapping all `/checkout/*` routes. Contains a `<CheckoutProgress>` component showing the 4 steps (Cart → Info → Review → Confirmation) with active/completed state derived from the current URL pathname.

**Rationale**:
- Next.js App Router nested layouts are the idiomatic way to share UI across a route group — no prop drilling needed.
- The checkout layout is intentionally stripped-down (no main nav, no footer) to reduce distraction and keep users focused on conversion — a standard e-commerce UX pattern (used by Shopify, Amazon, ASOS).
- The main site header (with CartBadge) is excluded from the checkout layout intentionally.

**Progress indicator**: 4 steps shown as pills/dots. Current step highlighted in `brand-gold`. Completed steps shown with a checkmark. Future steps shown greyed out.

**Alternatives considered**:
- **Route groups `(checkout)`**: Can achieve the same layout isolation with a folder rename — not needed here since the URL path `/checkout/*` is already isolated.
- **Shared component manually imported on each page**: Violates DRY — layout.tsx is the right abstraction.

---

## Decision 6: CheckoutContext Scope

**Decision**: `CheckoutContext` wraps only `app/checkout/layout.tsx` — not the root `app/layout.tsx`. This keeps checkout state isolated to the checkout flow and does not pollute the global app context.

**Rationale**:
- Cart state (`CartContext`) is global because the cart badge appears on every page.
- Customer info and order state are only needed on `/checkout/*` pages — scoping them there avoids unnecessary re-renders on unrelated pages.
- Clean separation: `CartContext` (global) + `CheckoutContext` (checkout-scoped).
