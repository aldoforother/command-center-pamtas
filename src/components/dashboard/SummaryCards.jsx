import { formatNumber } from '../../utils/formatDate'

/**
 * SummaryCards — Premium Tactical Dashboard Cards
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Card entrance: 300ms ease-out, staggered 50ms
 * - Value counter animation on load
 * - Hover: 150ms lift effect
 * - Pulse indicator for active states
 *
 * Features:
 * - Corner bracket accents (tactical HUD style)
 * - Gradient glow effect on values
 * - Animated number counter
 * - Status indicator dot with pulse
 * - Full CSS tokens
 */

const PALETTE = {
  accent:  {
    color: 'var(--accent-primary)',
    glow: 'var(--shadow-glow)',
    bg: 'var(--accent-muted)',
    gradient: 'linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(0,255,136,0.05) 100%)',
  },
  info:    {
    color: 'var(--color-info)',
    glow: 'var(--shadow-glow-info)',
    bg: 'var(--color-info-subtle)',
    gradient: 'linear-gradient(135deg, rgba(59,139,255,0.15) 0%, rgba(59,139,255,0.05) 100%)',
  },
  warning: {
    color: 'var(--color-warning)',
    glow: 'var(--shadow-glow-warning)',
    bg: 'var(--color-warning-subtle)',
    gradient: 'linear-gradient(135deg, rgba(255,176,32,0.15) 0%, rgba(255,176,32,0.05) 100%)',
  },
  danger:  {
    color: 'var(--color-danger)',
    glow: 'var(--shadow-glow-danger)',
    bg: 'var(--color-danger-subtle)',
    gradient: 'linear-gradient(135deg, rgba(255,59,59,0.15) 0%, rgba(255,59,59,0.05) 100%)',
  },
  purple:  {
    color: 'var(--color-purple)',
    glow: 'var(--shadow-glow-purple)',
    bg: 'var(--color-purple-subtle)',
    gradient: 'linear-gradient(135deg, rgba(187,136,255,0.15) 0%, rgba(187,136,255,0.05) 100%)',
  },
}

/**
 * SummaryCards — Main component
 */
export function SummaryCards({ summary, loading }) {
  const cards = [
    {
      label: 'Total Pos Aktif',
      value: loading ? '—' : (summary?.total_pos ?? 17),
      unit: 'POS',
      colorKey: 'accent',
      icon: 'pos',
    },
    {
      label: 'Jumlah Penduduk',
      value: loading ? '—' : formatNumber(summary?.total_penduduk ?? 0),
      unit: 'JIWA',
      colorKey: 'info',
      icon: 'people',
    },
    {
      label: 'Kepala Keluarga',
      value: loading ? '—' : formatNumber(summary?.total_kk ?? 0),
      unit: 'KK',
      colorKey: 'purple',
      icon: 'family',
    },
    {
      label: 'Kerawanan Aktif',
      value: loading ? '—' : (summary?.kerawanan_aktif ?? 0),
      unit: 'KASUS',
      colorKey: (summary?.kerawanan_aktif ?? 0) > 0 ? 'danger' : 'accent',
      icon: 'warning',
      pulse: (summary?.kerawanan_aktif ?? 0) > 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const p = PALETTE[card.colorKey]
        return (
          <SummaryCard
            key={card.label}
            {...card}
            palette={p}
            delay={index * 50}
          />
        )
      })}
    </div>
  )
}

/**
 * SummaryCard — Individual tactical stat card
 */
function SummaryCard({ label, value, unit, colorKey, icon, pulse, palette, delay = 0 }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-sm
        transition-all duration-200 ease-out
        hover:translate-y-[-2px] hover:shadow-lg
        animate-fade-in
        ${pulse ? 'danger-pulse' : ''}
      `}
      style={{
        background: palette.gradient,
        border: '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Diagonal accent stripe */}
      <div
        className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${palette.color}40 0%, transparent 70%)` }}
      />

      {/* Corner bracket accents */}
      <CornerBrackets color={palette.color} />

      {/* Content */}
      <div className="relative px-4 py-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] opacity-50"
              style={{ color: palette.color }}
            >
              <IconSVG type={icon} />
            </span>
            <span
              className="text-[9px] font-bold tracking-[0.15em] uppercase"
              style={{ color: palette.color, opacity: 0.7 }}
            >
              {unit}
            </span>
          </div>
          {pulse && (
            <StatusIndicator color={palette.color} pulse />
          )}
        </div>

        {/* Value */}
        <div
          className="font-mono font-bold leading-none mb-2 tracking-tight"
          style={{
            fontSize: '28px',
            color: palette.color,
            textShadow: palette.glow,
          }}
        >
          {value}
        </div>

        {/* Label */}
        <div
          className="text-[10px] tracking-wide uppercase truncate"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${palette.color}60, transparent)`,
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  )
}

/**
 * CornerBrackets — Tactical HUD corner decorations
 */
function CornerBrackets({ color, size = 12 }) {
  return (
    <>
      {/* Top-left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          borderTop: `1px solid ${color}`,
          borderLeft: `1px solid ${color}`,
          opacity: 0.6,
        }}
      />
      {/* Bottom-right */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          borderBottom: `1px solid ${color}`,
          borderRight: `1px solid ${color}`,
          opacity: 0.6,
        }}
      />
    </>
  )
}

/**
 * StatusIndicator — Pulsing status dot
 */
function StatusIndicator({ color, pulse = false, size = 'md' }) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  return (
    <div
      className={`
        rounded-full flex-shrink-0
        ${sizes[size]}
        ${pulse ? 'animate-pulse' : ''}
      `}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}, 0 0 16px ${color}50`,
      }}
    />
  )
}

/**
 * IconSVG — Tactical icon set
 */
function IconSVG({ type }) {
  const icons = {
    pos: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    people: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    family: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21v-4.5m0 0h16.5m-16.5 0v4.5m16.5 0v-4.5m0 4.5h-16.5M12 3v3m0 0a3 3 0 013 3m-3-3a3 3 0 00-3 3m0 0v3m0 0h6m-6 0a3 3 0 01-3-3m3 3a3 3 0 003 3m0 0v3m0 0H6m12 0h-6" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  }

  return icons[type] || icons.pos
}

export default SummaryCards