import { test, expect } from '@playwright/test'
import { GrafikKerawananPage, TimelineBinterPage, DataDemografiPage, TokohWilayahPage } from './pages/LaporanPages'

test.describe('Laporan Pages', () => {
  test.describe('Grafik Kerawanan Page', () => {
    let grafikPage

    test.beforeEach(async ({ page }) => {
      grafikPage = new GrafikKerawananPage(page)
      await grafikPage.navigate('/laporan/kerawanan')
    })

    test('should load page', async () => {
      await grafikPage.expectPageLoaded()
    })

    test('should display chart', async () => {
      await grafikPage.expectChartVisible()
    })

    test('should have year filter', async () => {
      await expect(grafikPage.filterYear).toBeVisible()
    })

    test('should have download button', async () => {
      await expect(grafikPage.downloadButton).toBeVisible()
    })
  })

  test.describe('Timeline Binter Page', () => {
    let timelinePage

    test.beforeEach(async ({ page }) => {
      timelinePage = new TimelineBinterPage(page)
      await timelinePage.navigate('/laporan/binter')
    })

    test('should load page', async () => {
      await timelinePage.expectPageLoaded()
    })

    test('should display timeline', async () => {
      await timelinePage.expectTimelineVisible()
    })

    test('should have year filter', async () => {
      await expect(timelinePage.filterYear).toBeVisible()
    })

    test('should have download button', async () => {
      await expect(timelinePage.downloadButton).toBeVisible()
    })
  })

  test.describe('Data Demografi Page', () => {
    let demografiPage

    test.beforeEach(async ({ page }) => {
      demografiPage = new DataDemografiPage(page)
      await demografiPage.navigate('/laporan/demografi')
    })

    test('should load page', async () => {
      await demografiPage.expectPageLoaded()
    })

    test('should display data table', async () => {
      await demografiPage.expectDataTable()
    })

    test('should have POS filter', async () => {
      await expect(demografiPage.filterPos).toBeVisible()
    })

    test('should have download button', async () => {
      await expect(demografiPage.downloadButton).toBeVisible()
    })
  })

  test.describe('Tokoh Wilayah Page', () => {
    let tokohPage

    test.beforeEach(async ({ page }) => {
      tokohPage = new TokohWilayahPage(page)
      await tokohPage.navigate('/laporan/tokoh')
    })

    test('should load page', async () => {
      await tokohPage.expectPageLoaded()
    })

    test('should display tokoh list', async () => {
      await tokohPage.expectTokohList()
    })

    test('should have kategori filter', async () => {
      await expect(tokohPage.filterKategori).toBeVisible()
    })

    test('should have download button', async () => {
      await expect(tokohPage.downloadButton).toBeVisible()
    })
  })

  test.describe('Navigation from Sidebar', () => {
    test('should navigate to grafik kerawanan from sidebar', async ({ page }) => {
      await page.goto('/')
      await page.click('a[href="/laporan/kerawanan"]')
      const grafikPage = new GrafikKerawananPage(page)
      await grafikPage.expectPageLoaded()
    })

    test('should navigate to timeline binter from sidebar', async ({ page }) => {
      await page.goto('/')
      await page.click('a[href="/laporan/binter"]')
      const timelinePage = new TimelineBinterPage(page)
      await timelinePage.expectPageLoaded()
    })

    test('should navigate to data demografi from sidebar', async ({ page }) => {
      await page.goto('/')
      await page.click('a[href="/laporan/demografi"]')
      const demografiPage = new DataDemografiPage(page)
      await demografiPage.expectPageLoaded()
    })

    test('should navigate to tokoh wilayah from sidebar', async ({ page }) => {
      await page.goto('/')
      await page.click('a[href="/laporan/tokoh"]')
      const tokohPage = new TokohWilayahPage(page)
      await tokohPage.expectPageLoaded()
    })
  })
})
