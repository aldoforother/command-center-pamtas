/**
 * Tests untuk api.js — gasGet, gasPost, fetchWithTimeout
 * Menggunakan vi.stubGlobal untuk mock fetch
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock import.meta.env sebelum import api
vi.stubEnv('VITE_GAS_URL', 'https://script.google.com/macros/s/TEST/exec')

// Import setelah env di-stub
const { api } = await import('./api.js')

function mockFetch(responseData, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Bad Request',
    json: () => Promise.resolve(responseData),
  })
}

describe('api — gasGet', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getAllPos returns normalized pos array', async () => {
    vi.stubGlobal('fetch', mockFetch({
      status: 'ok',
      data: [{ pos_id: 'AJ', nama_pos: 'Pos Aji Kuning', kuat_pers: 23 }],
    }))
    const result = await api.getAllPos()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].pos_id).toBe('AJ')
    expect(result[0].jumlah_personel).toBe(23)
  })

  it('getAllPos falls back to direct array response', async () => {
    vi.stubGlobal('fetch', mockFetch([
      { pos_id: 'KT', nama_pos: 'Pos Kotis', jumlah_personel: 62 },
    ]))
    const result = await api.getAllPos()
    expect(result[0].pos_id).toBe('KT')
  })

  it('getAllKerawanan returns array', async () => {
    vi.stubGlobal('fetch', mockFetch({
      status: 'ok',
      data: [{ id: '1', pos_id: 'AJ', kategori: 'Narkoba' }],
    }))
    const result = await api.getAllKerawanan()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].kategori).toBe('Narkoba')
  })

  it('getAllKerawanan returns empty array for empty data', async () => {
    vi.stubGlobal('fetch', mockFetch({ status: 'ok', data: [] }))
    const result = await api.getAllKerawanan()
    expect(result).toEqual([])
  })

  it('getAllKerawanan returns empty array when data is not array-like', async () => {
    vi.stubGlobal('fetch', mockFetch({ status: 'ok', data: null }))
    const result = await api.getAllKerawanan()
    expect(result).toEqual([])
  })

  it('throws on HTTP error', async () => {
    vi.stubGlobal('fetch', mockFetch({}, false, 500))
    await expect(api.getAllPos()).rejects.toThrow('HTTP 500')
  })

  it('throws on GAS error response', async () => {
    vi.stubGlobal('fetch', mockFetch({ status: 'error', message: 'Sheet not found' }))
    await expect(api.getAllPos()).rejects.toThrow('Sheet not found')
  })

  it('throws on error field in response', async () => {
    vi.stubGlobal('fetch', mockFetch({ error: 'Unauthorized' }))
    await expect(api.getAllPos()).rejects.toThrow('Unauthorized')
  })

  it('getDemografi returns normalized single object for array response', async () => {
    vi.stubGlobal('fetch', mockFetch({
      status: 'ok',
      data: [{
        pos_id: 'AJ', total_penduduk: 100, total_kk: 20,
        islam: 80, kristen: 20, katolik: 0, hindu: 0,
        buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 1, gereja: 1, pura: 0, vihara: 0,
      }],
    }))
    const result = await api.getDemografi('AJ')
    expect(result.total_penduduk).toBe(100)
    expect(result.islam).toBe(80)
  })

  it('getDemografi aggregates multiple rows', async () => {
    vi.stubGlobal('fetch', mockFetch({
      status: 'ok',
      data: [
        { pos_id: 'AJ', total_penduduk: 100, total_kk: 20,
          islam: 80, kristen: 20, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
          masjid: 1, gereja: 1, pura: 0, vihara: 0 },
        { pos_id: 'AJ', total_penduduk: 50, total_kk: 10,
          islam: 50, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
          masjid: 0, gereja: 0, pura: 0, vihara: 0 },
      ],
    }))
    const result = await api.getDemografi('AJ')
    expect(result.total_penduduk).toBe(150)
    expect(result.islam).toBe(130)
  })

  it('getDemografi returns null for empty response', async () => {
    vi.stubGlobal('fetch', mockFetch({ status: 'ok', data: [] }))
    const result = await api.getDemografi('AJ')
    expect(result).toBeNull()
  })

  it('getAllTokoh returns array', async () => {
    vi.stubGlobal('fetch', mockFetch({
      status: 'ok',
      data: [{ id: '1', pos_id: 'AJ', nama: 'Test Tokoh' }],
    }))
    const result = await api.getAllTokoh()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].nama).toBe('Test Tokoh')
  })

  it('getAllBinter returns array', async () => {
    vi.stubGlobal('fetch', mockFetch({
      status: 'ok',
      data: [{ id: '1', pos_id: 'KT', jenis_kegiatan: 'Penyuluhan' }],
    }))
    const result = await api.getAllBinter()
    expect(result[0].jenis_kegiatan).toBe('Penyuluhan')
  })
})

describe('api — gasPost', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('addTokoh posts data and returns result', async () => {
    vi.stubGlobal('fetch', mockFetch({ success: true, id: 'new-id' }))
    const result = await api.addTokoh({ pos_id: 'AJ', nama: 'Test' })
    expect(result.success).toBe(true)
  })

  it('throws on HTTP error in POST', async () => {
    vi.stubGlobal('fetch', mockFetch({}, false, 500))
    await expect(api.addTokoh({ nama: 'x' })).rejects.toThrow('HTTP 500')
  })

  it('throws on error field in POST response', async () => {
    vi.stubGlobal('fetch', mockFetch({ error: 'Permission denied' }))
    await expect(api.addKerawanan({})).rejects.toThrow('Permission denied')
  })
})

describe('api — request timeout', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws timeout error when fetch is aborted', async () => {
    // Simulasi AbortError langsung — tidak perlu tunggu 30 detik nyata
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
      Object.assign(new Error('The operation was aborted'), { name: 'AbortError' })
    ))

    await expect(api.getAllPos()).rejects.toThrow(/timeout/i)
  })
})
