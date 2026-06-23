/**
 * Service layer untuk komunikasi dengan Google Apps Script
 * Semua request ke GAS endpoint lewat sini
 */

const GAS_URL = import.meta.env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbxAhOtTasSQ-EQGYyUBffKg_jgQm2IedXaRMioLdGGyW-f1GQGVoIChZFMUm5ETp61PNg/exec'

// Timeout request dalam milidetik (30 detik)
const REQUEST_TIMEOUT_MS = 30_000

/**
 * Fetch dengan timeout menggunakan AbortController.
 * Melempar error "Request timeout" jika melewati batas waktu.
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timeout — periksa koneksi internet atau coba lagi')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

/**
 * GET request ke GAS
 */
async function gasGet(action, params = {}) {
  if (!GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID')) {
    // Return dummy data jika GAS belum dikonfigurasi
    return getDummyData(action, params)
  }

  const url = new URL(GAS_URL)
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v)
    }
  })

  const res = await fetchWithTimeout(url.toString(), { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  if (json.status === 'error') throw new Error(json.message || 'GAS error')

  // Unwrap envelope {status:'ok', data: ...} dari GAS
  const data = (json.status === 'ok' && json.data !== undefined) ? json.data : json

  // Normalisasi field dari GAS ke format dashboard
  if (action === 'getAllPos' && Array.isArray(data)) {
    return data.map(normalizePos)
  }
  if (action === 'getAllPos' && data?.value) {
    return data.value.map(normalizePos)
  }

  // Endpoint yang WAJIB mengembalikan array — normalisasi defensif
  // GAS bisa mengembalikan object ({rows:[...]}, {values:[...]}, dst) atau
  // nilai truthy lain saat data kosong. Semua kasus di-handle di sini supaya
  // consumer code yang pakai (data || []).filter() tidak crash di production.
  const LIST_ACTIONS = [
    'getAllKerawanan', 'getAllBinter', 'getAllDemografi', 'getAllTokoh',
    'getTokoh', 'getBinter', 'getKerawanan',
  ]
  if (LIST_ACTIONS.includes(action)) {
    if (Array.isArray(data)) return data
    // Coba ambil dari property umum yang dipakai di GAS
    if (data && Array.isArray(data.data))   return data.data
    if (data && Array.isArray(data.rows))   return data.rows
    if (data && Array.isArray(data.values)) return data.values
    if (data && Array.isArray(data.value))  return data.value
    // Fallback: array kosong daripada crash
    return []
  }

  // getDemografi: GAS bisa mengembalikan array (multiple rows per pos/kelurahan)
  // atau single object. Kita aggregate ke satu object agar DemografiTable tidak
  // menolaknya dengan cek Array.isArray().
  if (action === 'getDemografi') {
    const rows = Array.isArray(data)         ? data
               : Array.isArray(data?.data)   ? data.data
               : Array.isArray(data?.rows)   ? data.rows
               : Array.isArray(data?.values) ? data.values
               : null

    if (rows && rows.length > 0) {
      return normalizeDemografi(aggregateDemografi(rows))
    }
    // GAS sudah kirim single object langsung
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return normalizeDemografi(data)
    }
    // Tidak ada data → null supaya DemografiTable tampil "belum tersedia"
    return null
  }

  return data
}

/**
 * POST request ke GAS
 */
async function gasPost(action, data) {
  if (!GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID')) {
    console.log('[API Mock] POST', action, data)
    return { success: true, message: 'Mock: GAS belum dikonfigurasi' }
  }

  const res = await fetchWithTimeout(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, data }),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const result = await res.json()
  if (result.error) throw new Error(result.error)
  return result
}

// ─── Aggregate demografi rows → single object ────────────────────────────────
// Sheet demografi bisa punya beberapa baris per pos (satu per kelurahan).
// Fungsi ini menjumlahkan semua kolom numerik dan menggabungkan teks.

function aggregateDemografi(rows) {
  const NUM_FIELDS = [
    'total_penduduk', 'total_kk',
    'islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'lainnya',
    'masjid', 'gereja', 'pura', 'vihara',
  ]

  const base = { ...rows[0] }

  // Reset semua field numerik ke 0 dulu, lalu akumulasi
  NUM_FIELDS.forEach(f => { base[f] = 0 })
  rows.forEach(row => {
    NUM_FIELDS.forEach(f => {
      base[f] = (base[f] || 0) + (Number(row[f]) || 0)
    })
  })

  // Gabungkan field teks dari semua baris (unik, pisah " | ")
  const TEXT_FIELDS = ['geografi', 'demografi_notes', 'konsos_notes']
  TEXT_FIELDS.forEach(f => {
    const parts = [...new Set(
      rows.map(r => (r[f] || '').trim()).filter(Boolean)
    )]
    base[f] = parts.join(' | ') || '—'
  })

  // Simpan daftar kelurahan untuk info tambahan
  const kelurahans = rows
    .map(r => r.nama_kelurahan || r.kelurahan || '')
    .filter(Boolean)
  if (kelurahans.length > 0) {
    base._kelurahan_list = kelurahans
  }

  return base
}

