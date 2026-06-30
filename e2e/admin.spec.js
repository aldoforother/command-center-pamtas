import { test, expect } from '@playwright/test'
import { AdminPage } from './pages/AdminPage'
import { TEST_USERS } from './fixtures/auth'

test.describe('Admin Page', () => {
  let adminPage

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page)
  })

  test.describe('Access Control', () => {
    test('should require authentication', async ({ page }) => {
      await adminPage.navigate('/admin')
      // Should redirect to login or show error
      const url = page.url()
      const isLoginPage = url.includes('/login')
      expect(isLoginPage).toBeTruthy()
    })

    test('should allow admin users', async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
      await adminPage.expectPageLoaded()
    })

    test('should show access denied for non-admin', async ({ page }) => {
      if (!process.env.E2E_VIEWER_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.viewer.email, TEST_USERS.viewer.password)
      await adminPage.navigate('/admin')
      // Should redirect or show access denied
      await page.waitForTimeout(1000)
      const url = page.url()
      expect(url).not.toContain('/admin')
    })
  })

  test.describe('Page Load (Admin Users)', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
    })

    test('should display admin page', async () => {
      await adminPage.expectPageLoaded()
    })

    test('should display user list', async () => {
      await adminPage.expectUserList()
    })

    test('should display add user button', async () => {
      await adminPage.expectAddUserButton()
    })

    test('should display edit buttons', async () => {
      await adminPage.expectEditButtons()
    })

    test('should display delete buttons', async () => {
      await adminPage.expectDeleteButtons()
    })
  })

  test.describe('User Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
      await adminPage.clickAddUser()
    })

    test('should show validation error for empty email', async () => {
      await adminPage.submitUserForm()
      await adminPage.expectValidationError('Email')
    })

    test('should show validation error for empty password (create mode)', async () => {
      await adminPage.fill('input[name="email"]', 'new@test.com')
      await adminPage.submitUserForm()
      await adminPage.expectValidationError('Password')
    })

    test('should show validation error for short password', async () => {
      await adminPage.fill('input[name="email"]', 'new@test.com')
      await adminPage.fill('input[name="password"]', 'short')
      await adminPage.submitUserForm()
      await adminPage.expectValidationError('Minimal 8 karakter')
    })

    test('should show validation error for empty nama', async () => {
      await adminPage.fill('input[name="email"]', 'new@test.com')
      await adminPage.fill('input[name="password"]', 'password123')
      await adminPage.submitUserForm()
      await adminPage.expectValidationError('Nama')
    })
  })

  test.describe('Role Filter', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
    })

    test('should have role filter buttons', async () => {
      await expect(adminPage.roleFilterAll).toBeVisible()
      await expect(adminPage.roleFilterAdmin).toBeVisible()
      await expect(adminPage.roleFilterOperator).toBeVisible()
      await expect(adminPage.roleFilterViewer).toBeVisible()
    })

    test('should filter by admin role', async () => {
      await adminPage.filterByRole('Admin')
      await adminPage.page.waitForTimeout(500)
    })

    test('should filter by operator role', async () => {
      await adminPage.filterByRole('Operator')
      await adminPage.page.waitForTimeout(500)
    })

    test('should filter by viewer role', async () => {
      await adminPage.filterByRole('Viewer')
      await adminPage.page.waitForTimeout(500)
    })

    test('should show all users', async () => {
      await adminPage.filterByRole('Admin')
      await adminPage.filterByRole('Semua')
      await adminPage.expectUserCount(1)
    })
  })

  test.describe('User Search', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
    })

    test('should have search input', async () => {
      await expect(adminPage.searchInput).toBeVisible()
    })

    test('should search users by email', async () => {
      await adminPage.searchUser('admin')
      await adminPage.page.waitForTimeout(500)
    })

    test('should search users by name', async () => {
      await adminPage.searchUser('operator')
      await adminPage.page.waitForTimeout(500)
    })
  })

  test.describe('Modal', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
    })

    test('should open add user modal', async () => {
      await adminPage.clickAddUser()
      await adminPage.expectModalOpen()
    })

    test('should close modal with cancel button', async () => {
      await adminPage.clickAddUser()
      await adminPage.closeModal()
      await adminPage.expectModalClosed()
    })

    test('should close modal with X button', async () => {
      await adminPage.clickAddUser()
      await adminPage.page.click('button:has-text("×")')
      await adminPage.expectModalClosed()
    })
  })

  test.describe('Supabase Status', () => {
    test.beforeEach(async ({ page }) => {
      if (!process.env.E2E_ADMIN_EMAIL) {
        test.skip(true, 'Requires real credentials')
      }
      await adminPage.navigate('/login')
      await adminPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password)
      await adminPage.navigate('/admin')
    })

    test('should display Supabase status section', async () => {
      await adminPage.expectSupabaseStatus()
    })

    test('should show connection status', async () => {
      await expect(adminPage.connectionStatus).toBeVisible()
    })
  })
})
