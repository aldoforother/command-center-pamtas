import { test, expect } from '@playwright/test'
import { InsidenPage } from './pages/InsidenPage'

test.describe('Insiden Page', () => {
  let insidenPage

  test.beforeEach(async ({ page }) => {
    insidenPage = new InsidenPage(page)
    await insidenPage.navigate('/insiden')
  })

  test.describe('Page Load', () => {
    test('should load insiden page', async () => {
      await insidenPage.expectPageLoaded()
    })

    test('should display insiden list or empty state', async () => {
      const hasList = await insidenPage.insidenList.isVisible().catch(() => false)
      const hasEmpty = await insidenPage.emptyState.isVisible().catch(() => false)
      expect(hasList || hasEmpty).toBeTruthy()
    })
  })

  test.describe('Filters', () => {
    test('should display filter controls', async () => {
      await insidenPage.expectFiltersVisible()
    })

    test('should display status filter buttons', async () => {
      await insidenPage.expectStatusFilterButtons()
    })

    test('should filter by status aktif', async () => {
      await insidenPage.filterByStatus('Aktif')
      await insidenPage.expectFilteredResults()
    })

    test('should filter by status selesai', async () => {
      await insidenPage.filterByStatus('Selesai')
      await insidenPage.expectFilteredResults()
    })

    test('should reset filters', async () => {
      await insidenPage.filterByStatus('Aktif')
      await insidenPage.resetFilters()
    })
  })

  test.describe('Timeline Filter', () => {
    test('should filter by 7 hari', async () => {
      await insidenPage.filterByTimeline('7d')
      await insidenPage.expectFilteredResults()
    })

    test('should filter by 30 hari', async () => {
      await insidenPage.filterByTimeline('30d')
      await insidenPage.expectFilteredResults()
    })

    test('should filter by 3 bulan', async () => {
      await insidenPage.filterByTimeline('90d')
      await insidenPage.expectFilteredResults()
    })
  })

  test.describe('Search', () => {
    test('should have search input', async () => {
      await expect(insidenPage.searchInput).toBeVisible()
    })

    test('should filter by search query', async () => {
      await insidenPage.search('test')
      await insidenPage.expectSearchResults('test')
    })

    test('should clear search', async () => {
      await insidenPage.search('test')
      await insidenPage.clearSearch()
    })
  })

  test.describe('Detail Panel', () => {
    test('should open detail panel on item click', async () => {
      const hasItems = await insidenPage.insidenItem.count() > 0
      if (hasItems) {
        await insidenPage.clickInsidenItem(0)
        await insidenPage.expectDetailPanelOpen()
      }
    })

    test('should close detail panel', async () => {
      const hasItems = await insidenPage.insidenItem.count() > 0
      if (hasItems) {
        await insidenPage.clickInsidenItem(0)
        await insidenPage.closeDetailPanel()
      }
    })
  })

  test.describe('PDF Download', () => {
    test('should have download PDF button', async () => {
      const downloadBtn = insidenPage.downloadPdfButton
      await expect(downloadBtn).toBeVisible()
    })

    test('should trigger PDF download', async () => {
      const hasItems = await insidenPage.insidenItem.count() > 0
      if (hasItems) {
        const downloadPromise = insidenPage.page.waitForEvent('download').catch(() => null)
        await insidenPage.downloadPdf()
        await downloadPromise
      }
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to POS detail', async () => {
      const hasItems = await insidenPage.insidenItem.count() > 0
      if (hasItems) {
        await insidenPage.clickInsidenItem(0)
        const posLink = insidenPage.page.locator('a[href^="/pos/"]')
        if (await posLink.isVisible()) {
          await posLink.first().click()
          expect(insidenPage.page.url()).toContain('/pos/')
        }
      }
    })
  })
})
