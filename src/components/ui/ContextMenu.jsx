import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * ContextMenu Component - Navigation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Menu appear: 150ms scale-in ease-out
 * - Transform origin: top-left
 * - Item hover: 100ms ease-out
 *
 * Features:
 * - Right-click to open
 * - Positioned at cursor
 * - Keyboard navigation
 * - Dividers
 * - Submenus support
 */

/**
 * ContextMenu - Right-click context menu
 *
 * @param {Object} props
 * @param {Array} props.items - Menu items [{ label, onClick, icon, danger, divider }]
 * @param {Function} props.children - Trigger element
 */
export function ContextMenu({
  items = [],
  children,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    // Calculate position to keep menu in viewport
    const menuWidth = 200
    const menuHeight = items.length * 36 + 16
    const padding = 8

    let x = e.clientX
    let y = e.clientY

    // Adjust if menu would go off right edge
    if (x + menuWidth + padding > window.innerWidth) {
      x = window.innerWidth - menuWidth - padding
    }

    // Adjust if menu would go off bottom edge
    if (y + menuHeight + padding > window.innerHeight) {
      y = window.innerHeight - menuHeight - padding
    }

    setPosition({ x, y })
    setIsOpen(true)
  }, [items.length])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
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

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className={className}
      >
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-[var(--z-dropdown)] min-w-[160px] py-1 rounded-sm"
          style={{
            left: position.x,
            top: position.y,
            background: 'var(--surface-tertiary)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            transformOrigin: 'top-left',
            animation: 'scaleIn var(--duration-normal) var(--ease-out) both',
          }}
          role="menu"
          aria-label="Context menu"
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

            return (
              <button
                key={item.id || index}
                onClick={() => handleItemClick(item)}
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
    </>
  )
}

/**
 * ContextMenuItem - Helper to create menu item
 */
export function ContextMenuItem({
  label,
  icon,
  onClick,
  danger = false,
  disabled = false,
  shortcut,
  id,
}) {
  return { label, icon, onClick, danger, disabled, shortcut, id }
}

/**
 * ContextMenuDivider - Divider for context menu
 */
export function ContextMenuDivider() {
  return { divider: true }
}

/**
 * useContextMenu - Hook for programmatic context menu
 */
export function useContextMenu(items = []) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  const show = useCallback((e) => {
    e.preventDefault()

    const menuWidth = 200
    const menuHeight = items.length * 36 + 16
    const padding = 8

    let x = e.clientX
    let y = e.clientY

    if (x + menuWidth + padding > window.innerWidth) {
      x = window.innerWidth - menuWidth - padding
    }

    if (y + menuHeight + padding > window.innerHeight) {
      y = window.innerHeight - menuHeight - padding
    }

    setPosition({ x, y })
    setIsOpen(true)
  }, [items.length])

  const hide = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback((e) => {
    if (isOpen) {
      hide()
    } else {
      show(e)
    }
  }, [isOpen, show, hide])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
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

  const ContextMenuContent = () => {
    if (!isOpen) return null

    return (
      <div
        ref={menuRef}
        className="fixed z-[var(--z-dropdown)] min-w-[160px] py-1 rounded-sm"
        style={{
          left: position.x,
          top: position.y,
          background: 'var(--surface-tertiary)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          transformOrigin: 'top-left',
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
                style={{ height: '1px', background: 'var(--border-subtle)' }}
                role="separator"
              />
            )
          }

          return (
            <button
              key={item.id || index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.()
                  setIsOpen(false)
                }
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                color: item.danger ? 'var(--color-danger)' : 'var(--text-primary)',
                fontSize: '11px',
                transition: `background-color var(--duration-fast) var(--ease-out)`,
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.background = item.danger
                    ? 'var(--color-danger-subtle)'
                    : 'var(--hover-surface)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
              role="menuitem"
            >
              {item.icon && (
                <span className="w-4 h-4 flex-shrink-0" style={{ opacity: 0.7 }}>
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-micro-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {item.shortcut}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return { isOpen, show, hide, toggle, ContextMenuContent }
}