import { forwardRef, useState } from 'react'

/**
 * Panel Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Collapsible: 150ms ease-out
 * - No other animations (static container)
 *
 * Features:
 * - 3 variants: default, elevated, flush
 * - PanelHeader, PanelContent, PanelFooter, PanelSection sub-components
 * - Collapsible section support
 */

const VARIANTS = {
  default: {
    bg: 'var(--surface-primary)',
    border: 'var(--border-subtle)',
  },
  elevated: {
    bg: 'var(--surface-secondary)',
    border: 'var(--border-default)',
  },
  flush: {
    bg: 'transparent',
    border: 'transparent',
  },
}

/**
 * Panel - Main container
 */
export const Panel = forwardRef(function Panel({
  variant = 'default',
  children,
  className = '',
  padding = false,
  ...props
}, ref) {
  const variantConfig = VARIANTS[variant] || VARIANTS.default

  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundColor: variantConfig.bg,
        border: `1px solid ${variantConfig.border}`,
        borderRadius: 'var(--radius-none)',
        boxShadow: variant === 'elevated' ? 'var(--shadow-md)' : 'none',
        ...(padding ? { padding: 'var(--space-4)' } : {}),
      }}
      {...props}
    >
      {children}
    </div>
  )
})

/**
 * PanelHeader - Panel header section
 */
export function PanelHeader({
  icon,
  title,
  badge,
  actions,
  subtitle,
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${className}`}
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
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {title && (
              <h2
                className="text-label-sm font-bold tracking-wider uppercase truncate"
                style={{ color: 'var(--accent-primary)' }}
              >
                {title}
              </h2>
            )}
            {badge}
          </div>
          {subtitle && (
            <p
              className="text-micro font-medium tracking-wider uppercase mt-0.5 truncate"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

/**
 * PanelContent - Scrollable content area
 */
export function PanelContent({
  children,
  className = '',
  scrollable = true,
  padding = true,
}) {
  return (
    <div
      className={`
        ${padding ? 'p-4' : ''}
        ${scrollable ? 'overflow-y-auto' : ''}
        ${className}
      `}
      style={{
        maxHeight: scrollable ? 'calc(100vh - 200px)' : undefined,
      }}
    >
      {children}
    </div>
  )
}

/**
 * PanelFooter - Panel footer section
 */
export function PanelFooter({
  children,
  actions,
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-end gap-2 px-4 py-3 ${className}`}
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
 * PanelSection - Section within panel
 */
export function PanelSection({
  title,
  children,
  className = '',
  collapsible = false,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={className}>
      {title && (
        <button
          type="button"
          onClick={() => collapsible && setIsOpen(!isOpen)}
          className={`
            flex items-center justify-between w-full px-4 py-2.5
            ${collapsible ? 'cursor-pointer' : ''}
            transition-colors duration-100
          `}
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
          aria-expanded={collapsible ? isOpen : undefined}
        >
          <span
            className="text-label-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </span>
          {collapsible && (
            <span
              className="transition-transform duration-150"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                color: 'var(--text-tertiary)',
              }}
              aria-hidden="true"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          )}
        </button>
      )}
      {(!collapsible || isOpen) && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default Panel