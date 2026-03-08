# Research: Wishlist / Favourites (006-wishlist)

**Date**: 2026-03-07
**Branch**: `006-wishlist`

---

## Decision 1: localStorage vs sessionStorage for Wishlist Persistence

**Decision**: Use `localStorage` for wishlist, not `sessionStorage`.

**Rationale**: The spec explicitly requires persistence across browser sessions (close and reopen). `sessionStorage` (used by the cart) is cleared when the tab or browser is closed. `localStorage` survives browser restarts and is the correct primitive for this use case.

**Key difference from cart**: `CartContext` uses `sessionStorage` (key: `lumiere_cart`). Wishlist uses `localStorage` (key: `lumiere_wishlist`). The two storage mechanisms are intentionally different — cart is transient (session), wishlist is durable (cross-session).

**Alternatives considered**:
- `sessionStorage` — rejected, clears on browser close, violates spec requirement
- IndexedDB — rejected, overcomplicated for a simple key-value JSON array
- Cookie — rejected, size limits and not suited for structured data

---

## Decision 2: WishlistContext + useWishlist Pattern (Mirror CartContext)

**Decision**: Implement `context/WishlistContext.tsx` and `hooks/useWishlist.ts` following the exact same pattern as `context/CartContext.tsx` and `hooks/useCart.ts`.

**Rationale**: The existing cart pattern (`useReducer` + Context + custom hook) is proven, tested, and understood by the project. Mirroring it minimises cognitive load, keeps architectural consistency, and makes onboarding new developers easier.

**WishlistContext** wraps a `useReducer` with a `wishlistReducer`. On mount, it hydrates from `localStorage`. On every state change, it persists to `localStorage`.

**Alternatives considered**:
- Zustand / Jotai — rejected, adds a new dependency for something the existing pattern already solves
- Direct localStorage calls in components — rejected, creates scattered state management, breaks reactivity

---

## Decision 3: Heart Button Positioning on ProductCard

**Decision**: Add an absolutely positioned `<button>` inside the existing `ProductCard` Link component. Use `e.stopPropagation()` on the button's click handler to prevent the Link navigation from firing.

**Rationale**: `ProductCard` is a full-card `<Link>`. To add a heart button without breaking the link navigation, the button must stop propagation. The button is placed in the top-right corner of the image area with `absolute top-2 right-2 z-10`.

**Accessibility**: The button gets its own `aria-label` ("Add to wishlist" / "Remove from wishlist") and is keyboard-focusable independently of the Link.

**Alternatives considered**:
- Wrap the card in a `<div>` instead of `<Link>` and handle navigation manually — rejected, changes existing component contract and breaks existing E2E tests
- A separate WishlistCardButton component rendered alongside ProductCard — rejected, requires ProductGrid restructuring

---

## Decision 4: WishlistItem as Data Snapshot

**Decision**: Store a snapshot of `{ productId, slug, name, imageUrl, price }` at the time of wishlist add. Do not store a reference to the live product.

**Rationale**:
1. Wishlist is 100% client-side with no backend. At render time, we cannot re-fetch product data.
2. Storing a snapshot means the wishlist page works even if the product is later modified or removed from the catalog.
3. The spec explicitly states "items shown using stored data at time of saving".

**`addedAt` field**: An ISO date string (not a `Date` object) is stored, because `Date` objects are not JSON-serializable without conversion.

**Alternatives considered**:
- Store only `productId` and look up the product from the seed data array at render time — rejected, wishlist page is a standalone route that would need to import the full product catalog, and discontinued products would be lost
- Store full `Product` type — rejected, over-stores data (scentNotes, scentTags, category, concentration, gender, description are not needed on the wishlist page)

---

## Decision 5: moveToCart Integration

**Decision**: `useWishlist` exposes a `moveToCart` helper that calls `addToCart` from `useCart` (quantity = 1) and then calls `removeFromWishlist`. Both hooks read from their respective contexts which are both mounted in the root layout.

**Rationale**: The `useCart` hook already exists (`hooks/useCart.ts`) and is accessible from any client component wrapped in `CartProvider`. Since both `CartProvider` and `WishlistProvider` will be in `app/layout.tsx`, any component can call both hooks.

**Cart item mapping**:
```
WishlistItem.productId → CartItem.productId
WishlistItem.slug      → CartItem.slug
WishlistItem.name      → CartItem.name
WishlistItem.imageUrl  → CartItem.imageUrl
WishlistItem.price     → CartItem.unitPrice
quantity               → 1 (hardcoded)
```

**Alternatives considered**:
- Handle moveToCart in WishlistContext directly — rejected, creates a circular dependency (WishlistContext importing CartContext)
- Let the wishlist page own the move logic — accepted but factored into `useWishlist` hook for reuse

---

## Decision 6: WishlistBadge in Header (alongside CartBadge)

**Decision**: Create `components/layout/WishlistBadge.tsx` mirroring `components/layout/CartBadge.tsx`. Add it to `app/layout.tsx` nav alongside `<CartBadge />`.

**Rationale**: The header already renders `CartBadge` as a standalone client component. `WishlistBadge` follows the same pattern — it reads `totalItems` from `useWishlist` and renders a heart icon with a count badge.

**Provider nesting in layout**: `WishlistProvider` wraps inside (or alongside) `CartProvider`. Both are mounted in `app/layout.tsx`. No performance concern since they are lightweight `useReducer`-based contexts.

**Alternatives considered**:
- A combined `FavouritesAndCart` component — rejected, couples unrelated concerns
- Using the same `CartBadge` for both — rejected, they navigate to different routes and have different icons

---

## Decision 7: Wishlist Page Route

**Decision**: `app/wishlist/page.tsx` — a Next.js App Router page. Since the wishlist data comes from `localStorage` (client-only), the page renders a client component that hydrates after mount.

**Hydration strategy**: A `WishlistPageClient` component reads from `useWishlist`. During SSR, `localStorage` is unavailable, so `WishlistContext` initialises with an empty array and populates on the client after hydration. This means a brief flash of the empty state on first load is expected and acceptable — it resolves in under one render cycle.

**Route**: `/wishlist` — publicly accessible, no auth.

**Alternatives considered**:
- Server component with cookie-based wishlist — rejected, spec explicitly states localStorage, no backend
- Modal/drawer instead of a dedicated page — rejected, spec explicitly requires a dedicated page
