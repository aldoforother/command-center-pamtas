import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  let authenticated = false

  async function loginIfNeeded({ page }) {
    if (authenticated) return

    const adminEmail = process.env.E2E_ADMIN_EMAIL
    const adminPassword = process.env.E2E_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      test.skip(true, 'Credentials not configured')
    }

    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Wait for form inputs to be visible (boot animation)
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 5000 })

    await page.fill('input[type="email"]', adminEmail)
    await page.fill('input[type="password"]', adminPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/command-center-pamtas/**', { timeout: 20000 })
    authenticated = true
  }

  test('home page loads', async ({ page }) => {
    await loginIfNeeded({ page })
    await expect(page.locator('body')).toBeVisible()
  })

  test('sidebar navigation exists', async ({ page }) => {
    await loginIfNeeded({ page })
    await expect(page.locator('nav')).toBeVisible()
  })

  test('can navigate to overview', async ({ page }) => {
    await loginIfNeeded({ page })
    await page.click('a[href="/overview"]')
    await page.waitForURL('**/overview')
  })

  test('can navigate to insiden', async ({ page }) => {
    await loginIfNeeded({ page })
    await page.click('a[href="/insiden"]')
    await page.waitForURL('**/insiden')
  })

  test('can navigate to binter', async ({ page }) => {
    await loginIfNeeded({ page })
    await page.click('a[href="/binter"]')
    await page.waitForURL('**/binter')
  })

  test('can navigate to panduan', async ({ page }) => {
    await loginIfNeeded({ page })
    await page.click('a[href="/panduan"]')
    await page.waitForURL('**/panduan')
  })
})
