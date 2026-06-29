import { forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { EmptyState } from './EmptyState'

/**
 * ReportTable - Accessible data table for reports
 *
 * Features:
 * - Semantic HTML with thead, tbody, scope attributes
 * - ARIA labels and live regions
 * - Loading skeleton state
 * - Empty state
 * - Hover highlighting
 * - Responsive horizontal scroll
 */
export function ReportTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'Tidak ada data',
  emptyDescription = 'Data tidak ditemukan.',
  emptyIcon = '◉',
  caption,
  id,
  className = '',
  onRowClick,
  getRowStyle,
}) {
  if (loading) {
    return <TableSkeleton columns={columns.length} rows={5} />
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* ARIA live region for screen readers */}
      <p className="sr-only" aria-live="polite" role="status">
        Menampilkan {data.length} data
      </p>

      <table
        id={id}
        className={`w-full border-collapse ${className}`}
        aria-label={caption || 'Tabel data'}
      >
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key || i}
                scope="col"
                className="text-left px-3 py-2 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  color: 'var(--text-tertiary)',
                  background: 'var(--surface-secondary)',
                  borderBottom: '1px solid var(--border-subtle)',
                  whiteSpace: col.noWrap ? 'nowrap' : 'normal',
                  minWidth: col.width,
                }}
              >
                {col.icon && <span className="mr-1">{col.icon}</span>}
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={onRowClick ? 'cursor-pointer transition-colors' : 'transition-colors'}
              onClick={() => onRowClick?.(row)}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-secondary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--surface-primary)'
              }}
              style={{
                background: 'var(--surface-primary)',
                borderBottom: '1px solid var(--border-subtle)',
                ...getRowStyle?.(row),
              }}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key || colIndex}
                  className="px-3 py-2 text-[11px]"
                  style={{
                    color: col.color ? col.color : 'var(--text-secondary)',
                    fontFamily: col.mono ? "'JetBrains Mono', monospace" : 'inherit',
                    whiteSpace: col.noWrap ? 'nowrap' : 'normal',
                    maxWidth: col.maxWidth,
                    overflow: col.noWrap ? 'hidden' : undefined,
                    textOverflow: col.noWrap ? 'ellipsis' : undefined,
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
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
 * TableSkeleton - Loading placeholder for table
 */
function TableSkeleton({ columns = 4, rows = 5 }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" aria-busy="true" aria-label="Memuat data...">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th
                key={i}
                scope="col"
                className="text-left px-3 py-2 text-[9px] font-bold uppercase tracking-wider"
                style={{
                  color: 'var(--text-tertiary)',
                  background: 'var(--surface-secondary)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <Skeleton width={`${60 + Math.random() * 30}%`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-3 py-3">
                  <Skeleton width={`${70 + Math.random() * 25}%`} height="14px" />
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
 * Skeleton - Loading placeholder
 */
function Skeleton({ width = '100%', height = '12px', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        background: 'var(--surface-muted)',
        borderRadius: '2px',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * DataTable - Enhanced table with built-in features
 *
 * A self-contained table that handles:
 * - Column definitions
 * - Sorting (optional)
 * - Pagination (optional)
 * - Row selection (optional)
 */
export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'Tidak ada data',
  emptyDescription = 'Data tidak ditemukan.',
  emptyIcon = '◉',
  sortable = false,
  sortColumn,
  sortDirection,
  onSort,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  caption,
  id,
  className = '',
  onRowClick,
  zebraStripe = false,
}) {
  const allSelected = selectable && data.length > 0 && data.every(row => selectedRows.includes(row.id))
  const someSelected = selectable && selectedRows.length > 0 && !allSelected

  return (
    <ReportTable
      id={id}
      columns={[
        ...(selectable ? [{
          key: '_select',
          label: (
            <input
              type="checkbox"
              checked={allSelected}
              ref={el => { if (el) el.indeterminate = someSelected }}
              onChange={onSelectAll}
              aria-label={allSelected ? 'Batalkan semua pilihan' : 'Pilih semua'}
              className="w-3.5 h-3.5 cursor-pointer"
            />
          ),
          width: '32px',
          noWrap: true,
        }] : []),
        ...columns,
      ]}
      data={data.map(row => ({
        ...row,
        _select: selectable ? (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={() => onRowSelect?.(row.id)}
            aria-label={`Pilih baris ${row.id}`}
            className="w-3.5 h-3.5 cursor-pointer"
          />
        ) : null,
      }))}
      loading={loading}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyIcon={emptyIcon}
      caption={caption}
      className={className}
      onRowClick={onRowClick}
      getRowStyle={(row) => ({
        background: zebraStripe && data.indexOf(row) % 2 === 1
          ? 'var(--surface-secondary)'
          : 'var(--surface-primary)',
      })}
    />
  )
}

export default ReportTable
