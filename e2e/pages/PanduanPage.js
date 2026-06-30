import { BasePage } from './BasePage'

/**
 * Panduan Page Object
 * Tests panduan input guide tabs and content
 */
export class PanduanPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/panduan'
  }

  // Tab navigation
  get tabOverview() { return this.page.locator('button:has-text("Overview")') }
  get tabPos() { return this.page.locator('button:has-text("Data Pos")') }
  get tabDemografi() { return this.page.locator('button:has-text("Demografi")') }
  get tabTokoh() { return this.page.locator('button:has-text("Tokoh")') }
  get tabBinter() { return this.page.locator('button:has-text("Binter")') }
  get tabKerawanan() { return this.page.locator('button:has-text("Kerawanan")') }
  get tabPatroli() { return this.page.locator('button:has-text("Patroli")') }

  // Content sections
  get guideTitle() { return this.page.locator('h2:has-text("Panduan")') }
  get guideDescription() { return this.page.locator('text=Petunjuk pengisian data') }

  // Section panels
  get sectionPanels() { return this.page.locator('.hud-panel') }

  // SOP sections
  get sopKerawanan() { return this.page.locator('text=SOP Pelaporan Kerawanan') }
  get sopPatroli() { return this.page.locator('text=SOP Input Laporan Patroli') }

  // Actions
  async clickTab(tabName) {
    await this.click(`button:has-text("${tabName}")`)
    await this.waitForTimeout(500)
  }

  // Assertions
  async expectPageLoaded() {
    await this.waitForSelector('h2:has-text("Panduan")', { timeout: 10000 })
  }

  async expectTabsVisible() {
    await this.tabOverview.waitFor()
    await this.tabPos.waitFor()
    await this.tabDemografi.waitFor()
  }

  async expectOverviewContent() {
    await this.waitForSelector('text=Petunjuk pengisian data', { timeout: 5000 })
  }

  async expectPosContent() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectDemografiContent() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectBinterContent() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectKerawananContent() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectPatroliContent() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectSOPKerawanan() {
    await this.waitForSelector('text=SOP Pelaporan Kerawanan', { timeout: 5000 })
  }

  async expectSOPPatroli() {
    await this.waitForSelector('text=SOP Input Laporan Patroli', { timeout: 5000 })
  }
}
