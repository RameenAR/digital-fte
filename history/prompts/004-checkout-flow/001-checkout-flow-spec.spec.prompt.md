---
id: 001
title: checkout-flow-spec
stage: spec
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 004-checkout-flow
branch: 004-checkout-flow
user: hp
command: /sp.specify
labels: [checkout, cart-review, customer-info, order-confirmation, session-only]
links:
  spec: specs/004-checkout-flow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-checkout-flow/spec.md
  - specs/004-checkout-flow/checklists/requirements.md
tests:
  - n/a (spec stage)
---

## Prompt

checkout flow ka spec banao

(Feature description: Checkout flow — cart review page showing items with quantities and subtotal, customer information form (name, email, phone, shipping address), order summary with total price and PKR currency, place order button, order confirmation page with order number. Session-only cart (no payment gateway, no auth required).)

## Response snapshot

Created spec for 004-checkout-flow with 3 user stories:

- **US1 (P1) — Review Cart**: `/checkout/cart` showing items, qty controls (1–10), remove, PKR subtotals and grand total. Empty cart shows prompt to browse.
- **US2 (P2) — Customer Info Form**: `/checkout/info` collecting name, email (validated), phone (≥10 digits), street, city, province (Pakistan dropdown), postal code. Inline validation, session retention on back-navigation.
- **US3 (P3) — Review & Place Order**: `/checkout/review` read-only summary → "Place Order" → `/checkout/confirmation` with unique order number (LP-YYYY-NNNNN). Cart cleared on placement, back-navigation prevented via empty cart redirect.

14 functional requirements, 6 success criteria, 6 edge cases. All [NEEDS CLARIFICATION] markers resolved by assumption. Out of scope: payment gateway, auth, email, DB, shipping cost, VAT.

## Outcome

- ✅ Impact: Full checkout flow spec (cart → info → review → confirmation) ready for planning
- 🧪 Tests: n/a (spec stage)
- 📁 Files: specs/004-checkout-flow/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: Session-only constraint keeps scope tight. Explicit Out of Scope section prevents scope creep into payment/auth in planning phase.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): checklist — 14/14 PASS
- Prompt variant (if applicable): sp.specify v1
- Next experiment: n/a
