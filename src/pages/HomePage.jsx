import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAllKerawanan, usePos, useSummary } from '../hooks/useSupabase'
import { StatChip, StatusDot } from '../components/ui'

/**
 * HomePage — Premium Tactical Command Center Home
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Page entrance: 400ms ease-out
 * - Stagger animations: 50ms increments
 * - Card hover: 150ms lift effect
 * - Button press: 50ms scale
 *
 * Features:
 * - Centered command emblem
 * - Stat overview chips
 * - Navigation cards with icons
 * - Quick access to 17 POS
 */

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: kerawanan } = useAllKerawanan()
  const { data: posList } = usePos()
  const { data: summary } = useSummary()

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length
  const totalPos = (posList || []).length || 17
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--surface-base)' }}>
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-10">

        {/* ══ Logo / Emblem ══ */}
        <div className="mb-8 flex flex-col items-center animate-fade-in">
          {/* Outer ring */}
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, rgba(0,255,136,0.04) 60%, transparent 100%)',
              border: '2px solid rgba(0,255,136,0.3)',
              boxShadow: '0 0 60px rgba(0,255,136,0.15), inset 0 0 40px rgba(0,255,136,0.05)',
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
              }}
            />
            {/* Shield icon */}
            <svg
              className="w-16 h-16 relative z-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              style={{ color: 'var(--accent-primary)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-2xl font-black tracking-[0.3em] uppercase text-center"
            style={{
              color: 'var(--accent-primary)',
              textShadow: '0 0 20px rgba(0,255,136,0.5)',
            }}
          >
            COMMAND CENTER
          </h1>
          <p
            className="text-[11px] tracking-[0.25em] uppercase mt-1 text-center"
            style={{ color: 'var(--text-tertiary)' }}
          >
            PAMTAS RI — MALAYSIA
          </p>
          <p
            className="text-[10px] tracking-widest uppercase mt-0.5"
            style={{ color: 'var(--accent-primary)', opacity: 0.5 }}
          >
            YONKAV 8/NSW · TA 2026
          </p>
        </div>

        {/* ══ Stat Chips ══ */}
        <div className="flex flex-wrap gap-3 justify-center mb-8 animate-fade-in stagger-1">
          <StatChip
            label="Personel"
            value={totalPersonel}
            color="var(--accent-primary)"
          />
          <StatChip
            label="Pos Aktif"
            value={totalPos}
            color="var(--color-info)"
          />
          <StatChip
            label="Penduduk"
            value={(summary?.total_penduduk || 0).toLocaleString('id-ID')}
            color="var(--color-purple)"
          />
          <StatChip
            label="Insiden Aktif"
            value={aktifCount}
            color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
            pulse={aktifCount > 0}
          />
        </div>

        {/* ══ Greeting ══ */}
        {profile?.nama && (
          <p
            className="text-[11px] tracking-widest uppercase mb-6 animate-fade-in stagger-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Selamat datang,{' '}
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
              {profile.nama}
            </span>
          </p>
        )}

        {/* ══ Navigation Cards ══ */}
        <div
          className="grid grid-cols-2 gap-3 w-full max-w-sm animate-fade-in stagger-3"
        >
          <NavCard
            icon={<MapIcon />}
            label="Overview"
            desc="Peta & situasi terkini"
            onClick={() => navigate('/overview')}
            color="var(--accent-primary)"
            staggerDelay={0}
          />
          <NavCard
            icon={<AlertIcon />}
            label="Data Insiden"
            desc={aktifCount > 0 ? `${aktifCount} insiden aktif` : 'Semua insiden'}
            onClick={() => navigate('/insiden')}
            color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
            danger={aktifCount > 0}
            staggerDelay={50}
          />
          <NavCard
            icon={<HandshakeIcon />}
            label="Program Binter"
            desc="Kegiatan teritorial"
            onClick={() => navigate('/binter')}
            color="var(--color-info)"
            staggerDelay={100}
          />
          <NavCard
            icon={<ChartIcon />}
            label="Laporan"
            desc="Grafik & analisis"
            onClick={() => navigate('/laporan/kerawanan')}
            color="var(--color-purple)"
            staggerDelay={150}
          />
        </div>

        {/* ══ Divider ══ */}
        <div
          className="w-full max-w-sm my-6 animate-fade-in stagger-4"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)',
          }}
        />

        {/* ══ POS Grid ══ */}
        <div className="w-full max-w-sm animate-fade-in stagger-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--accent-primary)',
                boxShadow: '0 0 6px var(--accent-primary)',
              }}
            />
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-tertiary)' }}>
              17 POS SATGAS
            </p>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(posList || []).map((pos, i) => {
              const posKey = pos.pos_id.replace('POS-', '')
              const hasRawan = (kerawanan || []).some(
                k => k.pos_id === pos.pos_id && k.status?.toLowerCase() === 'aktif'
              )
              return (
                <POSButton
                  key={pos.pos_id}
                  posId={posKey}
                  hasRawan={hasRawan}
                  onClick={() => navigate(`/pos/${pos.pos_id}`)}
                  delay={350 + i * 30}
                />
              )
            })}
          </div>
        </div>

        {/* ══ Footer ══ */}
        <p
          className="text-[8px] tracking-[0.2em] uppercase mt-8 animate-fade-in stagger-5"
          style={{ color: 'var(--text-disabled)' }}
        >
          SISTEM INFORMASI KOMANDO TAKTIS · SATGAS PAMTAS
        </p>
      </div>
    </div>
  )
}

