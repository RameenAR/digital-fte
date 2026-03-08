---
id: 002
title: Checkout Flow Architecture Research
stage: general
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 004-checkout-flow
branch: master
user: hp
command: research (ad-hoc)
labels: ["checkout", "next.js-app-router", "state-management", "form-validation", "session-storage", "pakistan-phone", "step-guard", "layout"]
links:
  spec: specs/004-checkout-flow/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - (none — research output only)
tests:
  - (none — research stage)
---

## Prompt

Research the following for a Next.js 14 App Router e-commerce checkout flow (session-only, no payment gateway, no auth):

1. Best pattern for multi-step checkout state in Next.js App Router (React Context + sessionStorage vs URL params vs server state)
2. Client-side form validation patterns without a library (regex for email, phone validation for Pakistan numbers)
3. Checkout step guard pattern in Next.js App Router (how to redirect in a 'use client' page when preconditions are missing)
4. Order number generation client-side (timestamp-based, format LP-YYYY-NNNNN)
5. Checkout layout with progress indicator in Next.js App Router (shared layout.tsx for /checkout/* routes)

Return concise findings: decision, rationale, alternatives considered. No code needed — just research findings.

## Response snapshot

See main response in conversation. Summary of five decisions:

1. React Context + sessionStorage (mirrors existing CartContext pattern)
2. Regex validation for email + Pakistan mobile number (03XX-XXXXXXX / +92 mobile)
3. useEffect redirect guard — check precondition, call router.replace() before render
4. Timestamp-based LP-YYYY-NNNNN with zero-padded counter derived from Date.now()
5. Nested layout.tsx at app/checkout/layout.tsx with a CheckoutProgressBar client component

## Outcome

- ✅ Impact: Five architectural decisions documented for checkout flow planning phase
- 🧪 Tests: none (research stage)
- 📁 Files: none (research output only)
- 🔁 Next prompts: /sp.plan for 004-checkout-flow
- 🧠 Reflection: All five decisions align with existing codebase conventions (CartContext pattern, sessionStorage usage, App Router layout nesting). No new dependencies required.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a (research stage)
- Prompt variant (if applicable): ad-hoc research
- Next experiment: n/a
