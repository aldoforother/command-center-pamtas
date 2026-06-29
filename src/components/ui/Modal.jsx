import { useEffect, useRef, useState } from 'react'

/**
 * Modal Component - Feedback Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Overlay: fade-in 200ms ease-out
 * - Content: scale-in 150ms ease-out
 * - Close: fade-out 150ms ease-sharp
 *
 * Features:
 * - Focus trap (WCAG 2.1 criterion 2.1.2)
 * - ESC to close
 * - Click outside to close
 * - Multiple sizes
 * - Full ARIA support
 */

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showClose = true,
  footer,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen || !isVisible) return

    const handleKeyDown = (e) => {
      // ESC to close
      if (e.key === 'Escape' && closeOnEscape) {
        handleClose()
        return
      }

      // Focus trap
      if (e.key !== 'Tab' || !contentRef.current) return

      const focusable = contentRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus first focusable element
    const timer = setTimeout(() => {
      const focusable = contentRef.current?.querySelector(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    }, 50)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      previousFocusRef.current?.focus?.()
    }
  }, [isOpen, isVisible, closeOnEscape])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      setIsVisible(false)
      onClose?.()
    }, 150) // Wait for exit animation
  }

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === overlayRef.current) {
      handleClose()
    }
  }

  if (!isVisible && !isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`
        fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4
        transition-opacity duration-200
        ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        backgroundColor: 'var(--overlay-scrim)',
        backdropFilter: 'blur(4px)',
        transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`
          ${SIZE_MAP[size] || SIZE_MAP.md}
          w-full
          rounded-sm
          transition-all duration-150
          ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-scale-in'}
          ${className}
        `}
        style={{
          backgroundColor: 'var(--surface-tertiary)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xl)',
          transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
          maxHeight: 'calc(100vh - 2rem)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--accent-muted)',
          }}
        >
          <h2
            id="modal-title"
            className="text-label-sm font-bold tracking-wider uppercase"
            style={{ color: 'var(--accent-primary)' }}
          >
            {title}
          </h2>
          {showClose && (
            <button
              onClick={handleClose}
              aria-label="Tutup modal"
              className="p-1.5 rounded-sm transition-colors duration-100"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className="px-4 py-4 overflow-y-auto"
          style={{ maxHeight: footer ? 'calc(100% - 130px)' : 'calc(100% - 60px)' }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center justify-end gap-2 px-4 py-3"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * ModalFooter - Helper component for modal footer actions
 */
export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  )
}

export default Modal