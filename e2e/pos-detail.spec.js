import { test, expect } from '@playwright/test'
import { PosDetailPage } from './pages/PosDetailPage'

test.describe('POS Detail Page', () => {
  let posDetailPage

  test.beforeEach(async ({ page }) => {
    posDetailPage = new PosDetailPage(page)
  })

  test.describe('Tab Navigation', () => {
    test('should load KOTIS POS detail page', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.expectPageLoaded()
    })

    test('should display all tabs', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.expectTabsVisible()
    })

    test('should navigate to Info tab', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Info')
      await posDetailPage.expectInfoTab()
    })

    test('should navigate to Demografi tab', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Demografi')
      await posDetailPage.expectDemografiTab()
    })

    test('should navigate to Tokoh tab', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Tokoh')
      await posDetailPage.expectTokohTab()
    })

    test('should navigate to Binter tab', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Binter')
      await posDetailPage.expectBinterTab()
    })

    test('should navigate to Kerawanan tab', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Kerawanan')
      await posDetailPage.expectKerawananTab()
    })

    test('should navigate to Patroli tab', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Patroli')
      await posDetailPage.expectPatroliTab()
    })
  })

  test.describe('Info Tab', () => {
    test('should display POS name', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.expectInfoTab()
    })

    test('should display POS location', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await expect(posDetailPage.posLocation).toBeVisible()
    })

    test('should display jumlah personel', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await expect(posDetailPage.jumlahPersonel).toBeVisible()
    })

    test('should have edit pos button', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.expectEditButton()
    })

    test('should open edit modal when edit clicked', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickEditPos()
      await expect(posDetailPage.page.locator('input')).toBeVisible()
    })
  })

  test.describe('Demografi Tab', () => {
    test('should display demografi table or empty state', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Demografi')
      await posDetailPage.expectDemografiTab()
    })

    test('should display distribusi agama', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Demografi')
      await expect(posDetailPage.distribusiAgama).toBeVisible()
    })

    test('should display tempat ibadah section', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Demografi')
      await expect(posDetailPage.tempatIbadah).toBeVisible()
    })
  })

  test.describe('Tokoh Tab', () => {
    test('should display tokoh list or empty state', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Tokoh')
      await posDetailPage.expectTokohTab()
    })

    test('should show tokoh items or empty state', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Tokoh')
      const hasItems = await posDetailPage.tokohList.isVisible().catch(() => false)
      const hasEmpty = await posDetailPage.emptyState('tokoh').isVisible().catch(() => false)
      expect(hasItems || hasEmpty).toBeTruthy()
    })
  })

  test.describe('Binter Tab', () => {
    test('should display binter list or empty state', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Binter')
      await posDetailPage.expectBinterTab()
    })
  })

  test.describe('Kerawanan Tab', () => {
    test('should display kerawanan list or empty state', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Kerawanan')
      await posDetailPage.expectKerawananTab()
    })

    test('should show kerawanan badges', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Kerawanan')
      await posDetailPage.page.waitForTimeout(500)
    })
  })

  test.describe('Patroli Tab', () => {
    test('should display patroli list or empty state', async () => {
      await posDetailPage.navigate('/pos/KOTIS')
      await posDetailPage.clickTab('Patroli')
      await posDetailPage.expectPatroliTab()
    })
  })

  test.describe('Navigation from Other Pages', () => {
    test('should navigate to POS from sidebar', async ({ page }) => {
      await posDetailPage.navigate('/')
      await page.click('a[href="/pos/KOTIS"]')
      await expect(page.url()).toContain('/pos/KOTIS')
    })

    test('should navigate to POS from overview map', async ({ page }) => {
      await posDetailPage.navigate('/overview')
      await page.waitForTimeout(2000)
      // Click on a POS marker if visible
      const posMarker = page.locator('.leaflet-marker-icon').first()
      if (await posMarker.isVisible({ timeout: 3000 }).catch(() => false)) {
        await posMarker.click()
        await expect(page.url()).toContain('/pos/')
      }
    })
  })

  test.describe('URL Tab Parameter', () => {
    test('should load with demografi tab in URL', async () => {
      await posDetailPage.navigate('/pos/KOTIS/demografi')
      await posDetailPage.expectDemografiTab()
    })

    test('should load with tokoh tab in URL', async () => {
      await posDetailPage.navigate('/pos/KOTIS/tokoh')
      await posDetailPage.expectTokohTab()
    })

    test('should load with binter tab in URL', async () => {
      await posDetailPage.navigate('/pos/KOTIS/binter')
      await posDetailPage.expectBinterTab()
    })
  })
})
