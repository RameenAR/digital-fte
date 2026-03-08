# Quickstart: Product Reviews & Ratings (007-product-reviews)

**Date**: 2026-03-08
**Branch**: `007-product-reviews`

---

## Integration Scenarios for Testing

### Scenario 1: Submit a review on product detail

```
1. Navigate to /products/:slug (any product)
2. Scroll to the Reviews section
3. Fill in: Name = "Test User", Rating = 4 stars, Text = "Great scent!"
4. Click "Submit Review"
Expected:
  - Review appears at top of the list immediately
  - Average rating updates to include new review
  - Form is cleared/reset
  - No page reload occurs
```

### Scenario 2: Validation — empty fields

```
1. Navigate to /products/:slug
2. Click "Submit Review" without filling any fields
Expected:
  - Inline error shown on Name field: "Name is required (max 50 characters)"
  - Inline error shown on Rating: "Please select a rating (1–5 stars)"
  - Inline error shown on Text: "Review text is required (max 500 chars)"
  - No review saved to localStorage
```

### Scenario 3: Review persists after page reload

```
1. Submit a review on /products/:slug
2. Reload the page (F5 / Ctrl+R)
Expected:
  - Review still appears in the list
  - Average rating unchanged
```

### Scenario 4: Empty state — no reviews

```
1. Open a product detail page that has no reviews (fresh localStorage)
Expected:
  - "No reviews yet — be the first!" message shown
  - Review form is still visible above the empty state
  - Average rating section shows no stars / "No ratings yet"
```

### Scenario 5: Average rating on product cards

```
1. Submit 2 reviews on a product: rating 4 and rating 2
2. Navigate to /products (listing page)
Expected:
  - Product card shows average rating = 3.0 and "(2 reviews)"
```

### Scenario 6: Product card with no reviews

```
1. Ensure localStorage is empty (or open a product with 0 reviews)
2. Navigate to /products
Expected:
  - Product card does NOT show "0 stars" or "0 reviews"
  - No rating indicator shown (blank / "No reviews")
```

### Scenario 7: XSS prevention

```
1. Navigate to /products/:slug
2. Submit a review with body: <script>alert('xss')</script>
Expected:
  - No alert fires
  - The text "<script>alert('xss')</script>" is displayed literally in the review card
```

### Scenario 8: Reviewer name too long

```
1. Enter a name longer than 50 characters in the Name field
2. Click Submit
Expected:
  - Validation error: "Name is required (max 50 characters)"
  - Review not saved
```

### Scenario 9: Review body too long

```
1. Enter review text longer than 500 characters
2. Click Submit
Expected:
  - Validation error: "Review text is required (max 500 chars)"
  - Or character counter prevents typing beyond 500
```

### Scenario 10: Multiple products — reviews isolated

```
1. Submit a review on product A
2. Navigate to product B
Expected:
  - Product B's review section shows no reviews (empty state)
  - Product B's average rating is 0 / not shown
```

---

## Key Touchpoints Summary

| Component / File                         | Change Type | Reason                                         |
|------------------------------------------|-------------|------------------------------------------------|
| `types/reviews.ts`                       | NEW         | Review, ReviewStore, ReviewAction types         |
| `context/ReviewsContext.tsx`             | NEW         | Global reviews state with localStorage         |
| `hooks/useReviews.ts`                    | NEW         | getReviews, getAverage, submitReview API        |
| `components/reviews/StarRating.tsx`      | NEW         | Reusable interactive + display star component  |
| `components/reviews/ReviewForm.tsx`      | NEW         | Submit form with validation                    |
| `components/reviews/ReviewCard.tsx`      | NEW         | Single review display card                     |
| `components/reviews/ReviewsSection.tsx`  | NEW         | Full reviews section (form + list)             |
| `components/reviews/RatingBadge.tsx`     | NEW         | Compact average + count for product cards      |
| `app/layout.tsx`                         | MODIFY      | Add ReviewsProvider                            |
| `app/products/[slug]/page.tsx`           | MODIFY      | Add ReviewsSection below product info          |
| `components/homepage/ProductCard.tsx`    | MODIFY      | Add RatingBadge to card                        |
| `tests/unit/reviews.test.ts`             | NEW         | reviewsReducer + computeProductReviews + validateReviewInput unit tests |
| `tests/e2e/reviews.spec.ts`             | NEW         | 10 Playwright scenarios from quickstart        |
