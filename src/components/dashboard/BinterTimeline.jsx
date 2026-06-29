import { useState } from 'react'
import { formatDate } from '../../utils/formatDate'
import { BINTER_COLOR_MAP } from '../../constants/kerawananCategories'

/**
 * BinterTimeline — Premium Tactical Timeline Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Item entrance: 200ms ease-out, staggered 40ms
 * - Line drawing animation
 * - Dot pulse for recent items
 * - Hover: 150ms highlight
 *
 * Features:
 * - Vertical timeline with connecting line
 * - Color-coded dots by activity type
 * - Compact info display
 * - Click to expand (future)
 */

function getBinterColor(jenis) {
  if (!jenis) return 'var(--color-info)'
  for (const [key, val] of Object.entries(BINTER_COLOR_MAP)) {
    if (jenis.toLowerCase().includes(key.toLowerCase())) return val
  }
  return 'var(--color-info)'
}

/**
 * BinterTimeline — Main component
 */
export function BinterTimeline({ binterList = [], limit = 5 }) {
  const sorted = [...binterList]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, limit)

  if (sorted.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-6 rounded-sm"
        style={{
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="mb-3 opacity-40"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p
          className="text-[10px] tracking-wider uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Belum ada kegiatan
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--color-purple)', boxShadow: '0 0 6px var(--color-purple)' }}
        />
        <span
          className="text-[9px] font-bold tracking-[0.15em] uppercase"
          style={{ color: 'var(--color-purple)' }}
        >
          Kegiatan Terakhir
        </span>
        <span
          className="ml-auto text-[9px] font-mono"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {sorted.length} kegiatan
        </span>
      </div>

      {/* Timeline items */}
      <div className="p-3 space-y-0">
        {sorted.map((item, i) => (
          <TimelineItem
            key={item.id || i}
            item={item}
            isLast={i === sorted.length - 1}
            delay={i * 40}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * TimelineItem — Individual timeline entry
 */
function TimelineItem({ item, isLast, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const binterColor = getBinterColor(item.jenis_kegiatan)

  // Check if recent (within 24 hours)
  const isRecent = item.tanggal &&
    (Date.now() - new Date(item.tanggal).getTime()) < 24 * 60 * 60 * 1000

  return (
    <div
      className="flex items-start gap-3 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div
          className={`
            relative w-2.5 h-2.5 rounded-full flex-shrink-0
            transition-all duration-150
            ${isRecent ? 'animate-pulse' : ''}
          `}
          style={{
            backgroundColor: binterColor,
            boxShadow: isHovered
              ? `0 0 12px ${binterColor}`
              : `0 0 6px ${binterColor}`,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: binterColor,
              opacity: 0.3,
              animation: isRecent ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[12px] mt-1"
            style={{
              background: `linear-gradient(180deg, ${binterColor}40 0%, var(--border-subtle) 100%)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 min-w-0 pb-3"
        style={{
          borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
          marginBottom: isLast ? 0 : '12px',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[11px] font-medium leading-tight truncate flex-1"
            style={{
              color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'color 150ms ease-out',
            }}
          >
            {item.jenis_kegiatan}
          </p>
          <span
            className="font-mono text-[9px] flex-shrink-0"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {formatDate(item.tanggal)}
          </span>
        </div>

        <div
          className="flex items-center gap-2 mt-1 text-[9px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {/* POS badge */}
          <span
            className="px-1.5 py-0.5 rounded-sm font-mono font-bold"
            style={{
              background: `${binterColor}15`,
              color: binterColor,
              fontSize: '8px',
            }}
          >
            {item.pos_id?.replace(/^POS-0?/, '') || 'N/A'}
          </span>

          {/* Location */}
          {item.lokasi && (
            <span className="truncate">
              <span style={{ opacity: 0.5 }}>·</span> {item.lokasi}
            </span>
          )}

          {/* Participants */}
          {item.jumlah_peserta && (
            <span className="flex items-center gap-1">
              <span style={{ opacity: 0.5 }}>·</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              {item.jumlah_peserta}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BinterTimeline