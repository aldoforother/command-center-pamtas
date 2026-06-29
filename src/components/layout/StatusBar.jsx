import { useEffect, useState } from 'react'

export function StatusBar() {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isOnline, setIsOnline]     = useState(navigator.onLine)

  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setLastUpdate(new Date()), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const hhmm = lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <footer
      className="flex items-center justify-between px-4 h-7 flex-shrink-0"
      style={{
        backgroundColor: '#030807',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {/* ── LEFT: status info ── */}
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-150"
            style={{
              backgroundColor: isOnline ? 'var(--accent-primary)' : 'var(--color-danger)',
              boxShadow: isOnline ? '0 0 4px rgba(0,255,136,0.8)' : '0 0 4px rgba(255,59,59,0.8)',
              animation: isOnline ? 'statusPulse 2s ease-in-out infinite' : 'none',
            }}
          />
          <span
            className="text-[9px] font-bold tracking-[0.12em] uppercase transition-colors duration-150"
            style={{
              color: isOnline ? 'rgba(0,255,136,0.7)' : 'var(--color-danger)',
            }}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <span style={{ color: 'var(--accent-muted)' }}>|</span>

        <span
          className="text-[9px] tracking-[0.08em] uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          SYNC <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{hhmm}</span>
        </span>

        <span style={{ color: 'var(--accent-muted)' }}>|</span>

        <span
          className="text-[9px] tracking-[0.08em] uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          DATA <span className="font-mono" style={{ color: 'var(--accent-primary)' }}>SUPABASE</span>
        </span>

        <span style={{ color: 'var(--accent-muted)' }}>|</span>

        {/* Telemetry pills */}
        <div className="flex items-center gap-2">
          <TelePill
            label="SYS"
            value={isOnline ? 'ONLINE' : 'OFFLINE'}
            color={isOnline ? 'green' : 'red'}
          />
          <TelePill label="SYNC" value="AUTO" color="blue" />
          <TelePill label="LAST" value={hhmm} color="amber" />
        </div>
      </div>

      {/* ── RIGHT: unit ── */}
      <div
        className="text-[8px] tracking-[0.15em] uppercase"
        style={{ color: 'var(--text-disabled)' }}
      >
        NARASINGA - 35
      </div>
    </footer>
  )
}

function TelePill({ label, value, color }) {
  const colorMap = {
    green: {
      text: 'var(--accent-primary)',
      border: 'var(--accent-muted)',
      bg: 'rgba(0,0,0,0.3)',
    },
    red: {
      text: 'var(--color-danger)',
      border: 'var(--color-danger-subtle)',
      bg: 'rgba(0,0,0,0.3)',
    },
    blue: {
      text: 'var(--color-info)',
      border: 'var(--color-info-subtle)',
      bg: 'rgba(0,0,0,0.3)',
    },
    amber: {
      text: 'var(--color-warning)',
      border: 'var(--color-warning-subtle)',
      bg: 'rgba(0,0,0,0.3)',
    },
  }

  const styles = colorMap[color] || colorMap.green

  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-sm transition-colors duration-150"
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
      }}
    >
      <span
        className="text-[8px] tracking-[0.1em]"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
      <span
        className="text-[9px] font-mono font-bold tracking-wider"
        style={{ color: styles.text }}
      >
        {value}
      </span>
    </div>
  )
}
