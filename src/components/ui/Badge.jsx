import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

/**
 * Badge Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Dot pulse: 2s ease-in-out infinite
 * - No other animations (static element)
 *
 * Features:
 * - 10+ variants with full CSS tokens
 * - StatusDot component for standalone indicators
 * - KerawananBadge for category display
 * - Dot indicator with optional pulse
 */

const VARIANTS = {
  default: {
    bg: 'var(--surface-muted)',
    border: 'var(--surface-muted)',
    text: 'var(--text-tertiary)',
  },
  success: {
    bg: 'var(--color-success-subtle)',
    border: 'var(--color-success-subtle)',
    text: 'var(--color-success)',
  },
  warning: {
    bg: 'var(--color-warning-subtle)',
    border: 'var(--color-warning-subtle)',
    text: 'var(--color-warning)',
  },
  danger: {
    bg: 'var(--color-danger-subtle)',
    border: 'var(--color-danger-subtle)',
    text: 'var(--color-danger)',
  },
  info: {
    bg: 'var(--color-info-subtle)',
    border: 'var(--color-info-subtle)',
    text: 'var(--color-info)',
  },
  accent: {
    bg: 'var(--accent-muted)',
    border: 'var(--accent-muted)',
    text: 'var(--accent-primary)',
  },
  purple: {
    bg: 'var(--color-purple-subtle)',
    border: 'var(--color-purple-subtle)',
    text: 'var(--color-purple)',
  },
  orange: {
    bg: 'var(--color-orange-subtle)',
    border: 'var(--color-orange-subtle)',
    text: 'var(--color-orange)',
  },
  pink: {
    bg: 'var(--color-pink-subtle)',
    border: 'var(--color-pink-subtle)',
    text: 'var(--color-pink)',
  },
  gray: {
    bg: 'var(--color-gray-subtle)',
    border: 'var(--color-gray-subtle)',
    text: 'var(--color-gray)',
  },
}

/**
 * Badge - Status indicator with semantic colors
 *
 * @param {Object} props
 * @param {string} props.variant - Badge variant (default, success, warning, danger, info, accent, purple, orange, pink, gray)
 * @param {React.ReactNode} props.children - Badge content
 * @param {boolean} props.dot - Show dot indicator
 * @param {boolean} props.pulse - Pulse animation for dot
 * @param {string} props.className - Additional classes
 */
export function Badge({
  variant = 'default',
  children,
  dot = false,
  pulse = false,
  className = '',
  style,
  ...props
}) {
  // Resolve variant
  const resolvedVariant = VARIANTS[variant] || VARIANTS.default

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      style={{
        fontSize: 'var(--text-micro)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '2px 7px',
        borderRadius: 'var(--radius-badge)',
        border: `1px solid ${resolvedVariant.border}`,
        backgroundColor: resolvedVariant.bg,
        color: resolvedVariant.text,
        lineHeight: 1.2,
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: resolvedVariant.text,
            boxShadow: pulse ? `0 0 4px ${resolvedVariant.text}` : 'none',
            animation: pulse ? 'statusPulse 2s ease-in-out infinite' : 'none',
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

/**
 * KerawananBadge - Specialized badge for kerawanan categories
 *
 * @param {Object} props
 * @param {string} props.kategori - Category ID
 */
export function KerawananBadge({ kategori }) {
  const cat = KERAWANAN_CATEGORIES.find(c => c.id === kategori)
  const label = cat?.label || kategori || '?'
  const variant = cat?.badgeVariant || 'default'

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  )
}

/**
 * StatusDot - Standalone status indicator
 *
 * @param {Object} props
 * @param {string} props.status - Status type (active, danger, warning, info, success, inactive)
 * @param {string} props.size - Dot size (sm, md, lg)
 * @param {boolean} props.pulse - Enable pulse animation
 */
export function StatusDot({
  status = 'active',
  size = 'md',
  pulse = true,
  className = '',
  style,
}) {
  const statusColors = {
    active: 'var(--accent-primary)',
    danger: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    success: 'var(--color-success)',
    inactive: 'var(--text-disabled)',
  }

  const sizeMap = {
    sm: { width: '4px', height: '4px' },
    md: { width: '6px', height: '6px' },
    lg: { width: '8px', height: '8px' },
  }

  const color = statusColors[status] || statusColors.active
  const shouldPulse = status !== 'inactive' && pulse
  const sizeConfig = sizeMap[size] || sizeMap.md

  return (
    <span
      className={`rounded-full flex-shrink-0 ${className}`}
      style={{
        width: sizeConfig.width,
        height: sizeConfig.height,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
        animation: shouldPulse ? 'statusPulse 2s ease-in-out infinite' : 'none',
        ...style,
      }}
      role="img"
      aria-label={`Status: ${status}`}
    />
  )
}

/**
 * BadgeGroup - Group of badges
 */
export function BadgeGroup({
  badges = [],
  className = '',
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map((badge, index) => (
        <Badge
          key={badge.key || index}
          variant={badge.variant}
          dot={badge.dot}
          pulse={badge.pulse}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  )
}

export default Badge