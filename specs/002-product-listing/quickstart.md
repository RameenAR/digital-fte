# Quickstart: Product Listing Page

**Feature**: 002-product-listing | **Date**: 2026-03-07
**Purpose**: Get `/products` running locally and validate each user story manually.

---

## Prerequisites

- Existing project set up from `001-homepage` (`npm install` done, `.env.local` configured)
- Dev server running: `npm run dev`

---

## 1. Navigate to the Products Page

Open `http://localhost:3000/products`

---

## 2. Manual Validation by User Story

### US1 — Browse All Products

1. ✅ Grid of product cards visible — 2 columns on mobile, 4 on desktop
2. ✅ Each card shows: image, name (e.g., "Midnight Rose"), price (e.g., "Rs 4,500"), scent family badge (e.g., "Floral")
3. ✅ Click a card → navigates to `/products/midnight-rose`
4. ✅ Result count visible: "6 products"
5. ✅ Resize to 375px → 2-column grid, no horizontal scroll
6. Empty state test: set all products `isActive: false` in seed → "No products available yet" message appears

---

### US2 — Filter by Scent Family & Price

1. ✅ Filter panel visible (sidebar on desktop, collapsible on mobile)
2. ✅ Check "Floral" → only floral products visible, URL updates to `?family=floral`
3. ✅ Check "Woody" additionally → both floral AND woody products visible (OR logic)
4. ✅ Set min price Rs 4,000 → products below Rs 4,000 disappear
5. ✅ Click "Clear All Filters" → full grid reappears, URL params removed
6. ✅ Apply filters → copy URL → open in new tab → same filtered state restored
7. Zero-result test: set price range Rs 99,000–100,000 → "No products match your filters." + "Clear Filters" button

---

### US3 — Search Products

1. ✅ Type "Rose" in search bar → grid filters to products with "rose" in name or notes
2. ✅ URL updates to `?q=Rose`
3. ✅ Wait 300ms after typing stops — grid updates (debounce working)
4. ✅ Clear search → full grid reappears
5. ✅ Search "oud" + filter "Woody" → only products satisfying BOTH conditions shown
6. Zero-result test: search "xyzabc123" → "No results for 'xyzabc123'." message

---

### US4 — Sort Products

1. ✅ Default sort = Bestselling (displayOrder 1, 2, 3...)
2. ✅ Select "Price: Low to High" → cheapest product first (Rs 3,500)
3. ✅ Select "Price: High to Low" → most expensive first (Rs 6,800)
4. ✅ Select "Newest First" → most recently added product first
5. ✅ URL updates: `?sort=price_asc`
6. ✅ Apply sort + filter → filtered results are correctly sorted

---

### Pagination

1. Add 13+ products to seed data
2. ✅ Page 1 shows 12 products, "Next" button active
3. ✅ Click "Next" → page 2 shows remaining products, URL = `?page=2`
4. ✅ Click "Previous" → back to page 1

---

## 3. Run Automated Tests

```bash
# Unit tests (filter/sort/search/paginate logic)
npm run test

# E2E tests
npx playwright test tests/e2e/product-listing.spec.ts
```

---

## 4. Definition of Done Checklist

Before merging `002-product-listing` → `master`:

- [ ] US1–US4 manual validation all pass
- [ ] `npm run test` — all unit tests green
- [ ] `npx playwright test` — all E2E tests pass
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90
- [ ] No ESLint / TypeScript errors (`npm run lint && npm run type-check`)
- [ ] Filter/search/sort/page state correctly synced to URL
- [ ] Shared URL restores correct filtered state in new tab
- [ ] Empty states shown for all zero-result scenarios
- [ ] Skeleton loading state visible on slow connections (DevTools → Slow 3G)
- [ ] PHR created and committed
