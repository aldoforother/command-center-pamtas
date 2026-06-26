import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { useToast } from '../ui/Toast'
import { demografiService } from '../../services/demografi.service'
import { POS_LIST } from '../../constants/posList'

/**
 * GeoDemoKonsos — Tab Geo-Demo-Konsos di PosDetailPage.
 *
 * Menampilkan tiga aspek: Kondisi Geografi, Kondisi Demografi, Kondisi Sosial.
 * Setiap aspek bisa diedit secara inline jika posId tersedia.
 * Field teks bebas (geografi, demografi_notes, konsos_notes) disimpan ke Supabase
 * via demografiService.upsert().
 *
 * SQL migration (jalankan sekali di Supabase SQL Editor):
 *   ALTER TABLE demografi
 *     ADD COLUMN IF NOT EXISTS geografi        TEXT,
 *     ADD COLUMN IF NOT EXISTS demografi_notes TEXT,
 *     ADD COLUMN IF NOT EXISTS konsos_notes    TEXT;
 */

/* ── Expert-level auto-description generator ───────────────── */
function generateGeografiAuto(pos, demografiSummary) {
  const posId = pos?.pos_id || ''
  const posData = POS_LIST.find(p => p.pos_id === posId) || {}
  const { lat, lng, jumlah_personel: personel = 0, nama_pos: namaPos } = posData

  // Klasifikasi berdasarkan lokasi dan koordinat
  const isSebatik = namaPos?.toLowerCase().includes('sebatik') ||
    posData.lokasi_desa?.toLowerCase().includes('sebatik') ||
    posData.kabupaten?.toLowerCase().includes('sebatik')

  const isKotis = posId === 'KOTIS' || posId === 'KT'
  const isDPP = posId.includes('DPP')
  const isSekaduyan = namaPos?.toLowerCase().includes('sekaduyan')
  const isSei = namaPos?.toLowerCase().includes('sei ') || namaPos?.toLowerCase().includes('sei-')

  // Koordinat reference untuk elevasi
  const elevasiHint = (lat && lng)
    ? (lat < -4 ? 'elevasi dataran tinggi/becek khas hutan tropis perbatasan' : 'elevasi rendah hingga dataran beach/frontier yang landai')
    : ''

  const koordinatHint = (lat && lng)
    ? `berkoordinat ${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'LU' : 'LS'}, ${Math.abs(lng).toFixed(4)}°BT`
    : ''

  // Klasifikasi kekuatan personel
  let personelKlasifikasi = ''
  if (isKotis) {
    personelKlasifikasi = `sebagai Pos Induk (Kotis) memiliki kekuatan tertinggi yaitu ${personel} personel TNI AD, berfungsi sebagai pusat komando dan koordinasi operasi di seluruh wilayah tugas`
  } else if (personel >= 20) {
    personelKlasifikasi = `berkedudukan sebagai pos dengan kekuatan sedang (${personel} personel), mampu menjalankan operasi patroli mandiri dan reaksi cepat dalam radius tugasnya`
  } else if (personel >= 10) {
    personelKlasifikasi = `berposisi sebagai pos dengan kekuatan terbatas (${personel} personel), mengutamakan fungsi surveillance (pengawasan) dan early warning terhadap aktivitas di sekitar GBN`
  } else {
    personelKlasifikasi = `memiliki kekuatan personel minimal (${personel} personel), lebih mengutamakan fungsi pengamatan定点 (observation post) dan pelaporan situasi perbatasan`
  }

  // Deskripsi spesifik berdasarkan lokasi
  let lokasiDeskripsi = ''
  if (isKotis) {
    lokasiDeskripsi = `Pos ini terletak di kawasan ${posData.lokasi_desa || 'Pasir Putih'}, merupakan simpul utama operasi seluruh pos yang berada dalam yurisdiksi Yonkav 8/NSW. Dari pos ini, komandan satgas mengkoordinasikan seluruh aktivitas operasional mulai dari patroli perbatasan hingga penanganan insiden lintas batas.`
  } else if (isDPP) {
    lokasiDeskripsi = `Pos DPP (Dewan Pengarah Pos) berfungsi sebagai pos pendukung dengan peran spesifik dalam koordinasi tingkat detachemen. Lokasi di kawasan ${posData.lokasi_desa || 'Sekaduyan Taka'} berada di dekat area persimpangan sungai yang menjadi jalur strategis pergerakan masyarakat lintas batas.`
  } else if (isSebatik) {
    lokasiDeskripsi = `Wilayah tugas berada di Pulau Sebatik yang merupakan kawasan perbatasan darat terbesar antara Indonesia dan Malaysia di Kalimantan Utara. Pulau ini memiliki keunikan geografis sebagai wilayah yang dibelah oleh GBN dengan pemukiman penduduk yang tersebar di kedua sisi perbatasan, menciptakan dinamika sosial dan keamanan yang kompleks.`
  } else if (isSekaduyan) {
    lokasiDeskripsi = `Pos berada di kawasan Desa Sekaduyan Taka yang merupakan pintu gerbang utama aktivitas perbatasan di sektor ini. Area ini dikenal sebagai salah satu titik perlintasan yang ramai dengan mobilitas tinggi masyarakat perbatasan yang melintas setiap hari untuk aktivitas comercio (perdagangan) dan sosial.`
  } else if (isSei) {
    lokasiDeskripsi = `Lokasi di sekitar aliran Sungai ${namaPos?.includes('Ular') ? 'Ular' : namaPos?.includes('Kaca') ? 'Kaca' : 'berhulu'} yang menjadi penghubung utama antara wilayah Indonesia dan Malaysia. Sungai ini sekaligus berfungsi sebagai natural barrier dan jalur patroli alami bagi personel pos.`
  } else {
    lokasiDeskripsi = `Berada di wilayah perbatasan darat dengan topografi yang bervariasi antara dataran beach hingga forested hill. Area ini mencakup beberapa titik perlintasan tidak resmi (jalur tikus) yang perlu dipantau secara berkelanjutan.`
  }

  // Aksesibilitas
  let aksesibilitas = 'Akses menuju pos dapatdilalui melalui jalan tanah dan sungai pada musim kemarau, namun mengalami kesulitan akses pada musim hujan akibat kondisi jalan yang becek dan Genangan air.'
  if (isKotis || isDPP) {
    aksesibilitas = 'Pos memiliki akses jalan yang relatif baik dan dapat dijangkau dengan kendaraan bermotor sepanjang tahun, dengan jarak tempuh sekitar 2-4 jam dari kota Nunukan.'
  }

  const lines = [
    `**${namaPos || posId}** (${posId}) ${koordinatHint} merupakan bagian integral dari Garis Batas Negara (GBN) di wilayah perbatasan darat Indonesia-Malaysia, Prov. Kalimantan Utara, Kab. Nunukan.`,
    lokasiDeskripsi,
    `Pos ini beroperasi ${personelKlasifikasi}.`,
    `Wilayah tugas memiliki karakteristik ${elevasiHint}. ${aksesibilitas}`,
    `Area perbatasan di sektornya mencakup beberapa titik perlintasan tidak resmi yang berpotensi digunakan untuk aktivitas ilegal seperti smuggling (narkoba, barang selundupan), illegal logging, dan human trafficking. Fungsi utama pos adalah melakukan deteksi dini, pencegahan, serta koordinasi denganinstansi terkait (Imigrasi, Bea Cukai, BNP) dalam penanganan aktivitas ilegal lintas batas.`,
  ]

  return lines.join('\n\n')
}

