# Data Model: Perfume E-Commerce Homepage

**Feature**: 001-homepage | **Date**: 2026-03-05

---

## Entities

### 1. FeaturedProduct

Represents a curated perfume displayed on the homepage featured collections section.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | string (uuid) | PK, required | Stable identifier; used in product detail URL |
| name | string | required, max 100 chars | Display name (e.g., "Midnight Rose") |
| price | decimal(10,2) | required, > 0 | In PKR (or configured currency) |
| imageUrl | string | required, valid URL | Primary product image; served via next/image |
| scentNotes | ScentNotes | required | Top, heart, base note labels |
| displayOrder | integer | required, ≥ 1 | Ascending = shown first; controls sort |
| slug | string | required, unique | URL-safe identifier for product detail link |
| isActive | boolean | default: true | False = excluded from homepage |

**ScentNotes (embedded object)**:
| Field | Type | Notes |
|-------|------|-------|
| top | string[] | e.g., ["Bergamot", "Lemon"] |
| heart | string[] | e.g., ["Rose", "Jasmine"] |
| base | string[] | e.g., ["Oud", "Amber", "Musk"] |

**Relationships**: Referenced by QuizResult (matched product ids).
**Validation**: `price` must be positive. `imageUrl` must be a valid HTTPS URL.
`displayOrder` must be unique per active product.

---

### 2. QuizQuestion

A single step in the Scent Discovery Quiz. Stored as static data (no DB table needed).

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | string | required, unique | e.g., "q1", "q2" |
| questionText | string | required, max 200 chars | Displayed to user |
| options | QuizOption[] | required, length 3–4 | Selectable answers |
| order | integer | required, 1–4 | Question sequence |

**QuizOption (embedded)**:
| Field | Type | Notes |
|-------|------|-------|
| id | string | e.g., "q1-a", "q1-b" |
| label | string | Display text (e.g., "Fresh & Clean") |
| tags | string[] | Scent preference tags (e.g., ["fresh", "citrus"]) |

**State transitions**: `idle → step-1 → step-2 → step-3 → step-4 → results → idle`
**Validation**: Each question must have 3–4 options. Each option must have ≥ 1 tag.

---

### 3. QuizResult

The output computed from a completed quiz. Transient — not persisted to DB.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| products | FeaturedProduct[] | length 2–3 | Recommended products |
| fallback | boolean | required | True if tag-matching scored 0 for all products |

**Computation**: Tag-intersection scoring per product. `score = collectectedTags ∩ productTags`.
Products sorted by score descending; top 2–3 returned. If all scores = 0,
`fallback = true` and top 3 by `displayOrder` are returned.

---

### 4. NewsletterSubscriber

Stores email addresses of visitors who sign up via the homepage newsletter form.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | string (uuid) | PK, auto-generated | |
| email | string | required, unique, valid email | Lowercased before storage |
| createdAt | DateTime | auto, UTC | Sign-up timestamp |
| consentGiven | boolean | required, must be true | GDPR/PDPA compliance flag |

**Validation rules**:
- `email` format: RFC 5322 compliant (server-side regex minimum)
- `email` uniqueness: duplicate → 409 Conflict
- `consentGiven` must equal `true`; reject if false or missing

**Prisma schema**:
```prisma
model NewsletterSubscriber {
  id           String   @id @default(uuid())
  email        String   @unique
  createdAt    DateTime @default(now())
  consentGiven Boolean
}
```

---

## Entity Relationships

```
FeaturedProduct ──┐
                  ├── QuizResult.products[] (runtime reference, no FK)
FeaturedProduct ──┘

QuizQuestion → QuizOption[] (embedded, static data)
QuizOption.tags ∩ FeaturedProduct.scentTags → QuizResult (computed)

NewsletterSubscriber (independent — no relations)
```

---

## Tag Taxonomy (Scent Preference Tags)

Used to link quiz answers to product recommendations:

| Tag | Description |
|-----|-------------|
| fresh | Light, clean, aquatic notes |
| citrus | Lemon, bergamot, orange |
| floral | Rose, jasmine, peony |
| woody | Sandalwood, cedar, vetiver |
| oriental | Oud, amber, incense |
| gourmand | Vanilla, chocolate, caramel |
| green | Grass, herbs, moss |
| musky | Clean musk, skin-like |

Products carry a `scentTags: string[]` field (derived from `scentNotes`) for
quiz matching. This field is populated at seed/import time.
