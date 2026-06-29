import { useState, useRef, useEffect } from 'react'

/**
 * Tooltip Component - Foundation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Enter: fade-in 100ms ease-out
 * - Delay: 400ms appear, instant hide
 * - Duration: 100ms
 *
 * Features:
 * - 4 positions: top, bottom, left, right
 * - Configurable delay
 * - Full ARIA support
 * - Reduced motion support
 */

const POSITIONS = {
  top: {
    placement: 'bottom',
    transform: 'translateX(-50%)',
    margin: '0 0 8px 0',
  },
  bottom: {
    placement: 'top',
    transform: 'translateX(-50%)',
    margin: '8px 0 0 0',
  },
  left: {
    placement: 'right',
    transform: 'translateY(-50%)',
    margin: '0 8px 0 0',
  },
  right: {
    placement: 'left',
    transform: 'translateY(-50%)',
    margin: '0 0 0 8px',
  },
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 400,
  disabled = false,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
  }

  const handleFocus = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (disabled || !content) {
    return children
  }

  const pos = POSITIONS[position] || POSITIONS.top

  // Arrow styles based on position
  const getArrowStyle = () => {
    const arrowSize = '6px'
    const baseStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    }

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '-6px',
          left: '50%',
          marginLeft: '-6px',
          borderWidth: '6px 6px 0 6px',
          borderColor: 'var(--surface-tertiary) transparent transparent transparent',
        }
      case 'bottom':
        return {
          ...baseStyle,
          top: '-6px',
          left: '50%',
          marginLeft: '-6px',
          borderWidth: '0 6px 6px 6px',
          borderColor: 'transparent transparent var(--surface-tertiary) transparent',
        }
      case 'left':
        return {
          ...baseStyle,
          right: '-6px',
          top: '50%',
          marginTop: '-6px',
          borderWidth: '6px 0 6px 6px',
          borderColor: 'transparent transparent transparent var(--surface-tertiary)',
        }
      case 'right':
        return {
          ...baseStyle,
          left: '-6px',
          top: '50%',
          marginTop: '-6px',
          borderWidth: '6px 6px 6px 0',
          borderColor: 'transparent var(--surface-tertiary) transparent transparent',
        }
      default:
        return baseStyle
    }
  }

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className="absolute left-1/2 z-[var(--z-tooltip)] pointer-events-none animate-fade-in"
          style={{
            transform: pos.transform,
            margin: pos.margin,
            animationDuration: '100ms',
            animationTimingFunction: 'var(--ease-out)',
            animationFillMode: 'both',
          }}
        >
          <div
            className="px-2.5 py-1.5 rounded-sm text-caption-sm max-w-xs"
            style={{
              backgroundColor: 'var(--surface-tertiary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
              whiteSpace: 'nowrap',
            }}
          >
            {content}
            {/* Arrow */}
            <div style={getArrowStyle()} aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * TooltipLink - Tooltip for icon-only buttons
 */
export function TooltipLink({
  children,
  href,
  tooltip,
  position = 'top',
  delay = 400,
}) {
  return (
    <Tooltip content={tooltip} position={position} delay={delay}>
      <a
        href={href}
        className="inline-flex items-center justify-center p-2 rounded-sm transition-all duration-100"
        style={{
          color: 'var(--text-tertiary)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)'
          e.currentTarget.style.backgroundColor = 'var(--surface-interactive)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-tertiary)'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {children}
      </a>
    </Tooltip>
  )
}

export default Tooltip