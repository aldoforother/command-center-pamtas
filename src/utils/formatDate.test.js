import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, formatCoords, calcPercent, truncate } from './formatDate'

describe('formatDate', () => {
  it('returns "-" for null', () => {
    expect(formatDate(null)).toBe('-')
  })

  it('returns "-" for undefined', () => {
    expect(formatDate(undefined)).toBe('-')
  })

  it('returns "-" for empty string', () => {
    expect(formatDate('')).toBe('-')
  })

  it('returns "-" for invalid date string', () => {
    expect(formatDate('bukan-tanggal')).toBe('-')
  })

  it('formats ISO date string (short)', () => {
    const result = formatDate('2024-01-15')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/01|Januari|Jan/)
  })

  it('formats Date object', () => {
    const d = new Date(2024, 0, 15) // Jan 15
    const result = formatDate(d)
    expect(result).toMatch(/15/)
  })

  it('uses long format', () => {
    const result = formatDate('2024-06-01', 'long')
    expect(result).toMatch(/Juni|June|Jun/)
    expect(result).toMatch(/2024/)
  })

  it('uses datetime format', () => {
    const result = formatDate('2024-06-01T10:30:00', 'datetime')
    expect(result).toMatch(/2024/)
  })

  it('falls back to short for unknown format key', () => {
    const result = formatDate('2024-01-15', 'unknown')
    expect(result).toMatch(/15/)
  })
})

describe('formatNumber', () => {
  it('returns "-" for null', () => {
    expect(formatNumber(null)).toBe('-')
  })

  it('returns "-" for undefined', () => {
    expect(formatNumber(undefined)).toBe('-')
  })

  it('returns "-" for empty string', () => {
    expect(formatNumber('')).toBe('-')
  })

  it('formats integer', () => {
    const result = formatNumber(1000)
    expect(result).toMatch(/1[.,]000|1000/)
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toMatch(/0/)
  })

  it('formats large number', () => {
    const result = formatNumber(1234567)
    expect(result).toMatch(/1\.234\.567|1,234,567/)
  })
})

describe('formatCoords', () => {
  it('returns "-" when lat is missing', () => {
    expect(formatCoords(null, 117.5)).toBe('-')
  })

  it('returns "-" when lng is missing', () => {
    expect(formatCoords(4.1, null)).toBe('-')
  })

  it('returns "-" when both missing', () => {
    expect(formatCoords(null, null)).toBe('-')
  })

  it('formats valid coordinates', () => {
    const result = formatCoords(4.1425, 117.673)
    expect(result).toContain('N')
    expect(result).toContain('E')
    expect(result).toContain('°')
  })

  it('uses S for negative latitude', () => {
    const result = formatCoords(-4.1425, 117.673)
    expect(result).toContain('S')
  })

  it('uses W for negative longitude', () => {
    const result = formatCoords(4.1425, -117.673)
    expect(result).toContain('W')
  })
})

describe('calcPercent', () => {
  it('returns 0 for zero total', () => {
    expect(calcPercent(50, 0)).toBe(0)
  })

  it('returns 0 for null total', () => {
    expect(calcPercent(50, null)).toBe(0)
  })

  it('calculates percent correctly', () => {
    expect(calcPercent(1, 4)).toBe(25)
  })

  it('rounds result', () => {
    expect(calcPercent(1, 3)).toBe(33)
  })

  it('returns 100 for full value', () => {
    expect(calcPercent(10, 10)).toBe(100)
  })
})

describe('truncate', () => {
  it('returns "-" for null', () => {
    expect(truncate(null)).toBe('-')
  })

  it('returns "-" for empty string', () => {
    expect(truncate('')).toBe('-')
  })

  it('does not truncate short strings', () => {
    expect(truncate('hello', 60)).toBe('hello')
  })

  it('truncates long strings with ellipsis', () => {
    const long = 'a'.repeat(70)
    const result = truncate(long, 60)
    expect(result).toHaveLength(63) // 60 + '...'
    expect(result.endsWith('...')).toBe(true)
  })

  it('respects custom maxLen', () => {
    const result = truncate('hello world', 5)
    expect(result).toBe('hello...')
  })
})
