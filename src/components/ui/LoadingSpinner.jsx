/**
 * LoadingSpinner - Feedback Components
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Spinner: 600ms linear infinite
 * - Skeleton: pulse 1.5s ease-in-out infinite
 * - Shimmer: 1.5s linear infinite
 *
 * Components:
 * - Spinner: Compact spinner for buttons
 * - LoadingSpinner: Full loading state with text
 * - Skeleton: Generic placeholder
 * - SkeletonRow: Table row placeholder
 * - SkeletonCard: Card placeholder
 * - TableSkeleton: Table with header + rows
 * - CardGridSkeleton: Grid of card placeholders
 */

// Size maps
const SPINNER_SIZE = {
  sm: { container: 'w-4 h-4', border: 'border' },
  md: { container: 'w-6 h-6', border: 'border-2' },
  lg: { container: 'w-8 h-8', border: 'border-2' },
}

const LOADER_SIZE = {
  sm: 'w-4 h-4',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
}

// Spinner - Compact spinner for buttons
export function Spinner({ size = 'sm' }) {
  const s = SPINNER_SIZE[size] || SPINNER_SIZE.sm

  return (
    <div
      className={`${s.container} rounded-full animate-spin`}
      style={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'var(--accent-muted)',
        borderTopColor: 'var(--accent-primary)',
        boxShadow: '0 0 8px rgba(0,255,136,0.3)',
        animationDuration: '600ms',
        animationTimingFunction: 'linear',
      }}
    />
  )
}

// LoadingSpinner - Full loading state with text
export function LoadingSpinner({
  size = 'md',
  text = 'Memuat data...',
  className = '',
}) {
  const loaderSize = LOADER_SIZE[size] || LOADER_SIZE.md

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${loaderSize} rounded-full animate-spin`}
        style={{
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'var(--accent-muted)',
          borderTopColor: 'var(--accent-primary)',
          boxShadow: '0 0 8px rgba(0,255,136,0.3)',
          animationDuration: '600ms',
          animationTimingFunction: 'linear',
        }}
      />
      {text && (
        <p
          className="text-micro font-semibold uppercase tracking-widest"
          style={{
            color: 'var(--accent-primary)',
            opacity: 0.6,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          {text}
        </p>
      )}
      <span className="sr-only">Memuat...</span>
    </div>
  )
}

// Skeleton - Generic skeleton placeholder
export function Skeleton({
  width = '100%',
  height = '1rem',
  className = '',
  style,
}) {
  return (
    <div
      className={`rounded-sm animate-pulse ${className}`}
      style={{
        width,
        height,
        backgroundColor: 'var(--accent-muted)',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

// SkeletonRow - Table row placeholder
export function SkeletonRow({ cols = 4 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton height="12px" />
        </td>
      ))}
    </tr>
  )
}

// SkeletonCard - Card placeholder
export function SkeletonCard() {
  return (
    <div
      className="p-4 rounded-sm animate-pulse"
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <Skeleton height="12px" width="75%" className="mb-3" />
      <Skeleton height="28px" width="50%" className="mb-3" />
      <Skeleton height="8px" className="mb-2" />
      <Skeleton height="8px" width="80%" />
    </div>
  )
}

// TableSkeleton - Table with header + rows
export function TableSkeleton({
  rows = 5,
  cols = 4,
  className = '',
}) {
  return (
    <div className={`w-full ${className}`}>
      {/* Header skeleton */}
      <div
        className="flex gap-4 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={`header-${i}`}
            height="12px"
            className="flex-1"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex gap-4 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              height="12px"
              className="flex-1"
              style={{
                animationDelay: `${rowIndex * 50 + colIndex * 20}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// CardGridSkeleton - Grid of card placeholders
export function CardGridSkeleton({
  count = 4,
  cols = 4,
  className = '',
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(cols, 4)} gap-3 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm overflow-hidden animate-pulse"
          style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            animation: `pulse 1.5s ease-in-out infinite`,
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="p-4 space-y-3">
            {/* Icon + Title row */}
            <div className="flex items-center gap-3">
              <Skeleton width="40px" height="40px" className="flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton height="12px" width="60%" />
                <Skeleton height="8px" width="40%" style={{ opacity: 0.6 }} />
              </div>
            </div>

            {/* Description lines */}
            <Skeleton height="8px" style={{ opacity: 0.4 }} />
            <Skeleton height="8px" width="80%" style={{ opacity: 0.4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ListSkeleton - List of item placeholders
export function ListSkeleton({
  count = 5,
  className = '',
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-sm animate-pulse"
          style={{
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            animation: `pulse 1.5s ease-in-out infinite`,
            animationDelay: `${i * 50}ms`,
          }}
        >
          <Skeleton width="32px" height="32px" className="flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton height="12px" width="40%" />
            <Skeleton height="8px" width="70%" style={{ opacity: 0.6 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner