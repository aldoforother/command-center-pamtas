import { useState, useEffect } from 'react'

/**
 * Progress Component - Feedback Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Bar transition: 300ms ease-out
 * - Indeterminate: 1.5s linear infinite
 *
 * Features:
 * - Determinate and indeterminate states
 * - 4 variants: default, success, warning, danger
 * - Labeled and unlabeled
 * - Size options
 * - ProgressCircle for circular variant
 */

// Progress sizes
const SIZE_STYLES = {
  sm: { height: '4px', labelSize: 'text-micro-xs' },
  md: { height: '6px', labelSize: 'text-micro' },
  lg: { height: '8px', labelSize: 'text-micro' },
}

// Progress variants
const VARIANT_STYLES = {
  default: 'var(--accent-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
}

/**
 * Progress - Progress bar component
 */
export function Progress({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  label,
  showValue = false,
  indeterminate = false,
  className = '',
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const percentage = Math.min(100, Math.max(0, (animatedValue / max) * 100))
  const color = VARIANT_STYLES[variant] || VARIANT_STYLES.default
  const s = SIZE_STYLES[size] || SIZE_STYLES.md

  // Animate value changes
  useEffect(() => {
    if (indeterminate) return

    const duration = 300
    const startValue = animatedValue
    const diff = value - startValue
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setAnimatedValue(startValue + diff * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <div className={`w-full ${className}`}>
      {/* Label row */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span
              className={`${s.labelSize} font-medium uppercase tracking-wider`}
              style={{ color: 'var(--text-secondary)' }}
            >
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span
              className={`${s.labelSize} font-mono`}
              style={{ color: 'var(--text-tertiary)' }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: s.height,
          backgroundColor: 'var(--surface-muted)',
        }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        {/* Bar */}
        <div
          className={`
            h-full rounded-full
            ${indeterminate ? 'animate-progress-indeterminate' : ''}
          `}
          style={{
            width: indeterminate ? '100%' : `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`,
            transition: indeterminate ? 'none' : 'width 300ms ease-out',
          }}
        />
      </div>
    </div>
  )
}

/**
 * ProgressCircle - Circular progress indicator
 */
export function ProgressCircle({
  value = 0,
  max = 100,
  size = 48,
  strokeWidth = 4,
  variant = 'default',
  showValue = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const color = VARIANT_STYLES[variant] || VARIANT_STYLES.default
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
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
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 300ms ease-out',
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
        />
      </svg>
      {showValue && (
        <span
          className="absolute text-micro font-mono font-bold"
          style={{ color }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}

/**
 * ProgressGroup - Multiple progress bars
 */
export function ProgressGroup({
  items = [],
  className = '',
  size = 'md',
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <Progress
          key={item.id || index}
          value={item.value}
          max={item.max}
          label={item.label}
          variant={item.variant}
          size={size}
          showValue={item.showValue}
          indeterminate={item.indeterminate}
        />
      ))}
    </div>
  )
}