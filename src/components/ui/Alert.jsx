import { useState } from 'react'

/**
 * Alert Component - Feedback Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Entrance: 200ms ease-out
 * - Dismiss: 150ms ease-out
 * - Icon animation: subtle pulse for important alerts
 *
 * Features:
 * - 4 variants: info, success, warning, danger
 * - Dismissible option
 * - Optional icon
 * - Full ARIA support
 */

// Alert styles per variant
const ALERT_STYLES = {
  info: {
    bg: 'var(--color-info-subtle)',
    border: 'var(--color-info)',
    color: 'var(--color-info)',
    icon: 'info',
  },
  success: {
    bg: 'var(--color-success-subtle)',
    border: 'var(--color-success)',
    color: 'var(--color-success)',
    icon: 'check',
  },
  warning: {
    bg: 'var(--color-warning-subtle)',
    border: 'var(--color-warning)',
    color: 'var(--color-warning)',
    icon: 'alert',
  },
  danger: {
    bg: 'var(--color-danger-subtle)',
    border: 'var(--color-danger)',
    color: 'var(--color-danger)',
    icon: 'x',
  },
}

// SVG Icons
const Icons = {
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  alert: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2-2l-2 2m0-2l2-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
}

/**
 * Alert - Inline alert/notification component
 */
export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const s = ALERT_STYLES[variant] || ALERT_STYLES.info

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, 150)
  }

  if (!isVisible) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        relative px-4 py-3 rounded-sm
        transition-all duration-150
        ${isExiting ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0 animate-fade-in'}
        ${className}
      `}
      style={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        transitionTimingFunction: 'var(--ease-out)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span
          className="flex-shrink-0 mt-0.5"
          style={{ color: s.color }}
        >
          {icon || Icons[s.icon]}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4
              className="text-label-sm font-semibold mb-1"
              style={{ color: s.color }}
            >
              {title}
            </h4>
          )}
          {children && (
            <div className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
              {children}
            </div>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-sm transition-colors duration-100"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = s.color}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            aria-label="Tutup"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l"
        style={{ backgroundColor: s.border }}
      />
    </div>
  )
}

/**
 * AlertTitle - Helper for structured alert content
 */
export function AlertTitle({ children, className = '' }) {
  return (
    <div className={`font-semibold text-label-sm ${className}`}>
      {children}
    </div>
  )
}

/**
 * AlertDescription - Helper for structured alert content
 */
export function AlertDescription({ children, className = '' }) {
  return (
    <div className={`text-body-sm ${className}`} style={{ color: 'var(--text-secondary)' }}>
      {children}
    </div>
  )
}

/**
 * AlertLink - Link inside alert
 */
export function AlertLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`underline hover:no-underline ${className}`}
      style={{ color: 'inherit' }}
    >
      {children}
    </a>
  )
}

export default Alert