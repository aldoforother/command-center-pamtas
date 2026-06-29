import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllKerawanan } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/formatDate'
import { KERAWANAN_CATEGORIES, getKategoriPoin } from '../../constants/kerawananCategories'
import { LoadingSpinner, EmptyState } from '../../components/ui'

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

// Mapping alias nama lama → nama kategori baru (konsisten dengan PamtasMap)
const KATEGORI_ALIAS = {
  'Human Trafficking': 'Trafficking',
  'Illegal Logging':   'Logging',
  'Ilegal Logging':    'Logging',
  'Penyelundupan':     'Trading',
  'Imigran Gelap':     'PMI NP',
  'Penjarahan Laut':   'Kriminal',
  'Ketergantungan':    'Trading',
  'Isolasi Wilayah':   'Trading',
}

function resolveKategori(k) {
  return KATEGORI_ALIAS[k] || k || 'Lainnya'
}

const KATEGORI_COLOR = KERAWANAN_CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c.color
  return acc
}, { 'Lainnya': 'var(--text-tertiary)' })

// Mode ranking DAFTAR POS
const RANK_OPTIONS = [
  { value: 'skor',   label: 'Skor Ancaman' },
  { value: 'jumlah', label: 'Jumlah Insiden' },
]

// Skor legend items
const SKOR_LEGEND = [
  { label: 'Narkoba',     poin: 6, color: 'var(--color-danger)' },
  { label: 'Trafficking', poin: 5, color: 'var(--color-purple)' },
  { label: 'PMI NP',      poin: 4, color: 'var(--color-orange)' },
  { label: 'Trading',     poin: 3, color: 'var(--color-warning)' },
  { label: 'Kriminal',    poin: 2, color: 'var(--color-danger)' },
  { label: 'Logging',     poin: 2, color: 'var(--color-warning)' },
  { label: 'Border',      poin: 1, color: 'var(--color-info)' },
]

