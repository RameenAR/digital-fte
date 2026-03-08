---
id: "002"
title: wishlist-plan-created
stage: plan
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 006-wishlist
branch: 006-wishlist
user: hp
command: /sp.plan
labels: ["wishlist", "plan", "localStorage", "WishlistContext", "useWishlist"]
links:
  spec: specs/006-wishlist/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-wishlist/plan.md
  - specs/006-wishlist/research.md
  - specs/006-wishlist/data-model.md
  - specs/006-wishlist/quickstart.md
  - specs/006-wishlist/contracts/wishlist-context.md
tests:
  - null
---

## Prompt

Aage plan banao → tasks banao → implement karo?

## Response snapshot

Created full plan for 006-wishlist feature. Key decisions:

1. localStorage (not sessionStorage) — wishlist persists across sessions
2. Mirror CartContext pattern — WishlistContext + useWishlist hook
3. Heart button inside Link with stopPropagation on ProductCard
4. WishlistItem as data snapshot (productId, slug, name, imageUrl, price, addedAt)
5. moveToCart calls useCart.addToCart then removeFromWishlist
6. WishlistBadge alongside CartBadge in app/layout.tsx nav
7. SSR hydration: empty array initialised server-side, localStorage read on client mount

**Files to create (8 new)**: types/wishlist.ts, context/WishlistContext.tsx, hooks/useWishlist.ts, components/layout/WishlistBadge.tsx, components/wishlist/WishlistToggle.tsx, components/wishlist/WishlistPage.tsx, app/wishlist/page.tsx, tests/unit/wishlist.test.ts

**Files to modify (3)**: app/layout.tsx, components/homepage/ProductCard.tsx, app/products/[slug]/page.tsx

**13-task implementation order**: types → RED tests → Context → Hook → UI components → route → integration → E2E

Constitution check: all 6 principles PASS. No violations.

## Outcome

- ✅ Impact: Full implementation plan ready — 8 new files, 3 modified, 13 tasks, no new dependencies
- 🧪 Tests: TDD mandatory — wishlist.test.ts RED before implementation
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/wishlist-context.md
- 🔁 Next prompts: /sp.tasks → /sp.implement
- 🧠 Reflection: moveToCart integration is clean — both contexts available in layout, no circular deps

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check PASS (6/6 principles)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
