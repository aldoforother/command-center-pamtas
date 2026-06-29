import { forwardRef, useState } from 'react'

/**
 * Input Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Focus: 150ms ease-out
 * - Hover: 100ms ease-out
 * - Border transition: 100ms ease-out
 *
 * Features:
 * - 3 sizes: sm, md, lg
 * - Leading/trailing icons
 * - Clearable option
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

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const Input = forwardRef(function Input({
  label,
  error,
  helper,
  hint,
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  onClear,
  className = '',
  type = 'text',
  id,
  required,
  name,
  defaultValue,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!defaultValue || !!value)
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const sizeConfig = SIZES[size] || SIZES.md

  const handleChange = (e) => {
    const val = e.target.value
    setHasValue(val.length > 0)
    onChange?.(e)
  }

  const handleClear = () => {
    setHasValue(false)
    onClear?.()
  }

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

  const hasTrailing = (icon && iconPosition === 'right') || (clearable && hasValue && !disabled)
  const hasLeading = icon && iconPosition === 'left'

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

      {/* Input wrapper */}
      <div className="relative">
        {/* Leading icon */}
        {hasLeading && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: iconColor, width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full
            rounded-sm
            transition-all
            duration-100
            focus:outline-none
            ${hasLeading ? 'pl-9' : ''}
            ${hasTrailing ? 'pr-9' : ''}
          `}
          style={{
            height: sizeConfig.height,
            paddingLeft: hasLeading ? undefined : sizeConfig.px,
            paddingRight: hasTrailing ? undefined : sizeConfig.px,
            paddingTop: '0',
            paddingBottom: '0',
            fontSize: sizeConfig.textSize,
            lineHeight: 1.5,
            backgroundColor: background,
            border: `1px solid ${borderColor}`,
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
            boxShadow: isFocused && !error ? '0 0 0 3px rgba(0,255,136,0.1)' : 'none',
            transitionTimingFunction: 'var(--ease-out)',
            caretColor: 'var(--accent-primary)',
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : (helper ? helperId : undefined)}
          aria-required={required}
          {...props}
        />

        {/* Trailing icon or clear button */}
        {hasTrailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {clearable && hasValue && !disabled ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center p-0.5 rounded-sm transition-all duration-100 cursor-pointer"
                style={{
                  color: 'var(--text-tertiary)',
                  width: sizeConfig.iconSize,
                  height: sizeConfig.iconSize,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                aria-label="Clear input"
              >
                <CloseIcon />
              </button>
            ) : (
              <span style={{ color: iconColor, width: sizeConfig.iconSize, height: sizeConfig.iconSize }}>
                {icon}
              </span>
            )}
          </span>
        )}
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

/**
 * InputGroup - Input with prefix/suffix
 */
export function InputGroup({
  prefix,
  suffix,
  children,
  className = '',
}) {
  return (
    <div className={`flex items-center ${className}`}>
      {prefix && (
        <span
          className="px-3 py-2 rounded-l-sm border border-r-0"
          style={{
            backgroundColor: 'var(--surface-muted)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-tertiary)',
            fontSize: '12px',
          }}
        >
          {prefix}
        </span>
      )}
      <div className="flex-1">
        {children}
      </div>
      {suffix && (
        <span
          className="px-3 py-2 rounded-r-sm border border-l-0"
          style={{
            backgroundColor: 'var(--surface-muted)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-tertiary)',
            fontSize: '12px',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}

export default Input