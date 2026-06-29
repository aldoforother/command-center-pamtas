import { forwardRef, useState } from 'react'

/**
 * Select Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Focus: 150ms ease-out
 * - Hover: 100ms ease-out
 * - Border transition: 100ms ease-out
 *
 * Features:
 * - 3 sizes: sm, md, lg
 * - Custom dropdown styling
 * - Full ARIA support
 * - Reduced motion support
 */

const SIZES = {
  sm: {
    height: '32px',
    px: '12px',
    textSize: '11px',
    iconSize: '14px',
  },
  md: {
    height: '36px',
    px: '12px',
    textSize: '12px',
    iconSize: '16px',
  },
  lg: {
    height: '44px',
    px: '14px',
    textSize: '13px',
    iconSize: '18px',
  },
}

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const Select = forwardRef(function Select({
  label,
  error,
  helper,
  hint,
  size = 'md',
  disabled = false,
  options = [],
  placeholder = 'Pilih...',
  className = '',
  id,
  required,
  name,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false)
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const sizeConfig = SIZES[size] || SIZES.md

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  // Determine border color based on state
  let borderColor = 'var(--border-subtle)'
  if (error) {
    borderColor = 'var(--border-danger)'
  } else if (isFocused) {
    borderColor = 'var(--border-focus)'
  }

  // Determine background based on state
  let background = 'var(--surface-interactive)'
  if (disabled) {
    background = 'var(--surface-muted)'
  }

  // Icon color
  let iconColor = 'var(--text-tertiary)'
  if (isFocused && !error) {
    iconColor = 'var(--accent-primary)'
  }
  if (error) {
    iconColor = 'var(--color-danger)'
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-label-sm font-medium"
          style={{ color: error ? 'var(--color-danger)' : 'var(--text-secondary)' }}
        >
          {label}
          {required && <span className="text-color-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Select wrapper */}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          name={name}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          className={`
            w-full
            appearance-none
            rounded-sm
            transition-all
            duration-100
            focus:outline-none
            pr-9
          `}
          style={{
            height: sizeConfig.height,
            paddingLeft: sizeConfig.px,
            paddingRight: sizeConfig.px,
            paddingTop: '0',
            paddingBottom: '0',
            fontSize: sizeConfig.textSize,
            lineHeight: 1.5,
            backgroundColor: background,
            border: `1px solid ${borderColor}`,
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
            boxShadow: isFocused && !error ? '0 0 0 3px rgba(0,255,136,0.1)' : 'none',
            transitionTimingFunction: 'var(--ease-out)',
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : (helper ? helperId : undefined)}
          aria-required={required}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              style={{
                backgroundColor: 'var(--surface-interactive)',
                color: 'var(--text-primary)',
              }}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown icon */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: iconColor, width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
          aria-hidden="true"
        >
          <ChevronDownIcon />
        </span>
      </div>

      {/* Helper or Error text */}
      {(helper || error || hint) && (
        <span
          id={error ? errorId : helperId}
          className="text-caption-sm"
          style={{ color: error ? 'var(--color-danger)' : 'var(--text-tertiary)' }}
          role={error ? 'alert' : undefined}
        >
          {error || helper || hint}
        </span>
      )}
    </div>
  )
})

export default Select