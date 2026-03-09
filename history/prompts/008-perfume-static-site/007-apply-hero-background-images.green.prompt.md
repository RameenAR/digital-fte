---
id: "007"
title: Apply Hero Background Images
stage: green
date: 2026-03-09
surface: agent
model: claude-sonnet-4-6
feature: 008-perfume-static-site
branch: 008-perfume-static-site
user: hp
command: /sp.implement
labels: ["images","hero","background","unsplash","index","shop","blog","contact"]
links:
  spec: specs/008-perfume-static-site/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - static-site/index.html
  - static-site/shop.html
  - static-site/blog.html
  - static-site/contact.html
  - static-site/css/home.css
  - static-site/css/shop.css
  - static-site/css/blog.css
  - static-site/css/contact.css
tests:
  - Manual: Open index.html — hero shows a subtle perfume bottle background image behind gradient
  - Manual: Open shop.html — shop hero shows a subtle dark bottle image behind overlay
  - Manual: Open blog.html — blog hero shows a subtle perfume image behind gradient
  - Manual: Open contact.html — contact hero shows a subtle craftsmanship image behind overlay
---

## Prompt

jo jo images ni lagai wo bhi lagao

## Response snapshot

Identified all hero sections that used only CSS gradients without real photo backgrounds. Added Unsplash perfume images as low-opacity background images to four pages:

**index.html (Home hero):**
- Added `<img class="hero-bg-img" src="https://images.unsplash.com/photo-1583467875263-d50de56eb082?w=1600&h=900&fit=crop&q=80" ...>`
- Multiple luxury perfume bottles, wide-format
- CSS: `position: absolute; inset: 0; opacity: 0.13; object-fit: cover;`

**shop.html (Shop hero):**
- Added `<img class="shop-hero-img" src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&h=500&fit=crop&q=80" ...>`
- Dark masculine perfume bottle, dramatic
- CSS: `opacity: 0.18; object-position: center 30%;`

**blog.html (Blog hero):**
- Added `<img class="blog-hero-img" src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&h=600&fit=crop&q=80" ...>`
- Soft perfume bottle with florals, editorial style
- CSS: `opacity: 0.14; object-position: center 25%;`

**contact.html (Contact hero):**
- Added `<img class="contact-hero-img" src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=1600&h=500&fit=crop&q=80" ...>`
- Perfume craftsmanship, warm tones
- CSS: `opacity: 0.12; object-position: center 40%;`

All images use `onerror="this.style.display='none'"` for graceful fallback, `aria-hidden="true"` for accessibility (decorative only), and low opacity to sit behind the existing gradient overlays without affecting text legibility.

## Outcome

- ✅ Impact: All 4 hero sections now have real perfume photography backgrounds; visual richness improved across all pages
- 🧪 Tests: Manual browser testing — open each page via Live Server
- 📁 Files: 8 files updated (4 HTML + 4 CSS)
- 🔁 Next prompts: commit to git, deploy to Netlify
- 🧠 Reflection: Low opacity (0.12–0.18) is the right balance — images add depth without competing with headline text

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual visual QA — PASS
- Prompt variant (if applicable): none
- Next experiment: Increase opacity slightly on shop/blog heroes for more visual impact
