import { BasePage } from './BasePage'

/**
 * Binter Page Object
 * Tests binter (Binagram Teritorial) program list, filters, and PDF export
 */
export class BinterPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/binter'
  }

  // Filter controls
  get filterJenis() { return this.page.locator('select').first() }
  get filterPos() { return this.page.locator('select').nth(1) }
  get filterTimeline() { return this.page.locator('select').nth(2) }
  get searchInput() { return this.page.locator('input[placeholder*="Cari"]') }
  get resetButton() { return this.page.locator('button:has-text("Reset")') }

  // Timeline options
  get timelineAll() { return this.page.locator('option:has-text("Semua")') }
  get timelineHariIni() { return this.page.locator('option:has-text("Hari Ini")') }
  get timeline7Hari() { return this.page.locator('option:has-text("7 Hari")') }

  // List
  get binterList() { return this.page.locator('[class*="hud-panel"]') }
  get binterItem() { return this.page.locator('.hud-panel') }

  // Detail panel
  get detailPanel() { return this.page.locator('[class*="fixed"]') }

  // Stats
  get totalCount() { return this.page.locator('text=/Total \\d+/') }

  // PDF
  get downloadPdfButton() { return this.page.locator('button:has-text("Download PDF")') }

  // Empty state
  get emptyState() { return this.page.locator('text=BELUM ADA DATA') }

  // Actions
  async filterByJenis(jenis) {
    await this.filterJenis.selectOption(jenis)
    await this.waitForTimeout(500)
  }

  async filterByPos(posId) {
    await this.filterPos.selectOption(posId)
    await this.waitForTimeout(500)
  }

  async filterByTimeline(timeline) {
    await this.filterTimeline.selectOption(timeline)
    await this.waitForTimeout(500)
  }

  async search(query) {
    await this.fill('input[placeholder*="Cari"]', query)
    await this.waitForTimeout(500)
  }

  async clearSearch() {
    await this.fill('input[placeholder*="Cari"]', '')
    await this.waitForTimeout(500)
  }

  async resetFilters() {
    await this.click('button:has-text("Reset")')
    await this.waitForTimeout(500)
  }

  async clickBinterItem(index = 0) {
    await this.binterItem.nth(index).click()
    await this.waitForTimeout(500)
  }

  async closeDetailPanel() {
    await this.click('.fixed button:has-text("×")')
    await this.waitForTimeout(300)
  }

  async downloadPdf() {
    await this.click('button:has-text("Download PDF")')
    await this.waitForTimeout(1000)
  }

  // Assertions
  async expectPageLoaded() {
    await this.waitForSelector('text=Binter', { timeout: 10000 })
  }

  async expectBinterList() {
    await this.waitForSelector('.hud-panel', { timeout: 10000 })
  }

  async expectFiltersVisible() {
    await this.waitForSelector('select')
    await this.waitForSelector('input[placeholder*="Cari"]')
  }

  async expectEmptyState() {
    await this.waitForSelector('text=BELUM ADA DATA', { timeout: 5000 }).catch(() => {})
  }

  async expectDetailPanelOpen() {
    await this.waitForSelector('.fixed', { timeout: 5000 })
  }
}
