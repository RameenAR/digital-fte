# API Contract: Products Data (v1 — Server Component Fetch)

**Feature**: 002-product-listing | **Date**: 2026-03-07

> **v1 Note**: No HTTP API route is created in this feature. Products are fetched
> directly in `app/products/page.tsx` (Server Component) via `lib/products.ts`.
> This contract documents the data shape and future GET /api/products endpoint
> for v2 (server-side filtering).

---

## v1: Server-Side Data Fetch

### `lib/products.ts` — `getAllProducts()`

```typescript
getAllProducts(): Promise<Product[]>
```

**Returns**: All active products sorted by `displayOrder` ASC.
**Source**: Prisma query (v2) or seed data array (v1).
**Called from**: `app/products/page.tsx` (Server Component — runs on server, no client JS).

---

## v2: GET /api/products (Future Reference)

**Endpoint**: `GET /api/products`
**Authentication**: None (public)

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| family | string (CSV) | — | Filter by scent families, e.g., `floral,woody` |
| minPrice | number | — | Minimum price (PKR, inclusive) |
| maxPrice | number | — | Maximum price (PKR, inclusive) |
| q | string | — | Search query (name + scent notes) |
| sort | string | `bestselling` | `bestselling\|price_asc\|price_desc\|newest` |
| page | number | `1` | Page number (1-indexed) |
| limit | number | `12` | Products per page (max 48) |

### Response — 200 OK

```json
{
  "products": [
    {
      "id": "prod-001",
      "name": "Midnight Rose",
      "price": 4500,
      "imageUrl": "/images/products/midnight-rose.webp",
      "slug": "midnight-rose",
      "category": "Floral",
      "scentNotes": {
        "top": ["Bergamot", "Black Pepper"],
        "heart": ["Damask Rose", "Jasmine"],
        "base": ["Oud", "Amber", "Musk"]
      },
      "scentTags": ["floral", "oriental", "woody", "musky"],
      "displayOrder": 1,
      "createdAt": "2026-03-01T00:00:00.000Z"
    }
  ],
  "total": 24,
  "page": 1,
  "totalPages": 2
}
```

### Response — 400 Bad Request

```json
{
  "error": "INVALID_PARAMS",
  "message": "minPrice must be a non-negative number."
}
```

### Behaviour

- Unknown `sort` values → default to `bestselling`
- Unknown `family` values → silently ignored
- `page` < 1 → treated as 1
- `limit` > 48 → capped at 48
- Only `isActive = true` products returned

### Idempotency
Fully idempotent — same query params always return same result set.
