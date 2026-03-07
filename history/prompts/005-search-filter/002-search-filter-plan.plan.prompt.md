---
id: 002
title: search-filter-plan
stage: plan
date: 2026-03-07
surface: agent
model: claude-sonnet-4-6
feature: 005-search-filter
branch: 005-search-filter
user: hp
command: /sp.plan
labels: [search, filter, price-slider, filter-chips, concentration, gender, url-state, client-side]
links:
  spec: specs/005-search-filter/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-search-filter/plan.md
  - specs/005-search-filter/research.md
  - specs/005-search-filter/data-model.md
  - specs/005-search-filter/contracts/filter-state.md
  - specs/005-search-filter/quickstart.md
tests:
  - n/a (plan stage)
---

## Prompt

plan banao

## Response snapshot

Created full implementation plan for 005-search-filter. Key discovery: substantial filter infrastructure already exists from 002-product-listing (useProductFilters hook with URL sync, FilterPanel, SearchBar, ProductGrid with empty states, 22 passing unit tests).

**This feature is an EXTENSION of existing code, not greenfield.**

Architecture decisions:
1. **Concentration field** (`'edp' | 'edt' | 'parfum'`) added to Product — existing `category` (scent family) NOT renamed to avoid breaking 22 tests.
2. **Gender field** (`'men' | 'women' | 'unisex'`) added to Product + seed data.
3. **FilterState extended** with `concentrations: string[]` and `genders: string[]` (both default `[]`).
4. **Price slider**: Custom dual-handle `<input type="range">` — zero new dependencies.
5. **FilterChips**: New stateless component between controls bar and grid; renders `null` when no filters active.
6. **Filter pipeline**: search → price → family → concentration → gender → sort → paginate.
7. **URL params**: `concentration` (CSV) and `gender` (CSV) added to existing parse/serialize.
8. **Seed data**: Balanced distribution — 2 EDP + 2 EDT + 2 Parfum; 2 Men + 2 Women + 2 Unisex.

Scope: 7 modified files + 3 new files (FilterChips.tsx, PriceRangeSlider.tsx, search-filter.spec.ts).
All constitution gates: PASS.

## Outcome

- ✅ Impact: Complete plan covering data model, contracts, 10 E2E scenarios, architecture
- 🧪 Tests: n/a (plan stage)
- 📁 Files: plan.md, research.md, data-model.md, contracts/filter-state.md, quickstart.md
- 🔁 Next prompts: /sp.tasks then /sp.implement
- 🧠 Reflection: Auditing existing code before planning was critical — avoided re-implementing what already existed and identified precise gaps.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): constitution gates — all 6 PASS
- Prompt variant (if applicable): sp.plan v1
- Next experiment: n/a
