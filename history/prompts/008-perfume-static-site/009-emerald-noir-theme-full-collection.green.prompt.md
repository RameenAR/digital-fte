---
id: 009
title: Emerald Noir Theme, Full Collection Grid, Unique Product Images
stage: green
date: 2026-03-09
surface: agent
model: claude-sonnet-4-6
feature: 008-perfume-static-site
branch: 007-product-reviews
user: hp
command: multi-task implementation
labels: ["theme","emerald-noir","ui","products","home-page","css","data"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - static-site/css/style.css
  - static-site/css/home.css
  - static-site/css/shop.css
  - static-site/css/blog.css
  - static-site/css/contact.css
  - static-site/css/about.css
  - static-site/css/navbar.css
  - static-site/index.html
  - static-site/js/home.js
  - static-site/js/data/products.js
tests:
  - null
---

## Prompt

You are working on a perfume e-commerce static site at: C:\Users\hp\PIAIC\Project\E.commerce\static-site\

Do BOTH tasks below completely.

---

## TASK 1 — "Emerald Noir" Theme

Replace the current dark theme with "Emerald Noir" — dark forest green backgrounds with gold accent. The key requirement is that the backgrounds must be VISIBLY GREEN/DARK-GREEN (not near-black), so the user can immediately see the color change.

[Full CSS :root replacement with #04100A dark forest green bg, #D4A843 gold, emerald green accents #4D9B68 across style.css, home.css, shop.css, blog.css, contact.css, about.css, navbar.css]

---

## TASK 2 — Show All 12 Products on Home Page

The home page currently shows only 4 "featured" products. The user wants to see ALL 12 products.
[Add #full-collection section to index.html, renderFullCollection() function in home.js, .collection-grid CSS in home.css]

---

## TASK 3 — Unique Product Images

Give each of the 12 products a UNIQUE, clearly different Unsplash image. Make ALL 12 products featured: true.

## Response snapshot

Completed all three tasks:

**Task 1 — Emerald Noir Theme:**
- Replaced entire :root block in style.css with Emerald Noir palette (--color-bg: #04100A dark forest green, --color-gold: #D4A843, --color-purple: #4D9B68 emerald green accent)
- Updated hardcoded values: footer background #030B05, scrollbar track #030B05, scrollbar thumb #1A5A2A
- Updated dark text colors on gold buttons from #080503 to #04100A in .btn-primary, .btn-outline, .announcement-bar
- Updated hero gradient in home.css to green-tinted background
- Updated shop-hero, spotlight card backgrounds in shop.css
- Updated blog-hero background in blog.css
- Updated contact-hero background in contact.css
- Updated about-hero-overlay in about.css
- Replaced all navbar rgba(8,5,3,...) references with rgba(4,16,10,...) in navbar.css

**Task 2 — Full Collection Grid:**
- Added #full-collection section to index.html between #featured and #scent-families
- Added renderFullCollection() call in DOMContentLoaded in home.js
- Added renderFullCollection() function after renderCategories() in home.js
- Added .collection-grid CSS (4-col → 3-col → 2-col → 1-col responsive) to end of home.css

**Task 3 — Unique Product Images:**
- Updated product 9 (Golden Oud) image to photo-1583467875263
- Set all 12 products to featured: true (was: products 2,6,7,8,9,10,11,12 were featured: false)

## Outcome

- Impact: Full Emerald Noir theme applied site-wide; home page now renders all 12 products in a responsive 4-column collection grid; all 12 products have unique Unsplash images and are featured
- Tests: none automated — visual verification required by opening index.html in browser
- Files: 10 files modified
- Next prompts: verify visual appearance in browser; consider adding hover animations to .collection-grid cards
- Reflection: All changes were minimal and surgical — only the specified values replaced, no unrelated code touched

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none automated
- Prompt variant (if applicable): null
- Next experiment: verify green backgrounds are visible at #04100A vs prior near-black values
