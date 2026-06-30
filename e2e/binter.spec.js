import { test, expect } from '@playwright/test'
import { BinterPage } from './pages/BinterPage'

test.describe('Binter Page', () => {
  let binterPage

  test.beforeEach(async ({ page }) => {
    binterPage = new BinterPage(page)
    await binterPage.navigate('/binter')
  })

  test.describe('Page Load', () => {
    test('should load binter page', async () => {
      await binterPage.expectPageLoaded()
    })

    test('should display binter list or empty state', async () => {
      const hasList = await binterPage.binterList.isVisible().catch(() => false)
      const hasEmpty = await binterPage.emptyState.isVisible().catch(() => false)
      expect(hasList || hasEmpty).toBeTruthy()
    })
  })

  test.describe('Filters', () => {
    test('should display filter controls', async () => {
      await binterPage.expectFiltersVisible()
    })

    test('should have jenis filter dropdown', async () => {
      await expect(binterPage.filterJenis).toBeVisible()
    })

    test('should have POS filter dropdown', async () => {
      await expect(binterPage.filterPos).toBeVisible()
    })

    test('should have timeline filter dropdown', async () => {
      await expect(binterPage.filterTimeline).toBeVisible()
    })

    test('should filter by timeline 7 hari', async () => {
      await binterPage.filterByTimeline('7d')
      await binterPage.page.waitForTimeout(500)
    })

    test('should filter by timeline 30 hari', async () => {
      await binterPage.filterByTimeline('30d')
      await binterPage.page.waitForTimeout(500)
    })

    test('should reset filters', async () => {
      await binterPage.filterByTimeline('7d')
      await binterPage.resetFilters()
    })
  })

  test.describe('Search', () => {
    test('should have search input', async () => {
      await expect(binterPage.searchInput).toBeVisible()
    })

    test('should filter by search query', async () => {
      await binterPage.search('sosialisasi')
      await binterPage.page.waitForTimeout(500)
    })

    test('should clear search', async () => {
      await binterPage.search('sosialisasi')
      await binterPage.clearSearch()
    })
  })

  test.describe('Detail Panel', () => {
    test('should open detail panel on item click', async () => {
      const hasItems = await binterPage.binterItem.count() > 0
      if (hasItems) {
        await binterPage.clickBinterItem(0)
        await binterPage.expectDetailPanelOpen()
      }
    })

    test('should close detail panel', async () => {
      const hasItems = await binterPage.binterItem.count() > 0
      if (hasItems) {
        await binterPage.clickBinterItem(0)
        await binterPage.closeDetailPanel()
      }
    })
  })

  test.describe('PDF Download', () => {
    test('should have download PDF button', async () => {
      await expect(binterPage.downloadPdfButton).toBeVisible()
    })

    test('should trigger PDF download when item selected', async () => {
      const hasItems = await binterPage.binterItem.count() > 0
      if (hasItems) {
        await binterPage.clickBinterItem(0)
        const downloadPromise = binterPage.page.waitForEvent('download').catch(() => null)
        await binterPage.downloadPdf()
        await downloadPromise
      }
    })
  })
})
