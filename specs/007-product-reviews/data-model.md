# Data Model: Product Reviews & Ratings (007-product-reviews)

**Date**: 2026-03-08

---

## Entities

### Review

A single user-submitted review for one product.

| Field          | Type     | Constraints                       |
|----------------|----------|-----------------------------------|
| `reviewId`     | string   | UUID — unique, generated on submit |
| `productId`    | string   | Non-empty — matches product ID    |
| `reviewerName` | string   | 1–50 characters, trimmed          |
| `rating`       | number   | Integer 1–5 inclusive             |
| `body`         | string   | 1–500 characters, trimmed         |
| `createdAt`    | string   | ISO 8601 date string (JSON-safe)  |

### ReviewStore (localStorage shape)

All reviews stored under a single localStorage key `lumiere_reviews`.

```ts
type ReviewStore = {
  [productId: string]: Review[]
}
```

### Derived: ProductReviews

Computed from ReviewStore on every read.

| Field           | Type     | Derivation                          |
|-----------------|----------|-------------------------------------|
| `productId`     | string   | Key from ReviewStore                |
| `reviews`       | Review[] | Sorted by `createdAt` DESC          |
| `averageRating` | number   | Sum of ratings / count, 1 decimal   |
| `totalCount`    | number   | Length of reviews array             |

---

## State Transitions

```
Empty product (no reviews)
  └─ User submits valid review
       └─ Review added → averageRating = rating, totalCount = 1

Product with reviews
  └─ User submits valid review
       └─ Review prepended → averageRating recalculated, totalCount + 1
```

---

## Validation Rules

| Field          | Rule                                        | Error Message                              |
|----------------|---------------------------------------------|--------------------------------------------|
| `reviewerName` | Required, 1–50 chars after trim             | "Name is required (max 50 characters)"     |
| `rating`       | Required, integer 1–5                       | "Please select a rating (1–5 stars)"       |
| `body`         | Required, 1–500 chars after trim            | "Review text is required (max 500 chars)"  |

---

## localStorage Key

```
REVIEWS_STORAGE_KEY = 'lumiere_reviews'
```

Shape stored:
```json
{
  "prod-001": [
    {
      "reviewId": "uuid-...",
      "productId": "prod-001",
      "reviewerName": "Sarah K.",
      "rating": 5,
      "body": "Absolutely stunning fragrance...",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```
