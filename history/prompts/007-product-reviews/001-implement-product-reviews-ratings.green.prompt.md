---
id: 001
title: Implement Product Reviews & Ratings
stage: green
date: 2026-03-08
surface: agent
model: claude-sonnet-4-6
feature: 007-product-reviews
branch: 007-product-reviews
user: hp
command: sp.implement
labels: ["reviews","ratings","localStorage","context","tdd","vitest"]
links:
  spec: specs/007-product-reviews/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - types/reviews.ts
  - context/ReviewsContext.tsx
  - hooks/useReviews.ts
  - components/reviews/StarRating.tsx
  - components/reviews/ReviewForm.tsx
  - components/reviews/ReviewCard.tsx
  - components/reviews/ReviewsSection.tsx
  - components/reviews/RatingBadge.tsx
  - app/layout.tsx
  - app/products/[slug]/page.tsx
  - components/homepage/ProductCard.tsx
  - tests/unit/reviews.test.ts
  - tests/e2e/reviews.spec.ts
tests:
  - tests/unit/reviews.test.ts (14 tests — all GREEN)
  - tests/unit/ full suite (106 tests — all GREEN)
---

## Prompt

mujhe sab kar kay du constitution, specify, plan, task, implement

## Response snapshot

Full SDD workflow executed for 007-product-reviews (Product Reviews & Ratings):
1. Constitution — verified v1.0.0, no changes needed
2. Spec — created specs/007-product-reviews/spec.md with 3 user stories + edge cases + FR + SC
3. Plan — created research.md, data-model.md, contracts/reviews-context.md, quickstart.md, plan.md
4. Tasks — created tasks.md with 14 tasks across 6 phases
5. Implement — all 14 tasks completed; 106/106 unit tests GREEN

## Outcome

- ✅ Impact: Full product reviews feature implemented — submit form, star rating, review list, average badge on cards, localStorage persistence
- 🧪 Tests: 106/106 unit tests GREEN (14 new reviews tests + 92 existing)
- 📁 Files: 13 files created/modified
- 🔁 Next prompts: /sp.git.commit_pr to commit and open PR
- 🧠 Reflection: Pattern reuse from cart/wishlist (useReducer + localStorage context) made implementation fast and consistent

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): vitest unit suite PASS (106/106)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add review count to product detail page title metadata
