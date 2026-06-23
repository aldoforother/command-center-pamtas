/**
 * Tests untuk fungsi-fungsi normalisasi data di api.js.
 * Karena fungsi-fungsi ini tidak di-export (private), kita test behavior
 * melalui output yang observable, atau dengan mengekstrak logikanya ke sini.
 *
 * Fungsi yang di-test secara unit:
 * - normalizeDemografi (logika dinormalisasi di sini)
 * - aggregateDemografi (logika aggregate)
 * - normalizePos (field mapping)
 */

import { describe, it, expect } from 'vitest'

// ─── normalizeDemografi logic (replikasi untuk unit test) ──────────────────

function normalizeDemografi(obj) {
  if (!obj || typeof obj !== 'object') return obj
  return {
    ...obj,
    total_penduduk: Number(obj.total_penduduk ?? obj.jumlah_penduduk ?? obj.penduduk ?? 0),
    total_kk: Number(obj.total_kk ?? obj.jumlah_kk ?? obj.kk ?? 0),
    islam:    Number(obj.islam    ?? 0),
    kristen:  Number(obj.kristen  ?? 0),
    katolik:  Number(obj.katolik  ?? 0),
    hindu:    Number(obj.hindu    ?? 0),
    buddha:   Number(obj.buddha   ?? 0),
    konghucu: Number(obj.konghucu ?? 0),
    lainnya:  Number(obj.lainnya  ?? 0),
    masjid:  Number(obj.masjid  ?? obj.masjid_mushola ?? 0),
    gereja:  Number(obj.gereja  ?? 0),
    pura:    Number(obj.pura    ?? 0),
    vihara:  Number(obj.vihara  ?? 0),
    geografi:        obj.geografi        || obj.kondisi_geografi || '',
    demografi_notes: obj.demografi_notes || obj.kondisi_demografi || '',
    konsos_notes:    obj.konsos_notes    || obj.kondisi_sosial    || obj.konsos || '',
  }
}

function aggregateDemografi(rows) {
  const NUM_FIELDS = [
    'total_penduduk', 'total_kk',
    'islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'lainnya',
    'masjid', 'gereja', 'pura', 'vihara',
  ]
  const base = { ...rows[0] }
  NUM_FIELDS.forEach(f => { base[f] = 0 })
  rows.forEach(row => {
    NUM_FIELDS.forEach(f => {
      base[f] = (base[f] || 0) + (Number(row[f]) || 0)
    })
  })
  const TEXT_FIELDS = ['geografi', 'demografi_notes', 'konsos_notes']
  TEXT_FIELDS.forEach(f => {
    const parts = [...new Set(rows.map(r => (r[f] || '').trim()).filter(Boolean))]
    base[f] = parts.join(' | ') || '—'
  })
  const kelurahans = rows.map(r => r.nama_kelurahan || r.kelurahan || '').filter(Boolean)
  if (kelurahans.length > 0) base._kelurahan_list = kelurahans
  return base
}

