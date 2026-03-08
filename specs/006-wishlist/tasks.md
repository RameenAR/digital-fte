# Tasks: Wishlist / Favourites (006-wishlist)

**Input**: Design documents from `/specs/006-wishlist/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅

**Tests**: TDD mandatory per Constitution Principle III — write RED tests before implementation.

**Organization**: Tasks grouped by user story. Foundation phase blocks all stories and must complete first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US4)
- All file paths are relative to repo root

---

## Phase 1: Setup (Shared Types)

**Purpose**: Create the core TypeScript types and pure reducer that all subsequent phases depend on.

- [ ] T001 Create `types/wishlist.ts` — define WishlistItem interface, Wishlist interface, WishlistAction union type, wishlistReducer pure function, computeWishlist helper, and WISHLIST_STORAGE_KEY constant

---

## Phase 2: Foundational (Context + Hook — Blocks All User Stories)

**Purpose**: Establish WishlistContext with localStorage persistence and the useWishlist hook. Wire WishlistProvider into the root layout so all pages have access.

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete — all components consume `useWishlist`.

- [ ] T002 Write RED unit tests in `tests/unit/wishlist.test.ts` — cover wishlistReducer (TOGGLE_ITEM add, TOGGLE_ITEM remove, no-duplicate toggle, REMOVE_ITEM, CLEAR_WISHLIST) and computeWishlist (totalItems, empty input) — confirm all tests FAIL before implementation
- [ ] T003 Create `context/WishlistContext.tsx` — WishlistProvider using useReducer + wishlistReducer; hydrates from localStorage on mount (try/catch for private browsing); persists items to localStorage on every state change via useEffect; exports WishlistContext
- [ ] T004 Create `hooks/useWishlist.ts` — exports useWishlist() returning { items, totalItems, isInWishlist, toggleWishlist, removeFromWishlist, moveToCart, clearWishlist }; moveToCart calls useCart().addToCart then removeFromWishlist — run unit tests and confirm all GREEN
- [ ] T005 Modify `app/layout.tsx` — wrap CartProvider children in WishlistProvider (so WishlistContext is available site-wide); no visual changes yet

**Checkpoint**: All unit tests GREEN. WishlistProvider mounted. useWishlist accessible from any client component.

---

## Phase 3: User Story 1 — Save & Toggle Products (Priority: P1) 🎯 MVP

**Goal**: Heart icon on product cards and product detail page toggles wishlist membership. Icon visually reflects saved state. No page reload on toggle.

**Independent Test**: Click heart on any product card on /products — icon fills, header count increments. Click again — icon empties, count decrements. Navigate to /products/:slug — heart icon is present and toggles correctly.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `components/wishlist/WishlistToggle.tsx` — client component; props: `{ product: { productId, slug, name, imageUrl, price }, className? }`; renders `<button>` with filled/outline heart SVG based on `isInWishlist(product.productId)`; onClick calls `e.stopPropagation()` then `toggleWishlist(product)`; aria-label: "Add {name} to wishlist" / "Remove {name} from wishlist"; min-h/min-w 44px for accessibility
- [ ] T007 [US1] Modify `components/homepage/ProductCard.tsx` — add `WishlistToggle` as an absolutely positioned button inside the card image area (`absolute top-2 right-2 z-10`); pass product fields (id→productId, slug, name, imageUrl, price) to WishlistToggle; card remains a full-clickable Link
- [ ] T008 [US1] Modify `app/products/[slug]/page.tsx` — add `<WishlistToggle>` in the product detail right column (below ScentNotesPyramid, above AddToCart); pass product fields as { productId: product.id, slug, name, imageUrl, price }

**Checkpoint**: US1 complete — heart icon toggles on cards and detail page; heart state is consistent across pages.

---

## Phase 4: User Story 2 — Persistent Wishlist Across Sessions (Priority: P2)

**Goal**: Wishlist data survives browser close and reopen. No login required.

**Independent Test**: Save 2 products. Close browser. Reopen and navigate to /products — both hearts are filled and header shows count 2.

**Implementation**: US2 persistence is delivered entirely by `WishlistContext.tsx` (T003) which reads/writes localStorage. No additional files needed.

**Note**: The localStorage hydration (T003) and WishlistProvider mounting (T005) together satisfy all US2 acceptance scenarios. Verify by running quickstart.md Scenario 3 manually.

**Checkpoint**: US2 complete — wishlist data persists across browser sessions via localStorage.

---

## Phase 5: User Story 3 — Wishlist Page (Priority: P3)

**Goal**: `/wishlist` page lists all saved products with image, name, price, remove button, and "Move to Cart" button. Empty state shown when no items saved.

**Independent Test**: Save 3 products → navigate to /wishlist → all 3 shown → remove one (2 remain) → move one to cart (1 remains in wishlist, cart count 1) → remove last (empty state shown with Browse Products link).

### Implementation for User Story 3

- [ ] T009 [P] [US3] Create `components/wishlist/WishlistPage.tsx` — client component; reads `useWishlist()`; renders product grid with WishlistItem cards showing image (Next.js Image), name, price (PKR formatted), remove button (calls removeFromWishlist), "Move to Cart" button (calls moveToCart); shows empty state with message + Link to /products when items.length === 0; uses brand Tailwind classes (bg-brand-cream, font-serif, brand-gold, etc.)
- [ ] T010 [US3] Create `app/wishlist/page.tsx` — server page component with metadata (`title: 'Wishlist | Lumière Parfums'`); renders `<WishlistPage />` inside a `<main>` with standard max-w-7xl padding layout

**Checkpoint**: US3 complete — /wishlist page fully functional with remove and move-to-cart actions.

---

## Phase 6: User Story 4 — Header Wishlist Count (Priority: P4)

**Goal**: Site header shows a heart icon badge with item count. Badge hidden when count is 0. Clicking navigates to /wishlist.

**Independent Test**: With 0 items — no badge visible. Add 1 item — badge shows "1". Navigate to any page — badge persists. Click badge → navigates to /wishlist.

### Implementation for User Story 4

- [ ] T011 [P] [US4] Create `components/layout/WishlistBadge.tsx` — mirrors CartBadge.tsx; reads `useWishlist().totalItems`; renders Link to /wishlist with heart SVG icon; shows count badge (hidden when totalItems === 0, shows "9+" when > 9); aria-label reflects count; brand-gold badge styling matching CartBadge
- [ ] T012 [US4] Modify `app/layout.tsx` — import WishlistBadge; add `<WishlistBadge />` to nav before `<CartBadge />`; no other changes

**Checkpoint**: US4 complete — all 4 user stories functional end-to-end.

---

## Phase 7: Polish & Validation

**Purpose**: E2E test coverage and full test suite validation.

- [ ] T013 Create `tests/e2e/wishlist.spec.ts` — implement 10 Playwright scenarios from quickstart.md: (1) add from product listing, (2) toggle removes, (3) persistence across sessions, (4) remove from wishlist page, (5) move to cart, (6) empty state, (7) duplicate prevention, (8) heart on detail page, (9) header badge navigates to /wishlist, (10) private browsing graceful degradation
- [ ] T014 Run full test suite (`npx vitest run`) — confirm all unit tests GREEN (≥ 23 existing + new wishlist tests); verify no TypeScript errors (`npx tsc --noEmit`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (types must exist before context/hook)
- **Phase 3 (US1)**: Depends on Phase 2 complete — WishlistToggle needs useWishlist
- **Phase 4 (US2)**: Covered by Phase 2 — no additional tasks (verify manually)
- **Phase 5 (US3)**: Depends on Phase 2 complete — WishlistPage needs useWishlist
- **Phase 6 (US4)**: Depends on Phase 2 complete — WishlistBadge needs useWishlist
- **Phase 7 (Polish)**: Depends on all phases complete

### Parallel Opportunities Within Phases

```
Phase 2:  T002 (tests) → T003 (context) → T004 (hook)  [sequential]
           T005 (layout provider) can run after T003

