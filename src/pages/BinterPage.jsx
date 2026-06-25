import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllBinter, usePos } from '../hooks/useSupabase'
import { BINTER_TYPES, BINTER_COLOR_MAP } from '../constants/kerawananCategories'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate } from '../utils/formatDate'
import { APP_CONFIG } from '../constants/config'

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

/* ── Timeline filter options ───────────────────────────────── */
const TIMELINE_OPTIONS = [
  { id: 'all',   label: 'Semua' },
  { id: 'today', label: 'Hari Ini' },
  { id: '7d',    label: '7 Hari' },
  { id: '30d',   label: '30 Hari' },
  { id: '90d',   label: '3 Bulan' },
  { id: '180d',  label: '6 Bulan' },
  { id: '365d',  label: '1 Tahun' },
]

function filterByTimeline(items, timelineId) {
  if (timelineId === 'all') return items
  const now = new Date()
  const cutoff = new Date()
  if (timelineId === 'today') {
    cutoff.setHours(0, 0, 0, 0)
  } else {
    cutoff.setDate(now.getDate() - parseInt(timelineId))
  }
  return items.filter(b => b.tanggal && new Date(b.tanggal) >= cutoff)
}

/* ── Main component ────────────────────────────────────────── */
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

  // Label untuk print header
  const timelineLabel = TIMELINE_OPTIONS.find(o => o.id === filterTimeline)?.label || 'Semua'
  const jenisLabel    = filterJenis === 'all' ? 'Semua Jenis' : filterJenis
  const posLabel      = filterPos === 'all' ? 'Semua Pos' : (posMap[filterPos] || filterPos)
  const today         = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col h-full fade-in">

      {/* ── Print: list format ─────────────────────────────── */}
      {!selectedItem && (
        <div className="hidden print:block p-6 font-mono">
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">
              {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.YONKAV} · {APP_CONFIG.TAHUN_ANGGARAN}
            </p>
            <h1 className="text-xl font-bold text-black">LAPORAN PROGRAM BINTER</h1>
            <p className="text-sm text-gray-600 mt-1">Dicetak: {today}</p>
          </div>
          <div className="mb-4 text-[10px] text-gray-500 flex flex-wrap gap-4">
            <span>Periode: <b className="text-black">{timelineLabel}</b></span>
            <span>Jenis: <b className="text-black">{jenisLabel}</b></span>
            <span>Pos: <b className="text-black">{posLabel}</b></span>
            <span>Total ditampilkan: <b className="text-black">{filtered.length} kegiatan</b></span>
          </div>
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                {['No','Tanggal','Pos','Jenis Kegiatan','Lokasi / Sasaran','Peserta'].map(h => (
                  <th key={h} className="text-left py-1.5 px-2 uppercase tracking-wider font-bold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id || i} className="border-b border-gray-200">
                  <td className="py-1.5 px-2 text-gray-400">{i + 1}</td>
                  <td className="py-1.5 px-2">{formatDate(b.tanggal)}</td>
                  <td className="py-1.5 px-2 font-bold">{posMap[b.pos_id] || b.pos_id}</td>
                  <td className="py-1.5 px-2">{b.jenis_kegiatan || '—'}</td>
                  <td className="py-1.5 px-2 max-w-[200px]">{b.lokasi || '—'}{b.sasaran ? ` · ${b.sasaran}` : ''}</td>
                  <td className="py-1.5 px-2">{b.jumlah_peserta || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 pt-4 border-t border-gray-300 text-center text-[9px] text-gray-400 tracking-widest uppercase">
            {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.YONKAV} · {APP_CONFIG.WILAYAH} · {APP_CONFIG.TAHUN_ANGGARAN}
          </div>
        </div>
      )}

      {/* ── Print: single binter format ────────────────────── */}
      {selectedItem && (
        <div className="hidden print:block p-6 font-mono">
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">
              {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.YONKAV} · {APP_CONFIG.TAHUN_ANGGARAN}
            </p>
            <h1 className="text-xl font-bold text-black">LAPORAN KEGIATAN BINTER</h1>
            <h2 className="text-base font-bold text-gray-700 mt-0.5">{selectedItem.jenis_kegiatan?.toUpperCase()}</h2>
            <p className="text-sm text-gray-600 mt-1">Dicetak: {today}</p>
          </div>
          <table className="w-full text-[11px] border-collapse mb-4">
            <tbody>
              {[
                ['Jenis Kegiatan', selectedItem.jenis_kegiatan],
                ['Tanggal',        formatDate(selectedItem.tanggal)],
                ['Pos',            posMap[selectedItem.pos_id] || selectedItem.pos_id],
                ['Lokasi',         selectedItem.lokasi || '—'],
                ['Sasaran',        selectedItem.sasaran || '—'],
                ['Jumlah Peserta', selectedItem.jumlah_peserta || '—'],
              ].map(([label, val]) => (
                <tr key={label} className="border-b border-gray-200">
                  <td className="py-1.5 px-3 w-40 text-gray-500 uppercase tracking-wider">{label}</td>
                  <td className="py-1.5 px-3 font-medium">{val || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedItem.keterangan && (
            <div className="mb-4 p-3 border border-gray-300 rounded">
              <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Keterangan</p>
              <p className="text-[11px] leading-relaxed">{selectedItem.keterangan}</p>
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-gray-300 text-center text-[9px] text-gray-400 tracking-widest uppercase">
            {APP_CONFIG.SATGAS_NAME} · {APP_CONFIG.YONKAV} · {APP_CONFIG.WILAYAH} · {APP_CONFIG.TAHUN_ANGGARAN}
          </div>
        </div>
      )}

      {/* ── Header (screen only) ────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3 print:hidden"
        style={{ background: 'rgba(4,11,6,0.9)', borderBottom: '1px solid rgba(0,255,136,0.15)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[rgba(200,214,229,0.85)] font-bold text-sm uppercase tracking-widest">
              ◫ Program Binter
            </h2>
            <p className="text-[rgba(200,214,229,0.3)] text-[10px] mt-0.5">
              Pembinaan Teritorial — aggregasi semua pos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatChip label="Total" value={(binter || []).length} color="#4488ff" />
            <StatChip label="Filter" value={filtered.length} color="#00ff88" />
          </div>
        </div>

        {/* Filters row — semua kontrol seragam (w-40), sejajar dalam satu grid */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeline */}
          <select
            className="hud-select text-[10px] w-40"
            value={filterTimeline}
            onChange={e => setFilterTimeline(e.target.value)}
          >
            {TIMELINE_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>

          {/* Jenis */}
          <select className="hud-select text-[10px] w-40" value={filterJenis} onChange={e => setFilterJenis(e.target.value)}>
            <option value="all">Semua Jenis</option>
            {BINTER_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Pos */}
          <select className="hud-select text-[10px] w-40" value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
            ))}
          </select>

          {/* Search */}
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

          {/* Print button */}
          <button
            className="hud-btn text-[9px] px-2 ml-auto flex items-center gap-1.5"
            onClick={() => window.print()}
            title={selectedItem ? 'Print laporan kegiatan ini' : 'Print daftar kegiatan'}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {selectedItem ? 'Print Kegiatan' : 'Print Daftar'}
          </button>
        </div>
      </div>

      {/* ── Main content (screen only) ──────────────────────── */}
      <div className="flex flex-1 overflow-hidden print:hidden">

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
                    className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer transition-all"
                    style={{
                      borderLeftColor: color,
                      borderLeftWidth: '2px',
                      background: isSelected ? 'rgba(68,136,255,0.08)' : undefined,
                      borderColor:  isSelected ? 'rgba(68,136,255,0.4)' : undefined,
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border tracking-wider uppercase"
                          style={{ color, background: `${color}10`, borderColor: `${color}30` }}
                        >
                          {item.jenis_kegiatan || 'Kegiatan'}
                        </span>
                        <span className="text-[rgba(0,255,136,0.6)] text-[10px] font-mono font-bold">
                          {posMap[item.pos_id] || item.pos_id}
                        </span>
                        <span className="text-[rgba(200,214,229,0.3)] text-[10px] font-mono">
                          {formatDate(item.tanggal)}
                        </span>
                        {item.jumlah_peserta && (
                          <span className="text-[rgba(200,214,229,0.35)] text-[10px]">
                            {item.jumlah_peserta} peserta
                          </span>
                        )}
                      </div>
                      <p className="text-[rgba(200,214,229,0.55)] text-xs truncate">
                        {item.lokasi || '—'}{item.sasaran ? ` · ${item.sasaran}` : ''}
                      </p>
                    </div>
                    <span className="text-[rgba(0,255,136,0.3)] text-[10px] flex-shrink-0">
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
          <div className="w-1/2 border-l border-[rgba(68,136,255,0.15)] overflow-y-auto">
            <BinterDetail
              item={selectedItem}
              posName={posMap[selectedItem.pos_id] || selectedItem.pos_id}
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
    { label: 'Jenis Kegiatan', value: item.jenis_kegiatan },
    { label: 'Tanggal',        value: formatDate(item.tanggal) },
    { label: 'Pos',            value: posName },
    { label: 'Lokasi',         value: item.lokasi || '—' },
    { label: 'Sasaran',        value: item.sasaran || '—' },
    { label: 'Jumlah Peserta', value: item.jumlah_peserta ? `${item.jumlah_peserta} orang` : '—' },
    { label: 'Keterangan',     value: item.keterangan || '—', fullRow: true },
  ]

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{ background: `${color}08`, borderBottom: `1px solid ${color}25` }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border"
              style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
              {item.jenis_kegiatan || 'Kegiatan'}
            </span>
          </div>
          <p className="text-[rgba(200,214,229,0.7)] text-[11px] font-bold">Detail Kegiatan Binter</p>
        </div>
        <button
          onClick={onClose}
          className="text-[rgba(200,214,229,0.3)] hover:text-[rgba(200,214,229,0.7)] text-lg leading-none transition-colors"
        >×</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(68,136,255,0.15)' }}>
          <div className="px-3 py-1.5"
            style={{ background: 'rgba(68,136,255,0.04)', borderBottom: '1px solid rgba(68,136,255,0.1)' }}>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[rgba(68,136,255,0.7)]">
              INFORMASI KEGIATAN
            </span>
          </div>
          <div className="divide-y divide-[rgba(68,136,255,0.06)]">
            {rows.map(row => (
              <div key={row.label} className={`px-3 py-2 ${row.fullRow ? 'block' : 'flex items-start gap-3'}`}>
                <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-28"
                  style={{ color: 'rgba(200,214,229,0.35)' }}>{row.label}</span>
                <span className={`text-[11px] font-medium text-[rgba(200,214,229,0.8)]
                  ${row.fullRow ? 'block mt-1 leading-relaxed' : 'flex-1'}`}>
                  {row.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigate to pos */}
        <button
          onClick={onNavigate}
          className="w-full hud-btn text-[10px] flex items-center justify-center gap-2"
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
