# Contract: ReviewsContext

**Feature**: 007-product-reviews
**Date**: 2026-03-08

---

## Context Value Interface

```ts
interface ReviewsContextValue {
  // State
  store: ReviewStore                          // { [productId]: Review[] }

  // Derived helpers
  getReviews(productId: string): Review[]     // sorted newest first
  getAverage(productId: string): number       // 0 if no reviews
  getCount(productId: string): number

  // Actions
  submitReview(review: Omit<Review, 'reviewId' | 'createdAt'>): void
}
```

---

## Hook: useReviews

```ts
function useReviews(productId?: string): {
  reviews: Review[]          // empty array if productId undefined or no reviews
  averageRating: number      // 0 if no reviews
  totalCount: number
  submitReview: (data: ReviewInput) => void
  getAverage: (productId: string) => number
  getCount: (productId: string) => number
}
```

### ReviewInput (form submission payload)

```ts
interface ReviewInput {
  productId: string
  reviewerName: string   // 1–50 chars
  rating: number         // 1–5 integer
  body: string           // 1–500 chars
}
```

---

## Reducer Actions

```ts
type ReviewAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'CLEAR_PRODUCT'; payload: { productId: string } }
  | { type: 'CLEAR_ALL' }
```

---

## Pure Functions (exported for unit testing)

```ts
function reviewsReducer(
  store: ReviewStore,
  action: ReviewAction
): ReviewStore

function computeProductReviews(
  store: ReviewStore,
  productId: string
): { reviews: Review[]; averageRating: number; totalCount: number }

function validateReviewInput(input: ReviewInput): ValidationResult
```

### ValidationResult

```ts
interface ValidationResult {
  valid: boolean
  errors: {
    reviewerName?: string
    rating?: string
    body?: string
  }
}
```

---

## Storage Contract

- **Key**: `lumiere_reviews`
- **Format**: JSON — `{ [productId: string]: Review[] }`
- **Failure mode**: try/catch on read and write; silent failure (no crash)
- **Hydration**: On provider mount via `useEffect` (SSR-safe — no window access during render)
