import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'
import { TEST_POS_IDS } from './fixtures/auth'

test.describe('Home Page', () => {
  let homePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    // Navigate to home (will redirect to login if not authenticated)
    await homePage.navigate('/')
  })

  test.describe('Hero Section', () => {
    test('should display hero banner with scanline effect', async () => {
      await homePage.expectHeroVisible()
    })

    test('should display NARASINGA motto', async () => {
      await homePage.expectMottoVisible()
    })

    test('should display SATGAS subtitle', async () => {
      await expect(homePage.subtitle).toBeVisible()
    })
  })

  test.describe('Stat Panels', () => {
    test('should display PERSONEL stat panel', async () => {
      await expect(homePage.personelStat).toBeVisible()
    })

    test('should display POS AKTIF stat panel', async () => {
      await expect(homePage.posAktifStat).toBeVisible()
    })

    test('should display INSIDEN stat panel', async () => {
      await expect(homePage.insidenStat).toBeVisible()
    })

    test('should show stat values (numbers)', async () => {
      // Should show numeric values for stats
      await homePage.waitForTimeout(1000)
      const pageContent = await homePage.page.textContent('body')
      // Should have numbers in the stats
      expect(pageContent).toMatch(/\d+/)
    })
  })

  test.describe('Navigation', () => {
    test('should display sidebar navigation', async () => {
      await homePage.expectSidebarVisible()
    })

    test('should have Home navigation link', async () => {
      await expect(homePage.sidebarHome).toBeVisible()
    })

    test('should have Overview navigation link', async () => {
      await expect(homePage.sidebarOverview).toBeVisible()
    })

    test('should have Insiden navigation link', async () => {
      await expect(homePage.sidebarInsiden).toBeVisible()
    })

    test('should have Binter navigation link', async () => {
      await expect(homePage.sidebarBinter).toBeVisible()
    })

    test('should have Panduan navigation link', async () => {
      await expect(homePage.sidebarPanduan).toBeVisible()
    })

    test('should have Admin navigation link (admin users only)', async ({ page }) => {
      // Check if admin link exists
      const adminLink = page.locator('nav a[href="/admin"]')
      await expect(adminLink).toBeAttached()
    })
  })

  test.describe('Action Buttons', () => {
    test('should have OVERVIEW action button', async () => {
      await expect(homePage.overviewButton).toBeVisible()
    })

    test('should have LAPORAN action button', async () => {
      await expect(homePage.laporanButton).toBeVisible()
    })

    test('should navigate to overview when OVERVIEW clicked', async () => {
      await homePage.clickOverview()
      expect(homePage.page.url()).toContain('/overview')
    })
  })

  test.describe('POS Navigation', () => {
    test('should display POS navigation items', async () => {
      // Should show some POS nav items
      await homePage.waitForSelector('nav a[href^="/pos/"]', { timeout: 10000 })
      const posCount = await homePage.posNavItems.count()
      expect(posCount).toBeGreaterThan(0)
    })

    test('should have KOTIS POS in navigation', async () => {
      const kotisLink = homePage.page.locator('a[href="/pos/KOTIS"]')
      await expect(kotisLink).toBeVisible()
    })

    test('should have KT POS in navigation', async () => {
      const ktLink = homePage.page.locator('a[href="/pos/KT"]')
      await expect(ktLink).toBeVisible()
    })
  })

  test.describe('Laporan Links', () => {
    test('should have Grafik Insiden link', async () => {
      await expect(homePage.grafikInsidenLink).toBeVisible()
    })

    test('should have Timeline Binter link', async () => {
      await expect(homePage.timelineBinterLink).toBeVisible()
    })

    test('should have Data Demografi link', async () => {
      await expect(homePage.dataDemografiLink).toBeVisible()
    })

    test('should have Tokoh Wilayah link', async () => {
      await expect(homePage.tokokWilayahLink).toBeVisible()
    })
  })

  test.describe('Status Bar', () => {
    test('should display status bar', async () => {
      await homePage.expectStatusBar()
    })
  })

  test.describe('Accessibility', () => {
    test('should have skip to main content link', async () => {
      await homePage.expectSkipLinks()
    })

    test('should have skip to sidebar link', async () => {
      await homePage.skipToSidebar.waitFor()
    })
  })
})
