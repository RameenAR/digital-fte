# API Contract: Quiz Results / Recommendations

**Endpoint**: `POST /api/quiz/results`
**Feature**: 001-homepage | **Date**: 2026-03-05

---

## Request

**Method**: POST
**Content-Type**: `application/json`

### Body

```json
{
  "answers": [
    { "questionId": "q1", "selectedTags": ["fresh", "citrus"] },
    { "questionId": "q2", "selectedTags": ["floral"] },
    { "questionId": "q3", "selectedTags": ["woody", "oriental"] },
    { "questionId": "q4", "selectedTags": ["musky"] }
  ]
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| answers | QuizAnswer[] | yes | Length 4–5; each entry has questionId + selectedTags |
| answers[].questionId | string | yes | Must match a known question id (q1–q4) |
| answers[].selectedTags | string[] | yes | Min 1 tag per answer; tags from allowed taxonomy |

---

## Responses

### 200 OK — Recommendations found

```json
{
  "products": [
    {
      "id": "prod-001",
      "name": "Midnight Rose",
      "price": 4500.00,
      "imageUrl": "https://example.com/images/midnight-rose.webp",
      "slug": "midnight-rose",
      "scentNotes": {
        "top": ["Bergamot", "Lemon"],
        "heart": ["Rose", "Jasmine"],
        "base": ["Oud", "Amber"]
      }
    }
  ],
  "fallback": false
}
```

### 200 OK — No match found (fallback to bestsellers)

```json
{
  "products": [
    { "...": "top 3 by displayOrder" }
  ],
  "fallback": true
}
```

`fallback: true` signals the UI to display "Our top picks for you" label
instead of "Recommended for you".

### 400 Bad Request — Malformed input

```json
{
  "error": "INVALID_INPUT",
  "message": "answers must contain 4–5 items with valid questionIds and tags."
}
```

### 500 Internal Server Error

```json
{
  "error": "SERVER_ERROR",
  "message": "Something went wrong. Please try again."
}
```

---

## Recommendation Algorithm

```
1. Collect all selectedTags from all answers → collectedTags[]
2. For each active FeaturedProduct:
   score = |collectedTags ∩ product.scentTags|
3. Sort products by score DESC, then displayOrder ASC (tie-break)
4. Take top 2–3 products with score > 0
5. If no product has score > 0:
   → return top 3 products by displayOrder, fallback = true
6. Return products[], fallback = false
```

## Behaviour

- Only `isActive = true` products are considered.
- Response always contains 2–3 products (never fewer, unless fewer than 3 products
  exist in the catalogue — in that case return all active products).
- Results are deterministic for the same input (no randomisation).

## Security

- No authentication required (public endpoint).
- Input tags are validated against the allowed taxonomy before scoring.
  Unknown tags are silently ignored (do not cause errors).
- Rate limiting: 10 requests per IP per minute.

## Idempotency

Fully idempotent — same answers always return same products.
