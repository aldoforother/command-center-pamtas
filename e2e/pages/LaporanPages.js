import { BasePage } from './BasePage'

/**
 * Laporan Pages Object
 * Tests all laporan (report) pages
 */
export class GrafikKerawananPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/laporan/kerawanan'
  }

  get chartContainer() { return this.page.locator('.recharts-wrapper, [class*="chart"]') }
  get filterYear() { return this.page.locator('select').first() }
  get filterKategori() { return this.page.locator('select').nth(1) }
  get downloadButton() { return this.page.locator('button:has-text("Download")') }

  async expectPageLoaded() {
    await this.waitForSelector('text=Insiden', { timeout: 10000 })
  }

  async expectChartVisible() {
    await this.waitForSelector('.recharts-wrapper, [class*="chart"]', { timeout: 10000 })
  }
}

export class TimelineBinterPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/laporan/binter'
  }

  get timeline() { return this.page.locator('[class*="timeline"]') }
  get filterYear() { return this.page.locator('select').first() }
  get downloadButton() { return this.page.locator('button:has-text("Download")') }

  async expectPageLoaded() {
    await this.waitForSelector('text=Timeline', { timeout: 10000 })
  }

  async expectTimelineVisible() {
    await this.waitForSelector('[class*="timeline"]', { timeout: 10000 })
  }
}

export class DataDemografiPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/laporan/demografi'
  }

  get demografiTable() { return this.page.locator('table, .hud-panel') }
  get filterPos() { return this.page.locator('select').first() }
  get downloadButton() { return this.page.locator('button:has-text("Download")') }

  async expectPageLoaded() {
    await this.waitForSelector('text=Demografi', { timeout: 10000 })
  }

  async expectDataTable() {
    await this.waitForSelector('table, .hud-panel', { timeout: 10000 })
  }
}

export class TokohWilayahPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/laporan/tokoh'
  }

  get tokohList() { return this.page.locator('.hud-panel') }
  get filterKategori() { return this.page.locator('select').first() }
  get downloadButton() { return this.page.locator('button:has-text("Download")') }

  async expectPageLoaded() {
    await this.waitForSelector('text=Tokoh', { timeout: 10000 })
  }

  async expectTokohList() {
    await this.waitForSelector('.hud-panel', { timeout: 10000 })
  }
}
