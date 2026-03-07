import { test, expect } from '@playwright/test'

// ─── Scenario 1: Text search real-time update ─────────────────────────────────

test('text search filters products and shows chip', async ({ page }) => {
  await page.goto('/products')
  const search = page.getByLabel('Search fragrances')
  await search.fill('rose')
  await page.waitForTimeout(400)
  await expect(page.getByText('Search: "rose"')).toBeVisible()
  const count = page.locator('[aria-label="Product grid"] > *')
  await expect(count).toHaveCount(1)
  const clearBtn = page.getByRole('button', { name: /Remove Search.*filter/ })
  await clearBtn.click()
  await expect(page.getByLabel('Product grid').locator('> *')).toHaveCount(6)
})

// ─── Scenario 2: Concentration filter ────────────────────────────────────────

test('concentration filter — single selection', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Eau de Parfum').check()
  await expect(page.getByText('Eau de Parfum')).toBeVisible()
  const url = page.url()
  expect(url).toContain('concentration=edp')
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(2)
})

test('concentration filter — multi selection uses OR logic', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Eau de Parfum').check()
  await page.getByLabel('Filter by Parfum').check()
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(4)
  expect(page.url()).toContain('concentration=edp')
  expect(page.url()).toContain('parfum')
})

// ─── Scenario 3: Gender filter ────────────────────────────────────────────────

test('gender filter — single selection', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Women').check()
  expect(page.url()).toContain('gender=women')
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(2)
})

test('gender filter — women OR unisex', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Women').check()
  await page.getByLabel('Filter by Unisex').check()
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(4)
})

// ─── Scenario 4: Cross-group AND logic ───────────────────────────────────────

test('cross-group AND logic — EDP and Women returns 1 product', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Eau de Parfum').check()
  await page.getByLabel('Filter by Women').check()
  expect(page.url()).toContain('concentration=edp')
  expect(page.url()).toContain('gender=women')
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(1)
  await expect(page.getByText('Midnight Rose')).toBeVisible()
})

// ─── Scenario 5: Price range slider ──────────────────────────────────────────

test('price range chip appears when price narrowed via URL', async ({ page }) => {
  await page.goto('/products?maxPrice=5000')
  // Velvet Oud (6800) should be excluded
  await expect(page.getByText('Velvet Oud')).not.toBeVisible()
  await expect(page.getByText(/PKR/)).toBeVisible()
})

// ─── Scenario 6: Individual chip removal ─────────────────────────────────────

test('chip × removes only that filter', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Eau de Parfum').check()
  await page.getByLabel('Filter by Women').check()
  await expect(page.getByText('Eau de Parfum')).toBeVisible()
  await expect(page.getByText('Women')).toBeVisible()
  // Remove Women chip
  await page.getByRole('button', { name: 'Remove Women filter' }).click()
  await expect(page.getByText('Women')).not.toBeVisible()
  // EDP chip still present
  await expect(page.getByText('Eau de Parfum')).toBeVisible()
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(2)
})

// ─── Scenario 7: Clear All ────────────────────────────────────────────────────

test('Clear All resets all filters', async ({ page }) => {
  await page.goto('/products')
  await page.getByLabel('Filter by Eau de Parfum').check()
  await page.getByLabel('Filter by Women').check()
  await page.getByRole('button', { name: 'Clear All' }).first().click()
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(6)
  await expect(page.getByText('Eau de Parfum')).not.toBeVisible()
})

// ─── Scenario 8: URL state restore ───────────────────────────────────────────

test('filter state restores from URL on direct navigation', async ({ page }) => {
  await page.goto('/products?concentration=edp&gender=women')
  // Filter checkboxes should be checked
  await expect(page.getByLabel('Filter by Eau de Parfum')).toBeChecked()
  await expect(page.getByLabel('Filter by Women')).toBeChecked()
  // Grid shows correct results
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(1)
})

// ─── Scenario 9: No results empty state ──────────────────────────────────────

test('no products found state shows with clear-filters link', async ({ page }) => {
  // EDP + Men + Floral — Cedar Solstice is EDP + Men but Woody, not Floral
  await page.goto('/products?concentration=edp&gender=men&family=floral')
  await expect(page.getByText(/No products/i)).toBeVisible()
  const clearLink = page.getByRole('button', { name: /Clear Filters/i })
  await clearLink.click()
  await expect(page.locator('[aria-label="Product grid"] > *')).toHaveCount(6)
})

// ─── Scenario 10: Result count ────────────────────────────────────────────────

test('result count always visible and updates with filters', async ({ page }) => {
  await page.goto('/products')
  await expect(page.getByText('6 products')).toBeVisible()
  await page.getByLabel('Filter by Women').check()
  await expect(page.getByText('2 products')).toBeVisible()
})
