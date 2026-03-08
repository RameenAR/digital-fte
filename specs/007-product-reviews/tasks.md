# Tasks: Product Reviews & Ratings (007-product-reviews)

**Input**: Design documents from `/specs/007-product-reviews/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅

**Tests**: TDD mandatory per Constitution Principle III — write RED tests before implementation.

**Organization**: Tasks grouped by user story. Foundational phase blocks all stories and must complete first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US3)
- All file paths are relative to repo root

---

## Phase 1: Setup (Shared Types)

**Purpose**: Create core TypeScript types and pure functions that all subsequent phases depend on.

- [x] T001 Create `types/reviews.ts` — define `Review` interface, `ReviewStore` type, `ReviewAction` union type, `REVIEWS_STORAGE_KEY` constant, `reviewsReducer` pure function, `computeProductReviews` helper, and `validateReviewInput` function

---

## Phase 2: Foundational (Context + Hook — Blocks All User Stories)

**Purpose**: Establish ReviewsContext with localStorage persistence and the useReviews hook. Wire ReviewsProvider into the root layout so all pages have access.

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete — all components consume `useReviews`.

- [x] T002 Write RED unit tests in `tests/unit/reviews.test.ts` — cover `reviewsReducer` (ADD_REVIEW new product, ADD_REVIEW existing product, preserves other products, CLEAR_PRODUCT, CLEAR_ALL), `computeProductReviews` (empty store, single review average, multi-review average + sort order), `validateReviewInput` (all empty, name too long, body too long, rating out of range, valid input) — confirm all tests FAIL before implementation
- [x] T003 Create `context/ReviewsContext.tsx` — ReviewsProvider using useReducer + reviewsReducer; hydrates from localStorage on mount (try/catch for private browsing); persists store to localStorage on every state change via useEffect; exports ReviewsContext
- [x] T004 Create `hooks/useReviews.ts` — exports `useReviews(productId?)` returning `{ reviews, averageRating, totalCount, submitReview, getAverage, getCount }`; `submitReview` calls `validateReviewInput`, generates reviewId via `crypto.randomUUID()`, dispatches ADD_REVIEW — run unit tests and confirm all GREEN
- [x] T005 Modify `app/layout.tsx` — import ReviewsProvider; wrap WishlistProvider children in ReviewsProvider; no visual changes

**Checkpoint**: All unit tests GREEN. ReviewsProvider mounted. useReviews accessible from any client component.

---

## Phase 3: User Story 1 — Submit a Review (Priority: P1) 🎯 MVP

**Goal**: Review form on product detail page accepts name, star rating, and text; validates; saves to localStorage; displays immediately on submit.

**Independent Test**: Navigate to `/products/:slug`, fill in the review form (name + rating + text), click Submit — review appears at top of list, average rating updates, form resets. Navigate away and back — review persists.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `components/reviews/StarRating.tsx` — dual-mode component; props: `{ value: number, onChange?: (n: number) => void, readOnly?: boolean, size?: 'sm' | 'md' }`; renders 5 stars as filled/outline SVGs; interactive mode calls onChange on click; aria-label per star ("Rate N stars"); min 44×44px touch targets in interactive mode
- [x] T007 [P] [US1] Create `components/reviews/ReviewForm.tsx` — client component; controlled form with fields: reviewerName (text input, max 50), rating (StarRating interactive), body (textarea, max 500 with character counter); inline validation errors shown after submit attempt; on valid submit calls `submitReview` then resets form; uses brand Tailwind classes
- [x] T008 [US1] Create `components/reviews/ReviewCard.tsx` — displays: reviewerName, StarRating (readOnly), formatted date (e.g. "8 Mar 2026"), body text; body rendered as plain text (no dangerouslySetInnerHTML); uses brand-cream bg, font-serif for name
- [x] T009 [US1] Create `components/reviews/ReviewsSection.tsx` — client component; props: `{ productId: string }`; reads `useReviews(productId)`; renders ReviewForm above list of ReviewCards sorted newest first; shows empty state "No reviews yet — be the first!" when `totalCount === 0`; shows average + count heading when reviews exist
- [x] T010 [US1] Modify `app/products/[slug]/page.tsx` — import ReviewsSection; add `<ReviewsSection productId={product.id} />` below `<AddToCart>` in the right column

**Checkpoint**: US1 complete — review form submits, validates, persists, and displays on product detail page.

---

## Phase 4: User Story 2 — View Reviews & Average Rating on Product Detail (Priority: P2)

**Goal**: Product detail page shows average star rating, total count, and sorted review list with full review cards.

**Independent Test**: Verify average rating heading displays correctly (e.g. "4.5 / 5 — 2 reviews"), reviews are newest-first, each card shows name + stars + date + text.

**Implementation**: US2 is delivered entirely by `ReviewsSection.tsx` (T009) and `ReviewCard.tsx` (T008) from Phase 3. No additional files needed.

**Note**: The `computeProductReviews` sort (T001) and ReviewsSection (T009) together satisfy all US2 acceptance scenarios. Verify by running quickstart.md Scenarios 4 and 7.

**Checkpoint**: US2 complete — all review display acceptance scenarios pass.

---

## Phase 5: User Story 3 — Average Rating on Product Cards (Priority: P3)

**Goal**: Product cards on `/products` and homepage show average rating badge (hidden when no reviews).

**Independent Test**: Submit reviews on a product, navigate to `/products` — card shows correct average and count. A product with no reviews shows no rating indicator.

### Implementation for User Story 3

- [x] T011 [P] [US3] Create `components/reviews/RatingBadge.tsx` — client component; props: `{ productId: string, className? }`; reads `useReviews(productId)` for `averageRating` and `totalCount`; renders average (1 decimal) + star SVG + count (e.g. "4.5 ★ (3)"); returns `null` when `totalCount === 0`; compact sizing; brand-gold star color
- [x] T012 [US3] Modify `components/homepage/ProductCard.tsx` — import RatingBadge; add `<RatingBadge productId={product.id} />` inside the card image area (`absolute bottom-2 left-2 z-10`) with semi-transparent bg; card link and WishlistToggle remain unchanged

**Checkpoint**: US3 complete — all 3 user stories functional end-to-end.

---

## Phase 6: Polish & Validation

**Purpose**: E2E test coverage and full test suite validation.

- [x] T013 Create `tests/e2e/reviews.spec.ts` — implement 10 Playwright scenarios from quickstart.md: (1) submit review fills and resets form, (2) validation empty fields, (3) persistence after reload, (4) empty state on fresh product, (5) average rating on product cards, (6) card with no reviews shows no rating, (7) XSS prevention, (8) reviewer name too long, (9) review body too long, (10) multiple products reviews are isolated
- [x] T014 Run full test suite `npx vitest run tests/unit/` — confirm all unit tests GREEN (≥ 92 existing + new reviews tests); verify no TypeScript errors `npx tsc --noEmit`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (types must exist before context/hook)
- **Phase 3 (US1)**: Depends on Phase 2 complete — components need useReviews
- **Phase 4 (US2)**: Covered by Phase 3 — no additional tasks (verify manually)
- **Phase 5 (US3)**: Depends on Phase 2 complete — RatingBadge needs useReviews
- **Phase 6 (Polish)**: Depends on all phases complete

### Parallel Opportunities Within Phases

```
Phase 2:  T002 (tests) → T003 (context) → T004 (hook)  [sequential]
           T005 (layout provider) can run after T003

