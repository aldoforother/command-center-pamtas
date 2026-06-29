import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Breadcrumb Component - Navigation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Hover: 100ms ease-out
 *
 * Features:
 * - Link and text items
 * - Separator customization
 * - Truncation for long items
 * - Ellipsis for overflow
 */

/**
 * Breadcrumb - Navigation breadcrumb trail
 *
 * @param {Object} props
 * @param {Array} props.items - Array of { href, label, icon }
 * @param {ReactNode|string} props.separator - Separator between items
 * @param {number} props.maxItems - Max items before ellipsis
 */
export function Breadcrumb({
  items = [],
  separator = '/',
  className = '',
  maxItems,
}) {
  const displayItems = maxItems && items.length > maxItems
    ? [
        ...items.slice(0, 1),
        { label: '...', type: 'ellipsis' },
        ...items.slice(-(maxItems - 1)),
      ]
    : items

  const SeparatorIcon = () => (
    <span
      className="mx-1 flex-shrink-0"
      style={{
        color: 'var(--text-disabled)',
        fontSize: '10px',
      }}
      aria-hidden="true"
    >
      {typeof separator === 'string' ? (
        <span className="mx-0.5">{separator}</span>
      ) : (
        separator
      )}
    </span>
  )

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center flex-wrap" role="list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = item.type === 'ellipsis'

          return (
            <li key={item.href || index} className="flex items-center">
              {index > 0 && <SeparatorIcon />}

              {isEllipsis ? (
                <span
                  className="text-label-sm"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  ...
                </span>
              ) : item.href ? (
                <BreadcrumbLink
                  to={item.href}
                  label={item.label}
                  icon={item.icon}
                  isLast={isLast}
                />
              ) : (
                <BreadcrumbText
                  label={item.label}
                  icon={item.icon}
                  isLast={isLast}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * BreadcrumbLink - Clickable breadcrumb item
 */
function BreadcrumbLink({ to, label, icon, isLast }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-1.5"
      style={{
        fontSize: '11px',
        color: isLast
          ? 'var(--text-primary)'
          : isHovered
            ? 'var(--accent-primary)'
            : 'var(--text-tertiary)',
        fontWeight: isLast ? 500 : 400,
        transition: 'color var(--duration-fast) var(--ease-out)',
        textDecoration: 'none',
      }}
      aria-current={isLast ? 'page' : undefined}
    >
      {icon && (
        <span className="w-3.5 h-3.5 flex-shrink-0">{icon}</span>
      )}
      <span className="truncate max-w-[150px]">{label}</span>
    </Link>
  )
}

/**
 * BreadcrumbText - Non-clickable breadcrumb item
 */
function BreadcrumbText({ label, icon, isLast }) {
  return (
    <span
      className="flex items-center gap-1.5"
      style={{
        fontSize: '11px',
        color: isLast ? 'var(--text-primary)' : 'var(--text-tertiary)',
        fontWeight: isLast ? 500 : 400,
      }}
      aria-current={isLast ? 'page' : undefined}
    >
      {icon && (
        <span className="w-3.5 h-3.5 flex-shrink-0">{icon}</span>
      )}
      <span className="truncate max-w-[150px]">{label}</span>
    </span>
  )
}