// ─── Normalisasi field demografi dari GAS → format dashboard ─────────────────
// GAS bisa mengirim nama kolom yang berbeda tergantung header di sheet.
// Fungsi ini menjamin field yang dipakai DemografiTable selalu ada.

function normalizeDemografi(obj) {
  if (!obj || typeof obj !== 'object') return obj
  return {
    ...obj,
    // Jumlah penduduk: bisa total_penduduk, jumlah_penduduk, penduduk
    total_penduduk: Number(obj.total_penduduk ?? obj.jumlah_penduduk ?? obj.penduduk ?? 0),
    // KK: bisa total_kk, jumlah_kk, kk
    total_kk: Number(obj.total_kk ?? obj.jumlah_kk ?? obj.kk ?? 0),
    // Agama — fallback ke 0 jika field tidak ada
    islam:    Number(obj.islam    ?? 0),
    kristen:  Number(obj.kristen  ?? 0),
    katolik:  Number(obj.katolik  ?? 0),
    hindu:    Number(obj.hindu    ?? 0),
    buddha:   Number(obj.buddha   ?? 0),
    konghucu: Number(obj.konghucu ?? 0),
    lainnya:  Number(obj.lainnya  ?? 0),
    // Tempat ibadah
    masjid:  Number(obj.masjid  ?? obj.masjid_mushola ?? 0),
    gereja:  Number(obj.gereja  ?? 0),
    pura:    Number(obj.pura    ?? 0),
    vihara:  Number(obj.vihara  ?? 0),
    // Teks
    geografi:        obj.geografi        || obj.kondisi_geografi || '',
    demografi_notes: obj.demografi_notes || obj.kondisi_demografi || '',
    konsos_notes:    obj.konsos_notes    || obj.kondisi_sosial    || obj.konsos || '',
  }
}



