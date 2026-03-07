# Quickstart: Product Detail Page

**Feature**: 003-product-detail | **Date**: 2026-03-07
**Purpose**: Get `/products/[slug]` running locally and validate each user story manually.

---

## Prerequisites

- Existing project set up from `002-product-listing` (`npm install` done)
- Dev server running: `npm run dev`

---

## 1. Navigate to a Product Detail Page

Open any of these URLs:

```
http://localhost:3000/products/midnight-rose
http://localhost:3000/products/velvet-oud
http://localhost:3000/products/garden-at-dawn
```

---

## 2. Manual Validation by User Story

### US1 — View Full Product Details

1. ✅ Product name visible (e.g., "Midnight Rose") in large serif font
2. ✅ Price displayed in PKR format (e.g., "Rs 4,500")
3. ✅ Hero image fills left column (desktop) / full width (mobile)
4. ✅ Scent family badge visible (e.g., "Floral" pill/badge)
5. ✅ Scent notes pyramid shows three labelled tiers:
   - **Top Notes**: Bergamot, Black Pepper
   - **Heart Notes**: Damask Rose, Jasmine
   - **Base Notes**: Oud, Amber, Musk
6. ✅ Editorial description paragraph visible (50+ words)
7. ✅ Breadcrumb: Home → All Fragrances → Midnight Rose
8. ✅ Resize to 375px → image and info stack vertically, no horizontal scroll
9. ✅ Page title = "Midnight Rose | Lumière Parfums"
10. ✅ 404 test: open `/products/xyz-does-not-exist` → "Product not found" message + link to `/products`

---

### US2 — Add to Cart

1. ✅ Quantity selector visible, defaulting to 1
2. ✅ Change quantity to 3 → click "Add to Cart" → button shows "Added ✓"
3. ✅ Header cart count updates: shows "3" badge
4. ✅ Navigate to `/products` → come back → cart count still shows "3"
5. ✅ Navigate to another product → add 2 → header shows "5"
6. ✅ Quantity at 10 → increment disabled (can't exceed 10)
7. ✅ Refresh page → cart count persists (sessionStorage)
8. ✅ "Added ✓" state reverts after ~2 seconds

---

### US3 — Related Fragrances

1. ✅ "You Might Also Like" section visible at bottom of page
2. ✅ Shows 1–3 product cards (not the current product)
3. ✅ Each card shows image, name, price
4. ✅ Click a related card → navigates to `/products/[slug]` for that product
5. ✅ On "Garden at Dawn" (floral, green, fresh, musky) → should show 3 related products with overlapping tags

---

## 3. Run Automated Tests

```bash
# Unit tests (cart logic, related products algorithm)
npm run test

# E2E tests
npx playwright test tests/e2e/product-detail.spec.ts
```

---

## 4. Definition of Done Checklist

Before merging `003-product-detail` → `master`:

- [ ] US1–US3 manual validation all pass
- [ ] `npm run test` — all unit tests green (cart, related-products)
- [ ] `npx playwright test` — all E2E tests pass
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90
- [ ] No ESLint / TypeScript errors (`npm run lint && npm run type-check`)
- [ ] Cart count persists on page navigation (sessionStorage)
- [ ] Cart count resets when browser tab is closed and reopened
- [ ] 404 shown for invalid slug — no crash
- [ ] Related section hidden when no tag overlap (not an empty box)
- [ ] Keyboard navigation: Tab through breadcrumb, quantity, Add to Cart, related cards
- [ ] PHR created and committed
