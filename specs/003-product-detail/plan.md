# Implementation Plan: Product Detail Page

**Branch**: `003-product-detail` | **Date**: 2026-03-07 | **Spec**: specs/003-product-detail/spec.md
**Input**: Feature specification from `/specs/003-product-detail/spec.md`

## Summary

Build the `/products/[slug]` dynamic route — a full product detail page showing
hero image, name, price, scent family badge, scent notes pyramid, editorial
description, Add to Cart CTA, and a "You Might Also Like" related products
section. Cart state is managed client-side via React Context + sessionStorage
(no auth, no API routes). The page reuses `ProductCard` for related items and
extends the existing `Product` type with a `description` field.

## Technical Context

**Language/Version**: TypeScript 5.x · Node.js 20 LTS
**Primary Dependencies**: Next.js 14 (App Router) · React 18 · Tailwind CSS 3 · Prisma 5
**Storage**: Seed data `data/featured-products-seed.ts` (v1); PostgreSQL via Prisma (v2)
**Testing**: Vitest (unit — cart logic, related products algorithm) · Playwright (E2E — full PDP flow)
**Target Platform**: Web — Vercel (SSR for initial load, client-side cart)
**Project Type**: Web application — extends existing Next.js fullstack project
**Performance Goals**: LCP ≤ 2s · Add-to-Cart feedback ≤ 300ms · Lighthouse Perf ≥ 85
**Constraints**: WCAG 2.1 AA · Mobile-first 320px–1920px · Session-only cart (no auth required)
**Scale/Scope**: Single dynamic route (`/products/[slug]`) · 0 new API routes · 6 new components · 1 new Context

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. User-First | Full-width hero image on mobile; ATF: name + price + Add to Cart on desktop; 44px touch targets on cart controls | ✅ PASS |
| II. Component-Driven | ProductDetailHero, ScentNotesPyramid, ProductDescription, Breadcrumb, RelatedProducts — all isolated; CartContext separate from UI | ✅ PASS |
| III. Test-First | Unit tests for cart operations (add, accumulate, cap) and related products algorithm before implementation | ✅ PASS |
| IV. Secure by Default | Cart state client-side only (no sensitive data); no new secrets; slug from URL sanitized via `notFound()` | ✅ PASS |
| V. Performance Budget | `next/image` for hero (WebP/AVIF, lazy below fold); sessionStorage only on client; no blocking scripts | ✅ PASS |
| VI. Simplicity | React Context + sessionStorage (no Zustand/Redux); reuse `ProductCard` for related; 0 new API routes | ✅ PASS |

**All gates PASS — Phase 0 research may proceed.**

## Project Structure

### Documentation (this feature)

```text
specs/003-product-detail/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── cart-state.md    # Cart state contract (client-side)
├── tasks.md             # Phase 2 output (/sp.tasks)
└── checklists/
    └── requirements.md
```

### Source Code

```text
# Extends existing Next.js App Router project

app/
└── products/
    └── [slug]/
        ├── page.tsx            # /products/[slug] — SSR: fetch by slug, notFound() if missing
        └── loading.tsx         # Skeleton while page loads

components/
└── product-detail/
    ├── ProductDetailHero.tsx   # Hero image, name, price, scent family badge
    ├── ScentNotesPyramid.tsx   # Top / Heart / Base notes tiers
    ├── ProductDescription.tsx  # Editorial description text block
    ├── Breadcrumb.tsx          # Home → All Fragrances → [Product Name]
    ├── AddToCart.tsx           # Quantity selector + Add to Cart button + success state
    └── RelatedProducts.tsx     # "You Might Also Like" section — reuses ProductCard

context/
└── CartContext.tsx             # React Context: cart state + add/update/clear + sessionStorage sync

hooks/
└── useCart.ts                  # Consumer hook: exposes cart items, count, total, addToCart

lib/
└── related-products.ts         # Pure fn: getRelatedProducts(current, all, limit?) → Product[]

types/
└── cart.ts                     # CartItem, Cart interfaces

data/
└── featured-products-seed.ts   # Updated: add `description` field to all 6 products

tests/
├── unit/
│   ├── cart.test.ts             # Unit: add, accumulate, cap at 10, session restore
│   └── related-products.test.ts # Unit: tag overlap, exclude self, limit 3, no matches
└── e2e/
    └── product-detail.spec.ts   # E2E: product loads, add to cart, related products, 404
```

**Structure Decision**: Extends single Next.js project. New components under
`components/product-detail/` (separate namespace from homepage/products). Cart
Context lives in `context/` (new directory) to separate global state from UI.
No new API routes — all data fetched server-side or from client sessionStorage.

## Complexity Tracking

> No constitution violations.

## Key Design Decisions

### 1. Cart State: React Context + sessionStorage
Cart state managed in `CartContext.tsx` using `useReducer`. On mount, hydrates
from `sessionStorage`. On every change, syncs to `sessionStorage`. No external
library (Zustand, Redux) needed — keeps bundle lean (Principle VI). Session-only
scope matches spec FR-008: persists across page navigations, resets on browser
close (no auth needed for v1).

### 2. Extend Product Type with `description`
Add `description: string` field to the `Product` interface (extends existing
`FeaturedProduct`). Update all 6 seed products with editorial descriptions
(50–150 words each). `getAllProducts()` and `getProductBySlug()` return full
`ProductWithDescription` — no schema migration needed in v1.

### 3. Reuse `ProductCard` for Related Products
`RelatedProducts` component maps related `Product[]` to `<ProductCard>` — zero
duplication. `getRelatedProducts()` in `lib/related-products.ts` is a pure
function that scores by scentTag overlap, excludes self, and limits results.

### 4. `notFound()` for Invalid Slugs
`app/products/[slug]/page.tsx` calls `getProductBySlug(slug)`. If result is
`null`, calls Next.js `notFound()` — renders the nearest `not-found.tsx` or
App Router's built-in 404 page. No custom error component needed in v1.

### 5. Add to Cart: Optimistic UI, 2s Success State
`AddToCart` component uses local `useState` for `added` flag. On click:
(1) dispatch to CartContext, (2) set `added = true`, (3) after 2000ms reset.
No server roundtrip — instant, optimistic response (Principle V).

## API Routes

No new HTTP API routes in this feature. All interactions are:
- **Product data**: fetched server-side in `page.tsx` via `lib/products.ts`
- **Cart**: managed client-side in `CartContext` + `sessionStorage`
