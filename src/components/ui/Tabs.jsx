import { useState } from 'react'

/**
 * Tabs Component - Navigation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Tab hover: 100ms ease-out
 * - Active indicator: 150ms ease-out
 * - Content transition: 150ms ease-out
 *
 * Features:
 * - Keyboard navigation
 * - Full ARIA support
 * - Badge support
 * - Icon support
 */

/**
 * Tabs - Tab navigation container
 *
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects { value, label, content, icon, badge }
 * @param {string} props.defaultTab - Default active tab value
 * @param {Function} props.onChange - Callback when tab changes
 * @param {string} props.className - Additional classes
 */
export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value)

  const handleTabClick = (tab) => {
    setActiveTab(tab.value)
    onChange?.(tab)
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length
      const nextTab = tabs[nextIndex]
      setActiveTab(nextTab.value)
      onChange?.(nextTab)
      document.getElementById(`tab-${nextTab.value}`)?.focus()
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      const prevTab = tabs[prevIndex]
      setActiveTab(prevTab.value)
      onChange?.(prevTab)
      document.getElementById(`tab-${prevTab.value}`)?.focus()
    } else if (e.key === 'Home') {
      const firstTab = tabs[0]
      setActiveTab(firstTab.value)
      onChange?.(firstTab)
      document.getElementById(`tab-${firstTab.value}`)?.focus()
    } else if (e.key === 'End') {
      const lastTab = tabs[tabs.length - 1]
      setActiveTab(lastTab.value)
      onChange?.(lastTab)
      document.getElementById(`tab-${lastTab.value}`)?.focus()
    }
  }

  const activeContent = tabs.find(t => t.value === activeTab)?.content

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        className="flex overflow-x-auto scrollbar-hide"
        role="tablist"
        aria-orientation="horizontal"
        style={{
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--surface-secondary)',
        }}
      >
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.value}
            id={`tab-${tab.value}`}
            tab={tab}
            isActive={activeTab === tab.value}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      {/* Tab content */}
      {activeContent && (
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="animate-fade-in"
          style={{
            animationDuration: 'var(--duration-normal)',
            animationTimingFunction: 'var(--ease-out)',
            animationFillMode: 'both',
          }}
        >
          {activeContent}
        </div>
      )}
    </div>
  )
}

/**
 * TabButton - Individual tab button
 */
function TabButton({ id, tab, isActive, onClick, onKeyDown }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      id={id}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${tab.value}`}
      tabIndex={isActive ? 0 : -1}
      className={`
        relative px-4 py-3
        transition-all duration-100
        whitespace-nowrap
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
      `}
      style={{
        color: isActive
          ? 'var(--accent-primary)'
          : isHovered
            ? 'var(--text-secondary)'
            : 'var(--text-tertiary)',
        background: isActive
          ? 'transparent'
          : isHovered
            ? 'var(--surface-tertiary)'
            : 'transparent',
        borderBottom: isActive
          ? '2px solid var(--accent-primary)'
          : '2px solid transparent',
        marginBottom: '-1px',
        transitionTimingFunction: 'var(--ease-out)',
      }}
    >
      <span className="flex items-center gap-2">
        {tab.icon && (
          <span
            className="w-4 h-4"
            style={{ opacity: isActive ? 1 : 0.7 }}
          >
            {tab.icon}
          </span>
        )}
        <span
          className="text-label-sm font-medium tracking-wide"
        >
          {tab.label}
        </span>
        {tab.badge !== undefined && (
          <span
            className="ml-1 px-1.5 py-0.5 rounded-sm font-bold"
            style={{
              fontSize: '9px',
              background: isActive
                ? 'var(--accent-muted)'
                : 'var(--surface-muted)',
              color: isActive
                ? 'var(--accent-primary)'
                : 'var(--text-tertiary)',
            }}
          >
            {tab.badge}
          </span>
        )}
      </span>
    </button>
  )
}

/**
 * TabList - Wrapper for tab buttons (for custom layouts)
 */
export function TabList({ children, className = '' }) {
  return (
    <div
      className={`flex overflow-x-auto scrollbar-hide ${className}`}
      role="tablist"
      style={{
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--surface-secondary)',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Tab - Individual tab button (for custom layouts)
 */
export function Tab({
  id,
  isActive,
  onClick,
  icon,
  label,
  badge,
  children,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      id={id}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="tab"
      aria-selected={isActive}
      className={`
        relative px-4 py-3
        transition-all duration-100
        whitespace-nowrap
        focus:outline-none
      `}
      style={{
        color: isActive
          ? 'var(--accent-primary)'
          : isHovered
            ? 'var(--text-secondary)'
            : 'var(--text-tertiary)',
        background: isActive
          ? 'transparent'
          : isHovered
            ? 'var(--surface-tertiary)'
            : 'transparent',
        borderBottom: isActive
          ? '2px solid var(--accent-primary)'
          : '2px solid transparent',
        marginBottom: '-1px',
        transitionTimingFunction: 'var(--ease-out)',
      }}
    >
      <span className="flex items-center gap-2">
        {icon && (
          <span
            className="w-4 h-4"
            style={{ opacity: isActive ? 1 : 0.7 }}
          >
            {icon}
          </span>
        )}
        {(label || children) && (
          <span className="text-label-sm font-medium tracking-wide">
            {label || children}
          </span>
        )}
        {badge !== undefined && (
          <span
            className="ml-1 px-1.5 py-0.5 rounded-sm font-bold"
            style={{
              fontSize: '9px',
              background: isActive
                ? 'var(--accent-muted)'
                : 'var(--surface-muted)',
              color: isActive
                ? 'var(--accent-primary)'
                : 'var(--text-tertiary)',
            }}
          >
            {badge}
          </span>
        )}
      </span>
    </button>
  )
}

/**
 * TabPanels - Wrapper for tab content panels
 */
export function TabPanels({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

/**
 * TabPanel - Individual tab content panel
 */
export function TabPanel({
  id,
  isActive,
  children,
  className = '',
  tabIndex,
}) {
  if (!isActive) return null

  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={id?.replace('panel-', 'tab-')}
      tabIndex={tabIndex ?? 0}
      className={`animate-fade-in ${className}`}
      style={{
        animationDuration: 'var(--duration-normal)',
        animationTimingFunction: 'var(--ease-out)',
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  )
}

export default Tabs