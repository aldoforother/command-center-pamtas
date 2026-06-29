/**
 * StatChip — Premium Tactical Stat Display Components
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Entrance: 200ms ease-out
 * - Hover: 150ms
 * - Pulse: 2s ease-in-out infinite
 *
 * Components:
 * - StatChip: Compact inline stat
 * - StatBadge: Icon + label + value
 * - InfoPill: Pill-shaped info display
 * - MiniStat: Minimal stat for lists
 */

import { useState } from 'react'

/* ── Size presets ─────────────────────────────────────── */
const SIZES = {
  xs: { padding: '1px 6px',  fontSize: '8px',  iconSize: 10, valueSize: '10px' },
  sm: { padding: '2px 8px',  fontSize: '9px',  iconSize: 12, valueSize: '11px' },
  md: { padding: '4px 10px', fontSize: '10px', iconSize: 14, valueSize: '13px' },
  lg: { padding: '6px 12px', fontSize: '11px', iconSize: 16, valueSize: '15px' },
}

/* ── StatChip — Compact stat with label and value ─────── */
export function StatChip({
  label,
  value,
  color = 'var(--accent-primary)',
  pulse = false,
  className = ''
}) {
  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-sm
        transition-all duration-150 ease-out
        hover:translate-y-[-1px] hover:shadow-md
        ${className}
      `}
      style={{
        background: `${color}10`,
        border: `1px solid ${color}25`,
        boxShadow: pulse ? `0 0 12px ${color}20` : 'none',
      }}
    >
      {pulse && (
        <StatusDot color={color} size="sm" pulse />
      )}
      <span
        className="text-[10px] uppercase tracking-wider"
        style={{ color: `${color}70` }}
      >
        {label}
      </span>
      <span
        className="font-mono font-bold"
        style={{
          fontSize: '13px',
          color,
          textShadow: `0 0 10px ${color}50`,
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── StatBadge — Icon + label + value inline ───────────── */
export function StatBadge({
  icon,
  label,
  value,
  color = 'var(--accent-primary)',
  size = 'md',
  onClick
}) {
  const s = SIZES[size] || SIZES.md
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className={`
        inline-flex items-center gap-2 font-medium rounded-sm
        transition-all duration-150 ease-out
        ${onClick ? 'cursor-pointer hover:translate-y-[-1px]' : ''}
      `}
      style={{
        background: hovered ? `${color}15` : `${color}08`,
        border: `1px solid ${color}25`,
        color: `${color}90`,
        padding: s.padding,
        fontSize: s.fontSize,
        boxShadow: hovered ? `0 4px 12px ${color}15` : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && (
        <span style={{ width: s.iconSize, height: s.iconSize, color }}>
          {icon}
        </span>
      )}
      <span>{label}:</span>
      <span className="font-mono font-bold" style={{ color, fontSize: s.valueSize }}>
        {value}
      </span>
    </span>
  )
}

/* ── InfoPill — Pill-shaped info display ───────────────── */
export function InfoPill({
  label,
  value,
  color = 'var(--accent-primary)',
  pulse = false,
  size = 'sm',
  icon
}) {
  const s = SIZES[size] || SIZES.sm
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full
        transition-all duration-150 ease-out
        hover:translate-y-[-1px] hover:shadow-md
      `}
      style={{
        background: hovered ? `${color}15` : `${color}08`,
        border: `1px solid ${color}25`,
        padding: s.padding,
        fontSize: s.fontSize,
        boxShadow: pulse ? `0 0 12px ${color}30` : (hovered ? `0 4px 12px ${color}15` : 'none'),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {pulse && (
        <StatusDot color={color} size="sm" pulse />
      )}
      {icon && (
        <span style={{ width: s.iconSize, height: s.iconSize, color }}>
          {icon}
        </span>
      )}
      <span
        className="uppercase tracking-wider"
        style={{ color: `${color}70` }}
      >
        {label}
      </span>
      <span
        className="font-mono font-bold"
        style={{ color, fontSize: s.valueSize }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── MiniStat — Minimal stat for lists/grids ───────────── */
export function MiniStat({
  label,
  value,
  color = 'var(--accent-primary)',
  icon,
  trend,
  trendDirection = 'up',
  className = ''
}) {
  const trendColors = {
    up: 'var(--color-success)',
    down: 'var(--color-danger)',
    neutral: 'var(--text-tertiary)',
  }
  const trendColor = trendColors[trendDirection] || trendColors.neutral

  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2 rounded-sm
        transition-all duration-150 ease-out
        hover:bg ${className}
      `}
      style={{
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border-subtle)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`
        e.currentTarget.style.background = `${color}05`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.background = 'var(--surface-secondary)'
      }}
    >
      {icon && (
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}
        >
          <span style={{ color, width: 16, height: 16 }}>{icon}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className="text-[9px] uppercase tracking-wider truncate"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </p>
        <p
          className="font-mono font-bold text-sm leading-tight"
          style={{ color, textShadow: `0 0 8px ${color}40` }}
        >
          {value}
        </p>
      </div>
      {trend && (
        <div
          className="flex items-center gap-1 text-[9px] font-mono"
          style={{ color: trendColor }}
        >
          {trendDirection === 'up' && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {trendDirection === 'down' && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {trend}
        </div>
      )}
    </div>
  )
}

/* ── StatusDot — Pulsing status indicator ──────────────── */
export function StatusDot({
  color = 'var(--accent-primary)',
  size = 'md',
  pulse = false,
  className = ''
}) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <span
      className={`
        inline-block rounded-full flex-shrink-0
        ${sizes[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}50`,
      }}
    />
  )
}

/* ── StatGroup — Group of stat chips ───────────────────── */
export function StatGroup({
  items = [],
  columns = 2,
  className = ''
}) {
  return (
    <div
      className={`grid gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, i) => (
        <StatChip key={item.key || i} {...item} />
      ))}
    </div>
  )
}

export default StatChip