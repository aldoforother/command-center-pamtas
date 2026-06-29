import { forwardRef, useState } from 'react'

/**
 * Checkbox Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Check animation: 150ms ease-out
 * - Hover: 100ms ease-out
 * - Focus: 100ms ease-out
 *
 * Features:
 * - 3 sizes: sm, md, lg
 * - Indeterminate state
 * - Full ARIA support
 * - Reduced motion support
 */

const SIZES = {
  sm: {
    boxSize: '14px',
    iconSize: '10px',
    gap: '6px',
    textSize: 'text-label-sm',
  },
  md: {
    boxSize: '16px',
    iconSize: '12px',
    gap: '8px',
    textSize: 'text-label',
  },
  lg: {
    boxSize: '18px',
    iconSize: '14px',
    gap: '10px',
    textSize: 'text-body-sm',
  },
}

const CheckIcon = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IndeterminateIcon = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const Checkbox = forwardRef(function Checkbox({
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  error,
  size = 'md',
  onChange,
  className = '',
  id,
  ...props
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const sizeConfig = SIZES[size] || SIZES.md
  const isChecked = checked || indeterminate
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  const handleChange = (e) => {
    if (!disabled) {
      onChange?.(e)
    }
  }

  // Determine colors
  const getBoxStyles = () => {
    if (disabled) {
      return {
        bg: 'var(--surface-muted)',
        border: 'var(--border-subtle)',
        color: 'var(--text-disabled)',
      }
    }
    if (isChecked) {
      return {
        bg: 'var(--accent-primary)',
        border: 'var(--accent-primary)',
        color: 'var(--surface-base)',
      }
    }
    if (isFocused) {
      return {
        bg: 'var(--surface-interactive)',
        border: 'var(--border-focus)',
        color: 'var(--text-disabled)',
      }
    }
    if (isHovered) {
      return {
        bg: 'var(--surface-interactive)',
        border: 'var(--border-strong)',
        color: 'var(--text-disabled)',
      }
    }
    return {
      bg: 'var(--surface-interactive)',
      border: 'var(--border-default)',
      color: 'var(--text-disabled)',
    }
  }

  const boxStyles = getBoxStyles()

  return (
    <label
      className={`
        inline-flex items-${sizeConfig.gap === '6px' ? 'center' : 'center'}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden actual checkbox */}
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="sr-only"
        aria-invalid={!!error}
        aria-checked={indeterminate ? 'mixed' : checked}
        {...props}
      />

      {/* Custom checkbox box */}
      <span
        className="flex-shrink-0 flex items-center justify-center rounded-sm transition-all duration-100"
        style={{
          width: sizeConfig.boxSize,
          height: sizeConfig.boxSize,
          backgroundColor: boxStyles.bg,
          border: `1px solid ${boxStyles.border}`,
          boxShadow: isFocused && !disabled ? '0 0 0 3px rgba(0,255,136,0.15)' : 'none',
          transitionTimingFunction: 'var(--ease-out)',
        }}
      >
        {isChecked && !indeterminate && (
          <CheckIcon size={sizeConfig.iconSize} color={boxStyles.color} />
        )}
        {indeterminate && (
          <IndeterminateIcon size={sizeConfig.iconSize} color={boxStyles.color} />
        )}
      </span>

      {/* Label text */}
      {label && (
        <span
          className={sizeConfig.textSize}
          style={{ color: error ? 'var(--color-danger)' : 'var(--text-primary)' }}
        >
          {label}
        </span>
      )}
    </label>
  )
})

/**
 * CheckboxGroup - Group of checkboxes
 */
export function CheckboxGroup({
  label,
  options = [],
  value = [],
  onChange,
  disabled = false,
  error,
  className = '',
}) {
  const handleChange = (optionValue, checked) => {
    if (checked) {
      onChange?.([...value, optionValue])
    } else {
      onChange?.(value.filter(v => v !== optionValue))
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span
          className="text-label-sm font-medium"
          style={{ color: error ? 'var(--color-danger)' : 'var(--text-secondary)' }}
        >
          {label}
        </span>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            disabled={disabled || option.disabled}
            onChange={(e) => handleChange(option.value, e.target.checked)}
          />
        ))}
      </div>
      {error && (
        <span className="text-caption-sm" style={{ color: 'var(--color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  )
}

export default Checkbox