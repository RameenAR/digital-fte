---
id: 004
title: product-detail-implement
stage: green
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 003-product-detail
branch: 003-product-detail
user: hp
command: /sp.implement
labels: [implementation, product-detail, cart, related-products, tdd]
links:
  spec: specs/003-product-detail/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - types/products.ts
  - types/cart.ts
  - data/featured-products-seed.ts
  - lib/products.ts
  - lib/related-products.ts
  - context/CartContext.tsx
  - hooks/useCart.ts
  - app/products/[slug]/page.tsx
  - app/products/[slug]/loading.tsx
  - app/products/[slug]/not-found.tsx
  - app/layout.tsx
  - components/product-detail/Breadcrumb.tsx
  - components/product-detail/ProductDetailHero.tsx
  - components/product-detail/ScentNotesPyramid.tsx
  - components/product-detail/ProductDescription.tsx
  - components/product-detail/AddToCart.tsx
  - components/product-detail/RelatedProducts.tsx
  - components/layout/CartBadge.tsx
  - tests/unit/cart.test.ts
  - tests/unit/related-products.test.ts
  - tests/e2e/product-detail.spec.ts
  - specs/003-product-detail/tasks.md
tests:
  - tests/unit/cart.test.ts (10 tests — GREEN)
  - tests/unit/related-products.test.ts (7 tests — GREEN)
  - tests/e2e/product-detail.spec.ts (16 E2E scenarios — written)
---

## Prompt

implement karo

## Response snapshot

Implemented all 31 tasks across 6 phases for the 003-product-detail feature:

**Phase 1 — Setup**: Added `description` field to `Product` type; added editorial descriptions to all 6 seed products; added `getProductBySlug()` to `lib/products.ts`; created `types/cart.ts` with `CartItem`, `Cart`, `CartAction`, `cartReducer` (pure, exported), `computeCart`, `MAX_QUANTITY=10`, `SESSION_STORAGE_KEY`; scaffolded `app/products/[slug]/page.tsx` with `generateStaticParams` + `generateMetadata` + `notFound()`; created `loading.tsx` skeleton.

**Phase 2 — Foundational (TDD)**: Wrote RED unit tests for `cartReducer` and `getRelatedProducts`; implemented `context/CartContext.tsx` (useReducer + sessionStorage sync); created `hooks/useCart.ts`; implemented `lib/related-products.ts` (tag-overlap scoring, exclude self, sort by score DESC then displayOrder ASC); wrapped `app/layout.tsx` with `<CartProvider>` + sticky header.

**Phase 3 — US1 View Details**: Created `Breadcrumb.tsx`, `ProductDetailHero.tsx` (next/image priority + PKR price + badge), `ScentNotesPyramid.tsx` (3 tiers with pill chips), `ProductDescription.tsx`; wired all into `page.tsx`; created `not-found.tsx`.

**Phase 4 — US2 Add to Cart**: Created `AddToCart.tsx` (quantity selector 1–10, 44px touch targets, 2s success state); created `CartBadge.tsx` (shopping bag icon + gold count badge, `'use client'`).

**Phase 5 — US3 Related Products**: Created `RelatedProducts.tsx` (reuses `ProductCard`, returns null when empty); all wired in `page.tsx`.

**Phase 6 — Polish**: Created `tests/e2e/product-detail.spec.ts` (16 scenarios); verified `loading.tsx` skeleton complete; confirmed all interactive elements have `focus-visible:ring-2 focus-visible:ring-brand-gold`; confirmed `generateMetadata` exports `title`, `description`, and full `openGraph` object.

**Unit test suite**: 52/52 GREEN across 5 test files.

## Outcome

- ✅ Impact: Full product detail page at /products/[slug] — hero image, name, PKR price, scent family badge, scent notes pyramid, editorial description, breadcrumb, add-to-cart with session persistence, related fragrances section, 404 handling
- 🧪 Tests: 52 unit tests GREEN; 16 E2E scenarios written for Playwright
- 📁 Files: 21 files created/modified across types, lib, context, hooks, components, app routes, and tests
- 🔁 Next prompts: /sp.specify for 004-checkout or 004-wishlist; or commit + merge 003-product-detail
- 🧠 Reflection: CartProvider in Server Component layout works cleanly via client boundary. Pure cartReducer exported from types/cart.ts enabled direct unit testing without Context mocking. page.tsx pre-wired all components during T005 scaffold, making T020/T023 trivially complete.

## Evaluation notes (flywheel)

- Failure modes observed: Context summary cut off mid-task (after T019 AddToCart.tsx); resumed correctly from session notes
- Graders run and results (PASS/FAIL): vitest run — 52/52 PASS
- Prompt variant (if applicable): sp.implement v1
- Next experiment: Pre-populate CartBadge in layout scaffold to avoid build error gap between T012 and T021