Phase 3:  T006 [P] StarRating — no dependencies within phase
           T007 [P] ReviewForm — depends on T006 (StarRating)
           T008 [P] ReviewCard — depends on T006 (StarRating)
           T009 ReviewsSection — depends on T007 + T008
           T010 page.tsx — depends on T009

Phase 5:  T011 [P] RatingBadge — can start once Phase 2 complete
           T012 depends on T011
```

---

## Implementation Strategy

### MVP (User Story 1 only)
1. T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
2. **STOP**: Review form fully functional on product detail page

### Full Feature (all stories)
1. Phase 1 → Phase 2 → Phase 3 (US1) → Phase 5 (US3) → Phase 6
2. Phase 4 (US2) is validated, not implemented separately

---

## Notes

- **TDD**: T002 must FAIL before T003/T004. Constitution Principle III — non-negotiable.
- **No new npm deps**: All implementation uses React built-ins + `crypto.randomUUID()`.
- **SSR safe**: ReviewsContext reads localStorage only inside useEffect (client-side), not during render.
- **Plain text only**: ReviewCard renders body as JSX text node — never `dangerouslySetInnerHTML`.
- **StarRating dual mode**: Single component used for both form input (interactive) and card display (readOnly).
- **RatingBadge returns null**: When totalCount === 0, component returns null — no "0 stars" shown.
- **reviewId**: Use `crypto.randomUUID()` — no external library needed.