function generateDemografiAuto(demografiSummary, pos) {
  const { total_penduduk: penduduk = 0, total_kk: kk = 0 } = demografiSummary || {}
  const rataKK = kk > 0 ? (penduduk / kk).toFixed(1) : null
  const posId = pos?.pos_id || ''

  const islam   = demografiSummary?.islam   || 0
  const kristen = demografiSummary?.kristen || 0
  const katolik = demografiSummary?.katolik || 0
  const hindu   = demografiSummary?.hindu   || 0
  const buddha  = demografiSummary?.buddha  || 0
  const lainnya  = demografiSummary?.lainnya  || 0
  const totalAgama = islam + kristen + katolik + hindu + buddha + lainnya

  const masjid  = demografiSummary?.masjid  || 0
  const gereja  = demografiSummary?.gereja  || 0
  const pura    = demografiSummary?.pura    || 0
  const vihara  = demografiSummary?.vihara  || 0
  const totalIbadah = masjid + gereja + pura + vihara

  // Klasifikasi kepadatan wilayah
  const klasifikasi = penduduk < 200
    ? 'sangat jarang didiami (kurang dari 200 jiwa) — merupakan zona penyangga (buffer zone) perbatasan dengan aktivitas manusia yang sangat terbatas'
    : penduduk < 1000
    ? 'relatif jarang didiami (200–1.000 jiwa) — didominasi komunitas lokal dengan mobilitas tinggi'
    : penduduk < 5000
    ? 'kepadatan sedang (1.000–5.000 jiwa) — terdapat pemukiman padat di sekitar akses perbatasan utama'
    : 'kepadatan tinggi (lebih dari 5.000 jiwa) — merupakan pusat aktivitas perbatasan dengan mobilitas tinggi'

  // Analisis komposisi agama dengan penjelasan implikasi keamanan
  let komposisiDesc = ''
  if (totalAgama > 0) {
    const rasioIslam = islam / totalAgama
    const rasioKristen = (kristen + katolik) / totalAgama
    const rasioHindu = hindu / totalAgama
    const rasioBuddha = buddha / totalAgama

    if (rasioIslam > 0.92) {
      komposisiDesc = `Wilayah ini memiliki komposisi keagamaan yang sangathomogen dengan ${(rasioIslam * 100).toFixed(1)}% Muslim. Karakteristik ini mencerminkan masyarakat pesisir Kalimantan Utara yang secara historis merupakan transmigran dari Jawa dan Sulawesi Selatan. Keseragaman ini berpotensi membentuk solidaritas sosial yang kuat namun juga menciptakan kerentanan terhadap pengaruh radikalisme if they encounter external ideological infiltrators — perlu dipantau melalui kegiatan Binter yang masif dan kontinyu.`
    } else if (rasioKristen > 0.7) {
      komposisiDesc = `Komposisi didominasi oleh pemeluk agama Kristen/Katolik (${(rasioKristen * 100).toFixed(1)}%), yang umumnya merupakan komunitas adat di wilayah pedalaman Kalimantan. Kondisi ini memerlukan sensitivitas khusus dalam pendekatan BINTEK karena terdapat dinamika kepercayaan lokal yang berbaur dengan praktik agama kristiani.`
    } else if (rasioHindu > 0.5) {
      komposisiDesc = `Populasi dengan mayoritas Hindu (${(rasioHindu * 100).toFixed(1)}%) — kemungkinan besar merupakan komunitas Bali yang Transmigran dari Bali/NTT. Komunitas ini umumnya memiliki struktur sosial yang terorganisir dan seringkali merupakan pelaku utama pertanian subsisten di wilayah perbatasan.`
    } else if (rasioBuddha > 0.4) {
      komposisiDesc = `Dominasi pemeluk Buddha (${(rasioBuddha * 100).toFixed(1)}%) mencerminkan komunitas Tionghoa-Melanau yang sudah lama menetap di wilayah pesisir Kalimantan Utara. Komunitas ini umumnya memiliki jaringan ekonomi lintas batas yang erat dengan Malaysia Timur (Sarawak, Sabah).`
    } else {
      komposisiDesc = `Komposisi multibudaya dengan Islam ${(islam / totalAgama * 100).toFixed(1)}%, Kristen/Katolik ${(rasioKristen * 100).toFixed(1)}%, Hindu ${(hindu / totalAgama * 100).toFixed(1)}%, Buddha ${(buddha / totalAgama * 100).toFixed(1)}% — mencerminkan karakteristik masyarakat perbatasan yang Majemuk dan Toleran. Keragaman ini merupakan kekuatan dalam menjaga stabilitas sosial, namun juga memerlukan pendekatan BINTEK yang inklusif dan representatif.`
    }
  }

  // Rasio tempat ibadah
  let ibadahDesc = ''
  if (totalIbadah > 0 && kk > 0) {
    const rasio = (totalIbadah / kk).toFixed(2)
    if (totalIbadah === 1) {
      ibadahDesc = `Terdapat ${totalIbadah} tempat ibadah yang berfungsi sebagai pusat kegiatan sosial dan keagamaan masyarakat. Dalam konteks perbatasan, tempat ibadah juga seringkali berfungsi sebagai titik koordinasi komunitas dan venues BINTEK.`
    } else {
      ibadahDesc = `Dengan ${totalIbadah} tempat ibadah (${masjid > 0 ? `${masjid} masjid, ` : ''}${gereja > 0 ? `${gereja} gereja, ` : ''}${pura > 0 ? `${pura} pura, ` : ''}${vihara > 0 ? `${vihara} vihara` : ''}) untuk ${kk.toLocaleString('id-ID')} KK, rasio места ibadah per keluarga adalah 1:${Math.round(Number(rasio))}. Ini menunjukkan ${totalIbadah >= kk / 3 ? 'kepadatan fasilitas keagamaan yang tinggi, memperkuat fungsi sosial tempat ibadah sebagai pusat komunitas' : 'ketersediaan fasilitas keagamaan yang memadai untuk melayani kebutuhan spiritual masyarakat.'}`
    }
  } else if (totalAgama > 100) {
    ibadahDesc = `Belum terdapat data mengenai tempat ibadah di wilayah ini — diperlukan survey langsung untuk mengetahui ketersediaan dan kondisi fasilitas keagamaan yang mendukung kegiatan BINTEK.`
  }

  // Dinamika perbatasan
  let dinamikaDesc = ''
  if (penduduk > 500) {
    dinamikaDesc = `Dinamika kependudukan di wilayah perbatasan ini sangat dipengaruhi oleh: (1) Mobilitas harian TIMNAS (Tenaga Indonesia Malaysia) yang melintas GBN untuk bekerja di sektor perkebunan dan jasa Malaysia; (2) Aliran remitan (pengiriman uang) dari Malaysia yang menjadi sumber ekonomi utama keluarga; (3) Potensi konflik sosial akibat kompetisi lapangan kerja antara TIMNAS dan warga lokal; (4) Risiko eksploitasi sosial oleh pihak-pihak yang memanfaatkan ketimpangan ekonomi. Kondisi ini menuntut kehadiran active presence pos dalam melakukanBINLA (Pembinaan Lainnya) dan BINTEK untuk menjaga kohesi sosial masyarakat.`
  } else if (penduduk > 0) {
    dinamikaDesc = `Dengan populasi yang relatif kecil, wilayah ini memiliki karakter sebagai community-based settlement dengan ikatan sosial yang erat (close-knit community). Pergerakan penduduk lintas batas umumnya bersifat sporadis dan terkait dengan aktivitas perkebunan subsisten.`
  }

  const lines = [
    `**Analisis Demografis**\nWilayah perbatasan ini memiliki populasi ${klasifikasi} dengan total ${penduduk > 0 ? penduduk.toLocaleString('id-ID') + ' jiwa' : 'belum ada data resmi'} dalam ${kk > 0 ? kk.toLocaleString('id-ID') + ' kepala keluarga' : 'belum ada data'}.${rataKK ? ` Rata-rata anggota keluarga ${rataKK} jiwa per KK, mencerminkan pola keluarga nuclear yang tipikal di wilayah perbatasan.'` : ''}`,
    komposisiDesc ? `\n**Komposisi keagamaan:** ${komposisiDesc}` : '',
    ibadahDesc ? `\n**Fasilitas keagamaan:** ${ibadahDesc}` : '',
    dinamikaDesc ? `\n**Dinamika perbatasan:** ${dinamikaDesc}` : '',
  ]

  return lines.filter(Boolean).join('\n\n')
}

