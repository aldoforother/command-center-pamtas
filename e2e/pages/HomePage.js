import { BasePage } from './BasePage'

/**
 * Home Page Object
 * Tests home page hero, stat panels, and navigation
 */
export class HomePage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/'
  }

  // Hero elements
  get heroBanner() { return this.page.locator('.absolute.inset-0') }
  get motto() { return this.page.locator('text=NARASINGA') }
  get subtitle() { return this.page.locator('text=SATGAS PAMTAS') }

  // Stat panels
  get personelStat() { return this.page.locator('text=PERSONEL') }
  get posAktifStat() { return this.page.locator('text=POS AKTIF') }
  get insidenStat() { return this.page.locator('text=INSIDEN') }

  // Action buttons
  get overviewButton() { return this.page.locator('text=OVERVIEW') }
  get insidenButton() { return this.page.locator('button:has-text("INSIDEN")') }
  get laporanButton() { return this.page.locator('text=LAPORAN') }

  // Navigation sidebar
  get sidebar() { return this.page.locator('[role="navigation"]') }
  get sidebarHome() { return this.page.locator('nav a[href="/"]') }
  get sidebarOverview() { return this.page.locator('nav a[href="/overview"]') }
  get sidebarInsiden() { return this.page.locator('nav a[href="/insiden"]') }
  get sidebarBinter() { return this.page.locator('nav a[href="/binter"]') }
  get sidebarPanduan() { return this.page.locator('nav a[href="/panduan"]') }
  get sidebarAdmin() { return this.page.locator('nav a[href="/admin"]') }

  // POS Navigation items
  get posNavItems() { return this.page.locator('nav a[href^="/pos/"]') }

  // Laporan links
  get grafikInsidenLink() { return this.page.locator('a[href="/laporan/kerawanan"]') }
  get timelineBinterLink() { return this.page.locator('a[href="/laporan/binter"]') }
  get dataDemografiLink() { return this.page.locator('a[href="/laporan/demografi"]') }
  get tokohWilayahLink() { return this.page.locator('a[href="/laporan/tokoh"]') }

  // Status bar
  get statusBar() { return this.page.locator('text=STATUS') }

  // Skip links
  get skipToMainContent() { return this.page.locator('a.skip-link:has-text("Langsung ke konten utama")') }
  get skipToSidebar() { return this.page.locator('a.skip-link:has-text("Langsung ke navigasi")') }

  // Actions
  async navigateToHome() {
    await this.navigate(this.path)
  }

  async clickOverview() {
    await this.click('text=OVERVIEW')
    await this.page.waitForURL('**/overview')
  }

  async clickInsiden() {
    await this.click('button:has-text("INSIDEN")')
    await this.page.waitForURL('**/insiden')
  }

  async clickLaporan() {
    await this.click('text=LAPORAN')
    await this.page.waitForURL('**/laporan/**')
  }

  async clickSidebarNav(linkText) {
    await this.click(`nav a:has-text("${linkText}")`)
  }

  async clickPosNav(posId) {
    await this.click(`a[href="/pos/${posId}"]`)
    await this.page.waitForURL(`**/pos/${posId}`)
  }

  // Assertions
  async expectHeroVisible() {
    await this.waitForSelector('.scanline-overlay', { timeout: 5000 })
  }

  async expectMottoVisible() {
    await this.waitForSelector('text=NARASINGA', { timeout: 5000 })
  }

  async expectStatPanelsVisible() {
    await this.waitForSelector('text=PERSONEL')
    await this.waitForSelector('text=POS AKTIF')
    await this.waitForSelector('text=INSIDEN')
  }

  async expectSidebarVisible() {
    await this.waitForSelector('[role="navigation"]', { timeout: 5000 })
  }

  async expectNavigationLinks() {
    await this.waitForSelector('a[href="/"]')
    await this.waitForSelector('a[href="/overview"]')
    await this.waitForSelector('a[href="/insiden"]')
    await this.waitForSelector('a[href="/binter"]')
  }

  async expectLaporanLinks() {
    await this.waitForSelector('a[href="/laporan/kerawanan"]')
    await this.waitForSelector('a[href="/laporan/binter"]')
    await this.waitForSelector('a[href="/laporan/demografi"]')
    await this.waitForSelector('a[href="/laporan/tokoh"]')
  }

  async expectStatusBar() {
    await this.waitForSelector('text=STATUS')
  }

  async expectSkipLinks() {
    await this.skipToMainContent.waitFor()
    await this.skipToSidebar.waitFor()
  }
}
