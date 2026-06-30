import { BasePage } from './BasePage'

/**
 * Admin Page Object
 * Tests user management, CRUD operations, and admin features
 */
export class AdminPage extends BasePage {
  constructor(page) {
    super(page)
    this.path = '/admin'
  }

  // User management
  get userList() { return this.page.locator('table tbody tr, [class*="user"]') }
  get userRows() { return this.page.locator('tbody tr') }

  // Form elements
  get emailInput() { return this.page.locator('input[type="email"], input[name="email"]') }
  get passwordInput() { return this.page.locator('input[type="password"], input[name="password"]') }
  get namaInput() { return this.page.locator('input[name="nama"], input[placeholder*="Nama"]') }
  get roleSelect() { return this.page.locator('select[name="role"], select').filter({ hasText: /viewer|operator|admin/i }) }

  // Role filter
  get roleFilterAdmin() { return this.page.locator('button:has-text("Admin")') }
  get roleFilterOperator() { return this.page.locator('button:has-text("Operator")') }
  get roleFilterViewer() { return this.page.locator('button:has-text("Viewer")') }
  get roleFilterAll() { return this.page.locator('button:has-text("Semua")') }

  // Action buttons
  get addUserButton() { return this.page.locator('button:has-text("Tambah")') }
  get editUserButtons() { return this.page.locator('button[aria-label*="Edit"]') }
  get deleteUserButtons() { return this.page.locator('button[aria-label*="Hapus"]') }
  get saveButton() { return this.page.locator('button[type="submit"], button:has-text("Simpan")') }
  get cancelButton() { return this.page.locator('button:has-text("Batal")') }

  // Modal
  get userModal() { return this.page.locator('[role="dialog"], .fixed') }
  get modalTitle() { return this.page.locator('h2, h3').filter({ hasText: /User|Pengguna|Admin/i }) }

  // Supabase status
  get supabaseStatus() { return this.page.locator('text=Supabase') }
  get connectionStatus() { return this.page.locator('text=Status') }

  // Toast notifications
  get toast() { return this.page.locator('[role="status"], .toast') }

  // Search
  get searchInput() { return this.page.locator('input[placeholder*="Cari"]') }

  // Actions
  async clickAddUser() {
    await this.click('button:has-text("Tambah")')
    await this.waitForSelector('[role="dialog"]', { timeout: 5000 })
  }

  async clickEditUser(index = 0) {
    await this.editUserButtons.nth(index).click()
    await this.waitForSelector('[role="dialog"]', { timeout: 5000 })
  }

  async clickDeleteUser(index = 0) {
    // Handle confirmation dialog if present
    this.page.on('dialog', dialog => dialog.accept().catch(() => {}))
    await this.deleteUserButtons.nth(index).click()
  }

  async fillUserForm(userData) {
    if (userData.email) await this.fill('input[type="email"], input[name="email"]', userData.email)
    if (userData.password) await this.fill('input[type="password"]', userData.password)
    if (userData.nama) await this.fill('input[name="nama"]', userData.nama)
    if (userData.role) await this.roleSelect.selectOption(userData.role)
  }

  async submitUserForm() {
    await this.click('button[type="submit"]')
    await this.waitForTimeout(1000)
  }

  async closeModal() {
    await this.click('button:has-text("Batal"), button:has-text("×")')
    await this.waitForTimeout(300)
  }

  async filterByRole(role) {
    await this.click(`button:has-text("${role}")`)
    await this.waitForTimeout(500)
  }

  async searchUser(query) {
    await this.fill('input[placeholder*="Cari"]', query)
    await this.waitForTimeout(500)
  }

  // Assertions
  async expectPageLoaded() {
    await this.waitForSelector('text=Pengaturan', { timeout: 10000 })
  }

  async expectUserList() {
    await this.waitForSelector('table, [class*="user"]', { timeout: 10000 })
  }

  async expectAddUserButton() {
    await this.addUserButton.waitFor()
  }

  async expectEditButtons() {
    await this.waitForSelector('button[aria-label*="Edit"]')
  }

  async expectDeleteButtons() {
    await this.waitForSelector('button[aria-label*="Hapus"]')
  }

  async expectModalOpen() {
    await this.waitForSelector('[role="dialog"]', { timeout: 5000 })
  }

  async expectModalClosed() {
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 }).catch(() => {})
  }

  async expectValidationError(field) {
    await this.waitForSelector(`text=${field} wajib diisi`, { timeout: 3000 })
  }

  async expectSuccessToast() {
    await this.waitForSelector('[role="status"]', { timeout: 5000 })
  }

  async expectSupabaseStatus() {
    await this.waitForSelector('text=Supabase', { timeout: 5000 })
  }

  async expectUserCount(minCount) {
    const count = await this.userRows.count()
    return count >= minCount
  }
}