function normalizePos(p) {
  return {
    ...p,
    // Dashboard pakai jumlah_personel, GAS kirim kuat_pers
    jumlah_personel: p.jumlah_personel ?? p.kuat_pers ?? 0,
    // Alias field tambahan
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

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  // READ
  getAllPos:        ()               => gasGet('getAllPos'),
  getSummary:      ()               => gasGet('getSummary'),
  getAllDemografi:  ()               => gasGet('getAllDemografi'),
  getAllTokoh:      ()               => gasGet('getAllTokoh'),
  getDemografi:    (pos_id)         => gasGet('getDemografi', { pos_id }),
  getTokoh:        (pos_id)         => gasGet('getTokoh', { pos_id }),
  getBinter:       (pos_id, bulan)  => gasGet('getBinter', { pos_id, bulan }),
  getKerawanan:    (pos_id, status) => gasGet('getKerawanan', { pos_id, status }),
  getAllKerawanan:  ()               => gasGet('getAllKerawanan'),
  getAllBinter:     ()               => gasGet('getAllBinter'),

  // WRITE
  addTokoh:        (data) => gasPost('addTokoh', data),
  updateTokoh:     (data) => gasPost('updateTokoh', data),
  deleteTokoh:     (data) => gasPost('deleteTokoh', data),
  addBinter:       (data) => gasPost('addBinter', data),
  updateBinter:    (data) => gasPost('updateBinter', data),
  deleteBinter:    (data) => gasPost('deleteBinter', data),
  addKerawanan:    (data) => gasPost('addKerawanan', data),
  updateKerawanan: (data) => gasPost('updateKerawanan', data),
  deleteKerawanan: (data) => gasPost('deleteKerawanan', data),
  updateDemografi: (data) => gasPost('updateDemografi', data),
  updatePos:       (data) => gasPost('updatePos', data),
}

// ─── Dummy Data (sebelum GAS dikonfigurasi) ───────────────────────────────────

function getDummyData(action, params) {
  switch (action) {
    case 'getAllPos':
      return DUMMY_POS

    case 'getSummary':
      return {
        total_pos: 17,
        total_penduduk: 0,
        total_kk: 0,
        kerawanan_aktif: 0,
        binter_bulan_ini: 0,
      }

    case 'getDemografi':
      return {
        pos_id: params.pos_id,
        total_penduduk: 0,
        total_kk: 0,
        islam: 0, kristen: 0, katolik: 0, hindu: 0, buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 0, gereja: 0, pura: 0, vihara: 0,
        geografi: '—',
        demografi_notes: '—',
        konsos_notes: '—',
      }

    case 'getTokoh':
      return []

    case 'getAllTokoh':
      return []

    case 'getBinter':
      return []

    case 'getKerawanan':
      return []

    case 'getAllKerawanan':
      return DUMMY_KERAWANAN

    case 'getAllBinter':
      return DUMMY_BINTER

    default:
      return []
  }
}

// Data 17 Pos Satgas Pamtas RI-MAL Yonkav 8/NSW
// pos_id sesuai Google Sheets — Kab. Nunukan, Kalimantan Utara
const DUMMY_POS = [
  { pos_id: 'KT',  nama_pos: 'Pos Kotis Nunukan',       lokasi_desa: 'Ds. Pasir Putih',    kabupaten: 'Kab. Nunukan', lat: 4.14250,  lng: 117.67300, komandan_pos: 'Letkol Kav Dian Kriswijaya', jumlah_personel: 62, foto_satelit_url: '' },
  { pos_id: 'AJ',  nama_pos: 'Pos Aji Kuning',          lokasi_desa: 'Ds. Aji Kuning',     kabupaten: 'Kab. Nunukan', lat: 4.13200,  lng: 117.65450, komandan_pos: 'Sertu Ahmad Ahsan',          jumlah_personel: 23, foto_satelit_url: '' },
  { pos_id: 'TA',  nama_pos: 'Pos Tanjung Aru',         lokasi_desa: 'Ds. Tanjung Aru',    kabupaten: 'Kab. Nunukan', lat: 4.12450,  lng: 117.64200, komandan_pos: 'Letda Kav Ibra Rizky A.',   jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'BB',  nama_pos: 'Pos Bambangan Besar',     lokasi_desa: 'Desa Bambangan',     kabupaten: 'Kab. Nunukan', lat: 4.09800,  lng: 117.62800, komandan_pos: 'Letda Kav Eleazer P.',      jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'BK',  nama_pos: 'Pos Bukit Keramat',       lokasi_desa: 'Kp. Keramat',        kabupaten: 'Kab. Nunukan', lat: 4.07550,  lng: 117.61500, komandan_pos: 'Serka Lukman Nurhadi',      jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'GSG', nama_pos: 'Pos Gosong',              lokasi_desa: 'Ds. Gosong',         kabupaten: 'Kab. Nunukan', lat: 4.05300,  lng: 117.59850, komandan_pos: 'Sertu Toto Hari',           jumlah_personel: 23, foto_satelit_url: '' },
  { pos_id: 'KD',  nama_pos: 'Pos Kanduangan',          lokasi_desa: 'Ds. Kanduangan',     kabupaten: 'Kab. Nunukan', lat: 4.03100,  lng: 117.58200, komandan_pos: 'Letda Kav Ngurah Krishna',  jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'SU',  nama_pos: 'Pos Sei Ular',            lokasi_desa: 'Ds. Sekaduyan Taka', kabupaten: 'Kab. Nunukan', lat: 4.00900,  lng: 117.56400, komandan_pos: 'Lettu Cpl Hegga',           jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'SK',  nama_pos: 'Pos Sei Kaca',            lokasi_desa: 'Ds. Sekaduyan Taka', kabupaten: 'Kab. Nunukan', lat: 3.98700,  lng: 117.54700, komandan_pos: 'Serma Harry Maulana',       jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'TB',  nama_pos: 'Pos Tembalang/Kout',      lokasi_desa: 'Ds. Tembalang',      kabupaten: 'Kab. Nunukan', lat: 3.96500,  lng: 117.52900, komandan_pos: 'Sertu Zainul Fuad',         jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'SL',  nama_pos: 'Pos Salang',              lokasi_desa: 'Ds. Salang',         kabupaten: 'Kab. Nunukan', lat: 3.94200,  lng: 117.51100, komandan_pos: 'Serma Riyanto',             jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'SMB', nama_pos: 'Pos Seimanggaris Baru',   lokasi_desa: 'Ds. Seimanggaris',   kabupaten: 'Kab. Nunukan', lat: 3.91950,  lng: 117.49200, komandan_pos: '—',                         jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'SML', nama_pos: 'Pos Seimanggaris Lama',   lokasi_desa: 'Ds. Seimanggaris',   kabupaten: 'Kab. Nunukan', lat: 3.89700,  lng: 117.47300, komandan_pos: '—',                         jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'LB',  nama_pos: 'Pos Labang',              lokasi_desa: 'Ds. Labang',         kabupaten: 'Kab. Nunukan', lat: 3.87400,  lng: 117.45400, komandan_pos: '—',                         jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'GSL', nama_pos: 'Pos Gosong Laut',         lokasi_desa: 'Ds. Gosong Laut',    kabupaten: 'Kab. Nunukan', lat: 3.85100,  lng: 117.43500, komandan_pos: '—',                         jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'ML',  nama_pos: 'Pos Mensalong (Koki)',    lokasi_desa: 'Ds. Mensalong',      kabupaten: 'Kab. Nunukan', lat: 3.82850,  lng: 117.41600, komandan_pos: '—',                         jumlah_personel: 16, foto_satelit_url: '' },
  { pos_id: 'LMS', nama_pos: 'Pos Lumbis',              lokasi_desa: 'Ds. Lumbis',         kabupaten: 'Kab. Nunukan', lat: 3.80600,  lng: 117.39700, komandan_pos: '—',                         jumlah_personel: 16, foto_satelit_url: '' },
]

// Kosong — akan diisi dari Google Sheets saat latihan
const DUMMY_KERAWANAN = []

const DUMMY_BINTER = []
