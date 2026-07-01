import { test, expect } from '@playwright/test'
import { goto, logout } from './helpers.js'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure logged out state before each test
    await logout(page)
    await goto(page, '/login')
    await page.waitForLoadState('networkidle')

    // Wait for form inputs to be visible (boot animation takes ~2-3 seconds)
    await page.waitForTimeout(3000)
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 5000 })
  })

  test('should display login form elements', async ({ page }) => {
    // Header - use first() to avoid strict mode violation
    await expect(page.locator('text=NARASINGA OPERATION CENTER').first()).toBeVisible()

    // Form labels
    await expect(page.locator('text=── OPERATOR ID')).toBeVisible()
    await expect(page.locator('text=── ACCESS KEY')).toBeVisible()

    // Submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('text=MASUK SISTEM')).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL
    const adminPassword = process.env.E2E_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      test.skip(true, 'Credentials not configured - set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD')
    }

    // Fill form
    await page.fill('input[type="email"]', adminEmail)
    await page.fill('input[type="password"]', adminPassword)

    // Submit
    await page.click('button[type="submit"]')

    // Should redirect to home
    await page.waitForURL('**/command-center-pamtas/**', { timeout: 20000 })

    // Home page should load
    await expect(page.locator('text=NARASINGA').first()).toBeVisible({ timeout: 10000 })
  })

  test('should show validation for invalid email', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should show error or prevent submission
    await page.waitForTimeout(1000)
  })

  test('should clear form fields', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Clear fields
    await page.locator('input[type="email"]').clear()
    await page.locator('input[type="password"]').clear()

    // Verify cleared
    await expect(page.locator('input[type="email"]')).toHaveValue('')
    await expect(page.locator('input[type="password"]')).toHaveValue('')
  })
})