/* ── NavCard Component ─────────────────────────────── */
function NavCard({ icon, label, desc, onClick, color, danger, staggerDelay = 0 }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="flex flex-col items-start p-3 rounded-sm text-left transition-all duration-150 animate-scale-in"
      style={{
        background: isHovered
          ? (danger ? 'rgba(255,51,51,0.12)' : `${color}12`)
          : (danger ? 'var(--color-danger-subtle)' : `${color}08`),
        border: `1px solid ${danger ? 'var(--color-danger-subtle)' : color + '20'}`,
        animationDelay: `${staggerDelay}ms`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered
          ? (danger ? 'var(--shadow-glow-danger)' : `0 8px 16px rgba(0,0,0,0.3)`)
          : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-6 h-6 mb-2 flex items-center justify-center transition-all duration-150"
        style={{
          color: danger ? 'var(--color-danger)' : color,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {icon}
      </div>
      <p
        className="text-[11px] font-bold uppercase tracking-wider"
        style={{ color: danger ? 'var(--color-danger)' : color }}
      >
        {label}
      </p>
      <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
        {desc}
      </p>
    </button>
  )
}

/* ── POSButton Component ────────────────────────────── */
function POSButton({ posId, hasRawan, onClick, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const color = hasRawan ? 'var(--color-danger)' : 'var(--accent-primary)'

  return (
    <button
      onClick={onClick}
      className="py-2 px-1 rounded-sm text-[10px] font-bold font-mono transition-all duration-100 animate-fade-in"
      style={{
        background: isHovered ? `${color}15` : (hasRawan ? 'var(--color-danger-subtle)' : 'var(--accent-muted)'),
        border: `1px solid ${isHovered ? color : (hasRawan ? 'var(--color-danger-subtle)' : 'var(--accent-muted)')}`,
        color: hasRawan ? 'var(--color-danger)' : 'var(--accent-primary)',
        animationDelay: `${delay}ms`,
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isHovered ? `0 0 12px ${color}30` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {posId}
      {hasRawan && (
        <span
          className="block w-1 h-1 rounded-full mx-auto mt-0.5 animate-pulse"
          style={{ background: 'var(--color-danger)' }}
        />
      )}
    </button>
  )
}

/* ── Icon Components ──────────────────────────────── */
function MapIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6 3m0 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function HandshakeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}