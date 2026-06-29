import { forwardRef, useState } from 'react'

/**
 * Switch Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Toggle animation: 200ms ease-out
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
    width: '32px',
    height: '18px',
    thumbSize: '12px',
    thumbOffset: '3px',
    gap: '8px',
    textSize: 'text-label-sm',
  },
  md: {
    width: '40px',
    height: '22px',
    thumbSize: '16px',
    thumbOffset: '3px',
    gap: '10px',
    textSize: 'text-label',
  },
  lg: {
    width: '48px',
    height: '26px',
    thumbSize: '20px',
    thumbOffset: '3px',
    gap: '12px',
    textSize: 'text-body-sm',
  },
}

export const Switch = forwardRef(function Switch({
  label,
  checked = false,
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
  const inputId = id || `switch-${Math.random().toString(36).substr(2, 9)}`

  const handleChange = (e) => {
    if (!disabled) {
      onChange?.(e)
    }
  }

  // Calculate thumb position
  const thumbTranslate = checked
    ? `translateX(calc(${sizeConfig.width} - ${sizeConfig.thumbSize} - ${sizeConfig.thumbOffset} * 2))`
    : `translateX(${sizeConfig.thumbOffset})`

  // Determine colors
  const getTrackStyles = () => {
    if (disabled) {
      return {
        bg: 'var(--surface-muted)',
        border: 'var(--border-subtle)',
        thumbBg: 'var(--text-disabled)',
      }
    }
    if (checked) {
      return {
        bg: 'var(--accent-primary)',
        border: 'var(--accent-primary)',
        thumbBg: 'var(--surface-base)',
      }
    }
    if (isFocused) {
      return {
        bg: 'var(--surface-interactive)',
        border: 'var(--border-focus)',
        thumbBg: 'var(--text-secondary)',
      }
    }
    if (isHovered) {
      return {
        bg: 'var(--surface-interactive)',
        border: 'var(--border-strong)',
        thumbBg: 'var(--text-secondary)',
      }
    }
    return {
      bg: 'var(--surface-interactive)',
      border: 'var(--border-default)',
      thumbBg: 'var(--text-secondary)',
    }
  }

  const trackStyles = getTrackStyles()

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
        role="switch"
        aria-checked={checked}
        aria-invalid={!!error}
        {...props}
      />

      {/* Track */}
      <span
        className="flex-shrink-0 rounded-full relative transition-all duration-200"
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          backgroundColor: trackStyles.bg,
          border: `1px solid ${trackStyles.border}`,
          boxShadow: isFocused && !disabled ? '0 0 0 3px rgba(0,255,136,0.15)' : 'none',
          transitionTimingFunction: 'var(--ease-out)',
        }}
      >
        {/* Thumb */}
        <span
          className="absolute top-1/2 rounded-full transition-all duration-200"
          style={{
            width: sizeConfig.thumbSize,
            height: sizeConfig.thumbSize,
            backgroundColor: trackStyles.thumbBg,
            transform: thumbTranslate,
            marginTop: `-${parseInt(sizeConfig.thumbSize) / 2}px`,
            transitionTimingFunction: 'var(--ease-out)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
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
 * SwitchGroup - Group of switches
 */
export function SwitchGroup({
  label,
  items = [],
  value = {},
  onChange,
  disabled = false,
  error,
  className = '',
}) {
  const handleChange = (itemKey, checked) => {
    onChange?.({
      ...value,
      [itemKey]: checked,
    })
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <span
          className="text-label-sm font-medium"
          style={{ color: error ? 'var(--color-danger)' : 'var(--text-secondary)' }}
        >
          {label}
        </span>
      )}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Switch
            key={item.key}
            label={item.label}
            checked={!!value[item.key]}
            disabled={disabled || item.disabled}
            onChange={(e) => handleChange(item.key, e.target.checked)}
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

export default Switch