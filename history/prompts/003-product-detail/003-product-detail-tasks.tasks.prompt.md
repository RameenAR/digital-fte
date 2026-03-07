---
id: 003
title: Product Detail Page Tasks Generation
stage: tasks
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 003-product-detail
branch: 003-product-detail
user: hp
command: /sp.tasks
labels: ["tasks","product-detail","cart","react-context","related-products","tdd","static-generation"]
links:
  spec: specs/003-product-detail/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-product-detail/tasks.md
tests:
  - null
---

## Prompt

tasks banao

## Response snapshot

Generated tasks.md for 003-product-detail with 31 tasks across 6 phases:

**Phase 1 Setup (T001–T006)**: Add description field to Product type, update seed data (6 descriptions), getProductBySlug(), types/cart.ts with CartItem/Cart/CartAction/cartReducer, app/products/[slug]/page.tsx shell, loading.tsx.

**Phase 2 Foundational (T007–T012)**: TDD RED — cart.test.ts (add new, accumulate, cap at 10, clear, totals) + related-products.test.ts (overlap scoring, exclude self, limit, no matches). Then GREEN: CartContext.tsx (useReducer + sessionStorage), useCart.ts hook, getRelatedProducts() pure fn, CartProvider wired to layout.tsx.

**Phase 3 US1 (T013–T018)**: Breadcrumb.tsx [P], ProductDetailHero.tsx [P], ScentNotesPyramid.tsx [P], ProductDescription.tsx [P], wire page.tsx (generateStaticParams + metadata), not-found.tsx.

**Phase 4 US2 (T019–T021)**: AddToCart.tsx (quantity 1-10, 2s success state, useCart), wire into page.tsx, CartBadge.tsx in layout header.

**Phase 5 US3 (T022–T023)**: RelatedProducts.tsx (reuses ProductCard, null when empty), wire into page.tsx (getAllProducts server-side + getRelatedProducts).

**Phase 6 Polish (T024–T027)**: E2E test (product-detail.spec.ts), loading.tsx full skeleton, keyboard nav audit, SEO OG tags verification.

## Outcome

- ✅ Impact: 31 actionable tasks, immediately executable for /sp.implement.
- 🧪 Tests: TDD approach — T007/T008 RED before T009/T011 GREEN; E2E in T024.
- 📁 Files: specs/003-product-detail/tasks.md
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: cartReducer exported from types/cart.ts for direct unit testability. CartProvider needs 'use client' boundary before layout.tsx (Server Component). generateStaticParams covers all 6 slugs at build time for instant CDN delivery.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Format validation — all 31 tasks follow [checkbox][ID][P?][USn?][description+path] format
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): /sp.implement to execute all 31 tasks
