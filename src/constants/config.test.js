import { describe, it, expect } from 'vitest'
import { APP_CONFIG } from './config'

describe('APP_CONFIG', () => {
  it('TOTAL_POS is 17', () => {
    expect(APP_CONFIG.TOTAL_POS).toBe(17)
  })

  it('CACHE_TTL_MS is 5 minutes', () => {
    expect(APP_CONFIG.CACHE_TTL_MS).toBe(5 * 60 * 1000)
  })

  it('AUTO_REFRESH_MS equals CACHE_TTL_MS', () => {
    expect(APP_CONFIG.AUTO_REFRESH_MS).toBe(APP_CONFIG.CACHE_TTL_MS)
  })

  it('REQUEST_TIMEOUT_MS is 30 seconds', () => {
    expect(APP_CONFIG.REQUEST_TIMEOUT_MS).toBe(30_000)
  })

  it('CACHE_MAX_ENTRIES is positive number', () => {
    expect(APP_CONFIG.CACHE_MAX_ENTRIES).toBeGreaterThan(0)
  })

  it('MAX_REF_POS is a number', () => {
    expect(typeof APP_CONFIG.MAX_REF_POS).toBe('number')
  })

  it('SATGAS_NAME is a non-empty string', () => {
    expect(typeof APP_CONFIG.SATGAS_NAME).toBe('string')
    expect(APP_CONFIG.SATGAS_NAME.length).toBeGreaterThan(0)
  })

  it('BATALYON is a non-empty string', () => {
    expect(typeof APP_CONFIG.BATALYON).toBe('string')
    expect(APP_CONFIG.BATALYON.length).toBeGreaterThan(0)
  })

  it('has all required keys', () => {
    const required = [
      'TOTAL_POS', 'CACHE_TTL_MS', 'AUTO_REFRESH_MS',
      'REQUEST_TIMEOUT_MS', 'CACHE_MAX_ENTRIES',
      'SATGAS_NAME', 'BATALYON', 'YONKAV',
    ]
    for (const key of required) {
      expect(APP_CONFIG).toHaveProperty(key)
    }
  })
})
