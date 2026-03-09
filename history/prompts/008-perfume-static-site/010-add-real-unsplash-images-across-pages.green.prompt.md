---
id: 010
title: Add real Unsplash images across pages
stage: green
date: 2026-03-09
surface: agent
model: claude-sonnet-4-6
feature: 008-perfume-static-site
branch: 007-product-reviews
user: hp
command: add real Unsplash images to every section that currently has only emojis or text
labels: ["images","unsplash","ui","home","about","blog","contact"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - static-site/index.html
  - static-site/css/home.css
  - static-site/about.html
  - static-site/css/about.css
  - static-site/blog.html
  - static-site/css/blog.css
  - static-site/contact.html
  - static-site/css/contact.css
tests:
  - Visual: testimonial avatars show real photos (4 images)
  - Visual: scent family cards display background images with overlay
  - Visual: why-us section has subtle bg image (opacity 0.04)
  - Visual: newsletter deco is a circular rose photo
  - Visual: about process section has hero banner image
  - Visual: about signature quote section has bg image
  - Visual: blog article cards show 28px author avatars
  - Visual: contact map placeholder shows Paris photo
---

## Prompt

Add real Unsplash images to every section that currently has only emojis or text. Work through ALL the changes carefully:

1. TESTIMONIAL AVATARS — Replace text initials (S, J, A, M) with real photos
2. SCENT FAMILIES — Add background images to each family card, convert divs to anchor tags
3. WHY US SECTION — Add a luxury background image (opacity 0.04)
4. NEWSLETTER — Replace 🌹 emoji with real flower image
5. CSS UPDATES — home.css: update .testimonial-avatar, .scent-family-item, #why-us, .newsletter-deco
6. ABOUT PAGE — Add process section hero image banner
7. ABOUT PAGE — Add signature quote section background image
8. BLOG PAGE — Add 28px author avatars to all 6 article cards (articles 2-7)
9. CONTACT PAGE — Replace 🗺 emoji map with real Paris photo

## Response snapshot

All 9 change groups applied across 8 files:

- index.html: 4 testimonial avatars replaced, scent-families section fully rewritten with `<a>` tags, `sf-bg-img` + `sf-overlay` elements, why-us bg img added, newsletter-deco converted to `<img>`
- home.css: `.testimonial-avatar` updated to use object-fit/border, scent family CSS block replaced with image-aware styles (sf-bg-img, sf-overlay, z-index layering), `#why-us` gets position:relative + overflow:hidden + `.why-us-bg-img` rule, `.why-grid` and `.why-card` get z-index:1, `.newsletter-deco` updated to circular image style
- about.html: process-hero-img-wrap inserted before process-grid, sig-quote-bg img inserted as first child of #signature-quote
- about.css: `.process-hero-img-wrap` + `.process-hero-img` rules added, `#signature-quote` gains position:relative + overflow:hidden, `.sig-quote-bg` rule added, `.sig-quote-wrap` z-index:1 merged in
- blog.html: 6 article cards (articles 2-7) each gain `<img class="article-avatar-sm">` before the author name span
- blog.css: `.article-card-meta` flex/align rule added, `.article-avatar-sm` 28px circular border rule added
- contact.html: map-placeholder rebuilt with Paris img + updated text
- contact.css: `.map-placeholder` updated (removed fixed height, added padding), `.map-placeholder img` rule added

## Outcome

- ✅ Impact: All emoji/text placeholders replaced with real Unsplash photos; scent family cards now link to shop with visual depth; testimonials show real faces; blog cards show author portraits; contact shows Paris photo
- 🧪 Tests: Visual checks against each listed change; onerror fallbacks on all images
- 📁 Files: 8 files modified (4 HTML, 4 CSS)
- 🔁 Next prompts: Add lazy loading to more images; consider WebP/srcset optimization; test mobile layout of newsletter deco
- 🧠 Reflection: All changes used minimal diffs; no unrelated code touched; CSS specificity managed cleanly with z-index layering for overlay patterns

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add srcset with multiple Unsplash sizes for responsive images
