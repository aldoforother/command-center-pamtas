import { describe, it, expect } from 'vitest'
import {
  KERAWANAN_CATEGORIES,
  KERAWANAN_COLOR_MAP,
  BINTER_TYPES,
  BINTER_COLOR_MAP,
  TOKOH_CATEGORIES,
  AGAMA_LIST,
  IBADAH_LIST,
} from './kerawananCategories'

describe('KERAWANAN_CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(KERAWANAN_CATEGORIES)).toBe(true)
    expect(KERAWANAN_CATEGORIES.length).toBeGreaterThan(0)
  })

  it('every entry has id, label, color, icon', () => {
    for (const cat of KERAWANAN_CATEGORIES) {
      expect(cat).toHaveProperty('id')
      expect(cat).toHaveProperty('label')
      expect(cat).toHaveProperty('color')
      expect(cat).toHaveProperty('icon')
    }
  })

  it('contains expected categories', () => {
    const ids = KERAWANAN_CATEGORIES.map(c => c.id)
    expect(ids).toContain('Narkoba')
    expect(ids).toContain('Kriminal')
    expect(ids).toContain('Logging')
  })
})

describe('KERAWANAN_COLOR_MAP', () => {
  it('is derived from KERAWANAN_CATEGORIES', () => {
    for (const cat of KERAWANAN_CATEGORIES) {
      expect(KERAWANAN_COLOR_MAP[cat.id]).toBe(cat.color)
    }
  })
})

describe('BINTER_TYPES', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(BINTER_TYPES)).toBe(true)
    expect(BINTER_TYPES.length).toBeGreaterThan(0)
    expect(typeof BINTER_TYPES[0]).toBe('string')
  })

  it('contains Lainnya as fallback', () => {
    expect(BINTER_TYPES).toContain('Lainnya')
  })
})

describe('BINTER_COLOR_MAP', () => {
  it('is an object with string values', () => {
    expect(typeof BINTER_COLOR_MAP).toBe('object')
    for (const val of Object.values(BINTER_COLOR_MAP)) {
      expect(typeof val).toBe('string')
      expect(val).toMatch(/^#[0-9a-fA-F]{3,6}|rgba?/)
    }
  })

  it('contains color for Bakti Sosial', () => {
    expect(BINTER_COLOR_MAP['Bakti Sosial']).toBeDefined()
  })

  it('contains fallback alias Lainnya', () => {
    expect(BINTER_COLOR_MAP['Lainnya']).toBeDefined()
  })

  it('all BINTER_TYPES have a color mapping', () => {
    for (const type of BINTER_TYPES) {
      // Either exact match or alias
      const hasDirectMatch = BINTER_COLOR_MAP[type] !== undefined
      const hasPartialMatch = Object.keys(BINTER_COLOR_MAP).some(
        key => type.toLowerCase().includes(key.toLowerCase()) ||
               key.toLowerCase().includes(type.toLowerCase())
      )
      expect(hasDirectMatch || hasPartialMatch).toBe(true)
    }
  })
})

describe('TOKOH_CATEGORIES', () => {
  it('contains Adat, Masyarakat, Agama', () => {
    expect(TOKOH_CATEGORIES).toContain('Adat')
    expect(TOKOH_CATEGORIES).toContain('Masyarakat')
    expect(TOKOH_CATEGORIES).toContain('Agama')
  })
})

describe('AGAMA_LIST', () => {
  it('has key and label for each entry', () => {
    for (const item of AGAMA_LIST) {
      expect(item).toHaveProperty('key')
      expect(item).toHaveProperty('label')
    }
  })

  it('contains islam and kristen', () => {
    const keys = AGAMA_LIST.map(a => a.key)
    expect(keys).toContain('islam')
    expect(keys).toContain('kristen')
  })
})

describe('IBADAH_LIST', () => {
  it('has key and label for each entry', () => {
    for (const item of IBADAH_LIST) {
      expect(item).toHaveProperty('key')
      expect(item).toHaveProperty('label')
    }
  })
})
