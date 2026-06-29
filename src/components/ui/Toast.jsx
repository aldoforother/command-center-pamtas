import { createContext, useCallback, useContext, useRef, useState, useEffect } from 'react'

/**
 * Toast — Notification component with auto-dismiss
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Enter: slide-in-right 200ms ease-out
 * - Exit: fade-out 150ms ease-sharp
 * - Progress bar: smooth countdown
 *
 * Features:
 * - 4 types: success, error, warning, info
 * - Auto-dismiss with progress indicator
 * - Manual dismiss
 * - Stack multiple toasts
 * - Full ARIA support
 */

// Context
const ToastContext = createContext(null)

let _idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timersRef.current[id])
    delete timersRef.current[id]
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info', options = {}) => {
    const { duration = type === 'error' ? 5000 : 3500, title } = options
    const id = ++_idCounter

    setToasts(prev => [...prev, { id, message, type, title, duration }])

    timersRef.current[id] = setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return ctx
}

// Toast styles per type
const TOAST_TYPES = {
  success: {
    border: 'var(--color-success)',
    bg: 'var(--color-success-subtle)',
    color: 'var(--color-success)',
    progressColor: 'var(--color-success)',
    icon: 'check',
  },
  error: {
    border: 'var(--color-danger)',
    bg: 'var(--color-danger-subtle)',
    color: 'var(--color-danger)',
    progressColor: 'var(--color-danger)',
    icon: 'x',
  },
  warning: {
    border: 'var(--color-warning)',
    bg: 'var(--color-warning-subtle)',
    color: 'var(--color-warning)',
    progressColor: 'var(--color-warning)',
    icon: 'alert',
  },
  info: {
    border: 'var(--color-info)',
    bg: 'var(--color-info-subtle)',
    color: 'var(--color-info)',
    progressColor: 'var(--color-info)',
    icon: 'info',
  },
}

// SVG Icons
const Icons = {
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  alert: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

// Toast Container
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

// Single Toast Item
function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info
  const startTimeRef = useRef(Date.now())

  // Progress countdown
  useEffect(() => {
    const duration = toast.duration || 3500
    const interval = 50 // Update every 50ms for smooth progress

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [toast.duration])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 150) // Wait for exit animation
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`
        pointer-events-auto
        flex items-start gap-3 px-4 py-3
        rounded-sm max-w-sm w-full
        transition-all duration-150
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 animate-slide-in-right'}
      `}
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(8px)',
        transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
      }}
    >
      {/* Icon */}
      <span
        className="flex-shrink-0 mt-0.5"
        style={{ color: config.color }}
      >
        {Icons[config.icon]}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p
            className="text-label-sm font-semibold mb-0.5"
            style={{ color: config.color }}
          >
            {toast.title}
          </p>
        )}
        <p
          className="text-body-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {toast.message}
        </p>

        {/* Progress bar */}
        <div
          className="mt-2 h-0.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--border-subtle)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: config.progressColor,
              transitionTimingFunction: 'linear',
            }}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-sm transition-colors duration-100"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
        aria-label="Tutup notifikasi"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/**
 * ToastItem - Standalone toast for custom usage
 */
export function ToastItemComponent({
  type = 'info',
  title,
  message,
  duration = 3500,
  onClose,
}) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 px-4 py-3 rounded-sm max-w-sm"
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <span style={{ color: config.color }}>
        {Icons[config.icon]}
      </span>
      <div className="flex-1">
        {title && (
          <p className="text-label-sm font-semibold mb-0.5" style={{ color: config.color }}>
            {title}
          </p>
        )}
        <p className="text-body-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-sm"
          style={{ color: 'var(--text-tertiary)' }}
          aria-label="Tutup"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ToastProvider