import { test, expect } from '@playwright/test'
import { BASE_URL, login } from './helpers.js'

test.describe('Login Page', () => {
  test('should load login page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`)
    expect(response.status()).toBeLessThan(400)
  })

  test('should show NARASINGA branding', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.waitForTimeout(3000)
    const content = await page.content()
    expect(content).toContain('NARASINGA')
  })

  test('should login with valid credentials', async ({ page }) => {
    const success = await login(page)
    expect(success).toBeTruthy()
  })
})

test.describe('Dashboard Pages (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('home page loads with stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/`)
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('PERSONEL')
    expect(content).toContain('POS AKTIF')
  })

  test('overview page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/overview`)
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    // Check title or any page element
    expect(page.url()).toContain('/overview')
  })

  test('insiden page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/insiden`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/insiden')
  })

  test('binter page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/binter`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/binter')
  })

  test('admin page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`)
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Pengaturan') || expect(content).toContain('User')
  })

  test('panduan page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/panduan`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/panduan')
  })

  test('POS detail page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/pos/KOTIS`)
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('KOTIS')
  })

  test('laporan kerawanan page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/laporan/kerawanan`)
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Insiden') || expect(content).toContain('GRAFIK')
  })

  test('laporan demografi page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/laporan/demografi`)
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Demografi')
  })

  test('laporan tokoh page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/laporan/tokoh`)
    await page.waitForTimeout(2000)
    const content = await page.content()
    expect(content).toContain('Tokoh') || expect(content).toContain('WILAYAH')
  })
})
