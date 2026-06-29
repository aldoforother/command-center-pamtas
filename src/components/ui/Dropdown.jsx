import { useState, useRef, useEffect } from 'react'

/**
 * Dropdown Component - Navigation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Menu appear: 150ms scale-in ease-out
 * - Transform origin: top center
 * - Item hover: 100ms ease-out
 * - Stagger: 20ms per item (max 5 items)
 *
 * Features:
 * - 4 positions: bottom-left, bottom-right, top-left, top-right
 * - Divider support
 * - Icon support
 * - Keyboard navigation
 * - Click outside to close
 */

const POSITIONS = {
  'bottom-left': {
    placement: 'top-full',
    alignment: 'left-0',
    origin: 'origin-top-left',
    transform: 'translateY(0)',
  },
  'bottom-right': {
    placement: 'top-full',
    alignment: 'right-0',
    origin: 'origin-top-right',
    transform: 'translateY(0)',
  },
  'top-left': {
    placement: 'bottom-full',
    alignment: 'left-0',
    origin: 'origin-bottom-left',
    transform: 'translateY(0)',
  },
  'top-right': {
    placement: 'bottom-full',
    alignment: 'right-0',
    origin: 'origin-bottom-right',
    transform: 'translateY(0)',
  },
}

/**
 * Dropdown - Custom dropdown menu
 */
export function Dropdown({
  trigger,
  items = [],
  position = 'bottom-left',
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleItemClick = (item) => {
    if (item.disabled) return
    item.onClick?.()
    setIsOpen(false)
  }

  const handleKeyDown = (e, item, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextItem = menuRef.current?.querySelector(`[data-index="${index + 1}"]`)
      nextItem?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevItem = menuRef.current?.querySelector(`[data-index="${index - 1}"]`)
      prevItem?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleItemClick(item)
    }
  }

  if (disabled) {
    return trigger
  }

  const posConfig = POSITIONS[position] || POSITIONS['bottom-left']

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={dropdownRef}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-[var(--z-dropdown)] min-w-[160px] py-1 rounded-sm ${posConfig.placement} ${posConfig.alignment}`}
          style={{
            marginTop: position.startsWith('bottom') ? '4px' : undefined,
            marginBottom: position.startsWith('top') ? '4px' : undefined,
            background: 'var(--surface-tertiary)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            transformOrigin: posConfig.origin,
            animation: 'scaleIn var(--duration-normal) var(--ease-out) both',
          }}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-1 mx-2"
                  style={{
                    height: '1px',
                    background: 'var(--border-subtle)',
                  }}
                  role="separator"
                />
              )
            }

            const isDanger = item.danger
            const isDisabled = item.disabled
            const staggerDelay = Math.min(index * 20, 100)

            return (
              <button
                key={item.id || index}
                data-index={index}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item, index)}
                disabled={isDisabled}
                className="w-full text-left px-3 py-2 flex items-center gap-2"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  color: isDanger
                    ? 'var(--color-danger)'
                    : 'var(--text-primary)',
                  fontSize: '11px',
                  transition: `background-color var(--duration-fast) var(--ease-out)`,
                  animation: `fadeIn var(--duration-fast) var(--ease-out) both`,
                  animationDelay: `${staggerDelay}ms`,
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.background = isDanger
                      ? 'var(--color-danger-subtle)'
                      : 'var(--hover-surface)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
                role="menuitem"
                tabIndex={-1}
              >
                {item.icon && (
                  <span
                    className="w-4 h-4 flex-shrink-0"
                    style={{ opacity: 0.7 }}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span
                    className="text-micro-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * DropdownItem - Individual dropdown item
 */
export function DropdownItem({
  label,
  icon,
  onClick,
  danger = false,
  disabled = false,
  shortcut,
}) {
  return {
    label,
    icon,
    onClick,
    danger,
    disabled,
    shortcut,
  }
}

/**
 * DropdownDivider - Divider for dropdown menu
 */
export function DropdownDivider() {
  return { divider: true }
}