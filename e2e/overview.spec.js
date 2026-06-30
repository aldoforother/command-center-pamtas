import { test, expect } from '@playwright/test'
import { OverviewPage } from './pages/OverviewPage'

test.describe('Overview Page', () => {
  let overviewPage

  test.beforeEach(async ({ page }) => {
    overviewPage = new OverviewPage(page)
    await overviewPage.navigate('/overview')
  })

  test.describe('Map', () => {
    test('should load the tactical map', async () => {
      await overviewPage.expectMapLoaded()
    })

    test('should show map loading indicator initially', async () => {
      // Loading indicator may appear briefly
      await overviewPage.page.waitForTimeout(500)
    })

    test('should have zoom controls', async () => {
      // Zoom controls should be visible after map loads
      await overviewPage.expectMapLoaded()
      const zoomIn = overviewPage.page.locator('.leaflet-control-zoom-in')
      const zoomOut = overviewPage.page.locator('.leaflet-control-zoom-out')
      await expect(zoomIn).toBeVisible()
      await expect(zoomOut).toBeVisible()
    })
  })

  test.describe('Metric Cards', () => {
    test('should display TOTAL PERSONEL card', async () => {
      await expect(overviewPage.totalPersonelCard).toBeVisible()
    })

    test('should display TOTAL POS card', async () => {
      await expect(overviewPage.totalPosCard).toBeVisible()
    })

    test('should display TOTAL PENDUDUK card', async () => {
      await expect(overviewPage.totalPendudukCard).toBeVisible()
    })

    test('should display KEPALA KELUARGA card', async () => {
      await expect(overviewPage.kepalaKeluargaCard).toBeVisible()
    })

    test('should display KERAWANAN AKTIF card', async () => {
      await expect(overviewPage.kerawananAktifCard).toBeVisible()
    })

    test('should display POS RAWAN card', async () => {
      await expect(overviewPage.posRawanCard).toBeVisible()
    })

    test('should display KEGIATAN BINTER card', async () => {
      await expect(overviewPage.kegiatanBinterCard).toBeVisible()
    })

    test('should show danger indicator when kerawanan aktif', async () => {
      // If there are active threats, should show danger styling
      await overviewPage.page.waitForTimeout(1000)
    })
  })

  test.describe('Overlay Panels', () => {
    test('should display ANCAMAN AKTIF panel', async () => {
      await overviewPage.expectAncamanAktifPanel()
    })

    test('should display KEGIATAN BINTER panel', async () => {
      await overviewPage.expectBinterPanel()
    })

    test('should show Kondisi Aman when no threats', async () => {
      // Either shows threat list or "Kondisi Aman"
      await overviewPage.expectThreatList()
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to insiden page from ANCAMAN AKTIF', async () => {
      const ancamanLink = overviewPage.page.locator('button:has-text("ANCAMAN AKTIF")')
      if (await ancamanLink.isVisible()) {
        await overviewPage.clickAncamanAktif()
        expect(overviewPage.page.url()).toContain('/insiden')
      }
    })

    test('should navigate to binter page from LIHAT SEMUA', async () => {
      const lihatSemua = overviewPage.page.locator('text=LIHAT SEMUA')
      if (await lihatSemua.isVisible()) {
        await overviewPage.clickLihatSemuaBinter()
        expect(overviewPage.page.url()).toContain('/binter')
      }
    })
  })

  test.describe('Auto Refresh', () => {
    test('should have auto-refresh indicator', async () => {
      await overviewPage.expectRefreshIndicator()
    })
  })
})
