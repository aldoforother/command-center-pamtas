/**
 * Service layer untuk komunikasi dengan Google Apps Script
 * Semua request ke GAS endpoint lewat sini
 */

const GAS_URL = import.meta.env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbxBUt9tgBQx-37JEA-GxftPN7h4WvECHn79anAEupLZZr1l1__8BA44JoZCv1Bo3CSdZA/exec'

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

  const res = await fetch(url.toString(), { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
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

  const res = await fetch(GAS_URL, {
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

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  // READ
  getAllPos:        ()               => gasGet('getAllPos'),
  getSummary:      ()               => gasGet('getSummary'),
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
  addKerawanan:    (data) => gasPost('addKerawanan', data),
  updateKerawanan: (data) => gasPost('updateKerawanan', data),
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
        total_pos: 13,
        total_penduduk: 18500,
        total_kk: 4620,
        kerawanan_aktif: 3,
        binter_bulan_ini: 8,
      }

    case 'getDemografi':
      return {
        pos_id: params.pos_id,
        total_penduduk: 1420,
        total_kk: 355,
        islam: 1100, kristen: 180, katolik: 90, hindu: 35, buddha: 10, konghucu: 0, lainnya: 5,
        masjid: 4, gereja: 1, pura: 2, vihara: 0,
        geografi: 'Wilayah pedesaan di Jawa Timur dengan topografi berbukit. Akses jalan aspal menuju kota kecamatan sekitar 15 km.',
        demografi_notes: 'Mayoritas penduduk adalah Suku Jawa dan Madura. Mata pencaharian utama pertanian dan perkebunan.',
        konsos_notes: 'Kondisi sosial kondusif. Hubungan antar warga harmonis. Tingkat pendidikan rata-rata SMA.',
      }

    case 'getTokoh':
      return [
        { id: 'T001', pos_id: params.pos_id, nama: 'H. Slamet Riyadi', kategori: 'Adat', jabatan: 'Kepala Desa', alamat: 'Desa Setempat', no_telp: '081234567890', catatan: 'Tokoh berpengaruh, kooperatif' },
        { id: 'T002', pos_id: params.pos_id, nama: 'KH. Mahmud Faiz', kategori: 'Agama', jabatan: 'Ketua MUI Kecamatan', alamat: 'Pesantren Al-Hidayah', no_telp: '082345678901', catatan: '' },
        { id: 'T003', pos_id: params.pos_id, nama: 'Camat Setempat', kategori: 'Masyarakat', jabatan: 'Camat', alamat: 'Kantor Kecamatan', no_telp: '083456789012', catatan: 'Aktif koordinasi dengan Satgas' },
      ]

    case 'getBinter':
      return [
        { id: 'B001', pos_id: params.pos_id, tanggal: '2026-06-10', jenis_kegiatan: 'Pengobatan Gratis', lokasi: 'Balai Desa', sasaran: 'Warga Desa', jumlah_peserta: 110, keterangan: 'Bekerjasama dengan Puskesmas setempat', foto_url: '' },
        { id: 'B002', pos_id: params.pos_id, tanggal: '2026-06-05', jenis_kegiatan: 'Olahraga Bersama', lokasi: 'Lapangan Desa', sasaran: 'Pemuda Desa', jumlah_peserta: 50, keterangan: 'Turnamen voli dan futsal', foto_url: '' },
        { id: 'B003', pos_id: params.pos_id, tanggal: '2026-05-28', jenis_kegiatan: 'Penyuluhan Hukum', lokasi: 'Balai Desa', sasaran: 'Tokoh Masyarakat', jumlah_peserta: 30, keterangan: 'Sosialisasi ketertiban dan keamanan wilayah', foto_url: '' },
      ]

    case 'getKerawanan':
      return [
        { id: 'K001', pos_id: params.pos_id, tanggal: '2026-06-12', kategori: 'Kriminal', deskripsi: 'Laporan pencurian kendaraan di wilayah desa', status: 'aktif', lat: -8.290, lng: 112.730, pelaku: 'Tidak diketahui', tindak_lanjut: 'Koordinasi dengan Polsek setempat', foto_url: '' },
        { id: 'K002', pos_id: params.pos_id, tanggal: '2026-06-01', kategori: 'Sosial', deskripsi: 'Potensi konflik lahan antar warga desa', status: 'selesai', lat: -8.295, lng: 112.735, pelaku: 'Warga setempat', tindak_lanjut: 'Mediasi berhasil dilakukan', foto_url: '' },
      ]

    case 'getAllKerawanan':
      return DUMMY_KERAWANAN

    case 'getAllBinter':
      return DUMMY_BINTER

    default:
      return []
  }
}

const DUMMY_POS = [
  { pos_id: 'KOTIS',    nama_pos: 'Pos Kotis',              lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.265254,  lng: 112.7322575, komandan_pos: 'Kapten Kav —',      jumlah_personel: 40, foto_satelit_url: '' },
  { pos_id: 'POS-01',  nama_pos: 'Pos Aji Kuning',          lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3022433, lng: 112.7434708, komandan_pos: 'Lettu Kav —',       jumlah_personel: 28, foto_satelit_url: '' },
  { pos_id: 'POS-02',  nama_pos: 'Pos Bambangan',           lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3025682, lng: 112.745678,  komandan_pos: 'Lettu Kav —',       jumlah_personel: 25, foto_satelit_url: '' },
  { pos_id: 'POS-03',  nama_pos: 'Pos Bukit Keramat',       lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.2975417, lng: 112.7455469, komandan_pos: 'Lettu Kav —',       jumlah_personel: 26, foto_satelit_url: '' },
  { pos_id: 'POS-04',  nama_pos: 'Pos Tanjung Aru',         lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3051172, lng: 112.7458255, komandan_pos: 'Lettu Kav —',       jumlah_personel: 24, foto_satelit_url: '' },
  { pos_id: 'POS-05',  nama_pos: 'Pos Gabma Seimanggaris',  lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.2862491, lng: 112.7195053, komandan_pos: 'Lettu Kav —',       jumlah_personel: 30, foto_satelit_url: '' },
  { pos_id: 'POS-06',  nama_pos: 'Pos Kanduangan',          lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.2919343, lng: 112.7459579, komandan_pos: 'Lettu Kav —',       jumlah_personel: 22, foto_satelit_url: '' },
  { pos_id: 'POS-07',  nama_pos: 'Pos Sei Ular',            lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.2760253, lng: 112.7419712, komandan_pos: 'Lettu Kav —',       jumlah_personel: 27, foto_satelit_url: '' },
  { pos_id: 'POS-08',  nama_pos: 'Pos Seikaca',             lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.2808168, lng: 112.742083,  komandan_pos: 'Lettu Kav —',       jumlah_personel: 23, foto_satelit_url: '' },
  { pos_id: 'POS-09',  nama_pos: 'Pos Labang',              lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.2791336, lng: 112.6758735, komandan_pos: 'Lettu Kav —',       jumlah_personel: 25, foto_satelit_url: '' },
  { pos_id: 'POS-10',  nama_pos: 'Pos Lumbis',              lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3156161, lng: 112.6215331, komandan_pos: 'Lettu Kav —',       jumlah_personel: 21, foto_satelit_url: '' },
  { pos_id: 'POS-11',  nama_pos: 'Pos Mensalong',           lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3092966, lng: 112.6324006, komandan_pos: 'Lettu Kav —',       jumlah_personel: 20, foto_satelit_url: '' },
  { pos_id: 'POS-12',  nama_pos: 'Pos Seimaba',             lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3053727, lng: 112.6906671, komandan_pos: 'Lettu Kav —',       jumlah_personel: 22, foto_satelit_url: '' },
  { pos_id: 'POS-13',  nama_pos: 'Pos Salang',              lokasi_desa: 'Daerah Latihan', kabupaten: 'Jawa Timur', lat: -8.3156326, lng: 112.6885924, komandan_pos: 'Lettu Kav —',       jumlah_personel: 20, foto_satelit_url: '' },
]

const DUMMY_KERAWANAN = [
  { id: 'K001', pos_id: 'POS-01', tanggal: '2026-06-12', kategori: 'Kriminal',      deskripsi: 'Laporan pencurian kendaraan di wilayah pos', status: 'aktif',   lat: -8.303, lng: 112.744 },
  { id: 'K002', pos_id: 'POS-05', tanggal: '2026-06-10', kategori: 'Sosial',        deskripsi: 'Potensi konflik lahan antar warga',           status: 'selesai', lat: -8.287, lng: 112.720 },
  { id: 'K003', pos_id: 'POS-07', tanggal: '2026-06-08', kategori: 'Kriminal',      deskripsi: 'Pencurian ternak warga di sekitar pos',       status: 'aktif',   lat: -8.277, lng: 112.742 },
  { id: 'K004', pos_id: 'POS-09', tanggal: '2026-06-05', kategori: 'Illegal Mining','deskripsi': 'Penambangan liar di aliran sungai',          status: 'aktif',   lat: -8.280, lng: 112.676 },
]

const DUMMY_BINTER = [
  { id: 'B001', pos_id: 'POS-01', tanggal: '2026-06-10', jenis_kegiatan: 'Pengobatan Gratis', lokasi: 'Balai Desa',    jumlah_peserta: 110 },
  { id: 'B002', pos_id: 'POS-05', tanggal: '2026-06-08', jenis_kegiatan: 'Bakti Sosial',      lokasi: 'Lapangan Desa', jumlah_peserta: 80 },
  { id: 'B003', pos_id: 'POS-07', tanggal: '2026-06-06', jenis_kegiatan: 'Olahraga Bersama',  lokasi: 'Lapangan Pos',  jumlah_peserta: 55 },
  { id: 'B004', pos_id: 'POS-03', tanggal: '2026-06-04', jenis_kegiatan: 'Penyuluhan Hukum',  lokasi: 'Balai Desa',    jumlah_peserta: 30 },
  { id: 'B005', pos_id: 'POS-10', tanggal: '2026-06-02', jenis_kegiatan: 'Silaturahmi Tokoh', lokasi: 'Kantor Desa',   jumlah_peserta: 18 },
]
