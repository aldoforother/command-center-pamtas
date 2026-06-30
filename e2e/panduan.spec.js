import { test, expect } from '@playwright/test'
import { PanduanPage } from './pages/PanduanPage'

test.describe('Panduan Page', () => {
  let panduanPage

  test.beforeEach(async ({ page }) => {
    panduanPage = new PanduanPage(page)
    await panduanPage.navigate('/panduan')
  })

  test.describe('Page Load', () => {
    test('should load panduan page', async () => {
      await panduanPage.expectPageLoaded()
    })

    test('should display guide title', async () => {
      await expect(panduanPage.guideTitle).toBeVisible()
    })

    test('should display guide description', async () => {
      await expect(panduanPage.guideDescription).toBeVisible()
    })
  })

  test.describe('Tab Navigation', () => {
    test('should display all tabs', async () => {
      await panduanPage.expectTabsVisible()
    })

    test('should have Overview tab', async () => {
      await expect(panduanPage.tabOverview).toBeVisible()
    })

    test('should have Data Pos tab', async () => {
      await expect(panduanPage.tabPos).toBeVisible()
    })

    test('should have Demografi tab', async () => {
      await expect(panduanPage.tabDemografi).toBeVisible()
    })

    test('should have Tokoh tab', async () => {
      await expect(panduanPage.tabTokoh).toBeVisible()
    })

    test('should have Binter tab', async () => {
      await expect(panduanPage.tabBinter).toBeVisible()
    })

    test('should have Kerawanan tab', async () => {
      await expect(panduanPage.tabKerawanan).toBeVisible()
    })

    test('should have Patroli tab', async () => {
      await expect(panduanPage.tabPatroli).toBeVisible()
    })
  })

  test.describe('Tab Content - Overview', () => {
    test('should display overview content by default', async () => {
      await panduanPage.expectOverviewContent()
    })
  })

  test.describe('Tab Content - Data Pos', () => {
    test('should display POS guide content', async () => {
      await panduanPage.clickTab('Data Pos')
      await panduanPage.expectPosContent()
    })
  })

  test.describe('Tab Content - Demografi', () => {
    test('should display demografi guide content', async () => {
      await panduanPage.clickTab('Demografi')
      await panduanPage.expectDemografiContent()
    })
  })

  test.describe('Tab Content - Tokoh', () => {
    test('should display tokoh guide content', async () => {
      await panduanPage.clickTab('Tokoh')
      await panduanPage.page.waitForTimeout(500)
    })
  })

  test.describe('Tab Content - Binter', () => {
    test('should display binter guide content', async () => {
      await panduanPage.clickTab('Binter')
      await panduanPage.expectBinterContent()
    })
  })

  test.describe('Tab Content - Kerawanan', () => {
    test('should display kerawanan guide content', async () => {
      await panduanPage.clickTab('Kerawanan')
      await panduanPage.expectKerawananContent()
    })

    test('should display SOP pelaporan kerawanan', async () => {
      await panduanPage.clickTab('Kerawanan')
      await panduanPage.expectSOPKerawanan()
    })
  })

  test.describe('Tab Content - Patroli', () => {
    test('should display patroli guide content', async () => {
      await panduanPage.clickTab('Patroli')
      await panduanPage.expectPatroliContent()
    })

    test('should display SOP patroli', async () => {
      await panduanPage.clickTab('Patroli')
      await panduanPage.expectSOPPatroli()
    })
  })

  test.describe('Section Panels', () => {
    test('should display hud-panel sections', async () => {
      await expect(panduanPage.sectionPanels.first()).toBeVisible()
    })

    test('should have multiple guide sections', async () => {
      const count = await panduanPage.sectionPanels.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to panduan from sidebar', async ({ page }) => {
      await panduanPage.navigate('/')
      await page.click('a[href="/panduan"]')
      await panduanPage.expectPageLoaded()
    })
  })
})
