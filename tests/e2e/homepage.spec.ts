import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('US1: hero section loads with tagline and CTA button', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const cta = page.getByRole('link', { name: /explore the collection/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/products')
  })

  test('US1: CTA button has minimum 44px touch target height', async ({ page }) => {
    const cta = page.getByRole('link', { name: /explore the collection/i })
    const box = await cta.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })

  test('US2: featured collections section shows product cards', async ({ page }) => {
    const section = page.getByRole('region', { name: /featured collections/i })
    await expect(section).toBeVisible()
    const cards = section.getByRole('link')
    await expect(cards).toHaveCount(6)
  })

  test('US2: product card links to product detail page', async ({ page }) => {
    const firstCard = page.getByRole('link', { name: /midnight rose/i })
    await expect(firstCard).toHaveAttribute('href', /\/products\/midnight-rose/)
  })

  test('US3: quiz opens on Find Your Scent click', async ({ page }) => {
    await page.getByRole('button', { name: /find your scent/i }).click()
    await expect(page.getByRole('dialog', { name: /scent discovery quiz/i })).toBeVisible()
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('US3: quiz progresses through all questions', async ({ page }) => {
    await page.getByRole('button', { name: /find your scent/i }).click()
    for (let i = 1; i <= 4; i++) {
      await expect(page.getByText(new RegExp(`question ${i} of 4`, 'i'))).toBeVisible()
      await page.getByRole('button').filter({ hasText: /romantic|evening|floral|classic/i }).first().click()
    }
    // Results should appear
    await expect(page.getByText(/recommended for you|our top picks/i)).toBeVisible()
  })

  test('US3: quiz resets on close and reopen', async ({ page }) => {
    await page.getByRole('button', { name: /find your scent/i }).click()
    await page.getByRole('button', { name: /close quiz/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await page.getByRole('button', { name: /find your scent/i }).click()
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('US4: brand story section is visible with heading and copy', async ({ page }) => {
    const section = page.getByRole('region', { name: /our story/i })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible()
    const learnMore = section.getByRole('link', { name: /learn more/i })
    await expect(learnMore).toHaveAttribute('href', '/about')
  })

  test('Newsletter: successful subscription shows confirmation', async ({ page }) => {
    await page.getByLabel('Email address').fill('test-e2e@example.com')
    await page.getByRole('button', { name: /subscribe/i }).click()
    await expect(page.getByRole('status')).toContainText(/subscribed/i)
  })

  test('Newsletter: invalid email shows error', async ({ page }) => {
    await page.getByLabel('Email address').fill('notanemail')
    await page.getByRole('button', { name: /subscribe/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})
