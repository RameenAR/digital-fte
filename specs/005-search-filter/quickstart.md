# Quickstart / Integration Scenarios: 005-Search & Filter

**Date**: 2026-03-07
**Branch**: `005-search-filter`

These scenarios verify that all filter dimensions work correctly in combination. Use them to guide E2E tests (`tests/e2e/search-filter.spec.ts`).

---

## Scenario 1: Text Search — Real-Time Update

**Setup**: Visit `/products` with no query params.

**Steps**:
1. Type "rose" into the search bar.
2. Wait 300 ms.

**Expected**:
- Product grid shows only products whose name or notes contain "rose" (Midnight Rose).
- URL updates to `/products?q=rose`.
- Result count reads "1 product found".
- A chip "Search: "rose"" appears.

**Cleanup**: Click × on the chip. All products reappear, URL returns to `/products`.

---

## Scenario 2: Concentration Filter

**Setup**: Visit `/products` with no query params.

**Steps**:
1. In the filter panel, check "Eau de Parfum".

**Expected**:
- Grid shows only EDP products (Midnight Rose, Cedar Solstice — 2 products).
- URL: `/products?concentration=edp`.
- Chip "Eau de Parfum" appears.
- Result count reads "2 products found".

**Steps continued**:
2. Also check "Parfum".

**Expected**:
- Grid now shows EDP + Parfum products (Midnight Rose, Cedar Solstice, Saffron Dusk, Velvet Oud — 4 products).
- URL: `/products?concentration=edp,parfum`.

---

## Scenario 3: Gender Filter

**Setup**: Visit `/products`.

**Steps**:
1. Check "Women" in the Gender filter.

**Expected**:
- Grid: Midnight Rose + Garden at Dawn (2 products).
- URL: `/products?gender=women`.
- Chip "Women" appears.

**Steps continued**:
2. Also check "Unisex".

**Expected**:
- Grid: Midnight Rose, Garden at Dawn, Saffron Dusk, Coastal Breeze (4 products).
- URL: `/products?gender=women,unisex`.

---

## Scenario 4: Cross-Group AND Logic (Concentration + Gender)

**Setup**: Visit `/products`.

**Steps**:
1. Check "Eau de Parfum" in Concentration.
2. Check "Women" in Gender.

**Expected**:
- Only products that are BOTH EDP AND Women: Midnight Rose (1 product).
- URL: `/products?concentration=edp&gender=women`.
- Two chips: "Eau de Parfum", "Women".

---

## Scenario 5: Price Range Slider

**Setup**: Visit `/products`. Catalog min = 3,500 PKR, max = 6,800 PKR.

**Steps**:
1. Drag the max handle of the price slider to approximately 5,000 PKR.

**Expected**:
- Grid excludes Velvet Oud (6,800 PKR).
- URL: `/products?maxPrice=5000` (or nearest slider snap).
- One price chip appears: e.g., "PKR 3,500 – 5,000".

**Steps continued**:
2. Drag min handle to 4,000 PKR.

**Expected**:
- Grid: products between 4,000–5,000 PKR (Midnight Rose 4,500, Cedar Solstice 4,100, Saffron Dusk 5,200 ← excluded if > 5,000).
- URL: `/products?minPrice=4000&maxPrice=5000`.

---

## Scenario 6: Active Filter Chips — Individual Removal

**Setup**: Activate concentration=edp, gender=women, family=floral.

**Steps**:
1. Confirm three chips are shown.
2. Click × on the "Women" chip.

**Expected**:
- Gender filter removed; concentration and family remain.
- Grid updates accordingly.
- URL drops `gender` param.
- Only the "Women" chip disappears.

---

## Scenario 7: Clear All Filters

**Setup**: Activate search "rose", concentration=edp, gender=women.

**Steps**:
1. Click "Clear All" button.

**Expected**:
- All filters reset.
- All 6 products shown.
- URL returns to `/products`.
- All chips disappear.
- Result count reads "6 products found".

---

## Scenario 8: URL State Restore on Page Load

**Setup**: Navigate directly to:
`/products?q=oud&concentration=parfum&gender=men&minPrice=5000&maxPrice=7000`

**Expected**:
- On first render:
  - Search bar shows "oud".
  - "Parfum" checkbox is checked.
  - "Men" checkbox is checked.
  - Price slider set to 5,000–7,000.
  - Grid filtered accordingly.
  - Chips present for each active filter.

---

## Scenario 9: No Results Empty State

**Setup**: Visit `/products`.

**Steps**:
1. Check "Eau de Parfum" + "Men" + "Floral" (fragrance note).

**Expected**:
- No products satisfy EDP + Men + Floral (Cedar Solstice is EDP + Men + Woody, not Floral).
- "No products found" message displayed.
- "Clear all filters" link visible and functional.

---

## Scenario 10: Mobile — Filter Toggle

**Setup**: Viewport width ≤ 768 px. Visit `/products`.

**Expected**:
- Filter panel is hidden.
- "Show Filters" (or "Filters") button is visible.
- Chips and result count are visible.

**Steps**:
1. Tap "Show Filters".

**Expected**:
- Filter panel slides in / becomes visible.
- User can check "Women".
- Grid updates; chip appears; filter panel can be closed.
