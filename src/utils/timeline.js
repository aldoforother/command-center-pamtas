/**
 * Shared timeline filter utilities
 * Reduces code duplication across BinterPage and InsidenPage
 */

/**
 * Timeline filter options - shared across pages
 */
export const TIMELINE_OPTIONS = [
  { id: 'all',   label: 'Semua' },
  { id: 'today', label: 'Hari Ini' },
  { id: '7d',   label: '7 Hari' },
  { id: '30d',   label: '30 Hari' },
  { id: '90d',   label: '3 Bulan' },
  { id: '180d',  label: '6 Bulan' },
  { id: '365d',  label: '1 Tahun' },
]

/**
 * Filter items by timeline
 * @param {Array} items - Array of items with tanggal property
 * @param {string} timelineId - Timeline filter ID
 * @returns {Array} Filtered items
 */
export function filterByTimeline(items, timelineId) {
  if (timelineId === 'all') return items
  const now = new Date()
  const cutoff = new Date()
  if (timelineId === 'today') {
    cutoff.setHours(0, 0, 0, 0)
  } else {
    cutoff.setDate(now.getDate() - parseInt(timelineId))
  }
  return items.filter(item => item.tanggal && new Date(item.tanggal) >= cutoff)
}

/**
 * Get stagger delay for animations
 * Max delay is 300ms to prevent animation lag
 * @param {number} index - Item index
 * @returns {number} Delay in milliseconds
 */
export const getStaggerDelay = (index) => Math.min(index * 50, 300)

/**
 * Get CSS class for stagger animation
 * @param {number} index - Item index
 * @returns {string} CSS class name
 */
export function getStaggerClass(index) {
  return `animate-fade-in stagger-item`
}