function normalizePos(p) {
  return {
    ...p,
    jumlah_personel: p.jumlah_personel ?? p.kuat_pers ?? 0,
    kondisi_bangunan:  p.kondisi_bangunan  || '',
    sumber_air:        p.sumber_air        || '',
    sumber_listrik:    p.sumber_listrik    || '',
    jaringan_gsm:      p.jaringan_gsm      || '',
    jumlah_patok:      p.jumlah_patok      || 0,
    kerawanan_utama:   p.kerawanan_utama   || '',
    kecamatan:         p.kecamatan         || '',
    provinsi:          p.provinsi          || '',
    danssk:            p.danssk            || '',
    dpp:               p.dpp               || '',
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('normalizeDemografi', () => {
  it('returns input unchanged if null', () => {
    expect(normalizeDemografi(null)).toBeNull()
  })

  it('returns input unchanged if not object', () => {
    expect(normalizeDemografi('string')).toBe('string')
  })

  it('maps total_penduduk from jumlah_penduduk alias', () => {
    const result = normalizeDemografi({ jumlah_penduduk: 500 })
    expect(result.total_penduduk).toBe(500)
  })

  it('maps total_penduduk from penduduk alias', () => {
    const result = normalizeDemografi({ penduduk: 300 })
    expect(result.total_penduduk).toBe(300)
  })

  it('prefers total_penduduk over aliases', () => {
    const result = normalizeDemografi({ total_penduduk: 100, jumlah_penduduk: 999 })
    expect(result.total_penduduk).toBe(100)
  })

  it('maps total_kk from jumlah_kk alias', () => {
    const result = normalizeDemografi({ jumlah_kk: 80 })
    expect(result.total_kk).toBe(80)
  })

  it('defaults all numeric fields to 0 if missing', () => {
    const result = normalizeDemografi({})
    expect(result.islam).toBe(0)
    expect(result.kristen).toBe(0)
    expect(result.masjid).toBe(0)
    expect(result.total_penduduk).toBe(0)
  })

  it('maps masjid from masjid_mushola alias', () => {
    const result = normalizeDemografi({ masjid_mushola: 3 })
    expect(result.masjid).toBe(3)
  })

  it('maps geografi from kondisi_geografi alias', () => {
    const result = normalizeDemografi({ kondisi_geografi: 'Pegunungan' })
    expect(result.geografi).toBe('Pegunungan')
  })

  it('maps konsos_notes from kondisi_sosial alias', () => {
    const result = normalizeDemografi({ kondisi_sosial: 'Kondusif' })
    expect(result.konsos_notes).toBe('Kondusif')
  })

  it('maps konsos_notes from konsos alias', () => {
    const result = normalizeDemografi({ konsos: 'Aman' })
    expect(result.konsos_notes).toBe('Aman')
  })

  it('preserves extra fields', () => {
    const result = normalizeDemografi({ pos_id: 'AJ', total_penduduk: 100 })
    expect(result.pos_id).toBe('AJ')
  })
})

describe('aggregateDemografi', () => {
  it('sums numeric fields across rows', () => {
    const rows = [
      { pos_id: 'AJ', total_penduduk: 100, total_kk: 20, islam: 80, kristen: 20,
        katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 1, gereja: 1, pura: 0, vihara: 0 },
      { pos_id: 'AJ', total_penduduk: 50, total_kk: 10, islam: 40, kristen: 10,
        katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 0, gereja: 1, pura: 0, vihara: 0 },
    ]
    const result = aggregateDemografi(rows)
    expect(result.total_penduduk).toBe(150)
    expect(result.total_kk).toBe(30)
    expect(result.islam).toBe(120)
    expect(result.gereja).toBe(2)
  })

  it('works with single row', () => {
    const rows = [{ pos_id: 'KT', total_penduduk: 200, total_kk: 50,
      islam: 200, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
      masjid: 2, gereja: 0, pura: 0, vihara: 0 }]
    const result = aggregateDemografi(rows)
    expect(result.total_penduduk).toBe(200)
    expect(result.pos_id).toBe('KT')
  })

  it('collects kelurahan list', () => {
    const rows = [
      { nama_kelurahan: 'Aji Kuning', total_penduduk: 100, total_kk: 20,
        islam: 100, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 1, gereja: 0, pura: 0, vihara: 0 },
      { nama_kelurahan: 'Sei Pancang', total_penduduk: 80, total_kk: 15,
        islam: 80, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 1, gereja: 0, pura: 0, vihara: 0 },
    ]
    const result = aggregateDemografi(rows)
    expect(result._kelurahan_list).toEqual(['Aji Kuning', 'Sei Pancang'])
  })

  it('deduplicates text fields', () => {
    const rows = [
      { geografi: 'Pantai', total_penduduk: 0, total_kk: 0,
        islam: 0, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 0, gereja: 0, pura: 0, vihara: 0 },
      { geografi: 'Pantai', total_penduduk: 0, total_kk: 0,
        islam: 0, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 0, gereja: 0, pura: 0, vihara: 0 },
    ]
    const result = aggregateDemografi(rows)
    expect(result.geografi).toBe('Pantai') // not 'Pantai | Pantai'
  })
})

describe('normalizePos', () => {
  it('maps kuat_pers to jumlah_personel when jumlah_personel missing', () => {
    const result = normalizePos({ pos_id: 'AJ', kuat_pers: 23 })
    expect(result.jumlah_personel).toBe(23)
  })

  it('prefers jumlah_personel over kuat_pers', () => {
    const result = normalizePos({ pos_id: 'AJ', jumlah_personel: 16, kuat_pers: 23 })
    expect(result.jumlah_personel).toBe(16)
  })

  it('defaults jumlah_personel to 0 if both missing', () => {
    const result = normalizePos({ pos_id: 'AJ' })
    expect(result.jumlah_personel).toBe(0)
  })

  it('defaults string fields to empty string', () => {
    const result = normalizePos({ pos_id: 'AJ' })
    expect(result.kondisi_bangunan).toBe('')
    expect(result.sumber_air).toBe('')
    expect(result.kecamatan).toBe('')
  })

  it('defaults jumlah_patok to 0', () => {
    const result = normalizePos({ pos_id: 'AJ' })
    expect(result.jumlah_patok).toBe(0)
  })

  it('preserves original fields', () => {
    const result = normalizePos({ pos_id: 'KT', nama_pos: 'Pos Kotis', lat: 4.14 })
    expect(result.pos_id).toBe('KT')
    expect(result.nama_pos).toBe('Pos Kotis')
    expect(result.lat).toBe(4.14)
  })
})
