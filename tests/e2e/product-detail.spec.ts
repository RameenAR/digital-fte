import { test, expect } from '@playwright/test'

test.describe('Product Detail Page (/products/[slug])', () => {
  // ─── US1: View Full Product Details ──────────────────────────────────────

  test('US1: loads product name, price, and hero image', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Midnight Rose')
    await expect(page.getByText(/Rs\s*[\d,]+/)).toBeVisible()
    await expect(page.locator('img[alt*="Midnight Rose"]')).toBeVisible()
  })

  test('US1: shows scent family badge', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    // Badge shows category / scent family
    await expect(page.getByText('Floral', { exact: false })).toBeVisible()
  })

  test('US1: renders scent notes pyramid with three tiers', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await expect(page.getByText('Top Notes')).toBeVisible()
    await expect(page.getByText('Heart Notes')).toBeVisible()
    await expect(page.getByText('Base Notes')).toBeVisible()
  })

  test('US1: shows editorial description paragraph', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    const section = page.getByRole('region', { name: /about this fragrance/i })
    await expect(section).toBeVisible()
  })

  test('US1: breadcrumb renders Home → All Fragrances → product name', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    const nav = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'All Fragrances' })).toBeVisible()
    await expect(nav.getByText('Midnight Rose')).toBeVisible()
  })

  test('US1: breadcrumb links navigate correctly', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    const nav = page.getByRole('navigation', { name: 'Breadcrumb' })
    await nav.getByRole('link', { name: 'All Fragrances' }).click()
    await expect(page).toHaveURL('/products')
  })

  test('US1: page title includes product name', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await expect(page).toHaveTitle(/Midnight Rose/)
  })

  test('US1: 404 for unknown slug', async ({ page }) => {
    await page.goto('/products/xyz-does-not-exist')
    await expect(page.getByRole('heading', { name: /Product Not Found/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Browse All Fragrances/i })).toBeVisible()
  })

  // ─── US2: Add to Cart ─────────────────────────────────────────────────────

  test('US2: quantity selector is present with decrement and increment buttons', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await expect(page.getByRole('button', { name: 'Decrease quantity' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Increase quantity' })).toBeVisible()
  })

  test('US2: add to cart button shows success state briefly', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await page.getByRole('button', { name: /Add Midnight Rose to cart/i }).click()
    await expect(page.getByText('✓ Added to Cart')).toBeVisible()
  })

  test('US2: header cart badge increments after add to cart', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await page.getByRole('button', { name: /Add Midnight Rose to cart/i }).click()
    // Wait for state update
    await expect(page.locator('header').getByText('1')).toBeVisible()
  })

  test('US2: cart count persists on navigation', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await page.getByRole('button', { name: /Add Midnight Rose to cart/i }).click()
    await page.goto('/products')
    await page.goto('/products/midnight-rose')
    // Badge should still show 1 (sessionStorage)
    await expect(page.locator('header').getByText('1')).toBeVisible()
  })

  // ─── US3: Related Products ────────────────────────────────────────────────

  test('US3: related products section is visible', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    await expect(page.getByRole('region', { name: /you might also like/i })).toBeVisible()
  })

  test('US3: current product is not in related list', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    const related = page.getByRole('region', { name: /you might also like/i })
    const cards = related.getByRole('link')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const href = await cards.nth(i).getAttribute('href')
      expect(href).not.toBe('/products/midnight-rose')
    }
  })

  test('US3: related product cards link to their detail pages', async ({ page }) => {
    await page.goto('/products/midnight-rose')
    const related = page.getByRole('region', { name: /you might also like/i })
    const firstCard = related.getByRole('link').first()
    const href = await firstCard.getAttribute('href')
    expect(href).toMatch(/^\/products\/[\w-]+$/)
    await firstCard.click()
    await expect(page).toHaveURL(/\/products\/[\w-]+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
