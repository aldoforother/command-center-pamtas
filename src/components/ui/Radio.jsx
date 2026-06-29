import { forwardRef, useState } from 'react'

/**
 * Radio Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Select animation: 150ms ease-out
 * - Hover: 100ms ease-out
 * - Focus: 100ms ease-out
 *
 * Features:
 * - 3 sizes: sm, md, lg
 * - Full ARIA support
 * - Reduced motion support
 */

const SIZES = {
  sm: {
    boxSize: '14px',
    dotSize: '6px',
    gap: '6px',
    textSize: 'text-label-sm',
  },
  md: {
    boxSize: '16px',
    dotSize: '8px',
    gap: '8px',
    textSize: 'text-label',
  },
  lg: {
    boxSize: '18px',
    dotSize: '10px',
    gap: '10px',
    textSize: 'text-body-sm',
  },
}

export const Radio = forwardRef(function Radio({
  label,
  checked = false,
  disabled = false,
  error,
  size = 'md',
  name,
  onChange,
  value,
  className = '',
  id,
  ...props
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const sizeConfig = SIZES[size] || SIZES.md
  const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

  const handleChange = (e) => {
    if (!disabled) {
      onChange?.(e)
    }
  }

  // Determine colors
  const getBoxStyles = () => {
    if (disabled) {
      return {
        border: 'var(--border-subtle)',
        dotBg: 'var(--text-disabled)',
      }
    }
    if (checked) {
      return {
        border: 'var(--accent-primary)',
        dotBg: 'var(--accent-primary)',
      }
    }
    if (isFocused) {
      return {
        border: 'var(--border-focus)',
        dotBg: 'var(--text-disabled)',
      }
    }
    if (isHovered) {
      return {
        border: 'var(--border-strong)',
        dotBg: 'var(--text-disabled)',
      }
    }
    return {
      border: 'var(--border-default)',
      dotBg: 'var(--text-disabled)',
    }
  }

  const boxStyles = getBoxStyles()

  return (
    <label
      className={`
        inline-flex items-center
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden actual radio */}
      <input
        ref={ref}
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="sr-only"
        aria-invalid={!!error}
        {...props}
      />

      {/* Custom radio circle */}
      <span
        className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-100"
        style={{
          width: sizeConfig.boxSize,
          height: sizeConfig.boxSize,
          backgroundColor: 'var(--surface-interactive)',
          border: `2px solid ${boxStyles.border}`,
          boxShadow: isFocused && !disabled ? '0 0 0 3px rgba(0,255,136,0.15)' : 'none',
          transitionTimingFunction: 'var(--ease-out)',
        }}
      >
        {checked && (
          <span
            className="rounded-full transition-all duration-150"
            style={{
              width: sizeConfig.dotSize,
              height: sizeConfig.dotSize,
              backgroundColor: boxStyles.dotBg,
              transitionTimingFunction: 'var(--ease-out)',
            }}
          />
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
 * RadioGroup - Group of radio buttons
 */
export function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  className = '',
  name,
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} role="radiogroup" aria-label={label}>
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
          <Radio
            key={option.value}
            label={option.label}
            value={option.value}
            name={name || `radio-group-${Math.random().toString(36).substr(2, 9)}`}
            checked={value === option.value}
            disabled={disabled || option.disabled}
            onChange={(e) => onChange?.(e.target.value)}
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

export default Radio