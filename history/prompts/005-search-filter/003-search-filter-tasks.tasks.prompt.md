---
id: 003
title: search-filter-tasks
stage: tasks
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 005-search-filter
branch: 005-search-filter
user: hp
command: /sp.tasks
labels: [search, filter, concentration, gender, price-slider, filter-chips, tdd, url-state]
links:
  spec: specs/005-search-filter/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-search-filter/tasks.md
tests:
  - n/a (tasks stage)
---

## Prompt

tasks banao

## Response snapshot

Generated 12-task tasks.md for 005-search-filter organized into 6 phases.

**Phase 1: Setup (T001-T003)**
- T001: Extend types/products.ts (Concentration + Gender types, FilterState fields)
- T002 [P]: Update seed data (6 products with concentration + gender)
- T003 [P]: Update makeProduct fixture + RED tests for filterByConcentration + filterByGender

**Phase 2: Foundational (T004)**
- T004: Implement filterByConcentration + filterByGender; extend hook with setConcentrations, setGenders, catalogMin, catalogMax; update URL parsing → GREEN

**Phase 3: US2 — Concentration, Gender & Notes Filters (T005-T006)**
- T005 [P] [US2]: FilterPanel.tsx — add Concentration + Gender checkboxes fieldsets
- T006 [US2]: ProductListingClient.tsx — pass new props to FilterPanel

**Phase 4: US3 — Price Range Slider (T007-T008)**
- T007 [P] [US3]: Create PriceRangeSlider.tsx (dual-handle, WCAG AA, no deps)
- T008 [US3]: FilterPanel.tsx — replace price inputs with PriceRangeSlider

**Phase 5: US4 — Filter Chips & Clear All (T009-T010)**
- T009 [P] [US4]: Create FilterChips.tsx (all filter dims, Clear All, null when empty)
- T010 [US4]: ProductListingClient.tsx — render FilterChips, wire all remove handlers

**Phase 6: Polish (T011-T012)**
- T011 [P]: Create tests/e2e/search-filter.spec.ts (10 scenarios)
- T012: Full test run — 34 unit tests GREEN + TypeScript check

Key parallel opportunities: T002+T003 after T001; T005+T007+T009 after T004 (all different files); T006+T008 after their respective deps.

US1 (text search) is already fully implemented from 002-product-listing — preserved by foundational work, no additional tasks needed.

## Outcome

- ✅ Impact: 12 executable tasks covering all 4 user stories + TDD approach
- 🧪 Tests: RED tests in T003, GREEN in T004, E2E in T011
- 📁 Files: specs/005-search-filter/tasks.md
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: T005 + T007 + T009 all create/modify different files after T004, giving maximum parallelism. All ProductListingClient changes split across T006 and T010 to respect file-level sequencing.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): format validated — all 12 tasks have checkbox + ID + description + file path
- Prompt variant (if applicable): sp.tasks v1
- Next experiment: n/a
