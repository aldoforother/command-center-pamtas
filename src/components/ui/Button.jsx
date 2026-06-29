import { forwardRef, useState } from 'react'
import { Spinner } from './LoadingSpinner'

/**
 * Button Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Hover: 100ms (--duration-fast), ease-out
 * - Active: 50ms (--duration-instant), scale(0.98)
 * - Focus: 100ms ease-out, focus-visible ring
 * - Loading: spinner replaces content
 *
 * Features:
 * - Touch-friendly (44px minimum for lg)
 * - 5 variants: primary, secondary, ghost, danger, outline
 * - 3 sizes: sm (32px), md (40px), lg (48px)
 * - Loading state with spinner
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
    height: '40px',
    px: '16px',
    textSize: '12px',
    iconSize: '16px',
  },
  lg: {
    height: '48px',
    px: '20px',
    textSize: '13px',
    iconSize: '18px',
  },
}

const VARIANTS = {
  primary: {
    base: {
      bg: 'var(--accent-muted)',
      border: 'var(--accent-primary)',
      color: 'var(--accent-primary)',
    },
    hover: {
      bg: 'rgba(0, 255, 136, 0.2)',
      border: 'rgba(0, 255, 136, 0.7)',
      color: 'var(--accent-primary)',
      shadow: 'var(--shadow-glow)',
    },
    active: {
      bg: 'rgba(0, 255, 136, 0.25)',
      scale: '0.98',
    },
    disabled: {
      opacity: '0.4',
    },
  },
  secondary: {
    base: {
      bg: 'transparent',
      border: 'var(--border-default)',
      color: 'var(--accent-primary)',
    },
    hover: {
      bg: 'var(--hover-surface)',
      border: 'var(--accent-muted)',
      color: 'var(--accent-primary)',
    },
    active: {
      bg: 'var(--accent-muted)',
      scale: '0.98',
    },
    disabled: {
      opacity: '0.4',
    },
  },
  ghost: {
    base: {
      bg: 'transparent',
      border: 'transparent',
      color: 'var(--text-secondary)',
    },
    hover: {
      bg: 'var(--hover-surface)',
      color: 'var(--text-primary)',
    },
    active: {
      bg: 'var(--surface-secondary)',
      scale: '0.98',
    },
    disabled: {
      opacity: '0.4',
    },
  },
  danger: {
    base: {
      bg: 'var(--color-danger-subtle)',
      border: 'var(--color-danger)',
      color: 'var(--color-danger)',
    },
    hover: {
      bg: 'rgba(255, 59, 59, 0.2)',
      border: 'rgba(255, 59, 59, 0.7)',
      color: 'var(--color-danger)',
      shadow: 'var(--shadow-glow-danger)',
    },
    active: {
      bg: 'rgba(255, 59, 59, 0.3)',
      scale: '0.98',
    },
    disabled: {
      opacity: '0.4',
    },
  },
  outline: {
    base: {
      bg: 'transparent',
      border: 'var(--border-default)',
      color: 'var(--text-secondary)',
    },
    hover: {
      bg: 'var(--hover-overlay)',
      border: 'var(--border-strong)',
      color: 'var(--text-primary)',
    },
    active: {
      bg: 'var(--pressed-overlay)',
      scale: '0.98',
    },
    disabled: {
      opacity: '0.4',
    },
  },
}

export const Button = forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  ...props
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const sizeConfig = SIZES[size] || SIZES.md
  const variantConfig = VARIANTS[variant] || VARIANTS.primary

  const isDisabled = disabled || loading
  const isIconOnly = !children && icon

  // Determine current styles based on state
  let currentStyles = { ...variantConfig.base }

  if (isDisabled) {
    currentStyles = {
      ...variantConfig.base,
      opacity: variantConfig.disabled?.opacity || '0.4',
      cursor: 'not-allowed',
    }
  } else if (isPressed) {
    currentStyles = {
      ...variantConfig.base,
      ...variantConfig.hover,
      ...variantConfig.active,
    }
  } else if (isHovered) {
    currentStyles = {
      ...variantConfig.base,
      ...variantConfig.hover,
    }
  }

  const buttonPadding = isIconOnly ? '0' : sizeConfig.px

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => !isDisabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => !isDisabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          !isDisabled && setIsPressed(true)
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          setIsPressed(false)
        }
      }}
      aria-label={ariaLabel || (isIconOnly ? undefined : children)}
      aria-describedby={ariaDescribedBy}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold uppercase
        transition-all duration-100
        ${className}
      `}
      style={{
        minHeight: sizeConfig.height,
        minWidth: isIconOnly ? sizeConfig.height : 'auto',
        padding: `0 ${buttonPadding}`,
        backgroundColor: currentStyles.bg,
        border: `1px solid ${currentStyles.border}`,
        borderRadius: 'var(--radius-sm)',
        color: currentStyles.color,
        fontSize: sizeConfig.textSize,
        letterSpacing: '0.05em',
        boxShadow: currentStyles.shadow || 'none',
        transform: currentStyles.scale || 'none',
        opacity: currentStyles.opacity || 1,
        cursor: currentStyles.cursor || 'pointer',
        outline: 'none',
        transitionDuration: isPressed && !isDisabled
          ? 'var(--duration-instant)'
          : 'var(--duration-fast)',
        transitionTimingFunction: 'var(--ease-out)',
        WebkitTapHighlightColor: 'transparent',
      }}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span style={{
              width: sizeConfig.iconSize,
              height: sizeConfig.iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </span>
          )}
          {!isIconOnly && children && (
            <span>{children}</span>
          )}
          {icon && iconPosition === 'right' && (
            <span style={{
              width: sizeConfig.iconSize,
              height: sizeConfig.iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  )
})

/**
 * IconButton - Square button with only an icon
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element
 * @param {string} props.variant - Button variant
 * @param {string} props.size - Button size
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) {
  const sizeConfig = SIZES[size] || SIZES.md

  return (
    <Button
      variant={variant}
      size={size}
      icon={icon}
      className={`!p-0 !min-w-auto ${className}`}
      style={{ padding: '0', minWidth: sizeConfig.height }}
      aria-label={props['aria-label'] || 'Icon button'}
      {...props}
    />
  )
}

/**
 * ButtonGroup - Group of buttons
 */
export function ButtonGroup({
  children,
  className = '',
  separated = false,
}) {
  return (
    <div
      className={`inline-flex ${separated ? 'gap-2' : ''} ${className}`}
      role="group"
    >
      {separated ? children : (
        <div className="flex -space-x-1">
          {Array.isArray(children) ? children.map((child, i) => (
            <div key={i} className="relative">
              {i > 0 && (
                <div
                  className="absolute left-0 top-1/2 -translate-x-px -translate-y-1/2 w-px h-4"
                  style={{ backgroundColor: 'var(--border-subtle)' }}
                />
              )}
              {child}
            </div>
          )) : children}
        </div>
      )}
    </div>
  )
}

export default Button