Phase 3:  T006 [P] WishlistToggle can be written before ProductCard is modified
           T007 depends on T006
           T008 depends on T006 (runs in parallel with T007)

Phase 5:  T009 [P] WishlistPage component
           T010 depends on T009

Phase 6:  T011 [P] WishlistBadge can be written before layout is modified
           T012 depends on T011
```

---

## Implementation Strategy

### MVP (User Story 1 only)
1. T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008
2. **STOP**: Heart icon toggles on product cards and detail page
3. Wishlist count is visible if WishlistBadge is also done

### Full Feature (all stories)
1. Phase 1 → Phase 2 → Phase 3 (US1) → Phase 5 (US3) → Phase 6 (US4) → Phase 7
2. Phase 4 (US2) is validated, not implemented

---

## Notes

- **TDD**: T002 must FAIL before T003/T004. Constitution Principle III — non-negotiable.
- **No new npm deps**: All implementation uses React built-ins (useReducer, useContext, useEffect).
- **stopPropagation**: WishlistToggle's onClick must call `e.stopPropagation()` or card link navigation fires.
- **addedAt**: Store as `new Date().toISOString()` (string, not Date object — JSON-serialisable).
- **moveToCart field mapping**: `WishlistItem.price → CartItem.unitPrice`; quantity hardcoded to 1.
- **SSR safe**: WishlistContext reads localStorage only inside useEffect (client-side), not during render.
