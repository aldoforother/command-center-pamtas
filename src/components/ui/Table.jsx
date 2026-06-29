import { useState } from 'react'

/**
 * Table - Reusable data table component
 *
 * Uses CSS tokens for theming consistency.
 *
 * Cara pakai:
 *   <Table
 *     columns={[
 *       { key: 'name', header: 'Nama' },
 *       { key: 'status', header: 'Status', render: (val) => <Badge>{val}</Badge> },
 *     ]}
 *     data={[{ name: 'Item 1', status: 'active' }]}
 *   />
 */

export function Table({
  columns = [],
  data = [],
  onRowClick,
  emptyMessage = 'Tidak ada data',
  className = '',
}) {
  const [hoveredRow, setHoveredRow] = useState(null)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-[10px]">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  py-2 px-3
                  font-semibold
                  tracking-wider
                  uppercase
                  text-left
                  ${col.align === 'center' ? 'text-center' : ''}
                  ${col.align === 'right' ? 'text-right' : ''}
                `}
                style={{ color: 'var(--text-tertiary)' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`
                    py-2.5 px-3
                    ${col.align === 'center' ? 'text-center' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                  `}
                  style={{
                    color: hoveredRow === rowIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: hoveredRow === rowIndex ? 'var(--hover-surface)' : 'transparent',
                    transition: 'background-color var(--duration-fast) ease-out',
                  }}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * TableHeader - Table header row
 */
export function TableHeader({ children, className = '' }) {
  return (
    <thead className={className}>
      {children}
    </thead>
  )
}

/**
 * TableBody - Table body container
 */
export function TableBody({ children, className = '' }) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  )
}

/**
 * TableRow - Table row
 */
export function TableRow({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {children}
    </tr>
  )
}

/**
 * TableCell - Table cell
 */
export function TableCell({
  children,
  align = 'left',
  header = false,
  className = '',
}) {
  const Component = header ? 'th' : 'td'
  return (
    <Component
      className={`
        py-2 px-3
        ${align === 'center' ? 'text-center' : ''}
        ${align === 'right' ? 'text-right' : ''}
        ${className}
      `}
      style={{
        color: header ? 'var(--text-tertiary)' : 'var(--text-secondary)',
      }}
    >
      {children}
    </Component>
  )
}
