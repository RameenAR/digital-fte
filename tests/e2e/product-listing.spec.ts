import { test, expect } from '@playwright/test'

test.describe('Product Listing Page (/products)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  // ─── US1: Browse All Products ────────────────────────────────────────────

  test('US1: loads product grid with 6 cards', async ({ page }) => {
    await expect(page.locator('#product-grid')).toBeVisible()
    const cards = page.locator('#product-grid a')
    await expect(cards).toHaveCount(6)
  })

  test('US1: result count shows "6 products"', async ({ page }) => {
    await expect(page.getByText('6 products')).toBeVisible()
  })

  test('US1: each card links to /products/[slug]', async ({ page }) => {
    const firstCard = page.locator('#product-grid a').first()
    const href = await firstCard.getAttribute('href')
    expect(href).toMatch(/^\/products\/[\w-]+$/)
  })

  test('US1: page title is set correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/All Fragrances/)
  })

  // ─── US2: Filter by Scent Family ─────────────────────────────────────────

  test('US2: checking Floral filter updates grid and URL', async ({ page }) => {
    await page.getByRole('checkbox', { name: /Filter by Floral/i }).check()
    await expect(page).toHaveURL(/family=floral/)
    // Grid should show fewer products (only floral ones)
    const cards = page.locator('#product-grid a')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(6)
  })

  test('US2: Clear All Filters restores full grid', async ({ page }) => {
    await page.getByRole('checkbox', { name: /Filter by Floral/i }).check()
    await page.getByRole('button', { name: /Clear All/i }).click()
    await expect(page.locator('#product-grid a')).toHaveCount(6)
    await expect(page).not.toHaveURL(/family=/)
  })

  test('US2: zero-result filter shows empty state message', async ({ page }) => {
    // Set an impossibly high min price
    const minInput = page.getByLabel('Minimum price')
    await minInput.fill('999999')
    await minInput.blur()
    await expect(page.getByText('No products match your filters.')).toBeVisible()
    await expect(page.getByRole('button', { name: /Clear Filters/i })).toBeVisible()
  })

  // ─── US3: Search Products ────────────────────────────────────────────────

  test('US3: search for "Rose" filters grid and updates URL', async ({ page }) => {
    await page.getByLabel('Search fragrances').fill('Rose')
    // Wait for debounce (300ms)
    await page.waitForTimeout(400)
    await expect(page).toHaveURL(/q=Rose/)
    const cards = page.locator('#product-grid a')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(6)
  })

  test('US3: zero-result search shows no-results message', async ({ page }) => {
    await page.getByLabel('Search fragrances').fill('xyzabc123')
    await page.waitForTimeout(400)
    await expect(page.getByText(/No results for/)).toBeVisible()
  })

  test('US3: clear button (×) clears search and restores grid', async ({ page }) => {
    await page.getByLabel('Search fragrances').fill('Rose')
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /Clear search/i }).click()
    await expect(page.locator('#product-grid a')).toHaveCount(6)
    await expect(page).not.toHaveURL(/q=/)
  })

  // ─── US4: Sort Products ──────────────────────────────────────────────────

  test('US4: sort Price Low to High updates URL and reorders products', async ({ page }) => {
    await page.getByLabel('Sort products').selectOption('price_asc')
    await expect(page).toHaveURL(/sort=price_asc/)
    // First card should be cheapest product (Garden at Dawn, Rs 3,500)
    const firstCard = page.locator('#product-grid a').first()
    await expect(firstCard).toContainText('Garden at Dawn')
  })

  test('US4: sort Price High to Low shows most expensive first', async ({ page }) => {
    await page.getByLabel('Sort products').selectOption('price_desc')
    await expect(page).toHaveURL(/sort=price_desc/)
    const firstCard = page.locator('#product-grid a').first()
    await expect(firstCard).toContainText('Velvet Oud')
  })

  test('US4: sort Newest First shows most recently added first', async ({ page }) => {
    await page.getByLabel('Sort products').selectOption('newest')
    await expect(page).toHaveURL(/sort=newest/)
    const firstCard = page.locator('#product-grid a').first()
    await expect(firstCard).toContainText('Garden at Dawn')
  })

  // ─── URL state restoration ───────────────────────────────────────────────

  test('shared URL restores filter state in new tab', async ({ page, context }) => {
    // Apply a filter
    await page.getByRole('checkbox', { name: /Filter by Floral/i }).check()
    await page.waitForTimeout(200)
    const url = page.url()
    expect(url).toContain('family=floral')

    // Open URL in new page
    const newPage = await context.newPage()
    await newPage.goto(url)
    const checkbox = newPage.getByRole('checkbox', { name: /Filter by Floral/i })
    await expect(checkbox).toBeChecked()
    await newPage.close()
  })
})
