import { forwardRef, useState } from 'react'

/**
 * Card Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Hover lift: 150ms ease-out (interactive variant)
 * - Scale on press: 50ms ease-out
 * - No other animations (static container)
 *
 * Features:
 * - 4 variants: surface, elevated, interactive, metric
 * - CardHeader, CardContent, CardFooter sub-components
 * - StatCard for metrics display
 * - Hover lift effect for interactive variant
 */

const VARIANTS = {
  surface: {
    bg: 'var(--surface-primary)',
    border: 'var(--border-subtle)',
    shadow: 'none',
  },
  elevated: {
    bg: 'var(--surface-secondary)',
    border: 'var(--border-default)',
    shadow: 'var(--shadow-md)',
  },
  interactive: {
    bg: 'var(--surface-primary)',
    border: 'var(--border-default)',
    shadow: 'none',
  },
  metric: {
    bg: 'var(--surface-primary)',
    border: 'none',
    shadow: 'none',
  },
}

/**
 * Card - Main container
 */
export const Card = forwardRef(function Card({
  variant = 'surface',
  children,
  className = '',
  padding = true,
  hoverable = false,
  onClick,
  ...props
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const variantConfig = VARIANTS[variant] || VARIANTS.surface
  const isInteractive = variant === 'interactive' || hoverable || !!onClick
  const Component = isInteractive ? 'button' : 'div'

  // Determine current styles
  let currentStyles = {
    bg: variantConfig.bg,
    border: variantConfig.border,
    shadow: variantConfig.shadow,
  }

  if (isInteractive && isPressed) {
    currentStyles = {
      bg: 'var(--surface-secondary)',
      border: 'var(--border-strong)',
      shadow: 'var(--shadow-lg)',
    }
  } else if (isInteractive && isHovered) {
    currentStyles = {
      bg: 'var(--surface-secondary)',
      border: 'var(--border-strong)',
      shadow: 'var(--shadow-md)',
    }
  }

  return (
    <Component
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => isInteractive && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        ${isInteractive ? 'cursor-pointer text-left w-full' : ''}
        ${padding ? 'p-4' : ''}
        ${isInteractive ? 'transition-all duration-150' : ''}
        ${className}
      `}
      style={{
        backgroundColor: currentStyles.bg,
        border: `1px solid ${currentStyles.border}`,
        borderRadius: 'var(--radius-none)',
        boxShadow: currentStyles.shadow,
        transform: isPressed ? 'scale(0.99)' : 'none',
        transitionTimingFunction: 'var(--ease-out)',
      }}
      {...props}
    >
      {children}
    </Component>
  )
})

/**
 * CardHeader - Card header section
 */
export function CardHeader({
  icon,
  title,
  badge,
  actions,
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-between pb-3 mb-3 ${className}`}
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span
            className="w-4 h-4 flex-shrink-0"
            style={{ color: 'var(--accent-primary)' }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {title && (
          <h3
            className="text-label-sm font-bold tracking-wider uppercase truncate"
            style={{ color: 'var(--accent-primary)' }}
          >
            {title}
          </h3>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {badge}
        {actions}
      </div>
    </div>
  )
}

/**
 * CardContent - Card content section
 */
export function CardContent({
  children,
  className = '',
}) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

/**
 * CardFooter - Card footer section
 */
export function CardFooter({
  children,
  actions,
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-between pt-3 mt-3 ${className}`}
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      {children}
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

/**
 * StatCard - Metric display card
 */
export function StatCard({
  label,
  value,
  trend,
  trendDirection = 'up',
  icon,
  variant = 'surface',
  className = '',
}) {
  const trendColor = trendDirection === 'up'
    ? 'var(--color-success)'
    : trendDirection === 'down'
      ? 'var(--color-danger)'
      : 'var(--text-tertiary)'

  const TrendIcon = trendDirection === 'up' ? (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ) : trendDirection === 'down' ? (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ) : (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )

  return (
    <Card variant={variant} className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className="text-micro font-semibold tracking-widest uppercase mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {label}
          </p>

          {/* Value */}
          <p
            className="font-mono text-display-sm font-bold leading-none"
            style={{
              color: 'var(--accent-primary)',
              textShadow: 'var(--shadow-glow)',
            }}
          >
            {value}
          </p>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span style={{ color: trendColor }}>
                {TrendIcon}
              </span>
              <span
                className="text-caption-sm font-medium"
                style={{ color: trendColor }}
              >
                {trend}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{
              background: 'var(--accent-muted)',
              color: 'var(--accent-primary)',
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card