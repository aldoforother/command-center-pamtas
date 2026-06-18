import { formatDate } from '../../utils/formatDate'
import { KerawananBadge } from '../ui/Badge'

/**
 * Popup konten untuk marker Pos — dark military HUD theme
 * Warna cyan/gold agar berbeda dari dashboard utama (hijau #00ff88)
 */
export function PosPopup({ pos, onDetailClick }) {
  const isKotis      = pos.pos_id === 'KOTIS'
  const accent       = isKotis ? '#ffd700'              : '#00ccff'
  const accentDim    = isKotis ? 'rgba(255,215,0,0.12)' : 'rgba(0,204,255,0.10)'
  const accentBorder = isKotis ? 'rgba(255,215,0,0.35)' : 'rgba(0,204,255,0.30)'
  const accentGlow   = isKotis ? 'rgba(255,215,0,0.18)' : 'rgba(0,204,255,0.14)'

  return (
    <div style={{
      minWidth: '215px',
      background: 'linear-gradient(135deg, #080d1a 0%, #0c1422 100%)',
      border: `1px solid ${accentBorder}`,
      borderRadius: '3px',
      boxShadow: `0 0 28px rgba(0,0,0,0.85), 0 0 14px ${accentGlow}`,
      fontFamily: "'JetBrains Mono', monospace",
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(90deg, ${accentDim}, transparent)`,
        borderBottom: `1px solid ${accentBorder}`,
        padding: '7px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          padding: '2px 8px',
          borderRadius: '2px',
          background: accentDim,
          border: `1px solid ${accentBorder}`,
          fontSize: '10px',
          fontWeight: 'bold',
          color: accent,
          letterSpacing: '0.08em',
          textShadow: `0 0 8px ${accent}`,
          flexShrink: 0,
        }}>
          {pos.pos_id}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: '10px',
            fontWeight: '700',
            color: 'rgba(200,220,240,0.95)',
            letterSpacing: '0.03em',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {pos.nama_pos}
          </p>
          <p style={{
            margin: 0,
            fontSize: '8px',
            color: 'rgba(150,180,210,0.4)',
            letterSpacing: '0.05em',
          }}>
            {pos.lokasi_desa !== '—' ? pos.lokasi_desa : pos.kabupaten}
          </p>
        </div>
      </div>

      {/* Scan line */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
      }} />

      {/* Data rows */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <DataRow label="DPP"      value={pos.komandan_pos || '—'} accent={accent} />
        <DataRow label="PERSONEL" value={`${pos.jumlah_personel || 0} orang`} accent={accent} highlight />
        {pos.lat && pos.lng && (
          <DataRow
            label="KOORDINAT"
            value={`${Number(pos.lat).toFixed(4)}, ${Number(pos.lng).toFixed(4)}`}
            accent={accent}
            mono
          />
        )}
      </div>

      {/* Divider */}
      <div style={{
        margin: '0 10px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentBorder}, transparent)`,
      }} />

      {/* Button */}
      <div style={{ padding: '7px 10px' }}>
        <button
          onClick={() => onDetailClick && onDetailClick(pos.pos_id)}
          style={{
            width: '100%',
            padding: '5px 0',
            background: `linear-gradient(90deg, ${accentDim}, rgba(0,0,0,0.15))`,
            border: `1px solid ${accentBorder}`,
            borderRadius: '2px',
            color: accent,
            fontSize: '9px',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: '700',
            letterSpacing: '0.18em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            textShadow: `0 0 8px ${accent}`,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 0 16px ${accentGlow}`
            e.currentTarget.style.borderColor = accent
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = accentBorder
          }}
        >
          ▶ LIHAT DETAIL POS
        </button>
      </div>

    </div>
  )
}

function DataRow({ label, value, accent, highlight, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontSize: '8px',
        color: 'rgba(150,180,210,0.4)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: mono ? '9px' : '10px',
        color: highlight ? accent : 'rgba(200,220,240,0.8)',
        fontWeight: highlight ? '700' : '500',
        fontFamily: "'JetBrains Mono', monospace",
        textAlign: 'right',
        textShadow: highlight ? `0 0 6px ${accent}88` : 'none',
        letterSpacing: mono ? '0.02em' : '0.04em',
      }}>
        {value}
      </span>
    </div>
  )
}

/**
 * Popup konten untuk marker Kerawanan
 */
export function KerawananPopup({ item }) {
  return (
    <div className="min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-military-danger flex-shrink-0" />
        <KerawananBadge kategori={item.kategori} />
      </div>

      <p className="text-military-text text-xs mb-2 leading-relaxed">{item.deskripsi}</p>

      <div className="space-y-1 text-xs border-t border-military-border pt-2">
        <div className="flex justify-between">
          <span className="text-military-subtext">Tanggal</span>
          <span className="text-military-text">{formatDate(item.tanggal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-military-subtext">Status</span>
          <span className={item.status === 'aktif' ? 'text-red-400' : 'text-green-400'}>
            {item.status === 'aktif' ? '● Aktif' : '✓ Selesai'}
          </span>
        </div>
        {item.pos_id && (
          <div className="flex justify-between">
            <span className="text-military-subtext">Pos</span>
            <span className="text-military-text">{item.pos_id}</span>
          </div>
        )}
      </div>
    </div>
  )
}
