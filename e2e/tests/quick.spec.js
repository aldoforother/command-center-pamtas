import { test, expect } from '@playwright/test'
import { BASE_URL, goto, login } from './helpers.js'

test.describe('Login Page', () => {
  test('should load login page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`)
    expect(response.status()).toBeLessThan(400)
  })

  test('should show NARASINGA branding', async ({ page }) => {
    await goto(page, '/login')
    await page.waitForTimeout(3000)
    const content = await page.content()
    expect(content).toContain('NARASINGA')
  })

  test('should login with valid credentials', async ({ page }) => {
    if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
      test.skip(true, 'Credentials not configured')
    }
    const success = await login(page)
    expect(success).toBeTruthy()
  })
})

test.describe('Dashboard Pages (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    const success = await login(page)
    if (!success) {
      test.skip(true, 'Login failed')
    }
  })

  test('home page loads with stats', async ({ page }) => {
    await goto(page, '/')
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('PERSONEL')
    expect(content).toContain('POS AKTIF')
  })

  test('overview page loads', async ({ page }) => {
    await goto(page, '/overview')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/overview')
  })

  test('insiden page loads', async ({ page }) => {
    await goto(page, '/insiden')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/insiden')
  })

  test('binter page loads', async ({ page }) => {
    await goto(page, '/binter')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/binter')
  })

  test('admin page loads', async ({ page }) => {
    await goto(page, '/admin')
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Pengaturan') || expect(content).toContain('User')
  })

  test('panduan page loads', async ({ page }) => {
    await goto(page, '/panduan')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/panduan')
  })

  test('POS detail page loads', async ({ page }) => {
    await goto(page, '/pos/KOTIS')
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('KOTIS')
  })

  test('laporan kerawanan page loads', async ({ page }) => {
    await goto(page, '/laporan/kerawanan')
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Insiden') || expect(content).toContain('GRAFIK')
  })

  test('laporan demografi page loads', async ({ page }) => {
    await goto(page, '/laporan/demografi')
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Demografi')
  })

  test('laporan tokoh page loads', async ({ page }) => {
    await goto(page, '/laporan/tokoh')
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Tokoh') || expect(content).toContain('WILAYAH')
  })
})
