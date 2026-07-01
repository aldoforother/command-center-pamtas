import { test, expect } from '@playwright/test'
import { goto, login } from './helpers.js'

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure logged in for each test
    if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
      test.skip(true, 'Credentials not configured')
    }
    const success = await login(page)
    if (!success) {
      throw new Error('Login failed')
    }
  })

  test('home page loads', async ({ page }) => {
    await goto(page, '/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('sidebar navigation exists', async ({ page }) => {
    await goto(page, '/')
    await expect(page.locator('nav, [role="navigation"], aside')).toBeVisible()
  })

  test('can navigate to overview', async ({ page }) => {
    await goto(page, '/')
    await page.click('a[href*="/overview"]')
    await page.waitForURL('**/overview')
  })

  test('can navigate to insiden', async ({ page }) => {
    await goto(page, '/')
    await page.click('a[href*="/insiden"]')
    await page.waitForURL('**/insiden')
  })

  test('can navigate to binter', async ({ page }) => {
    await goto(page, '/')
    await page.click('a[href*="/binter"]')
    await page.waitForURL('**/binter')
  })

  test('can navigate to panduan', async ({ page }) => {
    await goto(page, '/')
    await page.click('a[href*="/panduan"]')
    await page.waitForURL('**/panduan')
  })
})
