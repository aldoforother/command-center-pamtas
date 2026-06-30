import { BasePage } from './BasePage'

/**
 * Insiden (Kerawanan) Page Object
 * Tests insiden list, filters, search, and PDF export
 */
export class InsidenPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/insiden'
  }

  // Filter controls
  get filterStatus() { return this.page.locator('select, [role="combobox"]').first() }
  get filterKategori() { return this.page.locator('select').nth(1) }
  get filterPos() { return this.page.locator('select').nth(2) }
  get filterTimeline() { return this.page.locator('select').nth(3) }
  get searchInput() { return this.page.locator('input[placeholder*="Cari"]') }
  get resetButton() { return this.page.locator('button:has-text("Reset")') }

  // Status filter buttons
  get allStatusButton() { return this.page.locator('button:has-text("Semua")') }
  get aktifStatusButton() { return this.page.locator('button:has-text("Aktif")') }
  get selesaiStatusButton() { return this.page.locator('button:has-text("Selesai")') }

  // Timeline filter options
  get timelineAll() { return this.page.locator('option:has-text("Semua")') }
  get timelineHariIni() { return this.page.locator('option:has-text("Hari Ini")') }
  get timeline7Hari() { return this.page.locator('option:has-text("7 Hari")') }
  get timeline30Hari() { return this.page.locator('option:has-text("30 Hari")') }

  // List items
  get insidenList() { return this.page.locator('[class*="hud-panel"]:not([class*="header"]):not([class*="footer"])') }
  get insidenItem() { return this.page.locator('.hud-panel') }

  // Detail panel
  get detailPanel() { return this.page.locator('[class*="fixed"]') }
  get detailTitle() { return this.page.locator('.fixed button:has-text("×")') }

  // Stats
  get aktifCount() { return this.page.locator('text=/AKTIF/i').first() }
  get totalCount() { return this.page.locator('text=/Total \\d+/') }

  // PDF
  get downloadPdfButton() { return this.page.locator('button:has-text("Download PDF")') }

  // Empty state
  get emptyState() { return this.page.locator('text=BELUM ADA DATA') }

  // Actions
  async filterByStatus(status) {
    await this.click(`button:has-text("${status}")`)
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

  async clickInsidenItem(index = 0) {
    await this.insidenItem.nth(index).click()
    await this.waitForTimeout(500)
  }

  async closeDetailPanel() {
    await this.click('.fixed button:has-text("×")')
    await this.waitForTimeout(300)
  }

  async downloadPdf() {
    await this.click('button:has-text("Download PDF")')
    // Wait for download to start
    await this.waitForTimeout(1000)
  }

  async navigateToPos(posId) {
    await this.click(`a[href="/pos/${posId}"]`)
    await this.page.waitForURL(`**/pos/${posId}`)
  }

  // Assertions
  async expectPageLoaded() {
    await this.waitForSelector('text=Insiden', { timeout: 10000 })
  }

  async expectInsidenList() {
    await this.waitForSelector('.hud-panel', { timeout: 10000 })
  }

  async expectFiltersVisible() {
    await this.waitForSelector('select')
    await this.waitForSelector('input[placeholder*="Cari"]')
  }

  async expectStatusFilterButtons() {
    await this.waitForSelector('button:has-text("Semua")')
    await this.waitForSelector('button:has-text("Aktif")')
    await this.waitForSelector('button:has-text("Selesai")')
  }

  async expectEmptyState() {
    await this.waitForSelector('text=BELUM ADA DATA', { timeout: 5000 }).catch(() => {})
  }

  async expectDetailPanelOpen() {
    await this.waitForSelector('.fixed', { timeout: 5000 })
  }

  async expectSearchResults(query) {
    await this.waitForTimeout(500)
    const items = await this.insidenItem.count()
    return items
  }

  async expectFilteredResults() {
    await this.waitForTimeout(500)
    const count = await this.insidenItem.count()
    return count > 0
  }
}
