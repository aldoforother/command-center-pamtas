import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllBinter, usePos } from '../hooks/useSupabase'
import { BINTER_TYPES, BINTER_COLOR_MAP } from '../constants/kerawananCategories'
import { LoadingSpinner, EmptyState } from '../components/ui'
import { formatDate } from '../utils/formatDate'
import { downloadBinterPDF, downloadBinterListPDF } from '../utils/generatePDF'
import { TIMELINE_OPTIONS, filterByTimeline, getStaggerDelay } from '../utils/timeline'

/* ── Color helper ──────────────────────────────────────────── */
function getColor(jenis) {
  if (!jenis) return 'rgba(200,214,229,0.5)'
  const direct = BINTER_COLOR_MAP[jenis]
  if (direct) return direct
  for (const [key, val] of Object.entries(BINTER_COLOR_MAP)) {
    if (jenis.toLowerCase().includes(key.toLowerCase())) return val
  }
  return 'rgba(200,214,229,0.5)'
}

export default function BinterPage() {
  const navigate = useNavigate()
  const { data: binter,  loading } = useAllBinter()
  const { data: posList }          = usePos()

  const [filterJenis,    setFilterJenis]    = useState('all')
  const [filterPos,      setFilterPos]      = useState('all')
  const [filterTimeline, setFilterTimeline] = useState('all')
  const [search,         setSearch]         = useState('')
  const [selectedItem,   setSelectedItem]   = useState(null)

  const posMap = useMemo(() => (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {}), [posList])

  const filtered = useMemo(() => {
    let items = binter || []
    items = filterByTimeline(items, filterTimeline)
    return items.filter(b => {
      if (filterJenis !== 'all' && b.jenis_kegiatan !== filterJenis) return false
      if (filterPos !== 'all' && b.pos_id !== filterPos) return false
      if (search &&
        !b.jenis_kegiatan?.toLowerCase().includes(search.toLowerCase()) &&
        !b.lokasi?.toLowerCase().includes(search.toLowerCase()) &&
        !b.pos_id?.toLowerCase().includes(search.toLowerCase()) &&
        !b.sasaran?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      const ta = a.tanggal || ''
      const tb = b.tanggal || ''
      return tb.localeCompare(ta)
    })
  }, [binter, filterJenis, filterPos, filterTimeline, search])

  const hasFilter = filterJenis !== 'all' || filterPos !== 'all' ||
                    filterTimeline !== 'all' || search

  const selectedPosName = selectedItem
    ? (posMap[selectedItem.pos_id] || selectedItem.pos_id)
    : null

  // PDF filter summary
  const timelineLabel = TIMELINE_OPTIONS.find(o => o.id === filterTimeline)?.label || 'Semua'
  const jenisLabel    = filterJenis === 'all' ? 'Semua Jenis' : filterJenis
  const posLabel      = filterPos === 'all' ? 'Semua Pos' : (posMap[filterPos] || filterPos)
  const filterSummary = [timelineLabel, jenisLabel, posLabel].join(' · ')

  const handleDownloadPDF = () => {
    if (selectedItem) {
      downloadBinterPDF(selectedItem, selectedPosName)
    } else {
      downloadBinterListPDF(filtered, filterSummary, posMap)
    }
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ background: 'var(--surface-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--color-info)' }}>
              ◫ Program Binter
            </h2>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Pembinaan Teritorial — aggregasi semua pos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatChip label="Total"   value={(binter || []).length}  color="var(--color-info)" />
            <StatChip label="Filter"   value={filtered.length}       color="var(--accent-primary)" />
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="hud-select text-[10px] w-40"
            value={filterTimeline}
            onChange={e => setFilterTimeline(e.target.value)}
          >
            {TIMELINE_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>

          <select className="hud-select text-[10px] w-40" value={filterJenis} onChange={e => setFilterJenis(e.target.value)}>
            <option value="all">Semua Jenis</option>
            {BINTER_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select className="hud-select text-[10px] w-40" value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
            ))}
          </select>

          <input
            className="hud-input text-[10px] w-40"
            placeholder="Cari kegiatan / lokasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {hasFilter && (
            <button
              className="hud-btn text-[9px] px-2"
              onClick={() => {
                setFilterJenis('all'); setFilterPos('all')
                setFilterTimeline('all'); setSearch('')
              }}
            >
              Reset
            </button>
          )}

          {/* Download PDF button */}
          <button
            className="hud-btn text-[9px] px-2 ml-auto flex items-center gap-1.5"
            onClick={handleDownloadPDF}
            title={selectedItem ? 'Unduh PDF kegiatan ini' : 'Unduh PDF daftar kegiatan'}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {selectedItem ? 'Unduh PDF' : 'Unduh Daftar'}
          </button>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* List */}
        <div className={`overflow-y-auto p-4 transition-all ${selectedItem ? 'w-1/2' : 'w-full'}`}>
          {loading ? (
            <LoadingSpinner text="Memuat data binter..." />
          ) : filtered.length === 0 ? (
            <EmptyState icon="◫" title="Tidak ada kegiatan" description="Tidak ada kegiatan Binter yang sesuai filter." />
          ) : (
            <div className="space-y-2">
              <p className="hud-label mb-2">{filtered.length} kegiatan ditampilkan</p>
              {filtered.map((item, i) => {
                const color      = getColor(item.jenis_kegiatan)
                const isSelected = selectedItem?.id === item.id
                return (
                  <div
                    key={item.id || i}
                    className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer transition-all animate-fade-in"
                    style={{
                      borderLeftColor: color,
                      borderLeftWidth: '2px',
                      background: isSelected ? 'var(--accent-muted)' : 'var(--surface-primary)',
                      borderColor:  isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      animationDelay: `${getStaggerDelay(i)}ms`,
                    }}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--surface-secondary)'
                        e.currentTarget.style.borderColor = 'var(--border-default)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--surface-primary)'
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border tracking-wider uppercase"
                          style={{ color, background: `${color}10`, borderColor: `${color}30` }}
                        >
                          {item.jenis_kegiatan || 'Kegiatan'}
                        </span>
                        <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                          {posMap[item.pos_id] || item.pos_id}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                          {formatDate(item.tanggal)}
                        </span>
                        {item.jumlah_peserta && (
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            {item.jumlah_peserta} peserta
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.lokasi || '—'}{item.sasaran ? ` · ${item.sasaran}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] flex-shrink-0 transition-all" style={{ color: 'var(--accent-primary)' }}>
                      {isSelected ? '◀' : '▶'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && (
          <div className="w-1/2 border-l overflow-y-auto animate-slide-in-right"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-base)' }}>
            <BinterDetail
              item={selectedItem}
              posName={selectedPosName}
              onClose={() => setSelectedItem(null)}
              onNavigate={() => navigate(`/pos/${selectedItem.pos_id}/binter`)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Detail Panel ───────────────────────────────────────────── */
function BinterDetail({ item, posName, onClose, onNavigate }) {
  const color = getColor(item.jenis_kegiatan)

  const rows = [
    { label: 'Jenis Kegiatan',   value: item.jenis_kegiatan },
    { label: 'Tanggal',        value: formatDate(item.tanggal) },
    { label: 'Pos',             value: posName },
    { label: 'Lokasi',         value: item.lokasi || '—' },
    { label: 'Sasaran',        value: item.sasaran || '—' },
    { label: 'Jumlah Peserta', value: item.jumlah_peserta ? `${item.jumlah_peserta} orang` : '—' },
    { label: 'Keterangan',     value: item.keterangan || '—', fullRow: true },
  ]

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between animate-scale-in"
        style={{ background: 'var(--accent-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border animate-fade-in"
              style={{ color: 'var(--color-info)', borderColor: 'var(--color-info-subtle)', background: 'var(--color-info-subtle)', animationDelay: '50ms' }}>
              {item.jenis_kegiatan || 'Kegiatan'}
            </span>
          </div>
          <p className="text-[11px] font-bold animate-fade-in" style={{ color: 'var(--text-secondary)', animationDelay: '100ms' }}>Detail Kegiatan Binter</p>
        </div>
        <button
          onClick={onClose}
          className="text-[10px] leading-none transition-all duration-100 p-1 rounded-sm"
          style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--surface-secondary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-tertiary)'
          }}
          aria-label="Tutup panel"
        >×</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="rounded-sm overflow-hidden animate-scale-in"
          style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-primary)', animationDelay: '100ms' }}>
          <div className="px-3 py-1.5"
            style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--color-info)' }}>
              INFORMASI KEGIATAN
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {rows.map((row, idx) => (
              <div key={row.label} className={`px-3 py-2 animate-fade-in ${row.fullRow ? 'block' : 'flex items-start gap-3'}`}
                style={{ animationDelay: `${150 + idx * 30}ms` }}>
                <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-28"
                  style={{ color: 'var(--text-tertiary)' }}>{row.label}</span>
                <span className={`text-[11px] font-medium ${row.fullRow ? 'block mt-1 leading-relaxed' : 'flex-1'}`}
                  style={{ color: 'var(--text-secondary)' }}>
                  {row.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigate to pos */}
        <button
          onClick={onNavigate}
          className="w-full hud-btn text-[10px] flex items-center justify-center gap-2 animate-scale-in"
          style={{ animationDelay: '300ms' }}
        >
          <span>Buka Tab Binter Pos {posName}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}

/* ── StatChip ───────────────────────────────────────────────── */
function StatChip({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
      style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
      <span className="text-[9px] uppercase tracking-wider" style={{ color: `${color}60` }}>{label}</span>
      <span className="font-mono font-bold text-sm" style={{ color, textShadow: `0 0 10px ${color}60` }}>
        {value}
      </span>
    </div>
  )
}