function generateKonsosAuto(demografiSummary, pos) {
  const { total_penduduk: penduduk = 0, total_kk: kk = 0 } = demografiSummary || {}
  const posId = pos?.pos_id || ''
  const namaPos = pos?.nama_pos || posId
  const posData = POS_LIST.find(p => p.pos_id === posId) || {}
  const { jumlah_personel: personel = 0 } = posData

  const isKotis = posId === 'KOTIS' || posId === 'KT'
  const isDPP = posId.includes('DPP')
  const isSebatik = namaPos?.toLowerCase().includes('sebatik')

  // Klasifikasi kepadatan
  const padatHint = penduduk < 200
    ? 'kepadatan sangat rendah — zona penyangga perbatasan dengan interaksi sosial yang minim'
    : penduduk < 1000
    ? 'kepadatan rendah dengan ikatan sosial yang erat (close-knit community) khas komunitas pedesaan perbatasan'
    : penduduk < 5000
    ? 'kepadatan sedang dengan struktur sosial yang sudah lebih terdiferensiasi dan hierarkis'
    : 'kepadatan tinggi dengan dinamika sosial yang kompleks dan beragam'

  // Mata pencaharian
  let ekonomiDesc = ''
  if (isKotis || isDPP) {
    ekonomiDesc = `Struktur ekonomi di sekitar ${namaPos} didominasi oleh sektor jasa dan perdagangan perbatasan. Keberadaan Pasar Nunukan sebagai titik perdagangan utama menarik mobilitas ekonomi dari seluruh wilayah perbatasan. Warga sekitar pos umumnya bekerja sebagai pedagang retail, pekerja sektor pemerintahan daerah, dan nelayan tangkap. Pendapatan rata-rata households di sektor ini berada di atas rata-rata regional, menjadikan kawasan sekitar pos sebagai economic center di wilayah perbatasan.`
  } else if (isSebatik) {
    ekonomiDesc = `Ekonomi Pulau Sebatik dicirikan oleh dual ekonomi: (1) sektor perkebunan kelapa sawit的大型企业 (estate) milik perusahaan besar yang menyerap banyak Tenaga Kerja Indonesia (TKI); dan (2) sektor perdagangan lintas batas unofficial yang menjadi sumber pendapatan signifikan bagi households. Hubungan kerja sama (kemitraan) antara perusahaan perkebunan dengan masyarakat sekitar merupakan titik sensitive yang memerlukan BINLA monitoring untuk mencegah potensi eksploitasi dan sengketa lahan.`
  } else {
    ekonomiDesc = `Mata pencaharian masyarakat di sektor ini didominasi oleh: (1) Pertanian subsisten/ladang — warga menanam padi, sayur-sayuran, dan buah-buahan untuk konsumsi sendiri dan penjualan minor; (2) Perlanian/sampling — kegiatan melaut dengan perahu kecil untuk konsumsi rumah tangga dan penjualan di pasar lokal; (3) Perdagangan lintas batas unofficial — transportasi barang konsumsi dari Malaysia yang dijual kembali di Indonesia; (4) Sektor jasa informal — ojek, warung makan, dan jasa perbaikan. Keseluruhan mata pencaharian ini memiliki karakteristik yang highly dependent pada proximity ke Malaysia dan kondisi alam sekitar.`
  }

  // Pendidikan dan kesehatan
  let sosialLayananDesc = ''
  if (penduduk > 2000) {
    sosialLayananDesc = `Tingkat pendidikan masyarakat di kawasan ini bervariasi: sebagian besar memiliki pendidikan SD-SMP, dengan Proporsi pendidikan SMA ke atas yang lebih rendah dibanding perkotaan. Akses terhadap pendidikan tinggi dan fasilitas kesehatan masih terbatas — warga yang membutuhkan layanan lanjutan harus menuju Nunukan atau Tarakan yang berjarak 2-4 jam perjalanan. Kondisi ini menciptakan dependency terhadap layanan publik di luar perbatasan dan berpotensi menimbulkan bottlenecks saat evakuasi medis diperlukan.`
  } else if (penduduk > 0) {
    sosialLayananDesc = `Akses terhadap fasilitas pendidikan dan kesehatan di wilayah ini sangat terbatas. Anak-anak usia sekolah umumnya menempuh pendidikan di Nunukan dengan sistem berasrama atau menetap di keluarga terdekat. Untuk kebutuhan kesehatan, warga sangat bergantung pada Pustu (Pusat Kesehatan Desa) yang kadangkala kekurangan obat esensial dan tenaga medis. Evakuasi medis menuju Nunukan atau Tarakan memerlukan waktu yang tidak singkat dan bergantung pada ketersediaan transportasi sungai.`
  }

  // Hubungan sosial lintas batas
  let lintasBatasDesc = ''
  if (isSebatik) {
    lintasBatasDesc = `Hubungan sosial antara warga Indonesia dan Malaysia di Pulau Sebatik memiliki karakter yang sangat khusus. Banyak keluarga yang memiliki sanak saudara di kedua sisi perbatasan (keluarga mixed-nationality), menciptakan interaksi sosial yang intens dan berlagsung daily. Dalam konteks keamanan, kondisi ini menciptakan double-edged situation: di satu sisi memperkuat social cohesion dan perdamaian perbatasan, namun di sisi lain menciptakan complexity dalam enforcement hukum karena batas aktivitas ilegal dan legal menjadi sangat tipis. Keberadaan Famili Link ini menjadikan BINLA dan BINTEK sebagai pendekatan yang lebih efektif dibandingkan hard security approach.`
  } else {
    lintasBatasDesc = `Hubungan antarwarga di sekitar GBN pada umumnya berjalan harmonis,didukung oleh ikatan etnis, agama, dan keluarga yang melintasi batas negara. Warga di kedua sisi perbatasan sering kali berasal dari same ethnic group dan share similar cultural practices. Namun, terdapat potensi friksi sosial terkait: (1) Kompetisi ekonomi — warga Malaysia yang memiliki modal dan akses lebih baik sometimes mendominasi sektor perdagangan tertentu; (2) Ketimpangan layanan publik — perbedaan kualitas infrastruktur antara sisi Indonesia dan Malaysia yang kadang menciptakan frustasi di kalangan warga Indonesia; (3) Perbedaan penegakan hukum — aktivitas yang dianggap ilegal di satu sisi mungkin tolerated di sisi lain.`
  }

  // Peran pos
  const posRoleDesc = isKotis
    ? `Keberadaan Kotis ${namaPos} memberikan efek stabilisator yang sangat signifikan terhadap keamanan dan ketertiban di seluruh wilayah perbatasan. Pos ini berfungsi sebagai nerve center bagi seluruh operasi Yonkav 8/NSW, dan personel yang berdinas di sini memiliki exposure langsung terhadap berbagai dinamika sosial perbatasan. Keterlibatan aktif Dandau dan Dansatgas dalam kegiatan BINLA/BINTEK menjadi critical success factor dalam menjaga stability sosial di wilayah tugas.`
    : `Keberadaan pos ${namaPos} dengan ${personel} personel TNI memberikan efek stabilisator terhadap keamanan dan ketertiban di sektornya. Personnel yang berdinas di pos ini umumnya memiliki hubungan yang erat dengan masyarakat sekitar karena interaksi daily yangdilakukan melalui kegiatan BINLA dan BINTEK. Pendekatan tersebut terbukti efektif dalam membangun trust dan cooperation antara TNI dan masyarakat, yang pada gilirannya meningkatkan kualitas early warning system terhadap ancaman di perbatasan.`

  // Rekomendasi
  const rekomendasiDesc = isKotis || isDPP
    ? `**Rekomendasi Intervensi:** Fokus BINLA pada penguatan governance lokal (kepala desa, BPD) dan economic empowerment melalui program padat karya. BINTEK difokuskan pada peningkatan kesadaran hukum dan civic responsibility masyarakat perbatasan.`
    : isSebatik
    ? `**Rekomendasi Intervensi:** Prioritaskan BINLA yang memanfaatkan family/social network yang sudah ada sebagai channel komunikasi dan BINTEK.Program yang melibatkan tokoh adat dan tokoh agama dari kedua sisi perbatasan terbukti efektif dalam mencegah eskalasi konflik.`
    : `**Rekomendasi Intervensi:** Sesuaikan pendekatan BINLA dengan karakter sosial masing-masing pos — di pos dengan ikatan sosial yang kuat, leverage tokoh masyarakat sebagai multiplier effect; di pos dengan mobilitas tinggi, prioritaskan pendekatan melalui tokoh agama dan kelompok pemuda.`

  const lines = [
    `**Analisis Kondisi Sosial**\nKondisi sosial masyarakat di wilayah perbatasan ini dicirikan oleh ${padatHint}. Karakteristik ini menciptakan pattern interaksi sosial yang unik dibandingkan wilayah pedalaman lainnya di Indonesia.`,
    `\n**Struktur Ekonomi:** ${ekonomiDesc}`,
    sosialLayananDesc ? `\n**Pendidikan & Kesehatan:** ${sosialLayananDesc}` : '',
    `\n**Dinamika Lintas Batas:** ${lintasBatasDesc}`,
    `\n**Peran Pos:** ${posRoleDesc}`,
    `\n${rekomendasiDesc}`,
  ]

  return lines.filter(Boolean).join('')
}

