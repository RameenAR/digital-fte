# Research: Product Reviews & Ratings (007-product-reviews)

**Date**: 2026-03-08
**Branch**: `007-product-reviews`

---

## Decision 1: State Management Pattern

**Decision**: React Context + useReducer (same pattern as CartContext and WishlistContext)

**Rationale**: The project already uses this pattern for cart and wishlist — it is consistent, well-tested, and requires no new dependencies. The reducer is a pure function that is easy to unit test in isolation.

**Alternatives considered**:
- Zustand / Jotai: Would add a dependency not already in the project (violates Principle VI).
- useState in each component: Cannot share state across ProductCard (listing) and detail page simultaneously.
- Server-side DB: Out of scope per spec (no backend required).

---

## Decision 2: localStorage Key Strategy

**Decision**: Single key `lumiere_reviews` storing all reviews as `{ [productId]: Review[] }`.

**Rationale**: Mirrors the wishlist's `lumiere_wishlist` key pattern. Grouping by productId makes per-product reads O(1). A flat array would require filtering on every read.

**Alternatives considered**:
- One key per product (`lumiere_reviews_<productId>`): Creates unbounded key growth; harder to enumerate all reviews.
- sessionStorage: Does not survive browser close (violates FR-003).

---

## Decision 3: XSS Prevention

**Decision**: Store and render review text as plain text. Use React's default JSX text rendering (never `dangerouslySetInnerHTML`). Truncate reviewer name at 50 chars client-side before saving.

**Rationale**: React escapes all text content by default — no additional sanitization library needed. This satisfies FR-009 and SC-006 with zero new dependencies.

**Alternatives considered**:
- DOMPurify: Overkill for plain text; adds bundle weight.
- Server-side sanitization: No server in this feature.

---

## Decision 4: Review ID Generation

**Decision**: `crypto.randomUUID()` — available in all modern browsers and Node.js 14.17+.

**Rationale**: Built-in, zero-dependency, cryptographically unique. Consistent with the project's preference for standard library functions.

**Alternatives considered**:
- `Date.now() + Math.random()`: Collision-prone under rapid submission.
- nanoid: External dependency not yet in project.

---

## Decision 5: Average Rating Display on Product Cards

**Decision**: Read from ReviewsContext at render time. ProductCard already receives `FeaturedProduct` — we add an optional overlay if `totalCount > 0`.

**Rationale**: Context is already available site-wide (wrapped in layout). No prop drilling needed. Consistent with how WishlistToggle reads context from within ProductCard.

**Alternatives considered**:
- Bake average into product data: Data is static (from Prisma seed); reviews are dynamic client-side.
- Re-fetch localStorage on every card render: Too many localStorage reads; context solves this.

---

## Decision 6: No Pagination

**Decision**: Display all reviews for a product in a scrollable list (no pagination).

**Rationale**: MVP scope. localStorage-based reviews are unlikely to reach hundreds of entries per product in a real session. Pagination adds complexity without clear user need at this stage (Principle VI: YAGNI).

**Alternatives considered**:
- Show latest 5 + "Load more": Reasonable UX but premature for localStorage-only MVP.

---

## Resolved Clarifications

All requirements were fully specified. No NEEDS CLARIFICATION markers remain.
