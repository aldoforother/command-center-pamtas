import { useState, useEffect } from 'react'

/**
 * EmptyState Component - Feedback Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Illustration entrance: 400ms ease-out
 * - Reduced motion support
 *
 * Features:
 * - 12 SVG illustrations
 * - Full ARIA support
 * - Reduced motion support
 * - Action slot
 */

// SVG Illustrations - Tactical themed
const illustrations = {
  users: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="20" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M16 48C16 38.059 22.627 30 32 30C41.373 30 48 38.059 48 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.2"/>
    </svg>
  ),
  data: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="12" y="16" width="40" height="32" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M20 26H44M20 34H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <path d="M12 16L32 8L52 16" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),
  search: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="28" cy="28" r="14" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M38 38L48 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.15"/>
    </svg>
  ),
  error: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M32 20V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <circle cx="32" cy="44" r="2" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  lock: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="16" y="28" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M22 28V20C22 14.477 26.477 10 32 10C37.523 10 42 14.477 42 20V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <circle cx="32" cy="40" r="4" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  folder: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 16H24L28 24H56V52H8V16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.3"/>
      <path d="M8 16H24L28 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.2"/>
    </svg>
  ),
  chart: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 48V32M24 48V24M36 48V36M48 48V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <path d="M8 52H56" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <circle cx="12" cy="32" r="3" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.4"/>
      <circle cx="36" cy="36" r="3" fill="currentColor" opacity="0.4"/>
      <circle cx="48" cy="16" r="3" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  map: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 16L24 8V48L8 56V16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.3"/>
      <path d="M24 8L40 16V56L24 48V8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.25"/>
      <path d="M40 16L56 8V48L40 56V16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.3"/>
      <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  document: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16 8H40L52 20V56H16V8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.3"/>
      <path d="M40 8V20H52" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.3"/>
      <path d="M24 30H44M24 38H36M24 46H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  timeline: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 8V16M32 24V32M32 40V48M32 56V64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2"/>
      <circle cx="32" cy="20" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <circle cx="32" cy="36" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <circle cx="32" cy="52" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M40 20H48M40 36H48M40 52H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  warning: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 8L58 54H6L32 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.3"/>
      <path d="M32 24V36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      <circle cx="32" cy="46" r="3" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  success: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M20 32L28 40L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  ),
}

// Get illustration by key or fallback
function getIllustration(key) {
  if (!key) return illustrations.data
  if (illustrations[key]) return illustrations[key]

  // Fallback mappings
  const fallbackMap = {
    '◉': 'users',
    '◈': 'data',
    '◧': 'search',
    '⚠': 'error',
    '🔒': 'lock',
    '📁': 'folder',
    '📊': 'chart',
    '🗺️': 'map',
    '📄': 'document',
    'users': 'users',
    'user': 'users',
    'data': 'data',
    'list': 'data',
    'search': 'search',
    'error': 'error',
    'warning': 'warning',
    'lock': 'lock',
    'folder': 'folder',
    'chart': 'chart',
    'map': 'map',
    'document': 'document',
    'report': 'document',
    'timeline': 'timeline',
    'clock': 'timeline',
    'history': 'timeline',
    'check': 'success',
  }

  const mapped = fallbackMap[key] || 'data'
  return illustrations[mapped] || illustrations.data
}

export function EmptyState({
  icon = '◈',
  title = 'Tidak ada data',
  description = '',
  action,
  illustration,
  className = '',
}) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const svgIllustration = illustration ? illustrations[illustration] || getIllustration(icon) : getIllustration(icon)

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Illustration */}
      <div
        className="mb-6"
        style={{
          color: 'var(--accent-primary)',
          animation: reducedMotion ? 'none' : 'fadeInUp 400ms ease-out both',
        }}
      >
        {svgIllustration}
      </div>

      {/* Title */}
      <h3
        className="text-label font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className="text-body-sm max-w-xs leading-relaxed mb-6"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState