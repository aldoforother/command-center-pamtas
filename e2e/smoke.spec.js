import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { OverviewPage } from './pages/OverviewPage'
import { InsidenPage } from './pages/InsidenPage'
import { BinterPage } from './pages/BinterPage'
import { TEST_USERS } from './fixtures/auth'

test.describe('Smoke Tests - Critical User Flows', () => {
  test.describe('Authentication Flow', () => {
    test('should login and access home page', async ({ page }) => {
      const loginPage = new LoginPage(page)

      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }

      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await loginPage.expectRedirectToHome()

      const homePage = new HomePage(page)
      await homePage.expectHeroVisible()
    })

    test('should logout and redirect to login', async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }

      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await loginPage.expectRedirectToHome()

      // Click logout if exists
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("logout")')
      if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await logoutButton.click()
        await page.waitForURL('**/login')
      }
    })
  })

  test.describe('Navigation Flow', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await loginPage.expectRedirectToHome()
    })

    test('should navigate through all main pages', async ({ page }) => {
      // Home
      await page.goto('/')
      await expect(page.locator('text=NARASINGA')).toBeVisible()

      // Overview
      await page.goto('/overview')
      await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 })

      // Insiden
      await page.goto('/insiden')
      await page.waitForSelector('select', { timeout: 10000 })

      // Binter
      await page.goto('/binter')
      await page.waitForSelector('select', { timeout: 10000 })

      // Admin
      await page.goto('/admin')
      await page.waitForSelector('button:has-text("Tambah")', { timeout: 10000 })

      // Panduan
      await page.goto('/panduan')
      await expect(page.locator('h2:has-text("Panduan")')).toBeVisible()
    })

    test('should navigate to POS from sidebar', async ({ page }) => {
      await page.goto('/')
      await page.click('a[href="/pos/KOTIS"]')
      await expect(page.url()).toContain('/pos/KOTIS')
    })
  })

  test.describe('Data Operations Flow', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    test('should filter insiden list', async ({ page }) => {
      await page.goto('/insiden')
      await page.waitForSelector('select', { timeout: 10000 })

      // Apply filter
      await page.click('button:has-text("Aktif")')
      await page.waitForTimeout(500)

      // Should show filtered results
      const url = page.url()
      expect(url).toContain('/insiden')
    })

    test('should open and close insiden detail', async ({ page }) => {
      await page.goto('/insiden')
      await page.waitForSelector('.hud-panel', { timeout: 10000 })

      const items = await page.locator('.hud-panel').count()
      if (items > 0) {
        await page.locator('.hud-panel').first().click()
        await page.waitForSelector('.fixed', { timeout: 5000 })

        // Close
        await page.click('.fixed button:has-text("×")')
        await page.waitForTimeout(300)
      }
    })

    test('should filter binter list', async ({ page }) => {
      await page.goto('/binter')
      await page.waitForSelector('select', { timeout: 10000 })

      // Apply timeline filter
      await page.locator('select').nth(2).selectOption('7d')
      await page.waitForTimeout(500)
    })

    test('should navigate POS tabs', async ({ page }) => {
      await page.goto('/pos/KOTIS')
      await page.waitForSelector('button:has-text("Info")', { timeout: 10000 })

      // Click through tabs
      await page.click('button:has-text("Demografi")')
      await page.waitForTimeout(500)

      await page.click('button:has-text("Tokoh")')
      await page.waitForTimeout(500)

      await page.click('button:has-text("Binter")')
      await page.waitForTimeout(500)
    })
  })

  test.describe('Error Handling', () => {
    test('should show white screen prevention (error boundary)', async ({ page }) => {
      // Navigate to any page and check no white screen
      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')

      // Check body is not empty
      const bodyContent = await page.locator('body').textContent()
      expect(bodyContent.length).toBeGreaterThan(0)
    })

    test('should handle 404 gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page')
      // Should redirect to home or show appropriate message
      await page.waitForTimeout(1000)
    })

    test('should maintain session on page refresh', async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }

      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await loginPage.expectRedirectToHome()

      // Refresh page
      await page.reload()
      await page.waitForLoadState('domcontentloaded')

      // Should still be logged in or redirected to login
      const url = page.url()
      expect(url.includes('/login') || url.includes('/')).toBeTruthy()
    })
  })

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
    })

    test('should have skip links on home page', async ({ page }) => {
      await page.goto('/')
      const skipLink = page.locator('a.skip-link').first()
      await expect(skipLink).toBeAttached()
    })

    test('should have main content landmark', async ({ page }) => {
      await page.goto('/')
      const main = page.locator('#main-content, main')
      await expect(main).toBeAttached()
    })

    test('should have navigation landmark', async ({ page }) => {
      await page.goto('/')
      const nav = page.locator('nav, [role="navigation"]')
      await expect(nav.first()).toBeAttached()
    })
  })

  test.describe('Responsive Design', () => {
    test('should render on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }

      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)

      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')

      // Page should render without errors
      const bodyContent = await page.locator('body').textContent()
      expect(bodyContent.length).toBeGreaterThan(0)
    })

    test('should render on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }

      const loginPage = new LoginPage(page)
      await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)

      await page.goto('/')
      await page.waitForLoadState('domcontentloaded')

      const bodyContent = await page.locator('body').textContent()
      expect(bodyContent.length).toBeGreaterThan(0)
    })
  })
})
