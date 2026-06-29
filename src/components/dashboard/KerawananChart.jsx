import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

/**
 * KerawananChart — Premium Tactical Chart Components
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Chart entrance: 500ms ease-out
 * - Bar hover: 150ms
 * - Tooltip: 100ms fade-in
 *
 * Features:
 * - Tactical dark theme
 * - Glow effects on hover
 * - Custom tooltips with token styling
 * - Animated data entry
 */

/* ── Chart Tooltip Style using CSS tokens ────────────────── */
const TOOLTIP_STYLE = {
  background: 'var(--surface-tertiary)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '11px',
  fontFamily: 'Inter, system-ui, sans-serif',
  padding: '8px 12px',
  boxShadow: 'var(--shadow-lg)',
}

/* ── Chart colors using CSS tokens ─────────────────────── */
const CHART_COLORS = {
  primary: '#00ff88',
  info: '#4488ff',
  purple: '#bb88ff',
  warning: '#ffaa00',
  pink: '#ff88cc',
  gray: '#888888',
  orange: '#ff8844',
  danger: '#ff3b3b',
}

/* ── Custom Tooltip Components ─────────────────────────── */
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="px-3 py-2 rounded-sm"
      style={{
        background: 'var(--surface-tertiary)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <p
        className="text-[10px] font-bold tracking-wider uppercase mb-1"
        style={{ color: payload[0].payload.color }}
      >
        {payload[0].payload.fullName}
      </p>
      <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
          {payload[0].value}
        </span>
        {' '}kasus
      </p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="px-3 py-2 rounded-sm"
      style={{
        background: 'var(--surface-tertiary)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <p
        className="text-[10px] font-bold tracking-wider uppercase mb-1"
        style={{ color: payload[0].payload.fill }}
      >
        {payload[0].name}
      </p>
      <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
          {Number(payload[0].value).toLocaleString('id-ID')}
        </span>
        {' '}jiwa
      </p>
    </div>
  )
}

/* ── Bar chart kerawanan per kategori ──────────────────── */
export function KerawananChart({ kerawananList = [] }) {
  const data = KERAWANAN_CATEGORIES.map(cat => ({
    name:      cat.label.split(' ')[0],
    fullName:  cat.label,
    value:     kerawananList.filter(k => k.kategori === cat.id).length,
    color:     cat.color,
  })).filter(d => d.value > 0)

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-32 rounded-sm"
        style={{
          background: 'var(--surface-secondary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="text-center">
          <div
            className="mb-2"
            style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}
          >
            <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p
            className="text-[10px] tracking-wider uppercase"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Tidak ada data
          </p>
        </div>
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
          style={{ background: 'var(--accent-primary)', boxShadow: '0 0 6px var(--accent-primary)' }}
        />
        <span
          className="text-[9px] font-bold tracking-[0.15em] uppercase"
          style={{ color: 'var(--accent-primary)' }}
        >
          Distribusi Kerawanan
        </span>
      </div>

      {/* Chart */}
      <div className="p-3">
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{
                fill: 'var(--text-tertiary)',
                fontSize: 9,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: 'var(--text-tertiary)',
                fontSize: 9,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomBarTooltip />}
              cursor={{ fill: 'var(--accent-muted)', opacity: 0.3 }}
            />
            <Bar
              dataKey="value"
              radius={[2, 2, 0, 0]}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  fillOpacity={0.85}
                  style={{
                    filter: 'drop-shadow(0 0 4px transparent)',
                    transition: 'all 150ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.fillOpacity = 1
                    e.currentTarget.style.filter = `drop-shadow(0 0 8px ${entry.color})`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.fillOpacity = 0.85
                    e.currentTarget.style.filter = 'drop-shadow(0 0 4px transparent)'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Pie chart distribusi agama ────────────────────────── */
export function AgamaChart({ demografi }) {
  if (!demografi) return null

  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.info,
    CHART_COLORS.purple,
    CHART_COLORS.warning,
    CHART_COLORS.pink,
    CHART_COLORS.gray,
  ]

  const data = [
    { name: 'Islam',   value: Number(demografi.islam    || 0), fill: COLORS[0] },
    { name: 'Kristen', value: Number(demografi.kristen  || 0), fill: COLORS[1] },
    { name: 'Katolik', value: Number(demografi.katolik  || 0), fill: COLORS[2] },
    { name: 'Hindu',   value: Number(demografi.hindu    || 0), fill: COLORS[3] },
    { name: 'Buddha',  value: Number(demografi.buddha   || 0), fill: COLORS[4] },
    { name: 'Lainnya', value: Number(demografi.konghucu || 0) + Number(demografi.lainnya || 0), fill: COLORS[5] },
  ].filter(d => d.value > 0)

  if (data.length === 0) return null

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
          style={{ background: 'var(--color-info)', boxShadow: '0 0 6px var(--color-info)' }}
        />
        <span
          className="text-[9px] font-bold tracking-[0.15em] uppercase"
          style={{ color: 'var(--color-info)' }}
        >
          Komposisi Agama
        </span>
      </div>

      {/* Chart */}
      <div className="p-3">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={38} outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.fill}
                  fillOpacity={0.85}
                  style={{
                    transition: 'all 150ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.fillOpacity = 1
                    e.currentTarget.style.filter = `drop-shadow(0 0 8px ${entry.fill})`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.fillOpacity = 0.85
                    e.currentTarget.style.filter = 'none'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Mini Stat Bar ─────────────────────────────────────── */
export function MiniStatBar({ label, value, max, color = 'var(--accent-primary)' }) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[9px] uppercase tracking-wider w-20 flex-shrink-0"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--surface-muted)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}50`,
          }}
        />
      </div>
      <span
        className="font-mono text-[10px] font-bold w-8 text-right flex-shrink-0"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── Donut Chart ───────────────────────────────────────── */
export function DonutChart({ data, size = 120, strokeWidth = 12 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  let accumulatedOffset = 0

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-muted)"
          strokeWidth={strokeWidth}
        />
        {/* Data segments */}
        {data.map((item, i) => {
          const segmentLength = (item.value / total) * circumference
          const offset = accumulatedOffset
          accumulatedOffset += segmentLength

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 4px ${item.color}50)`,
                transition: 'all 300ms ease-out',
              }}
            />
          )
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size / 5, color: 'var(--accent-primary)' }}
        >
          {total}
        </span>
        <span
          className="text-[8px] uppercase tracking-wider"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Total
        </span>
      </div>
    </div>
  )
}