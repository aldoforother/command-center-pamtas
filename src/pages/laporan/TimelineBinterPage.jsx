import { useAllBinter } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/formatDate'
import { BINTER_COLOR_MAP } from '../../constants/kerawananCategories'
import { LoadingSpinner, EmptyState } from '../../components/ui'

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

export default function TimelineBinterPage() {
  const { data: binter, loading } = useAllBinter()

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--surface-base)' }}>
        <LoadingSpinner text="Memuat timeline binter..." />
      </div>
    )
  }

  // Gunakan perbandingan string ISO (YYYY-MM-DD) — aman dari ambiguitas timezone
  const all = (binter || []).sort((a, b) => {
    const ta = a.tanggal || ''
    const tb = b.tanggal || ''
    return tb.localeCompare(ta)
  })

  // Hitung per jenis
  const byJenis = all.reduce((acc, b) => {
    const key = b.jenis_kegiatan || 'Lainnya'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Hitung per pos
  const byPos = all.reduce((acc, b) => {
    acc[b.pos_id] = (acc[b.pos_id] || 0) + 1
    return acc
  }, {})

  const sortedByPos = Object.entries(byPos).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxByPos    = sortedByPos[0]?.[1] || 1

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in" style={{ background: 'var(--surface-base)' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-widest uppercase" style={{ color: 'var(--color-info)' }}>
          ◈ TIMELINE BINTER
        </h2>
        <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: 'var(--text-tertiary)' }}>
          Riwayat kegiatan bina teritorial semua pos satgas
        </p>
      </div>

      <div className="space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            label="Total Kegiatan"
            value={all.length}
            color="var(--color-info)"
            icon="◈"
            delay={getStaggerDelay(0)}
          />
          <StatCard
            label="Jenis Kegiatan"
            value={Object.keys(byJenis).length}
            color="var(--color-purple)"
            icon="◆"
            delay={getStaggerDelay(1)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Distribusi per jenis */}
          <Panel title="PERSENTASE PER KEGIATAN" delay={getStaggerDelay(2)}>
            <div className="space-y-3">
              {Object.entries(byJenis).sort((a,b) => b[1]-a[1]).map(([jenis, count]) => {
                const color = BINTER_COLOR_MAP[jenis] || 'var(--text-tertiary)'
                const pct   = Math.round((count / all.length) * 100) || 0
                return (
                  <div key={jenis} className="animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] uppercase tracking-wide"
                        style={{ color: 'var(--text-secondary)' }}>{jenis}</span>
                      <span className="font-mono text-[10px] font-bold" style={{ color }}>
                        {count} <span className="opacity-50 text-[8px]">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--surface-muted)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}66` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* Aktifitas per pos */}
          <Panel title="AKTIVITAS PER POS" delay={getStaggerDelay(3)}>
            <div className="space-y-2">
              {sortedByPos.map(([posId, count], i) => {
                const pct = Math.round((count / maxByPos) * 100)
                return (
                  <div key={posId} className="flex items-center gap-2 animate-fade-in"
                    style={{ animationDelay: `${getStaggerDelay(i + 4)}ms` }}>
                    <span className="font-mono text-[8px] w-4 text-right flex-shrink-0"
                      style={{ color: 'var(--text-tertiary)' }}>{i+1}</span>
                    <span className="font-mono text-[9px] font-bold w-14 flex-shrink-0"
                      style={{ color: 'var(--accent-primary)' }}>
                      {posId.replace('POS-', 'POS ')}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--surface-muted)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: 'var(--color-info)' }} />
                    </div>
                    <span className="font-mono text-[9px] font-bold flex-shrink-0"
                      style={{ color: 'var(--text-secondary)' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>

        {/* Timeline */}
        <Panel title="RIWAYAT KEGIATAN" delay={getStaggerDelay(5)}>
          {all.length === 0 ? (
            <EmptyState
              icon="timeline"
              title="Belum ada data kegiatan binter"
              description="Kegiatan bina teritorial akan muncul di sini."
            />
          ) : (
            <div className="space-y-0">
              {all.map((item, i) => {
                const color = BINTER_COLOR_MAP[item.jenis_kegiatan] || 'var(--text-tertiary)'
                return (
                  <TimelineItem
                    key={item.id || i}
                    item={item}
                    color={color}
                    isLast={i === all.length - 1}
                    delay={getStaggerDelay(i + 6)}
                  />
                )
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

/* ── Timeline Item Component ───────────────────────────────── */
function TimelineItem({ item, color, isLast, delay }) {
  return (
    <div
      className="flex gap-3 relative animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[7px] top-5 bottom-0 w-px"
          style={{ background: 'var(--color-info-subtle)' }} />
      )}
      {/* Dot */}
      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1.5 relative z-10 flex items-center justify-center"
        style={{ background: 'var(--surface-secondary)', border: `1px solid ${color}` }}>
        <div className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      </div>
      {/* Content */}
      <div className="flex-1 pb-3 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <span className="text-[10px] font-bold"
              style={{ color: 'var(--text-primary)' }}>
              {item.jenis_kegiatan || 'Kegiatan'}
            </span>
            {item.lokasi && (
              <span className="text-[9px] ml-1.5" style={{ color: 'var(--text-tertiary)' }}>
                · {item.lokasi}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
              style={{ color: 'var(--accent-primary)', background: 'var(--accent-muted)', border: '1px solid var(--accent-muted)' }}>
              {item.pos_id}
            </span>
            <span className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>
              {item.tanggal ? formatDate(item.tanggal) : '—'}
            </span>
          </div>
        </div>
        {item.keterangan && (
          <p className="text-[9px] mt-0.5 line-clamp-2"
            style={{ color: 'var(--text-tertiary)' }}>
            {item.keterangan}
          </p>
        )}
        {item.jumlah_peserta && (
          <p className="text-[8px] mt-0.5"
            style={{ color: 'var(--text-disabled)' }}>
            {item.jumlah_peserta} peserta
            {item.sasaran ? ` · ${item.sasaran}` : ''}
          </p>
        )}
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
      <div className="font-mono font-bold text-2xl leading-none"
        style={{ color, textShadow: `0 0 14px ${color}55` }}>
        {value}
      </div>
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
