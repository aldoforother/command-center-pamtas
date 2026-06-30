import { goto } from './helpers.js'
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL
  const adminPassword = process.env.E2E_ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    test.skip(true, 'Credentials not configured')
  }
  await goto(page, '/login')
  await page.waitForLoadState('networkidle')

  // Wait for form inputs to be visible (boot animation)
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 })
  await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 5000 })

  await page.fill('input[type="email"]', adminEmail)
  await page.fill('input[type="password"]', adminPassword)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/command-center-pamtas/**', { timeout: 20000 })
})

test.describe('Panduan Page', () => {
  test('should navigate to panduan page', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/panduan/)
  })

  test('should display panduan header', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Panduan')).toBeVisible()
  })

  test('should display tab navigation', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button:has-text("Overview")')).toBeVisible()
    await expect(page.locator('button:has-text("Data Pos")')).toBeVisible()
    await expect(page.locator('button:has-text("Demografi")')).toBeVisible()
  })

  test('should switch to Data Pos tab', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Data Pos")')
    await page.waitForTimeout(300)
  })

  test('should switch to Demografi tab', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Demografi")')
    await page.waitForTimeout(300)
  })

  test('should switch to Tokoh tab', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Tokoh")')
    await page.waitForTimeout(300)
  })

  test('should switch to Binter tab', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Binter")')
    await page.waitForTimeout(300)
  })

  test('should switch to Kerawanan tab', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Kerawanan")')
    await page.waitForTimeout(300)
  })

  test('should switch to Patroli tab', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Patroli")')
    await page.waitForTimeout(300)
  })

  test('should display SOP sections', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    // Should display guide panels
    await expect(page.locator('.hud-panel').first()).toBeVisible()
  })
})