export default function GrafikKerawananPage() {
  const navigate = useNavigate()
  const { data: kerawanan, loading } = useAllKerawanan()
  const [rankMode, setRankMode] = useState('skor')

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--surface-base)' }}>
        <LoadingSpinner text="Memuat data grafik kerawanan..." />
      </div>
    )
  }

  const all       = kerawanan || []
  const aktif     = all.filter(k => k.status?.toLowerCase() === 'aktif')
  const selesai   = all.filter(k => k.status?.toLowerCase() === 'selesai')

  // Hitung per kategori (resolve alias nama lama → baru)
  const byKategori = all.reduce((acc, k) => {
    const key = resolveKategori(k.kategori)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Hitung per pos — dua metrik: jumlah insiden + skor ancaman
  const byPos = all.reduce((acc, k) => {
    const pid = k.pos_id
    if (!acc[pid]) acc[pid] = { count: 0, skor: 0 }
    acc[pid].count += 1
    // Skor hanya dari insiden aktif
    if (k.status?.toLowerCase() === 'aktif') {
      acc[pid].skor += getKategoriPoin(resolveKategori(k.kategori))
    }
    return acc
  }, {})

  // Sort berdasarkan mode yang dipilih
  const sortedByPos = Object.entries(byPos)
    .sort((a, b) => {
      if (rankMode === 'skor')   return b[1].skor  - a[1].skor
      return b[1].count - a[1].count
    })
    .slice(0, 10)

  const maxVal = sortedByPos[0]
    ? (rankMode === 'skor' ? sortedByPos[0][1].skor : sortedByPos[0][1].count)
    : 1

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in" style={{ background: 'var(--surface-base)' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-widest uppercase" style={{ color: 'var(--color-warning)' }}>
          ◈ GRAFIK INSIDEN
        </h2>
        <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: 'var(--text-tertiary)' }}>
          Analisis distribusi insiden kerawanan semua pos satgas
        </p>
      </div>

      <div className="space-y-4">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Total Insiden"
            value={all.length}
            color="var(--color-warning)"
            icon="◆"
            delay={getStaggerDelay(0)}
          />
          <StatCard
            label="Aktif"
            value={aktif.length}
            color="var(--color-danger)"
            icon="⚠"
            danger={aktif.length > 0}
            delay={getStaggerDelay(1)}
          />
          <StatCard
            label="Ditangani"
            value={selesai.length}
            color="var(--accent-primary)"
            icon="✓"
            delay={getStaggerDelay(2)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Insiden Per Kategori */}
          <Panel title="INSIDEN PER KATEGORI" delay={getStaggerDelay(3)}>
            <div className="space-y-3">
              {Object.entries(byKategori).sort((a,b) => b[1]-a[1]).map(([kat, count]) => {
                const color = KATEGORI_COLOR[kat] || 'var(--text-tertiary)'
                const pct   = Math.round((count / all.length) * 100) || 0
                return (
                  <div key={kat} className="animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] uppercase tracking-wide"
                        style={{ color: 'var(--text-secondary)' }}>{kat}</span>
                      <span className="font-mono text-[10px] font-bold" style={{ color }}>
                        {count} <span className="opacity-50 text-[8px]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--surface-muted)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}66` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* Daftar Pos dengan Kerawanan Tinggi */}
          <Panel
            title="DAFTAR POS DENGAN KERAWANAN TINGGI"
            delay={getStaggerDelay(4)}
            action={
              <select
                className="hud-select text-[8px] py-0.5 px-1.5 h-6"
                value={rankMode}
                onChange={e => setRankMode(e.target.value)}
              >
                {RANK_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            }
          >
            <div className="space-y-2">
              {sortedByPos.length === 0 ? (
                <p className="text-[9px] text-center py-4" style={{ color: 'var(--text-tertiary)' }}>
                  Tidak ada data
                </p>
              ) : sortedByPos.map(([posId, stats], i) => {
                const val = rankMode === 'skor' ? stats.skor : stats.count
                const pct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
                const isHigh = rankMode === 'skor' ? stats.skor >= 10 : stats.count > 3
                const isMid  = rankMode === 'skor' ? stats.skor >= 5  : stats.count > 1
                const barColor = isHigh ? 'var(--color-danger)' : isMid ? 'var(--color-warning)' : 'var(--accent-primary)'
                return (
                  <div key={posId} className="flex items-center gap-2 animate-fade-in"
                    style={{ animationDelay: `${getStaggerDelay(i + 5)}ms` }}>
                    <span className="font-mono text-[8px] w-4 text-right flex-shrink-0"
                      style={{ color: 'var(--text-tertiary)' }}>{i+1}</span>
                    <span className="font-mono text-[9px] font-bold w-14 flex-shrink-0"
                      style={{ color: 'var(--accent-primary)' }}>
                      {posId.replace('POS-', 'POS ')}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--surface-muted)' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: barColor }} />
                    </div>
                    <span className="font-mono text-[9px] font-bold flex-shrink-0 w-8 text-right"
                      style={{ color: barColor }}>
                      {val}
                      {rankMode === 'skor' && (
                        <span className="text-[7px] opacity-50 ml-0.5">pt</span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
            {/* Visual score legend */}
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {rankMode === 'skor' ? (
                <div>
                  <p className="text-[8px] uppercase tracking-[0.15em] mb-2"
                    style={{ color: 'var(--text-tertiary)' }}>
                    Bobot Poin per Kategori
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SKOR_LEGEND.map(({ label, poin, color }) => (
                      <div key={label} className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm"
                        style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                        <span className="text-[8px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {label}
                        </span>
                        <span className="font-mono text-[9px] font-bold ml-0.5" style={{ color }}>
                          {poin}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[8px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  Jumlah = total insiden (aktif + selesai)
                </p>
              )}
            </div>
          </Panel>
        </div>

        {/* Tabel detail */}
        <Panel title="RIWAYAT INSIDEN AKTIF" delay={getStaggerDelay(6)}>
          {aktif.length === 0 ? (
            <EmptyState
              icon="◉"
              title="Tidak ada insiden aktif"
              description="Semua insiden sudah ditangani."
            />
          ) : (
            <div>
              {/* ARIA live region for filter results */}
              <p className="sr-only" aria-live="polite" role="status">
                {aktif.length} insiden aktif ditemukan
              </p>
              <div className="overflow-x-auto">
                <p className="text-[8px] mb-2 italic" style={{ color: 'var(--text-tertiary)' }}>
                  Klik baris untuk membuka detail insiden
                </p>
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th scope="col" className="text-left py-1.5 px-2 font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
                      POS
                    </th>
                    <th scope="col" className="text-left py-1.5 px-2 font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
                      KATEGORI
                    </th>
                    <th scope="col" className="text-left py-1.5 px-2 font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
                      TANGGAL
                    </th>
                    <th scope="col" className="text-left py-1.5 px-2 font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
                      DESKRIPSI
                    </th>
                    <th scope="col" className="text-left py-1.5 px-2 font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aktif.map((k, i) => (
                    <tr key={k.id || i}
                      className="transition-colors cursor-pointer animate-fade-in"
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        animationDelay: `${getStaggerDelay(i + 7)}ms`
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => navigate(`/insiden`, { state: { highlightId: k.id } })}
                    >
                      <td scope="row" className="py-1.5 px-2 font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                        {k.pos_id}
                      </td>
                      <td className="py-1.5 px-2">
                        {(() => {
                          const resolvedKat = resolveKategori(k.kategori)
                          const color = KATEGORI_COLOR[resolvedKat] || 'var(--text-tertiary)'
                          return (
                            <span className="px-1.5 py-0.5 rounded-sm font-bold text-[8px]"
                              style={{ background: 'var(--surface-secondary)', color, border: '1px solid var(--border-subtle)' }}>
                              {resolvedKat}
                            </span>
                          )
                        })()}
                      </td>
                      <td className="py-1.5 px-2" style={{ color: 'var(--text-tertiary)' }}>
                        {k.tanggal ? formatDate(k.tanggal) : '—'}
                      </td>
                      <td className="py-1.5 px-2 max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        {k.deskripsi || '—'}
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="px-1.5 py-0.5 rounded-sm font-bold text-[8px]"
                          style={{ color: 'var(--color-danger)', background: 'var(--color-danger-subtle)', border: '1px solid var(--color-danger-subtle)' }}>
                          AKTIF
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

/* ── Components ──────────────────────────────────────────────── */

function StatCard({ label, value, color, icon, danger, delay = 0 }) {
  return (
    <div
      className="px-3 py-2.5 rounded-sm animate-scale-in"
      style={{
        background: 'var(--surface-primary)',
        border: danger ? '1px solid var(--color-danger-subtle)' : '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px]" style={{ color }}>{icon}</span>
        <span className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
      </div>
      <div className="font-mono font-bold text-2xl leading-none"
        style={{ color, textShadow: `0 0 14px ${color}55` }}>
        {value}
      </div>
    </div>
  )
}

function Panel({ title, children, action, delay = 0 }) {
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
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-primary)' }}>
          {title}
        </span>
        {action && <div>{action}</div>}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
