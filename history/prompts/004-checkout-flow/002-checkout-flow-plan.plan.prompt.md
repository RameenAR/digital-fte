---
id: 002
title: checkout-flow-plan
stage: plan
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 004-checkout-flow
branch: 004-checkout-flow
user: hp
command: /sp.plan
labels: [checkout, session-state, form-validation, react-context, step-guard]
links:
  spec: specs/004-checkout-flow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-checkout-flow/plan.md
  - specs/004-checkout-flow/research.md
  - specs/004-checkout-flow/data-model.md
  - specs/004-checkout-flow/quickstart.md
  - specs/004-checkout-flow/contracts/checkout-state.md
tests:
  - n/a (plan stage)
---

## Prompt

plan banao

## Response snapshot

Generated full implementation plan for 004-checkout-flow.

**Research decisions**:
- State: React Context + sessionStorage (mirrors CartContext pattern) — scoped to app/checkout/layout.tsx
- Validation: Pure functions in lib/checkout.ts (no library); phone regex `^(92)?0?3[0-9]{9}$` after stripping non-digits
- Step guards: `useEffect` + `router.replace()` + render `null` during precondition check
- Order number: `LP-${year}-${String(Date.now() % 99999).padStart(5, '0')}`
- Checkout layout: `app/checkout/layout.tsx` with stripped-down header (no main nav); `CheckoutProgress` uses `usePathname()`

**Architecture**:
- 4 routes: /checkout/cart, /checkout/info, /checkout/review, /checkout/confirmation
- 7 components in components/checkout/
- 2 pure utility modules (lib/checkout.ts, types/checkout.ts)
- CheckoutContext (scoped) + CartContext (global, reused)
- New REMOVE_ITEM CartAction added to types/cart.ts + cartReducer
- Order placement: placeOrder() → SET_COMPLETED_ORDER + CLEAR_CART + router.push('/checkout/confirmation')

**Constitution**: All 6 principles PASS — no violations.

**ADR candidate**: CheckoutContext scoped to checkout layout (not global) — architectural decision worth documenting.

## Outcome

- ✅ Impact: Complete architectural plan for session-only 4-step checkout
- 🧪 Tests: 2 unit test files + 1 Playwright E2E spec planned
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/checkout-state.md
- 🔁 Next prompts: /sp.tasks
- 🧠 Reflection: REMOVE_ITEM CartAction is a necessary extension to CartContext — cleanly handled as a targeted addition to types/cart.ts rather than a new context.

## Evaluation notes (flywheel)

- Failure modes observed: Research agent delayed — proceeded with existing knowledge; agent result confirmed all decisions
- Graders run and results (PASS/FAIL): Constitution check — 6/6 PASS
- Prompt variant (if applicable): sp.plan v1
- Next experiment: n/a
