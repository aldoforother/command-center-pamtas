import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllKerawanan, usePos } from '../hooks/useSupabase'
import { KERAWANAN_CATEGORIES } from '../constants/kerawananCategories'
import { KerawananBadge, LoadingSpinner, EmptyState } from '../components/ui'
import { formatDate } from '../utils/formatDate'
import { downloadKerawananPDF, downloadKerawananListPDF } from '../utils/generatePDF'
import { TIMELINE_OPTIONS, filterByTimeline, getStaggerDelay } from '../utils/timeline'

// Animation keyframes
const ANIMATION_STYLES = `
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}
`

export default function InsidenPage() {
  const navigate = useNavigate()
  const { data: kerawanan, loading } = useAllKerawanan()
  const { data: posList } = usePos()
  const [visibleItems, setVisibleItems] = useState(new Set())
  const contentRef = useRef(null)

  const [filterStatus,   setFilterStatus]   = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterPos,      setFilterPos]      = useState('all')
  const [filterTimeline, setFilterTimeline] = useState('all')
  const [search,         setSearch]         = useState('')
  const [selectedItem,   setSelectedItem]   = useState(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (document.getElementById('insiden-animations')) return
    const style = document.createElement('style')
    style.id = 'insiden-animations'
    style.textContent = ANIMATION_STYLES
    document.head.appendChild(style)
  }, [])

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
  }, [loading, filtered])

  const posMap = useMemo(() => (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {}), [posList])

  const filtered = useMemo(() => {
    let items = kerawanan || []
    items = filterByTimeline(items, filterTimeline)
    return items.filter(k => {
      if (filterStatus !== 'all' && k.status?.toLowerCase() !== filterStatus) return false
      if (filterKategori !== 'all' && k.kategori !== filterKategori) return false
      if (filterPos !== 'all' && k.pos_id !== filterPos) return false
      if (search &&
        !k.deskripsi?.toLowerCase().includes(search.toLowerCase()) &&
        !k.pos_id?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      const aAktif = a.status?.toLowerCase() === 'aktif'
      const bAktif = b.status?.toLowerCase() === 'aktif'
      if (aAktif && !bAktif) return -1
      if (!aAktif && bAktif) return 1
      return new Date(b.tanggal) - new Date(a.tanggal)
    })
  }, [kerawanan, filterStatus, filterKategori, filterPos, filterTimeline, search])

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length

  const hasFilter = filterStatus !== 'all' || filterKategori !== 'all' ||
                    filterPos !== 'all' || filterTimeline !== 'all' || search

  const selectedPosName = selectedItem
    ? (posMap[selectedItem.pos_id] || selectedItem.pos_id)
    : null

  const handleDownloadPDF = () => {
    if (selectedItem) {
      downloadKerawananPDF(selectedItem, selectedPosName)
    } else {
      downloadKerawananListPDF(filtered, `${filterStatus} · ${filterKategori} · ${filterPos}`, posMap)
    }
  }

  return (
    <div className="flex flex-col h-full" ref={contentRef} style={{ background: 'var(--surface-base)' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, rgba(255,80,80,0.05) 0%, var(--surface-base) 100%)', borderBottom: '1px solid rgba(255,80,80,0.1)' }}>
        <div className="px-4 pt-4 pb-3">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', boxShadow: '0 0 30px rgba(255,80,80,0.2)' }}>
                <svg className="w-6 h-6" fill="none" stroke="#ff5050" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-base tracking-widest uppercase" style={{ color: '#ff5050', textShadow: '0 0 30px rgba(255,80,80,0.5)' }}>
                  ⚠ DATA INSIDEN
                </h2>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  Agregasi seluruh laporan insiden kerawanan
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,80,80,0.1) 0%, rgba(20,25,30,0.9) 100%)',
                  border: '1px solid rgba(255,80,80,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                <p className="font-mono font-bold text-2xl" style={{ color: '#ff5050', textShadow: '0 0 20px rgba(255,80,80,0.5)' }}>
                  {(kerawanan || []).length}
                </p>
                <p className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Total</p>
              </div>
              <div className="px-4 py-2 rounded-xl text-center"
                style={{
                  background: aktifCount > 0
                    ? 'linear-gradient(135deg, rgba(255,80,80,0.15) 0%, rgba(20,25,30,0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(20,25,30,0.9) 100%)',
                  border: aktifCount > 0 ? '1px solid rgba(255,80,80,0.4)' : '1px solid rgba(0,255,136,0.3)',
                  boxShadow: aktifCount > 0 ? '0 4px 20px rgba(255,80,80,0.3)' : '0 4px 20px rgba(0,255,136,0.2)',
                  animation: aktifCount > 0 ? 'pulseGlow 2s infinite' : 'none',
                }}>
                <p className="font-mono font-bold text-2xl" style={{ color: aktifCount > 0 ? '#ff5050' : '#00ff88', textShadow: aktifCount > 0 ? '0 0 20px rgba(255,80,80,0.5)' : '0 0 20px rgba(0,255,136,0.5)' }}>
                  {aktifCount}
                </p>
                <p className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Aktif</p>
              </div>
            </div>
          </div>

          {/* Filters Row - Single line modern design */}
          <div className="flex items-center gap-2 flex-wrap p-3 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
            {/* Timeline */}
            <select
              className="px-3 py-2 rounded-lg text-[10px] cursor-pointer transition-all"
              value={filterTimeline}
              onChange={e => setFilterTimeline(e.target.value)}
              style={{
                background: 'rgba(255,80,80,0.1)',
                border: '1px solid rgba(255,80,80,0.25)',
                color: '#ff5050',
                outline: 'none',
              }}
            >
              {TIMELINE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* Status */}
            <select
              className="px-3 py-2 rounded-lg text-[10px] cursor-pointer transition-all"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.2)',
                color: 'var(--text-secondary)',
                outline: 'none',
              }}
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
            </select>

            {/* Kategori */}
            <select
              className="px-3 py-2 rounded-lg text-[10px] cursor-pointer transition-all"
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
              style={{
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.2)',
                color: 'var(--text-secondary)',
                outline: 'none',
              }}
            >
              <option value="all">Semua Kategori</option>
              {KERAWANAN_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            {/* Pos */}
            <select
              className="px-3 py-2 rounded-lg text-[10px] cursor-pointer transition-all"
              value={filterPos}
              onChange={e => setFilterPos(e.target.value)}
              style={{
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.2)',
                color: 'var(--text-secondary)',
                outline: 'none',
              }}
            >
              <option value="all">Semua Pos</option>
              {(posList || []).map(p => (
                <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
              ))}
            </select>

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[160px]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="var(--text-tertiary)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="flex-1 bg-transparent outline-none text-[11px]"
                placeholder="Cari insiden..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>

            {/* Reset */}
            {hasFilter && (
              <button
                onClick={() => {
                  setFilterStatus('all'); setFilterKategori('all')
                  setFilterPos('all'); setFilterTimeline('all'); setSearch('')
                }}
                className="px-3 py-2 rounded-lg text-[10px] font-medium transition-all"
                style={{
                  background: 'rgba(255,100,100,0.1)',
                  border: '1px solid rgba(255,100,100,0.3)',
                  color: 'rgba(255,100,100,0.8)',
                }}
              >
                Reset
              </button>
            )}

            {/* PDF */}
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-2 rounded-lg text-[10px] font-medium transition-all flex items-center gap-2"
              style={{
                background: 'rgba(255,80,80,0.15)',
                border: '1px solid rgba(255,80,80,0.35)',
                color: '#ff5050',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* List */}
        <div className={`overflow-y-auto p-4 transition-all duration-300 ${selectedItem ? 'w-1/2' : 'w-full'}`}>
          {loading ? (
            <LoadingSpinner text="Memuat data insiden..." />
          ) : filtered.length === 0 ? (
            <EmptyState icon="◉" title="Tidak ada data" description="Tidak ada insiden yang sesuai filter." />
          ) : (
            <div className="space-y-3">
              {/* Result count */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                  {filtered.length} insiden ditemukan
                </p>
              </div>

              {filtered.map((item, i) => {
                const cat = KERAWANAN_CATEGORIES.find(c => c.id === item.kategori)
                const color = cat?.color || 'var(--text-tertiary)'
                const isAktif = item.status?.toLowerCase() === 'aktif'
                const isSelected = selectedItem?.id === item.id

                return (
                  <div
                    key={item.id || i}
                    data-animate-id={`insiden-${i}`}
                    className="group p-4 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(255,80,80,0.15) 0%, rgba(20,25,30,0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.95) 100%)',
                      border: `1px solid ${isSelected ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.05)'}`,
                      boxShadow: isSelected
                        ? '0 4px 30px rgba(255,80,80,0.2), 0 0 40px rgba(255,80,80,0.1)'
                        : '0 4px 20px rgba(0,0,0,0.2)',
                      animation: `slideUp 0.4s ease-out ${i * 50}ms both`,
                    }}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255,80,80,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(255,80,80,0.2)'
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.95) 100%)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                        e.currentTarget.style.transform = 'translateX(0)'
                      }
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isAktif ? 'animate-pulse' : ''
                        }`}
                          style={{
                            background: isAktif ? 'rgba(255,80,80,0.2)' : 'rgba(0,255,136,0.1)',
                            color: isAktif ? '#ff5050' : '#00ff88',
                            border: `1px solid ${isAktif ? 'rgba(255,80,80,0.4)' : 'rgba(0,255,136,0.3)'}`,
                            boxShadow: isAktif ? '0 0 15px rgba(255,80,80,0.3)' : 'none',
                          }}>
                          {isAktif && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: '#ff5050', boxShadow: '0 0 8px #ff5050' }} />}
                          {item.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold"
                          style={{
                            background: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`,
                          }}>
                          {item.kategori}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--accent-primary)' }}>
                          {posMap[item.pos_id] || item.pos_id}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                          {isSelected ? '◀' : '▶'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[12px] leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                      {item.deskripsi || 'Tanpa deskripsi'}
                    </p>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDate(item.tanggal)}
                      </span>
                      {item.lokasi && (
                        <span className="text-[9px] px-2 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-disabled)' }}>
                          📍 {item.lokasi}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && (
          <div className="w-1/2 border-l overflow-y-auto"
            style={{ borderColor: 'rgba(255,80,80,0.2)', background: 'linear-gradient(180deg, rgba(255,80,80,0.03) 0%, var(--surface-base) 100%)' }}>
            <InsidenDetail
              item={selectedItem}
              posName={selectedPosName}
              onClose={() => setSelectedItem(null)}
              onNavigate={() => navigate(`/pos/${selectedItem.pos_id}/kerawanan`, { state: { highlightId: selectedItem.id } })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Detail Panel ──────────────────────────────────────────── */
function InsidenDetail({ item, posName, onClose, onNavigate }) {
  const cat = KERAWANAN_CATEGORIES.find(c => c.id === item.kategori)
  const color = cat?.color || '#ff5050'
  const isAktif = item.status?.toLowerCase() === 'aktif'

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-10"
        style={{ background: 'linear-gradient(180deg, rgba(255,80,80,0.1) 0%, rgba(20,25,30,0.98) 100%)', borderBottom: '1px solid rgba(255,80,80,0.15)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold"
              style={{
                background: `${color}20`,
                color: color,
                border: `1px solid ${color}40`,
              }}>
              {item.kategori}
            </span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isAktif ? 'animate-pulse' : ''}`}
              style={{
                background: isAktif ? 'rgba(255,80,80,0.2)' : 'rgba(0,255,136,0.1)',
                color: isAktif ? '#ff5050' : '#00ff88',
                border: `1px solid ${isAktif ? 'rgba(255,80,80,0.4)' : 'rgba(0,255,136,0.3)'}`,
              }}>
              {isAktif && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: '#ff5050', boxShadow: '0 0 8px #ff5050' }} />}
              {item.status?.toUpperCase()}
            </span>
          </div>
          <p className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Detail Insiden
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,80,80,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          <span style={{ color: 'var(--text-tertiary)', fontSize: '18px' }}>×</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main info card */}
        <div className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,80,80,0.08) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(255,80,80,0.2)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>
          <div className="px-4 py-2"
            style={{ background: 'rgba(255,80,80,0.1)', borderBottom: '1px solid rgba(255,80,80,0.15)' }}>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: '#ff5050' }}>
              Informasi Insiden
            </span>
          </div>
          <div className="p-4 space-y-3">
            <InfoRow label="Pos" value={posName} />
            <InfoRow label="Tanggal" value={formatDate(item.tanggal)} />
            <InfoRow label="Waktu" value={item.waktu || '—'} />
            <InfoRow label="Lokasi" value={item.lokasi || item.pos_id} />
            <InfoRow label="Jumlah Pelaku" value={item.jumlah_pelaku || item.pelaku || '—'} />
          </div>
        </div>

        {/* Description card */}
        <div className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>
          <div className="px-4 py-2"
            style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-primary)' }}>
              Uraian Insiden
            </span>
          </div>
          <div className="p-4">
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.deskripsi || 'Tidak ada deskripsi'}
            </p>
          </div>
        </div>

        {/* Tindak Lanjut */}
        {item.tindak_lanjut && (
          <div className="rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(20,25,30,0.95) 100%)',
              border: '1px solid rgba(0,255,136,0.15)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}>
            <div className="px-4 py-2"
              style={{ background: 'rgba(0,255,136,0.06)', borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: '#00ff88' }}>
                Tindak Lanjut
              </span>
            </div>
            <div className="p-4">
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.tindak_lanjut}
              </p>
            </div>
          </div>
        )}

        {/* Koordinat */}
        {(item.lat && item.lng) && (
          <div className="px-4 py-3 rounded-xl flex items-center gap-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="var(--accent-primary)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Koordinat TKP</p>
              <p className="font-mono text-[11px]" style={{ color: 'var(--accent-primary)' }}>
                {item.lat}, {item.lng}
              </p>
            </div>
          </div>
        )}

        {/* Navigate button */}
        <button
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(255,80,80,0.15) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(255,80,80,0.35)',
            color: '#ff5050',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,80,80,0.25)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,80,80,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,80,80,0.15) 0%, rgba(20,25,30,0.95) 100%)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <span>Buka Tab Kerawanan Pos {posName}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
      <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-24"
        style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      <span className="text-[11px] font-medium flex-1" style={{ color: 'var(--text-secondary)' }}>
        {value || '—'}
      </span>
    </div>
  )
}
