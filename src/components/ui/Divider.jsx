/**
 * Divider Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - No animation (static element)
 *
 * Features:
 * - Horizontal and vertical orientations
 * - 3 variants: subtle, default, strong
 * - With or without label
 * - Customizable spacing
 */

const ORIENTATIONS = {
  horizontal: 'h-px w-full',
  vertical: 'h-full w-px',
}

const VARIANTS = {
  subtle: 'var(--border-subtle)',
  default: 'var(--border-default)',
  strong: 'var(--border-strong)',
}

export function Divider({
  orientation = 'horizontal',
  variant = 'default',
  label,
  className = '',
  style,
  ...props
}) {
  const orientationClass = ORIENTATIONS[orientation] || ORIENTATIONS.horizontal
  const color = VARIANTS[variant] || VARIANTS.default

  if (label) {
    return (
      <div
        className={`
          flex items-center gap-3
          ${orientation === 'vertical' ? 'flex-col h-full' : 'w-full'}
          ${className}
        `}
        role="separator"
        aria-orientation={orientation}
        {...props}
      >
        {/* Left line */}
        <div
          className="flex-1"
          style={{
            height: orientation === 'horizontal' ? '1px' : undefined,
            width: orientation === 'vertical' ? '1px' : undefined,
            backgroundColor: color,
          }}
        />

        {/* Label */}
        <span
          className="text-caption-sm font-medium whitespace-nowrap"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </span>

        {/* Right line */}
        <div
          className="flex-1"
          style={{
            height: orientation === 'horizontal' ? '1px' : undefined,
            width: orientation === 'vertical' ? '1px' : undefined,
            backgroundColor: color,
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${orientationClass} ${className}`}
      role="separator"
      aria-orientation={orientation}
      style={{
        backgroundColor: color,
        ...style,
      }}
      {...props}
    />
  )
}

/**
 * Space Divider - Visual spacer with optional label
 */
export function SpaceDivider({
  label,
  className = '',
  size = 'md',
}) {
  const spacingMap = {
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
  }

  if (label) {
    return (
      <div className={`flex items-center gap-3 ${spacingMap[size]} ${className}`}>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
        <span className="text-caption-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
      </div>
    )
  }

  return (
    <div className={`${spacingMap[size]} ${className}`} />
  )
}

export default Divider