/* ── Tombol Edit通用 (styling konsisten) ─────────────────── */
function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[9px] px-2 py-0.5 rounded-sm transition-all duration-150 flex-shrink-0"
      style={{
        color: 'rgba(0,255,136,0.5)',
        border: '1px solid rgba(0,255,136,0.2)',
        background: 'rgba(0,255,136,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#00ff88'
        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)'
        e.currentTarget.style.background = 'rgba(0,255,136,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(0,255,136,0.5)'
        e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)'
        e.currentTarget.style.background = 'rgba(0,255,136,0.04)'
      }}
    >
      ✎ Edit
    </button>
  )
}

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ icon, label, color, glow, field, canEdit, isEditing, onEdit, onCancelEdit, children }) {
  return (
    <div className="hud-panel relative overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: '2px' }}>
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none rounded-sm"
        style={{ background: `radial-gradient(ellipse at top left, ${glow}, transparent)` }} />
      <div className="hud-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color }}>{icon}</span>
          <span className="hud-title">{label}</span>
        </div>
        {canEdit && !isEditing && <EditButton onClick={onEdit} />}
        {canEdit && isEditing && (
          <button
            onClick={onCancelEdit}
            className="text-[9px] px-2 py-0.5 rounded-sm transition-colors flex-shrink-0"
            style={{ color: 'rgba(200,214,229,0.3)', border: '1px solid rgba(200,214,229,0.1)' }}
          >
            ✕ Batal
          </button>
        )}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

/* ── Helper sub-components ─────────────────────────────────── */
function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-32"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</span>
      <span className={`text-[11px] font-medium text-[rgba(200,214,229,0.75)] ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </span>
    </div>
  )
}

function StatBox({ label, value, unit, color }) {
  return (
    <div className="px-3 py-2 rounded-sm text-center"
      style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="text-[8px] uppercase tracking-wider mb-0.5"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</p>
      <p className="font-mono font-bold text-base leading-none"
        style={{ color, textShadow: `0 0 10px ${color}55` }}>{value}</p>
      {unit && <p className="text-[8px] mt-0.5" style={{ color: 'rgba(200,214,229,0.3)' }}>{unit}</p>}
    </div>
  )
}

function EmptyHint({ text }) {
  return (
    <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">{text}</p>
  )
}

/* ── AspekEditForm ──────────────────────────────────────────── */
function AspekEditForm({ field, initial, placeholder, onSave, onCancel, saving }) {
  const [value, setValue] = useState(initial)
  return (
    <div className="space-y-2">
      <textarea
        className="hud-input w-full resize-none text-xs leading-relaxed"
        rows={6}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      <p className="text-[9px]" style={{ color: 'rgba(200,214,229,0.3)' }}>
        Kosongkan untuk menghapus narasi dan kembali ke tampilan otomatis.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="hud-btn hud-btn-danger flex-1 text-[10px]"
          disabled={saving}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => onSave(field, value)}
          className="hud-btn flex-1 text-[10px]"
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 border border-[#00ff88] border-t-transparent rounded-full animate-spin" />
              Menyimpan…
            </span>
          ) : 'Simpan'}
        </button>
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────────── */
export function GeoDemoKonsos({ demografi, pos, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const [editAspek, setEditAspek] = useState(null)
  const [saving,    setSaving]    = useState(false)

  if (loading) return <LoadingSpinner text="Memuat data..." />
  if (!demografi && !pos) return <EmptyState title="Data belum tersedia" />

  // Aggregate numerik (bisa null jika tidak ada data)
  const demografiSummary = {
    total_penduduk: demografi?.total_penduduk || 0,
    total_kk:       demografi?.total_kk       || 0,
    islam:          demografi?.islam          || 0,
    kristen:        demografi?.kristen        || 0,
    katolik:        demografi?.katolik        || 0,
    hindu:          demografi?.hindu          || 0,
    buddha:         demografi?.buddha         || 0,
    konghucu:       demografi?.konghucu       || 0,
    lainnya:        demografi?.lainnya         || 0,
    masjid:         demografi?.masjid          || 0,
    gereja:         demografi?.gereja          || 0,
    pura:           demografi?.pura            || 0,
    vihara:         demografi?.vihara          || 0,
  }

  const { total_penduduk: penduduk = 0, total_kk: kk = 0 } = demografiSummary
  const rataKK = kk > 0 ? (penduduk / kk).toFixed(1) : null
  const hasDemoData = penduduk > 0 || kk > 0

  let klasifikasiDemo = '—'
  if (penduduk > 0 && kk > 0) {
    if (penduduk < 500)       klasifikasiDemo = 'Wilayah Jarang Penduduk'
    else if (penduduk < 2000) klasifikasiDemo = 'Wilayah Penduduk Sedang'
    else                      klasifikasiDemo = 'Wilayah Padat Penduduk'
  }

  // Auto-generate narasi jika belum ada
  const autoGeografi = generateGeografiAuto(pos, demografiSummary)
  const autoDemografi = generateDemografiAuto(demografiSummary, pos)
  const autoKonsos = generateKonsosAuto(demografiSummary, pos)

  const handleSaveAspek = async (field, value) => {
    if (!posId) { showToast('posId tidak tersedia', 'error'); return }
    setSaving(true)
    try {
      await demografiService.upsert(posId, { [field]: value.trim() || null })
      showToast('Berhasil disimpan', 'success')
      setEditAspek(null)
      onRefresh && onRefresh()
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 fade-in">

      {/* ── 1. Kondisi Geografi ─────────────────────────── */}
      <Section
        icon="◬"
        label="Kondisi Geografi"
        color="rgba(0,255,136,0.25)"
        glow="rgba(0,255,136,0.15)"
        field="geografi"
        canEdit={!!posId}
        isEditing={editAspek === 'geografi'}
        onEdit={() => setEditAspek('geografi')}
        onCancelEdit={() => setEditAspek(null)}
      >
        {editAspek === 'geografi' ? (
          <AspekEditForm
            field="geografi"
            initial={demografi?.geografi || ''}
            placeholder="Deskripsikan kondisi geografi wilayah tugas pos ini: topografi, batas wilayah, aksesibilitas, dll."
            onSave={handleSaveAspek}
            onCancel={() => setEditAspek(null)}
            saving={saving}
          />
        ) : demografi?.geografi ? (
          <div>
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {demografi.geografi}
            </p>
            <div className="mt-3 pt-2 border-t border-[rgba(0,255,136,0.06)] space-y-1">
              {pos?.kabupaten   && <InfoRow label="Kabupaten"     value={pos.kabupaten} />}
              {pos?.kecamatan   && <InfoRow label="Kecamatan"     value={pos.kecamatan} />}
              {pos?.lokasi_desa && pos.lokasi_desa !== '—' && <InfoRow label="Desa / Lokasi" value={pos.lokasi_desa} />}
              {pos?.provinsi    && <InfoRow label="Provinsi"      value={pos.provinsi} />}
              {pos?.lat && pos?.lng && (
                <InfoRow label="Koordinat" value={`${pos.lat}°N, ${pos.lng}°E`} mono />
              )}
              {pos?.jumlah_patok && (
                <InfoRow label="Jumlah Patok" value={`${pos.jumlah_patok} patok`} />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {autoGeografi}
            </p>
            <div className="pt-2 border-t border-[rgba(0,255,136,0.06)] space-y-1">
              {pos?.kabupaten   && <InfoRow label="Kabupaten"     value={pos.kabupaten} />}
              {pos?.kecamatan   && <InfoRow label="Kecamatan"     value={pos.kecamatan} />}
              {pos?.lokasi_desa && pos.lokasi_desa !== '—' && <InfoRow label="Desa / Lokasi" value={pos.lokasi_desa} />}
              {pos?.provinsi    && <InfoRow label="Provinsi"      value={pos.provinsi} />}
              {pos?.lat && pos?.lng && (
                <InfoRow label="Koordinat" value={`${pos.lat}°N, ${pos.lng}°E`} mono />
              )}
              {pos?.jumlah_patok && (
                <InfoRow label="Jumlah Patok" value={`${pos.jumlah_patok} patok`} />
              )}
            </div>
          </div>
        )}
      </Section>

      {/* ── 2. Kondisi Demografi ────────────────────────── */}
      <Section
        icon="◈"
        label="Kondisi Demografi"
        color="rgba(68,136,255,0.25)"
        glow="rgba(68,136,255,0.15)"
        field="demografi_notes"
        canEdit={!!posId}
        isEditing={editAspek === 'demografi_notes'}
        onEdit={() => setEditAspek('demografi_notes')}
        onCancelEdit={() => setEditAspek(null)}
      >
        {editAspek === 'demografi_notes' ? (
          <AspekEditForm
            field="demografi_notes"
            initial={demografi?.demografi_notes || ''}
            placeholder="Deskripsikan kondisi demografi: komposisi penduduk, pola migrasi, pertumbuhan penduduk, karakteristik warga perbatasan, dll."
            onSave={handleSaveAspek}
            onCancel={() => setEditAspek(null)}
            saving={saving}
          />
        ) : demografi?.demografi_notes ? (
          <div>
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {demografi.demografi_notes}
            </p>
            {hasDemoData && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <StatBox label="Total Penduduk" value={penduduk.toLocaleString('id-ID')} unit="jiwa" color="#4488ff" />
                <StatBox label="Kepala Keluarga" value={kk.toLocaleString('id-ID')}      unit="KK"   color="#4488ff" />
              </div>
            )}
          </div>
        ) : hasDemoData ? (
          <div className="space-y-3">
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {autoDemografi}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Total Penduduk" value={penduduk.toLocaleString('id-ID')} unit="jiwa" color="#4488ff" />
              <StatBox label="Kepala Keluarga" value={kk.toLocaleString('id-ID')}      unit="KK"   color="#4488ff" />
            </div>
            <div className="space-y-1 pt-1 border-t border-[rgba(68,136,255,0.08)]">
              {rataKK && <InfoRow label="Rata-rata Jiwa/KK" value={`${rataKK} jiwa`} />}
              <InfoRow label="Klasifikasi" value={klasifikasiDemo} />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {autoDemografi}
            </p>
            <EmptyHint text="Data demografi belum tersedia. Isi melalui tab Demografi untuk memperbarui narasi ini." />
          </div>
        )}
      </Section>

      {/* ── 3. Kondisi Sosial (Konsos) ─────────────────── */}
      <Section
        icon="◉"
        label="Kondisi Sosial (Konsos)"
        color="rgba(187,136,255,0.25)"
        glow="rgba(187,136,255,0.15)"
        field="konsos_notes"
        canEdit={!!posId}
        isEditing={editAspek === 'konsos_notes'}
        onEdit={() => setEditAspek('konsos_notes')}
        onCancelEdit={() => setEditAspek(null)}
      >
        {editAspek === 'konsos_notes' ? (
          <AspekEditForm
            field="konsos_notes"
            initial={demografi?.konsos_notes || ''}
            placeholder="Deskripsikan kondisi sosial: adat istiadat, agama dominan, mata pencaharian, tingkat pendidikan, isu sosial, hubungan lintas batas, dll."
            onSave={handleSaveAspek}
            onCancel={() => setEditAspek(null)}
            saving={saving}
          />
        ) : demografi?.konsos_notes ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.konsos_notes}
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
              {autoKonsos}
            </p>
          </div>
        )}
      </Section>

    </div>
  )
}
