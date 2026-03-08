import { test, expect, type Page } from '@playwright/test'

const FIRST_PRODUCT = '/products/midnight-rose'

async function fillReviewForm(page: Page, name: string, rating: number, body: string) {
  await page.fill('#reviewerName', name)
  await page.getByRole('button', { name: new RegExp(`Rate ${rating} star`) }).click()
  await page.fill('#reviewBody', body)
}

async function submitForm(page: Page) {
  await page.getByRole('button', { name: /submit review/i }).click()
  await page.waitForTimeout(150)
}

test.describe('Reviews & Ratings (007-product-reviews)', () => {

  // Scenario 1: Submit a review
  test('SC1: submit review appears immediately and form resets', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await fillReviewForm(page, 'Sarah K.', 4, 'Wonderful fragrance!')
    await submitForm(page)
    await expect(page.getByText('Sarah K.')).toBeVisible()
    await expect(page.getByText('Wonderful fragrance!')).toBeVisible()
    await expect(page.getByText('Thank you for your review!')).toBeVisible()
    await expect(page.locator('#reviewerName')).toHaveValue('')
  })

  // Scenario 2: Validation — all fields empty
  test('SC2: validation errors shown when submitting empty form', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await submitForm(page)
    await expect(page.getByText(/name is required/i)).toBeVisible()
    await expect(page.getByText(/please select a rating/i)).toBeVisible()
    await expect(page.getByText(/review text is required/i)).toBeVisible()
  })

  // Scenario 3: Persistence after reload
  test('SC3: reviews persist after page reload', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await fillReviewForm(page, 'Persistent User', 5, 'This stays after reload!')
    await submitForm(page)
    await page.reload()
    await expect(page.getByText('Persistent User')).toBeVisible()
    await expect(page.getByText('This stays after reload!')).toBeVisible()
  })

  // Scenario 4: Empty state on fresh product
  test('SC4: empty state shown when product has no reviews', async ({ page }) => {
    // Use a clean localStorage
    await page.goto(FIRST_PRODUCT)
    await page.evaluate(() => localStorage.removeItem('lumiere_reviews'))
    await page.reload()
    await expect(page.getByText(/no reviews yet/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /submit review/i })).toBeVisible()
  })

  // Scenario 5: Average rating on product cards
  test('SC5: product card shows average rating after reviews submitted', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await page.evaluate(() => localStorage.removeItem('lumiere_reviews'))
    await page.reload()
    await fillReviewForm(page, 'User A', 4, 'Great scent!')
    await submitForm(page)
    await fillReviewForm(page, 'User B', 2, 'Not for me.')
    await submitForm(page)
    await page.goto('/products')
    // Rating badge should appear (3.0 average)
    await expect(page.getByText('3.0')).toBeVisible()
  })

  // Scenario 6: Card with no reviews shows no rating
  test('SC6: product card with no reviews shows no rating badge', async ({ page }) => {
    await page.goto('/products')
    await page.evaluate(() => localStorage.removeItem('lumiere_reviews'))
    await page.reload()
    // No "0.0" or "0 reviews" should appear
    await expect(page.getByText('0.0')).not.toBeVisible()
  })

  // Scenario 7: XSS prevention
  test('SC7: XSS in review body is rendered as plain text', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await fillReviewForm(page, 'XSS Tester', 3, "<script>alert('xss')</script>")
    await submitForm(page)
    // Should render as text, not execute
    await expect(page.getByText("<script>alert('xss')</script>")).toBeVisible()
    // No dialog should have fired
  })

  // Scenario 8: Reviewer name too long
  test('SC8: reviewer name over 50 chars shows validation error', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await page.fill('#reviewerName', 'A'.repeat(51))
    await page.getByRole('button', { name: /rate 4 star/i }).click()
    await page.fill('#reviewBody', 'Good product.')
    await submitForm(page)
    await expect(page.getByText(/name is required \(max 50/i)).toBeVisible()
  })

  // Scenario 9: Review body too long
  test('SC9: review body over 500 chars shows validation error', async ({ page }) => {
    await page.goto(FIRST_PRODUCT)
    await page.fill('#reviewerName', 'Sarah')
    await page.getByRole('button', { name: /rate 5 star/i }).click()
    await page.fill('#reviewBody', 'A'.repeat(501))
    await submitForm(page)
    await expect(page.getByText(/review text is required \(max 500/i)).toBeVisible()
  })

  // Scenario 10: Multiple products — reviews are isolated
  test('SC10: reviews for different products are isolated', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('lumiere_reviews'))
    await page.goto(FIRST_PRODUCT)
    await fillReviewForm(page, 'Product A Reviewer', 5, 'Love product A!')
    await submitForm(page)
    // Navigate to a different product
    await page.goto('/products')
    const links = page.getByRole('link', { name: /view /i })
    const count = await links.count()
    if (count > 1) {
      const href = await links.nth(1).getAttribute('href')
      if (href && href !== FIRST_PRODUCT) {
        await page.goto(href)
        await expect(page.getByText(/no reviews yet/i)).toBeVisible()
      }
    }
  })
})
