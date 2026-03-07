---
id: 003
title: checkout-flow-tasks
stage: tasks
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 004-checkout-flow
branch: 004-checkout-flow
user: hp
command: /sp.tasks
labels: [checkout, tasks, tdd, cart-review, customer-form, order-confirmation]
links:
  spec: specs/004-checkout-flow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-checkout-flow/tasks.md
tests:
  - n/a (tasks stage)
---

## Prompt

tasks banao

## Response snapshot

Generated tasks.md for 004-checkout-flow with 22 tasks across 6 phases:

- **Phase 1 — Setup (3 tasks)**: T001 REMOVE_ITEM CartAction, T002 types/checkout.ts, T003 app/checkout/layout.tsx shell
- **Phase 2 — Foundational (6 tasks)**: T004-T005 TDD RED unit tests (checkout-validation, order-number), T006 lib/checkout.ts (GREEN), T007 CheckoutContext.tsx, T008 CheckoutProgress.tsx, T009 layout.tsx wired
- **Phase 3 — US1 Cart Review (4 tasks)**: T010 EmptyCartMessage, T011 CartLineItem, T012 CartReview, T013 /checkout/cart page
- **Phase 4 — US2 Customer Info (2 tasks)**: T014 CustomerInfoForm, T015 /checkout/info page
- **Phase 5 — US3 Order Review+Confirm (4 tasks)**: T016 OrderReview, T017 OrderConfirmation, T018 /checkout/review page, T019 /checkout/confirmation page
- **Phase 6 — Polish (3 tasks)**: T020 E2E tests (7 scenarios), T021 keyboard audit, T022 PKR formatting audit

## Outcome

- ✅ Impact: 22 actionable tasks — each with exact file path and implementation detail
- 🧪 Tests: T004+T005 (RED unit tests before T006 impl), T020 (7 Playwright scenarios)
- 📁 Files: specs/004-checkout-flow/tasks.md
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: placeOrder() needs access to both CheckoutContext and CartContext — noted in tasks.md that component must call clearCart() before/after placeOrder()

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): format validation — all 22 tasks follow [checkbox][ID][P?][Story?][description+filepath] format
- Prompt variant (if applicable): sp.tasks v1
- Next experiment: n/a
