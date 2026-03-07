import { test, expect } from '@playwright/test'

// Helper: add a product to cart via product detail page
async function addToCart(page: any, slug = 'midnight-rose') {
  await page.goto(`/products/${slug}`)
  await page.getByRole('button', { name: /add .* to cart/i }).click()
  await page.waitForTimeout(200)
}

test.describe('Checkout Flow (/checkout/*)', () => {

  // ─── US1: Cart Review ────────────────────────────────────────────────────

  test('US1: cart review shows items with qty controls and PKR total', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/cart')
    await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /decrease quantity/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /increase quantity/i })).toBeVisible()
    await expect(page.getByText(/PKR|Rs/)).toBeVisible()
  })

  test('US1: quantity change updates subtotal in real time', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/cart')
    await page.getByRole('button', { name: /increase quantity/i }).click()
    await expect(page.getByText('2')).toBeVisible()
  })

  test('US1: removing last item shows empty cart message', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/cart')
    await page.getByRole('button', { name: /remove .* from cart/i }).click()
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /browse all fragrances/i })).toBeVisible()
  })

  test('US1: empty cart shows no proceed button', async ({ page }) => {
    await page.goto('/checkout/cart')
    await expect(page.getByRole('link', { name: /proceed to checkout/i })).not.toBeVisible()
  })

  test('US1: Proceed to Checkout navigates to /checkout/info', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/cart')
    await page.getByRole('link', { name: /proceed to checkout/i }).click()
    await expect(page).toHaveURL('/checkout/info')
  })

  // ─── US2: Empty Cart Guards ───────────────────────────────────────────────

  test('US2: navigating to /checkout/info with empty cart redirects to /checkout/cart', async ({ page }) => {
    await page.goto('/checkout/info')
    await expect(page).toHaveURL('/checkout/cart')
  })

  test('US2: navigating to /checkout/review with empty cart redirects to /checkout/cart', async ({ page }) => {
    await page.goto('/checkout/review')
    await expect(page).toHaveURL('/checkout/cart')
  })

  // ─── US2: Customer Info Form ──────────────────────────────────────────────

  test('US2: submitting empty form shows inline errors on all fields', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/info')
    await page.getByRole('button', { name: /continue to review/i }).click()
    await expect(page.getByText('Please enter your full name.')).toBeVisible()
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible()
    await expect(page.getByText(/valid phone number/i)).toBeVisible()
    await expect(page.getByText('Please enter your street address.')).toBeVisible()
    await expect(page.getByText('Please enter your city.')).toBeVisible()
    await expect(page.getByText('Please select a province.')).toBeVisible()
    await expect(page.getByText('Please enter your postal code.')).toBeVisible()
  })

  test('US2: invalid email shows specific error', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/info')
    await page.getByLabel('Email Address').fill('notanemail')
    await page.getByRole('button', { name: /continue to review/i }).click()
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible()
  })

  test('US2: valid form submission navigates to /checkout/review', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/info')
    await page.getByLabel('Full Name').fill('Rameen Ahmed')
    await page.getByLabel('Email Address').fill('rameen@example.com')
    await page.getByLabel('Phone Number').fill('03001234567')
    await page.getByLabel('Street Address').fill('House 12, Street 5')
    await page.getByLabel('City').fill('Islamabad')
    await page.getByLabel('Province').selectOption('ict')
    await page.getByLabel('Postal Code').fill('44000')
    await page.getByRole('button', { name: /continue to review/i }).click()
    await expect(page).toHaveURL('/checkout/review')
  })

  // ─── US3: Order Review & Confirmation ────────────────────────────────────

  test('US3: review page shows items, customer details, and PKR total', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/info')
    await page.getByLabel('Full Name').fill('Rameen Ahmed')
    await page.getByLabel('Email Address').fill('rameen@example.com')
    await page.getByLabel('Phone Number').fill('03001234567')
    await page.getByLabel('Street Address').fill('House 12, Street 5')
    await page.getByLabel('City').fill('Islamabad')
    await page.getByLabel('Province').selectOption('ict')
    await page.getByLabel('Postal Code').fill('44000')
    await page.getByRole('button', { name: /continue to review/i }).click()
    await expect(page).toHaveURL('/checkout/review')
    await expect(page.getByText('Rameen Ahmed')).toBeVisible()
    await expect(page.getByRole('button', { name: /place order/i })).toBeVisible()
  })

  test('US3: placing order redirects to /checkout/confirmation with order number', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/info')
    await page.getByLabel('Full Name').fill('Rameen Ahmed')
    await page.getByLabel('Email Address').fill('rameen@example.com')
    await page.getByLabel('Phone Number').fill('03001234567')
    await page.getByLabel('Street Address').fill('House 12, Street 5')
    await page.getByLabel('City').fill('Islamabad')
    await page.getByLabel('Province').selectOption('ict')
    await page.getByLabel('Postal Code').fill('44000')
    await page.getByRole('button', { name: /continue to review/i }).click()
    await page.getByRole('button', { name: /place order/i }).click()
    await expect(page).toHaveURL('/checkout/confirmation')
    await expect(page.getByText(/LP-\d{4}-\d{5}/)).toBeVisible()
    await expect(page.getByText(/order confirmed/i)).toBeVisible()
  })

  test('US3: after placing order, cart badge shows 0', async ({ page }) => {
    await addToCart(page)
    await page.goto('/checkout/info')
    await page.getByLabel('Full Name').fill('Rameen Ahmed')
    await page.getByLabel('Email Address').fill('rameen@example.com')
    await page.getByLabel('Phone Number').fill('03001234567')
    await page.getByLabel('Street Address').fill('House 12')
    await page.getByLabel('City').fill('Karachi')
    await page.getByLabel('Province').selectOption('sindh')
    await page.getByLabel('Postal Code').fill('75000')
    await page.getByRole('button', { name: /continue to review/i }).click()
    await page.getByRole('button', { name: /place order/i }).click()
    await expect(page).toHaveURL('/checkout/confirmation')
    // Cart badge should not show a count (cart cleared)
    await expect(page.locator('header').getByText(/^\d+$/).first()).not.toBeVisible()
  })
})
