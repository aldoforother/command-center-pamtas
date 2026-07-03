import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePos } from '../hooks/useSupabase'
import { LoadingSpinner } from '../components/ui'

/**
 * SettingsPage - User settings and system information
 * Accessible to all logged-in users (not just admin)
 */
export default function SettingsPage() {
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const { data: posList, loading: posLoading } = usePos()

  const [copied, setCopied] = useState(null)

  // Copy to clipboard helper
  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Calculate system stats
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)
  const totalPos = (posList || []).length

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: 'linear-gradient(180deg, var(--surface-base) 0%, rgba(10,15,20,0.98) 100%)' }}>
      {/* Header */}
      <div className="mb-6 relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full"
          style={{ background: 'linear-gradient(180deg, #a855f7, transparent)', boxShadow: '0 0 20px #a855f7' }} />
        <h2 className="font-bold text-base tracking-widest uppercase pl-4"
          style={{ color: '#a855f7', textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>
          ⚙ PENGATURAN
        </h2>
        <p className="text-[11px] tracking-wider mt-1 pl-4" style={{ color: 'var(--text-tertiary)' }}>
          Profil operator dan informasi sistem
        </p>
      </div>

      <div className="space-y-5 max-w-3xl">

        {/* User Profile Card */}
        <div className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(168,85,247,0.25)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3), 0 0 30px rgba(168,85,247,0.1)',
          }}>
          <div className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(168,85,247,0.08)', borderBottom: '1px solid rgba(168,85,247,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <svg className="w-5 h-5" fill="none" stroke="#a855f7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(168,85,247,0.6)' }}>
                Profil Operator
              </p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {profile?.nama || user?.email || 'Operator'}
              </p>
            </div>
            <div className="ml-auto">
              <span className="text-[9px] px-3 py-1 rounded-full font-medium"
                style={{
                  background: profile?.role === 'admin' ? 'rgba(168,85,247,0.2)' : 'rgba(0,255,136,0.1)',
                  color: profile?.role === 'admin' ? '#a855f7' : '#00ff88',
                  border: `1px solid ${profile?.role === 'admin' ? 'rgba(168,85,247,0.4)' : 'rgba(0,255,136,0.3)'}`,
                }}>
                {profile?.role?.toUpperCase() || 'OPERATOR'}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <InfoRow
              label="Email"
              value={user?.email || '—'}
              onCopy={() => copyToClipboard(user?.email, 'email')}
              copied={copied === 'email'}
            />
            <InfoRow
              label="Pos Binaan"
              value={profile?.pos_id ? `${profile.pos_id} - ${profile.pos_nama || ''}` : 'Semua Pos'}
            />
            <InfoRow
              label="User ID"
              value={user?.id?.substring(0, 20) + '...'}
              onCopy={() => copyToClipboard(user?.id, 'userid')}
              copied={copied === 'userid'}
            />
          </div>
        </div>

        {/* System Information */}
        <div className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>
          <div className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <svg className="w-5 h-5" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(59,130,246,0.6)' }}>
                Informasi Sistem
              </p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Status & Statistik
              </p>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <StatBox label="Total Pos" value={totalPos} color="#3b82f6" />
              <StatBox label="Total Personel" value={totalPersonel} color="#00ff88" />
              <StatBox label="Versi App" value="2.6" color="#a855f7" />
              <StatBox label="Status" value="ONLINE" color="#00ff88" />
            </div>

            <div className="space-y-2">
              <InfoRow label="Supabase URL" value="● Connected" status="success" />
              <InfoRow label="Last Sync" value={new Date().toLocaleString('id-ID')} />
              <InfoRow label="Environment" value={import.meta.env.MODE || 'production'} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(20,25,30,0.95) 100%)',
            border: '1px solid rgba(0,255,136,0.15)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>
          <div className="px-4 py-3"
            style={{ background: 'rgba(0,255,136,0.05)', borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(0,255,136,0.6)' }}>
              Aksi Cepat
            </p>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.2)'
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.1)'
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'
              }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium" style={{ color: '#3b82f6' }}>
                  Refresh Data
                </span>
              </div>
              <span style={{ color: 'rgba(59,130,246,0.4)' }}>→</span>
            </button>

            <button
              onClick={signOut}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all"
              style={{
                background: 'rgba(255,80,80,0.1)',
                border: '1px solid rgba(255,80,80,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,80,80,0.2)'
                e.currentTarget.style.borderColor = 'rgba(255,80,80,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,80,80,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,80,80,0.3)'
              }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="#ff5050" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium" style={{ color: '#ff5050' }}>
                  Keluar / Logout
                </span>
              </div>
              <span style={{ color: 'rgba(255,80,80,0.4)' }}>→</span>
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center py-4">
          <p className="text-[9px]" style={{ color: 'var(--text-disabled)' }}>
            COMMAND CENTER PAMTAS · YONKAV 8/NSW · TA 2026
          </p>
          <p className="text-[8px] mt-1" style={{ color: 'rgba(200,214,229,0.2)' }}>
            Built with React + Supabase
          </p>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, onCopy, copied, status }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
        {status === 'success' && (
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          {value}
        </span>
        {onCopy && (
          <button
            onClick={onCopy}
            className="p-1 rounded transition-all"
            style={{ color: 'var(--text-disabled)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00ff88' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-disabled)' }}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="#00ff88" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className="text-center p-3 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <p className="font-mono font-bold text-lg" style={{ color, textShadow: `0 0 20px ${color}50` }}>
        {value}
      </p>
      <p className="text-[8px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
    </div>
  )
}
