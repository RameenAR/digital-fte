---
id: 012
title: Add New Arrivals and Best Sellers Sections
stage: green
date: 2026-03-09
surface: agent
model: claude-sonnet-4-6
feature: 008-perfume-static-site
branch: 007-product-reviews
user: hp
command: inline edits — products.js, home.js, index.html
labels: ["products","homepage","new-arrivals","best-sellers","data"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - perfume/js/data/products.js
  - perfume/js/home.js
  - perfume/index.html
tests:
  - null
---

## Prompt

I need you to make specific edits to files in a perfume e-commerce static website located at C:\Users\hp\PIAIC\Project\E.commerce\perfume\

## Task 1: Update products.js

File: C:\Users\hp\PIAIC\Project\E.commerce\perfume\js\data\products.js

Change `featured: true` to `featured: false` for products with IDs: 2, 4, 5, 7, 8, 10, 11, 12
Keep `featured: true` ONLY for IDs: 1 (Midnight Rose), 3 (Santal Bloom), 6 (Noir Absolu), 9 (Golden Oud)

Also add a new field `isNew: true` for IDs: 2 (Jasmine Reverie), 7 (Arctic Vetiver), 10 (Sea Salt & Driftwood), 11 (Hinoki Forest)
And add `isNew: false` for all other products.

Also add `isBestSeller: true` for IDs: 3 (Santal Bloom), 6 (Noir Absolu), 9 (Golden Oud), 4 (Velvet Iris)
And `isBestSeller: false` for all others.

## Task 2: Update home.js

Add calls to `renderNewArrivals()` and `renderBestSellers()` in DOMContentLoaded. Add two new render functions: `renderNewArrivals` (filters `p.isNew`) and `renderBestSellers` (filters `p.isBestSeller`).

## Task 3: Update index.html

After the `#featured` section and before `#full-collection`, insert two new sections: `#new-arrivals` with `.new-arrivals-grid` and `#best-sellers` with `.bestsellers-grid`.

## Response snapshot

All three files updated successfully.

**products.js**: Added `isNew` and `isBestSeller` fields to all 12 products. Featured status narrowed to IDs 1, 3, 6, 9. isNew set to true for IDs 2, 7, 10, 11. isBestSeller set to true for IDs 3, 4, 6, 9.

**home.js**: Added `renderNewArrivals()` and `renderBestSellers()` calls in DOMContentLoaded handler. Added both functions at the end of the file filtering on `p.isNew` and `p.isBestSeller` respectively, rendering into `.new-arrivals-grid` and `.bestsellers-grid`.

**index.html**: Inserted `#new-arrivals` and `#best-sellers` sections with correct grid containers between the closing `</section>` of `#featured` (line 109) and the opening of `#full-collection` (now line 137). Both sections use `class="reveal"` and `featured-grid` layout class.

## Outcome

- Impact: Homepage now has three distinct product showcases — Featured (4 products), New Arrivals (4 products), Best Sellers (4 products) — in addition to the full collection grid.
- Tests: No automated tests; visual verification by opening index.html in browser.
- Files: perfume/js/data/products.js, perfume/js/home.js, perfume/index.html
- Next prompts: Add CSS styles for new-arrivals/best-sellers sections if needed; add badge overlays ("New" / "Best Seller") on product cards.
- Reflection: All edits were surgical, targeting only the fields and insertion points specified. No unrelated code was modified.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add "New" badge overlay to product cards where isNew === true
