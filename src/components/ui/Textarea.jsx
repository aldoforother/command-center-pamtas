import { forwardRef, useState } from 'react'

/**
 * Textarea Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Focus: 150ms ease-out
 * - Hover: 100ms ease-out
 *
 * Features:
 * - 3 sizes: sm, md, lg
 * - Auto-resize option
 * - Character count
 * - Full ARIA support
 * - Reduced motion support
 */

const SIZES = {
  sm: {
    minHeight: '80px',
    px: '12px',
    py: '8px',
    textSize: '11px',
  },
  md: {
    minHeight: '100px',
    px: '12px',
    py: '10px',
    textSize: '12px',
  },
  lg: {
    minHeight: '120px',
    px: '14px',
    py: '12px',
    textSize: '13px',
  },
}

export const Textarea = forwardRef(function Textarea({
  label,
  error,
  helper,
  size = 'md',
  disabled = false,
  autoResize = false,
  maxLength,
  showCount = false,
  className = '',
  value,
  defaultValue,
  onChange,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const currentValue = value !== undefined ? value : internalValue
  const charCount = currentValue?.length || 0

  const sizeConfig = SIZES[size] || SIZES.md

  const handleChange = (e) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return

    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(e)

    // Auto-resize
    if (autoResize) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
    }
  }

  const handleFocus = (e) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  // Determine styles based on state
  let borderColor = 'var(--border-subtle)'
  if (error) {
    borderColor = 'var(--border-danger)'
  } else if (isFocused) {
    borderColor = 'var(--border-focus)'
  }

  let background = 'var(--surface-interactive)'
  if (disabled) {
    background = 'var(--surface-muted)'
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label row */}
      {(label || (showCount && maxLength)) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              className="text-label-sm font-medium"
              style={{ color: error ? 'var(--color-danger)' : 'var(--text-secondary)' }}
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span
              className="text-caption-sm"
              style={{ color: charCount >= maxLength ? 'var(--color-danger)' : 'var(--text-tertiary)' }}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Textarea field */}
      <textarea
        ref={ref}
        value={currentValue}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          w-full
          resize-y
          rounded-sm
          transition-all
          duration-150
          focus:outline-none
        `}
        style={{
          minHeight: sizeConfig.minHeight,
          padding: `${sizeConfig.py} ${sizeConfig.px}`,
          fontSize: sizeConfig.textSize,
          lineHeight: 1.5,
          backgroundColor: background,
          border: `1px solid ${borderColor}`,
          color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
          boxShadow: isFocused && !error ? '0 0 0 3px rgba(0,255,136,0.1)' : 'none',
          transitionTimingFunction: 'var(--ease-out)',
          resize: autoResize ? 'none' : 'vertical',
        }}
        placeholder={props.placeholder}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id || 'textarea'}-error` : undefined}
        {...props}
      />

      {/* Helper or Error text */}
      {(helper || error) && (
        <span
          id={`${props.id || 'textarea'}-error`}
          className="text-caption-sm"
          style={{ color: error ? 'var(--color-danger)' : 'var(--text-tertiary)' }}
          role={error ? 'alert' : undefined}
        >
          {error || helper}
        </span>
      )}
    </div>
  )
})

export default Textarea