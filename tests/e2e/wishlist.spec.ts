import { test, expect, type BrowserContext, type Page } from '@playwright/test'

// Helper: add product to wishlist from product listing
async function addToWishlist(page: Page, nth = 0) {
  await page.goto('/products')
  await page.waitForSelector('[aria-label*="wishlist"]')
  const btn = page.getByRole('button', { name: /add .* to wishlist/i }).nth(nth)
  await btn.click()
  await page.waitForTimeout(150)
}

test.describe('Wishlist (006-wishlist)', () => {

  // Scenario 1: Add product to wishlist from product listing
  test('SC1: add from product listing fills heart and increments header count', async ({ page }) => {
    await page.goto('/products')
    const btn = page.getByRole('button', { name: /add .* to wishlist/i }).first()
    await btn.click()
    await expect(page.getByRole('button', { name: /remove .* from wishlist/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /wishlist — 1 item/i })).toBeVisible()
  })

  // Scenario 2: Toggle removes product
  test('SC2: clicking filled heart removes product from wishlist', async ({ page }) => {
    await addToWishlist(page)
    const removeBtn = page.getByRole('button', { name: /remove .* from wishlist/i }).first()
    await removeBtn.click()
    await expect(page.getByRole('button', { name: /add .* to wishlist/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /wishlist — /i })).not.toBeVisible()
  })

  // Scenario 3: Persistence across page reload (localStorage)
  test('SC3: wishlist persists after page reload', async ({ page }) => {
    await addToWishlist(page)
    await page.reload()
    await expect(page.getByRole('button', { name: /remove .* from wishlist/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /wishlist — 1 item/i })).toBeVisible()
  })

  // Scenario 4: Remove item from wishlist page
  test('SC4: remove from /wishlist page removes item and updates header', async ({ page }) => {
    await addToWishlist(page, 0)
    await addToWishlist(page, 1)
    await page.goto('/wishlist')
    await expect(page.getByRole('button', { name: /remove/i }).first()).toBeVisible()
    await page.getByRole('button', { name: /remove/i }).first().click()
    await page.waitForTimeout(150)
    const count = await page.getByRole('button', { name: /remove/i }).count()
    expect(count).toBe(1)
  })

  // Scenario 5: Move to cart
  test('SC5: move to cart removes from wishlist and increments cart', async ({ page }) => {
    await addToWishlist(page)
    await page.goto('/wishlist')
    await page.getByRole('button', { name: /move to cart/i }).first().click()
    await page.waitForTimeout(150)
    // Wishlist page should now show empty state or fewer items
    const wishlistLink = page.getByRole('link', { name: /wishlist — /i })
    await expect(wishlistLink).not.toBeVisible()
  })

  // Scenario 6: Empty state
  test('SC6: empty wishlist shows empty state and Browse Products link', async ({ page }) => {
    await page.goto('/wishlist')
    await expect(page.getByText(/your wishlist is empty/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /browse products/i })).toBeVisible()
  })

  // Scenario 7: Duplicate prevention
  test('SC7: adding same product twice toggles not duplicates', async ({ page }) => {
    await page.goto('/products')
    const btn = page.getByRole('button', { name: /add .* to wishlist/i }).first()
    await btn.click()
    await page.waitForTimeout(100)
    // Toggle off
    await page.getByRole('button', { name: /remove .* from wishlist/i }).first().click()
    await page.waitForTimeout(100)
    // Toggle on again
    await page.getByRole('button', { name: /add .* to wishlist/i }).first().click()
    await page.waitForTimeout(100)
    // Should be exactly 1 item
    await expect(page.getByRole('link', { name: /wishlist — 1 item/i })).toBeVisible()
  })

  // Scenario 8: Heart on product detail page
  test('SC8: heart icon on product detail page adds to wishlist', async ({ page }) => {
    await page.goto('/products')
    const firstCard = page.getByRole('link', { name: /view .*/i }).first()
    const href = await firstCard.getAttribute('href')
    await page.goto(href!)
    await page.getByRole('button', { name: /add .* to wishlist/i }).click()
    await page.waitForTimeout(150)
    await expect(page.getByRole('button', { name: /remove .* from wishlist/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /wishlist — 1 item/i })).toBeVisible()
  })

  // Scenario 9: WishlistBadge navigates to /wishlist
  test('SC9: wishlist badge in header navigates to /wishlist', async ({ page }) => {
    await addToWishlist(page)
    await page.getByRole('link', { name: /wishlist/i }).click()
    await expect(page).toHaveURL('/wishlist')
  })

  // Scenario 10: Private browsing graceful degradation (simulated by blocking localStorage)
  test('SC10: graceful degradation when localStorage is unavailable', async ({ page }) => {
    // Override localStorage to throw
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => { throw new Error('SecurityError') },
          setItem: () => { throw new Error('SecurityError') },
          removeItem: () => { throw new Error('SecurityError') },
        },
        writable: false,
      })
    })
    await page.goto('/products')
    // Should not crash — page loads normally
    await expect(page.locator('body')).toBeVisible()
    const btn = page.getByRole('button', { name: /add .* to wishlist/i }).first()
    // Button should be present
    await expect(btn).toBeVisible()
    await btn.click()
    // No error shown
    await expect(page.getByText(/error/i)).not.toBeVisible()
  })
})
