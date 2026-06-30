// Test helper constants
export const BASE_URL = 'http://localhost:5173/command-center-pamtas'

// Login helper
export async function login(page) {
  const adminEmail = process.env.E2E_ADMIN_EMAIL
  const adminPassword = process.env.E2E_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('Credentials not configured')
  }

  await page.goto(`${BASE_URL}/login`)
  await page.waitForLoadState('domcontentloaded')

  // Wait for boot animation
  await page.waitForTimeout(3000)

  // Fill login form
  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')

  await emailInput.waitFor({ timeout: 10000 })
  await emailInput.fill(adminEmail)
  await passwordInput.fill(adminPassword)
  await page.locator('button[type="submit"]').click()

  // Wait for redirect
  await page.waitForTimeout(2000)

  return page.url().includes('/command-center-pamtas/')
}
