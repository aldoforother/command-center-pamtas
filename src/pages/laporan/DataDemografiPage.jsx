import { usePos, useAllDemografi } from '../../hooks/useSupabase'
import { LoadingSpinner, EmptyState } from '../../components/ui'

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

// Helper: ambil nilai numerik dari berbagai kemungkinan nama field
function getNum(obj, ...keys) {
  for (const k of keys) {
    const v = Number(obj[k])
    if (!isNaN(v) && v !== 0) return v
  }
  return 0
}

export default function DataDemografiPage() {
  const { data: posList,    loading: loadingPos  } = usePos()
  const { data: demografiList, loading: loadingDemo } = useAllDemografi()

  const loading = loadingPos || loadingDemo

  // Buat lookup pos untuk nama/lokasi/personel
  const posMap = (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p
    return acc
  }, {})

  // Gabungkan: satu entry per pos_id (jumlahkan jika multi-baris)
  const demoByPos = (demografiList || []).reduce((acc, d) => {
    const id = d.pos_id
    if (!id) return acc
    if (!acc[id]) {
      acc[id] = {
        pos_id:         id,
        total_penduduk: 0,
        total_kk:       0,
        islam:    0, kristen: 0, katolik: 0, hindu: 0,
        buddha:   0, konghucu: 0, lainnya: 0,
        masjid:   0, gereja:  0, pura:    0, vihara: 0,
      }
    }
    acc[id].total_penduduk += getNum(d, 'total_penduduk', 'jumlah_penduduk', 'penduduk')
    acc[id].total_kk       += getNum(d, 'total_kk', 'jumlah_kk', 'kk')
    acc[id].islam    += getNum(d, 'islam')
    acc[id].kristen  += getNum(d, 'kristen')
    acc[id].katolik  += getNum(d, 'katolik')
    acc[id].hindu    += getNum(d, 'hindu')
    acc[id].buddha   += getNum(d, 'buddha')
    acc[id].konghucu += getNum(d, 'konghucu')
    acc[id].lainnya  += getNum(d, 'lainnya')
    acc[id].masjid   += getNum(d, 'masjid', 'masjid_mushola')
    acc[id].gereja   += getNum(d, 'gereja')
    acc[id].pura     += getNum(d, 'pura')
    acc[id].vihara   += getNum(d, 'vihara')
    return acc
  }, {})

  // Pastikan semua 17 pos muncul (meski belum ada data demografi)
  const allPosIds = (posList || []).map(p => p.pos_id)
  allPosIds.forEach(id => {
    if (!demoByPos[id]) {
      demoByPos[id] = {
        pos_id: id, total_penduduk: 0, total_kk: 0,
        islam: 0, kristen: 0, katolik: 0, hindu: 0,
        buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 0, gereja: 0, pura: 0, vihara: 0,
      }
    }
  })

  const all = Object.values(demoByPos)

  const totalPenduduk = all.reduce((s, d) => s + d.total_penduduk, 0)
  const totalKK       = all.reduce((s, d) => s + d.total_kk, 0)

  // Kelompokkan: Malaysia (pos GSL) vs Indonesia (semua lainnya)
  const getWilayah = (pos) => {
    if (!pos) return 'WILAYAH INDONESIA'
    return pos.kabupaten === 'Malaysia' ? 'WILAYAH MALAYSIA' : 'WILAYAH INDONESIA'
  }

  const byKabupaten = all.reduce((acc, d) => {
    const pos = posMap[d.pos_id]
    const kab = getWilayah(pos)
    if (!acc[kab]) acc[kab] = { pos: 0, penduduk: 0, kk: 0 }
    acc[kab].pos++
    acc[kab].penduduk += d.total_penduduk
    acc[kab].kk       += d.total_kk
    return acc
  }, {})

  const sortedPos = [...all].sort((a, b) => b.total_penduduk - a.total_penduduk)
  const maxPenduduk = sortedPos[0]?.total_penduduk || 1

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--surface-base)' }}>
        <LoadingSpinner text="Memuat data demografi..." />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in" style={{ background: 'var(--surface-base)' }}>
      {/* Header */}
      <div className="mb-4 animate-fade-in">
        <h2 className="font-bold text-sm tracking-widest uppercase" style={{ color: 'var(--color-info)' }}>
          ◈ DATA DEMOGRAFI
        </h2>
        <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: 'var(--text-tertiary)' }}>
          Data kependudukan wilayah tugas satgas pamtas
        </p>
      </div>

      <div className="space-y-4">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Total Penduduk"
            value={totalPenduduk.toLocaleString('id-ID')}
            color="var(--color-info)"
            icon="◉"
            delay={getStaggerDelay(0)}
          />
          <StatCard
            label="Kepala Keluarga"
            value={totalKK.toLocaleString('id-ID')}
            color="var(--color-warning)"
            icon="◈"
            delay={getStaggerDelay(1)}
          />
          <StatCard
            label="Pos Aktif"
            value={allPosIds.length}
            color="var(--accent-primary)"
            icon="◫"
            delay={getStaggerDelay(2)}
          />
        </div>

        {/* Per kabupaten */}
        {Object.keys(byKabupaten).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(byKabupaten).map(([kab, data], i) => (
              <KabupatenCard
                key={kab}
                kab={kab}
                data={data}
                delay={getStaggerDelay(i + 3)}
              />
            ))}
          </div>
        )}

        {/* Distribusi penduduk per pos */}
        <Panel title="DISTRIBUSI PENDUDUK PER POS" delay={getStaggerDelay(5)}>
          <div className="space-y-2">
            {sortedPos.map((d, i) => {
              const jml = d.total_penduduk
              const pct = maxPenduduk > 0 ? Math.round((jml / maxPenduduk) * 100) : 0
              return (
                <div key={d.pos_id} className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold w-14 flex-shrink-0"
                    style={{ color: 'var(--accent-primary)' }}>
                    {d.pos_id}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--surface-muted)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: 'var(--color-info)',
                        boxShadow: '0 0 4px rgba(59,139,255,0.5)'
                      }} />
                  </div>
                  <span className="font-mono text-[9px] w-16 text-right flex-shrink-0"
                    style={{ color: 'var(--text-secondary)' }}>
                    {jml.toLocaleString('id-ID')}
                  </span>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Tabel lengkap */}
        <Panel title="DATA LENGKAP PER POS" delay={getStaggerDelay(6)}>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-left" style={{ color: 'var(--accent-primary)' }}>
                    POS
                  </th>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-left" style={{ color: 'var(--accent-primary)' }}>
                    NAMA POS
                  </th>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-left" style={{ color: 'var(--accent-primary)' }}>
                    KABUPATEN
                  </th>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-left" style={{ color: 'var(--accent-primary)' }}>
                    DESA/LOKASI
                  </th>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-center" style={{ color: 'var(--accent-primary)' }}>
                    PENDUDUK
                  </th>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-center" style={{ color: 'var(--accent-primary)' }}>
                    KK
                  </th>
                  <th scope="col" className="py-1.5 px-2 font-bold tracking-widest uppercase text-center" style={{ color: 'var(--accent-primary)' }}>
                    PERSONEL
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPos.map((d, i) => {
                  const pos = posMap[d.pos_id]
                  return (
                    <tr key={d.pos_id}
                      className="transition-colors animate-fade-in"
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        animationDelay: `${getStaggerDelay(i + 7)}ms`
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td scope="row" className="py-1.5 px-2 font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                        {d.pos_id}
                      </td>
                      <td className="py-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>
                        {pos?.nama_pos || '—'}
                      </td>
                      <td className="py-1.5 px-2" style={{ color: 'var(--text-tertiary)' }}>
                        {pos?.kabupaten || '—'}
                      </td>
                      <td className="py-1.5 px-2 max-w-[140px] truncate" style={{ color: 'var(--text-disabled)' }}>
                        {pos?.lokasi_desa || '—'}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-center" style={{ color: 'var(--color-info)' }}>
                        {d.total_penduduk.toLocaleString('id-ID')}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-center" style={{ color: 'var(--color-warning)' }}>
                        {d.total_kk.toLocaleString('id-ID')}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-center" style={{ color: 'var(--accent-primary)' }}>
                        {Number(pos?.jumlah_personel) || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

      </div>
    </div>
  )
}

/* ── Components ──────────────────────────────────────────────── */

function StatCard({ label, value, color, icon, delay = 0 }) {
  return (
    <div
      className="px-3 py-2.5 rounded-sm animate-scale-in"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px]" style={{ color }}>{icon}</span>
        <span className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
      </div>
      <div className="font-mono font-bold text-xl leading-none"
        style={{ color, textShadow: `0 0 14px ${color}55` }}>
        {value}
      </div>
    </div>
  )
}

function KabupatenCard({ kab, data, delay = 0 }) {
  const isMalaysia = kab.includes('MALAYSIA')
  const accentColor = isMalaysia ? 'var(--color-info)' : 'var(--accent-primary)'

  return (
    <div
      className="rounded-sm overflow-hidden animate-scale-in"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="px-3 py-1.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-secondary)' }}>
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
          {kab}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        <MiniStat
          label="Pos"
          value={data.pos}
          color={accentColor}
        />
        <MiniStat
          label="Penduduk"
          value={data.penduduk.toLocaleString('id-ID')}
          color="var(--color-info)"
        />
        <MiniStat
          label="KK"
          value={data.kk.toLocaleString('id-ID')}
          color="var(--color-warning)"
        />
      </div>
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div className="text-center p-2 rounded-sm"
      style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
      <p className="font-mono font-bold text-sm" style={{ color }}>{value}</p>
      <p className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
    </div>
  )
}

function Panel({ title, children, delay = 0 }) {
  return (
    <div
      className="rounded-sm overflow-hidden animate-scale-in"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="px-3 py-1.5"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-secondary)' }}>
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-primary)' }}>
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
