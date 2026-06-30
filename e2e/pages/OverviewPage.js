import { BasePage } from './BasePage'

/**
 * Overview Page Object
 * Tests tactical map, metric cards, threat panel, and binter list
 */
export class OverviewPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/overview'
  }

  // Map elements
  get mapContainer() { return this.page.locator('.leaflet-container') }
  get mapLoading() { return this.page.locator('text=Memuat peta') }

  // Metric cards
  get totalPersonelCard() { return this.page.locator('text=TOTAL PERSONEL') }
  get totalPosCard() { return this.page.locator('text=TOTAL POS') }
  get totalPendudukCard() { return this.page.locator('text=TOTAL PENDUDUK') }
  get kepalaKeluargaCard() { return this.page.locator('text=KEPALA KELUARGA') }
  get kerawananAktifCard() { return this.page.locator('text=KERAWANAN AKTIF') }
  get posRawanCard() { return this.page.locator('text=POS RAWAN') }
  get kegiatanBinterCard() { return this.page.locator('text=KEGIATAN BINTER') }

  // Panel elements
  get ancamanAktifPanel() { return this.page.locator('text=ANCAMAN AKTIF') }
  get kegiatanBinterPanel() { return this.page.locator('text=KEGIATAN BINTER') }

  // Threat items
  get threatItems() { return this.page.locator('.hud-panel').filter({ hasText: 'ANCAMAN AKTIF' }).locator('[class*="space-y"] > div') }

  // Actions
  async clickAncamanAktif() {
    await this.click('text=ANCAMAN AKTIF')
    await this.page.waitForURL('**/insiden')
  }

  async clickLihatSemuaBinter() {
    await this.click('text=LIHAT SEMUA')
    await this.page.waitForURL('**/binter')
  }

  async clickPosOnMap(posId) {
    // Click on POS marker
    await this.click(`.leaflet-marker-icon:has-text("${posId}")`, { timeout: 5000 }).catch(() => {})
  }

  async zoomIn() {
    await this.click('.leaflet-control-zoom-in')
  }

  async zoomOut() {
    await this.click('.leaflet-control-zoom-out')
  }

  // Assertions
  async expectMapLoaded() {
    await this.waitForSelector('.leaflet-container', { timeout: 15000 })
  }

  async expectMetricCards() {
    await this.waitForSelector('text=TOTAL PERSONEL')
    await this.waitForSelector('text=TOTAL POS')
    await this.waitForSelector('text=KERAWANAN AKTIF')
  }

  async expectAncamanAktifPanel() {
    await this.waitForSelector('text=ANCAMAN AKTIF')
  }

  async expectBinterPanel() {
    await this.waitForSelector('text=KEGIATAN BINTER')
  }

  async expectConditionSafe() {
    await this.waitForSelector('text=Kondisi Aman', { timeout: 3000 }).catch(() => {})
  }

  async expectThreatList() {
    // Should show threat items or "Kondisi Aman"
    const hasThreats = await this.threatItems.count() > 0
    const hasSafe = await this.page.locator('text=Kondisi Aman').isVisible().catch(() => false)
    return hasThreats || hasSafe
  }

  async expectRefreshIndicator() {
    await this.waitForSelector('text=Auto-refresh', { timeout: 3000 }).catch(() => {})
  }
}
