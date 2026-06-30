/**
 * Base Page Object
 * Common methods for all pages
 */
export class BasePage {
  constructor(page) {
    this.page = page
  }

  async navigate(path = '') {
    await this.page.goto(`${path}`)
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForLoadState('domcontentloaded')
  }

  async getTitle() {
    return this.page.title()
  }

  async waitForSelector(selector, options = {}) {
    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout: options.timeout || 10000,
      ...options,
    })
  }

  async click(selector, options = {}) {
    await this.waitForSelector(selector)
    await this.page.click(selector, options)
  }

  async fill(selector, value, options = {}) {
    await this.waitForSelector(selector)
    await this.page.fill(selector, value, options)
  }

  async getText(selector) {
    await this.waitForSelector(selector)
    return this.page.textContent(selector)
  }

  async isVisible(selector) {
    return this.page.isVisible(selector)
  }

  async isDisabled(selector) {
    return this.page.isDisabled(selector)
  }

  async isEnabled(selector) {
    return this.page.isEnabled(selector)
  }

  async getAttribute(selector, attribute) {
    await this.waitForSelector(selector)
    return this.page.getAttribute(selector, attribute)
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true })
  }

  async getAllByRole(role, options = {}) {
    return this.page.getByRole(role, options).all()
  }

  async getByLabel(label, options = {}) {
    return this.page.getByLabel(label, options)
  }

  async getByText(text, options = {}) {
    return this.page.getByText(text, options)
  }

  async getByPlaceholder(placeholder, options = {}) {
    return this.page.getByPlaceholder(placeholder, options)
  }
}
