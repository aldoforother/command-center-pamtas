import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllKerawanan } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/formatDate'
import { KERAWANAN_CATEGORIES, getKategoriPoin } from '../../constants/kerawananCategories'
import { LoadingSpinner, EmptyState } from '../../components/ui'
import { POS_LIST } from '../../constants/posList'

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

// CSS Keyframes for animations
const ANIMATION_STYLES = `
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
`

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
  const [visibleItems, setVisibleItems] = useState(new Set())
  const contentRef = useRef(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.animateId
            if (id) setVisibleItems(prev => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const elements = contentRef.current?.querySelectorAll('[data-animate-id]')
    elements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [loading])

  // Inject animation styles
  useEffect(() => {
    if (document.getElementById('kerawanan-animations')) return
    const style = document.createElement('style')
    style.id = 'kerawanan-animations'
    style.textContent = ANIMATION_STYLES
    document.head.appendChild(style)
  }, [])

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

  // Build array of ALL POS with their kerawanan data (including 0 for POS without data)
  const allPosWithData = POS_LIST.map(pos => ({
    posId: pos.pos_id,
    namaPos: pos.nama_pos,
    ...(byPos[pos.pos_id] || { count: 0, skor: 0 }),
  }))

  // Sort berdasarkan mode yang dipilih
  const sortedByPos = allPosWithData
    .sort((a, b) => {
      if (rankMode === 'skor')   return b.skor  - a.skor
      return b.count - a.count
    })
    .slice(0, 17) // Show all 17 POS

  const maxVal = sortedByPos[0]
    ? (rankMode === 'skor' ? sortedByPos[0].skor : sortedByPos[0].count)
    : 1

  return (
    <div ref={contentRef} className="h-full overflow-y-auto p-4" style={{ background: 'linear-gradient(180deg, var(--surface-base) 0%, rgba(0,20,10,0.95) 100%)' }}>
      {/* Header with glow effect */}
      <div className="mb-6 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full"
          style={{ background: 'linear-gradient(180deg, var(--color-warning), transparent)', boxShadow: '0 0 20px var(--color-warning)' }} />
        <h2 className="font-bold text-base tracking-widest uppercase pl-4"
          style={{ color: 'var(--color-warning)', textShadow: '0 0 30px var(--color-warning)50' }}>
          ◈ ANALISIS KERAWANAN
        </h2>
        <p className="text-[11px] tracking-wider mt-1 pl-4" style={{ color: 'var(--text-tertiary)' }}>
          Distribusi insiden dan tingkat kerawanan wilayah tugas
        </p>
      </div>

      <div className="space-y-5">
        {/* Summary cards - Enhanced with glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Insiden"
            value={all.length}
            color="var(--color-warning)"
            icon={<IconAlert />}
            delay={0}
          />
          <StatCard
            label="Insiden Aktif"
            value={aktif.length}
            color="var(--color-danger)"
            icon={<IconWarning />}
            danger={aktif.length > 0}
            delay={100}
          />
          <StatCard
            label="Sudah Ditangani"
            value={selesai.length}
            color="var(--accent-primary)"
            icon={<IconCheck />}
            delay={200}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Insiden Per Kategori - Card dengan gradient border */}
          <div data-animate-id="kategori-panel"
            className={`rounded-lg overflow-hidden transition-all duration-700 ${visibleItems.has('kategori-panel') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,149,0,0.05) 0%, rgba(20,25,30,0.95) 100%)',
              border: '1px solid rgba(255,149,0,0.2)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,149,0,0.1)',
            }}>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ background: 'rgba(255,149,0,0.08)', borderBottom: '1px solid rgba(255,149,0,0.15)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-warning)', boxShadow: '0 0 10px var(--color-warning)' }} />
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--color-warning)' }}>
                  Distribusi Per Kategori
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(byKategori).sort((a,b) => b[1]-a[1]).map(([kat, count], i) => {
                const color = KATEGORI_COLOR[kat] || 'var(--text-tertiary)'
                const pct   = Math.round((count / all.length) * 100) || 0
                return (
                  <div key={kat}
                    data-animate-id={`kat-${kat}`}
                    className={`transition-all duration-500 ${visibleItems.has(`kat-${kat}`) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                        <span className="text-[10px] uppercase tracking-wide font-medium"
                          style={{ color: 'var(--text-primary)' }}>{kat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold" style={{ color }}>
                          {count}
                        </span>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full"
                          style={{ background: `${color}20`, color: 'var(--text-tertiary)' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: visibleItems.has(`kat-${kat}`) ? `${pct}%` : '0%',
                          background: `linear-gradient(90deg, ${color}, ${color}88)`,
                          boxShadow: `0 0 15px ${color}60`,
                        }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Daftar Pos dengan Kerawanan Tinggi */}
          <div data-animate-id="pos-panel"
            className={`rounded-lg overflow-hidden transition-all duration-700 ${visibleItems.has('pos-panel') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,80,80,0.05) 0%, rgba(20,25,30,0.95) 100%)',
              border: '1px solid rgba(255,80,80,0.2)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,80,80,0.1)',
            }}>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ background: 'rgba(255,80,80,0.08)', borderBottom: '1px solid rgba(255,80,80,0.15)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-danger)', boxShadow: '0 0 10px var(--color-danger)' }} />
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--color-danger)' }}>
                  Pos Berbahaya
                </span>
              </div>
              <select
                className="text-[9px] px-3 py-1.5 rounded-md cursor-pointer transition-all"
                value={rankMode}
                onChange={e => setRankMode(e.target.value)}
                style={{
                  background: 'rgba(255,80,80,0.1)',
                  border: '1px solid rgba(255,80,80,0.3)',
                  color: 'var(--color-danger)',
                  outline: 'none',
                }}
              >
                {RANK_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="p-4 space-y-3">
              {sortedByPos.length === 0 ? (
                <p className="text-[10px] text-center py-6" style={{ color: 'var(--text-tertiary)' }}>
                  Tidak ada data kerawanan
                </p>
              ) : sortedByPos.map((pos, i) => {
                const val = rankMode === 'skor' ? pos.skor : pos.count
                const pct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
                const isHigh = rankMode === 'skor' ? pos.skor >= 10 : pos.count > 3
                const isMid  = rankMode === 'skor' ? pos.skor >= 5  : pos.count > 1
                const barColor = isHigh ? 'var(--color-danger)' : isMid ? 'var(--color-warning)' : 'var(--accent-primary)'
                const hasData = pos.count > 0

                return (
                  <div key={pos.posId}
                    className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                    style={{
                      background: visibleItems.has(`pos-${pos.posId}`) ? 'rgba(255,255,255,0.02)' : 'transparent',
                      opacity: hasData ? 1 : 0.5,
                    }}
                    data-animate-id={`pos-${pos.posId}`}
                    onClick={() => navigate(`/pos/${pos.posId}`)}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${barColor}10`
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}>
                    <span className="w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
                      style={{
                        background: i < 3 && hasData ? `${barColor}20` : 'rgba(255,255,255,0.05)',
                        color: i < 3 && hasData ? barColor : 'var(--text-tertiary)',
                        border: `1px solid ${i < 3 && hasData ? barColor : 'transparent'}40`,
                      }}>
                      {i + 1}
                    </span>
                    <span className="font-mono text-[10px] font-bold w-14 flex-shrink-0"
                      style={{ color: 'var(--accent-primary)' }}>
                      {pos.posId.replace('POS-', 'POS ')}
                    </span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden relative"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{
                          width: visibleItems.has(`pos-${pos.posId}`) ? `${Math.max(pct, hasData ? 8 : 0)}%` : '0%',
                          background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                          boxShadow: `0 0 15px ${barColor}60`,
                        }}>
                        <div className="absolute right-0 top-0 bottom-0 w-1"
                          style={{ background: '#fff', opacity: 0.5, boxShadow: '0 0 10px #fff' }} />
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold w-10 text-right flex-shrink-0"
                      style={{ color: barColor }}>
                      {val}{rankMode === 'skor' && <span className="text-[8px] ml-0.5 opacity-60">pt</span>}
                    </span>
                  </div>
                )
              })}
            </div>
            {/* Legend */}
            <div className="px-4 pb-4">
              <div className="p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[8px] uppercase tracking-[0.15em] mb-2"
                  style={{ color: 'var(--text-tertiary)' }}>
                  Bobot Poin Kategori
                </p>
                <div className="flex flex-wrap gap-2">
                  {SKOR_LEGEND.map(({ label, poin, color }) => (
                    <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                      style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                      <span className="text-[8px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {label}
                      </span>
                      <span className="font-mono text-[9px] font-bold" style={{ color }}>
                        {poin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel detail - Enhanced with hover effects */}
        <div data-animate-id="table-panel"
          className={`rounded-lg overflow-hidden transition-all duration-700 ${visibleItems.has('table-panel') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.03) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(0,255,136,0.15)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: 'rgba(0,255,136,0.06)', borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ color: 'var(--color-danger)', background: 'var(--color-danger)' }} />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-primary)' }}>
                Insiden Aktif - Riwayat Detail
              </span>
            </div>
            <span className="text-[9px] px-2 py-1 rounded-full font-mono"
              style={{ background: aktif.length > 0 ? 'var(--color-danger-subtle)' : 'var(--accent-muted)', color: aktif.length > 0 ? 'var(--color-danger)' : 'var(--accent-primary)' }}>
              {aktif.length} kasus
            </span>
          </div>
          <div className="p-4">
            {aktif.length === 0 ? (
              <EmptyState
                icon="◉"
                title="Tidak ada insiden aktif"
                description="Semua insiden sudah ditangani dengan baik."
              />
            ) : (
              <div className="space-y-2">
                {aktif.map((k, i) => {
                  const resolvedKat = resolveKategori(k.kategori)
                  const color = KATEGORI_COLOR[resolvedKat] || 'var(--text-tertiary)'
                  return (
                    <div key={k.id || i}
                      data-animate-id={`insiden-${k.id}`}
                      className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid transparent',
                        transitionDelay: `${i * 50}ms`,
                      }}
                      onClick={() => navigate(`/insiden`, { state: { highlightId: k.id } })}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,80,80,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)'
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.transform = 'translateX(0)'
                      }}>
                      <span className="w-16 font-mono text-[10px] font-bold flex-shrink-0"
                        style={{ color: 'var(--accent-primary)' }}>
                        {k.pos_id}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[9px] font-bold flex-shrink-0"
                        style={{
                          background: `${color}20`,
                          color: color,
                          border: `1px solid ${color}40`,
                          boxShadow: `0 0 10px ${color}30`,
                        }}>
                        {resolvedKat}
                      </span>
                      <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                        {k.tanggal ? formatDate(k.tanggal) : '—'}
                      </span>
                      <span className="flex-1 text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        {k.deskripsi || 'Tanpa deskripsi'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-bold flex-shrink-0 animate-pulse"
                        style={{ background: 'var(--color-danger-subtle)', color: 'var(--color-danger)' }}>
                        AKTIF
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Components ──────────────────────────────────────────────── */

function StatCard({ label, value, color, icon, danger, delay = 0 }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-4 transition-all duration-300 animate-slide-up"
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, rgba(20,25,30,0.95) 100%)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 30px ${color}15, inset 0 1px 0 ${color}20`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {/* Glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
        style={{ background: color, filter: 'blur(40px)' }} />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
      </div>
      <div className="font-mono font-bold text-3xl leading-none"
        style={{ color, textShadow: `0 0 30px ${color}50` }}>
        {value}
      </div>
      {danger && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      )}
    </div>
  )
}

// Icon components
function IconAlert() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function IconWarning() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
