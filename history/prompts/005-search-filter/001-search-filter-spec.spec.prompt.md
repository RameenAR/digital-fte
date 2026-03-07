---
id: 001
title: search-filter-spec
stage: spec
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 005-search-filter
branch: 005-search-filter
user: hp
command: /sp.specify
labels: [search, filter, product-listing, real-time, url-state, price-range, fragrance-notes]
links:
  spec: specs/005-search-filter/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-search-filter/spec.md
  - specs/005-search-filter/checklists/requirements.md
tests:
  - n/a (spec stage)
---

## Prompt

next feature ka spec banao → Search & Filter ka spec banao

(Feature description: Search & Filter — product search bar with real-time filtering, filter by category (eau de parfum, eau de toilette, parfum), price range slider, gender (men, women, unisex), fragrance notes (floral, woody, oriental, fresh, citrus). Filters apply instantly without page reload. Active filters shown as removable chips. Result count displayed. URL reflects active filters for shareable links. No backend search — client-side filtering of existing product catalog.)

## Response snapshot

Created spec for 005-search-filter with 4 user stories:

- **US1 (P1) — Real-Time Text Search**: Search bar on `/products` matches product name, brand, fragrance notes (case-insensitive partial match). Grid updates within 300 ms. URL `?q=` param kept in sync.
- **US2 (P2) — Category, Gender & Fragrance Note Filters**: Checkboxes for Category (EDP/EDT/Parfum), Gender (Men/Women/Unisex), Notes (Floral/Woody/Oriental/Fresh/Citrus). OR within group, AND across groups. URL params: `category`, `gender`, `notes`.
- **US3 (P3) — Price Range Filter**: Dual-handle slider bounded by catalog min/max prices. PKR display. URL params: `minPrice`, `maxPrice`.
- **US4 (P4) — Active Filter Chips & Clear All**: Each active filter shown as removable chip. "Clear All" button. "X products found" result count always visible. Mobile: filters behind "Show Filters" toggle, chips always visible.

15 functional requirements, 6 success criteria, 8 assumptions. No NEEDS CLARIFICATION markers. Out of scope: server-side search, filter presets, sort controls, pagination changes.

## Outcome

- ✅ Impact: Full search & filter spec ready for planning
- 🧪 Tests: n/a (spec stage)
- 📁 Files: specs/005-search-filter/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: URL-as-state (shareable links) is a key constraint that will drive the planning architecture. Client-side only constraint keeps complexity bounded.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): checklist — 14/14 PASS
- Prompt variant (if applicable): sp.specify v1
- Next experiment: n/a
