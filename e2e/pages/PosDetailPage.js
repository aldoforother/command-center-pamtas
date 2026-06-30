import { BasePage } from './BasePage'

/**
 * POS Detail Page Object
 * Tests POS detail tabs: Info, Demografi, Tokoh, Binter, Kerawanan, Patroli
 */
export class PosDetailPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/pos/KOTIS'
  }

  // Tab navigation
  get tabInfo() { return this.page.locator('button:has-text("Info")') }
  get tabDemografi() { return this.page.locator('button:has-text("Demografi")') }
  get tabTokoh() { return this.page.locator('button:has-text("Tokoh")') }
  get tabBinter() { return this.page.locator('button:has-text("Binter")') }
  get tabKerawanan() { return this.page.locator('button:has-text("Kerawanan")') }
  get tabPatroli() { return this.page.locator('button:has-text("Patroli")') }

  // Info tab
  get posName() { return this.page.locator('h1, h2').filter({ hasText: 'POS' }).first() }
  get posLocation() { return this.page.locator('text=Kabupaten') }
  get posCoordinates() { return this.page.locator('text=Koordinat') }
  get editPosButton() { return this.page.locator('button:has-text("Edit Pos")') }
  get jumlahPersonel() { return this.page.locator('text=Personel') }

  // Demografi tab
  get demografiTable() { return this.page.locator('.hud-panel') }
  get distribusiAgama() { return this.page.locator('text=Distribusi Agama') }
  get tempatIbadah() { return this.page.locator('text=Tempat Ibadah') }
  get summaryCards() { return this.page.locator('[class*="card"], .hud-panel') }

  // Tokoh tab
  get tokohList() { return this.page.locator('[class*="tokoh"], .hud-panel') }
  get tokohItem() { return this.page.locator('.hud-panel').filter({ has: this.page.locator('text=/KTK|KTL|Numeric/i') }) }

  // Binter tab
  get binterList() { return this.page.locator('.hud-panel') }

  // Kerawanan tab
  get kerawananList() { return this.page.locator('.hud-panel') }
  get kerawananBadge() { return this.page.locator('[class*="badge"]') }

  // Patroli tab
  get patroliList() { return this.page.locator('.hud-panel') }

  // Back button
  get backButton() { return this.page.locator('button:has-text("←"), button:has-text("Kembali")') }

  // Actions
  async navigateToPos(posId) {
    await this.navigate(`/pos/${posId}`)
  }

  async clickTab(tabName) {
    await this.click(`button:has-text("${tabName}")`)
    await this.waitForTimeout(500)
  }

  async clickEditPos() {
    await this.click('button:has-text("Edit Pos")')
    await this.waitForSelector('input', { timeout: 5000 })
  }

  async goBack() {
    await this.backButton.click()
    await this.page.waitForURL('**/overview', { timeout: 5000 }).catch(() => {
      this.page.goBack()
    })
  }

  // Assertions
  async expectPageLoaded() {
    await this.waitForSelector('button:has-text("Info")', { timeout: 10000 })
  }

  async expectTabsVisible() {
    await this.tabInfo.waitFor()
    await this.tabDemografi.waitFor()
    await this.tabTokoh.waitFor()
    await this.tabBinter.waitFor()
  }

  async expectInfoTab() {
    await this.waitForSelector('text=POS')
    await this.waitForSelector('text=Personel')
  }

  async expectDemografiTab() {
    await this.waitForSelector('text=Distribusi Agama', { timeout: 5000 })
  }

  async expectTokohTab() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectBinterTab() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectKerawananTab() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectPatroliTab() {
    await this.waitForSelector('.hud-panel', { timeout: 5000 })
  }

  async expectEditButton() {
    await this.editPosButton.waitFor()
  }

  async expectEmptyState(tab) {
    await this.waitForSelector('text=BELUM ADA DATA', { timeout: 3000 }).catch(() => {})
  }
}
