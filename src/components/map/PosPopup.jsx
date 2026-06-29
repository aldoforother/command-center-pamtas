import { formatDate } from '../../utils/formatDate'
import { KERAWANAN_COLOR_MAP } from '../../constants/kerawananCategories'

/** Konversi desimal ke format DMS */
function toDMS(deg, isLat) {
  const abs = Math.abs(deg)
  const d   = Math.floor(abs)
  const mF  = (abs - d) * 60
  const m   = Math.floor(mF)
  const s   = Math.round((mF - m) * 60)
  const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W')
  return `${d}°${String(m).padStart(2,'0')}'${String(s).padStart(2,'0')}" ${dir}`
}

/** Bar kekuatan personel — 5segmen vertikal */
function StrengthBar({ pct }) {
  const filled = Math.round((pct / 100) * 5)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {[4,3,2,1,0].map(i => (
        <div key={i} style={{
          width: '16px',
          height: '6px',
          borderRadius: '1px',
          background: i < filled ? '#00ff88' : 'rgba(0,255,136,0.10)',
          border: '1px solid rgba(0,255,136,0.22)',
          boxShadow: i < filled ? '0 0 3px rgba(0,255,136,0.4)' : 'none',
        }} />
      ))}
    </div>
  )
}

/** SVG Icons untuk popup */
const Icons = {
  location: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  person: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  radio: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31 0a9 9 0 0 1 0 12.73"/></svg>`,
}

/**
 * Popup marker Pos — desain HUD military 2x2 grid
 * Enhanced: CSS tokens compatible, smooth animations
 */
export function PosPopup({ pos, onDetailClick, activeKerawanan = 0 }) {
  const G = '#00ff88'
  const G_DIM = 'rgba(0,255,136,0.55)'
  const G_FAINT = 'rgba(0,255,136,0.12)'
  const G_EDGE = 'rgba(0,255,136,0.30)'
  const TEXT = 'rgba(200,220,210,0.80)'
  const TEXT_D = 'rgba(200,220,210,0.45)'

  const total = Number(pos.jumlah_personel) || 0
  const maxRef = pos.pos_id === 'KT' ? 350 : 26
  const pct = Math.min(100, Math.round((total / maxRef) * 100))
  const activeK = Number(activeKerawanan) || 0

  const latDMS = pos.lat ? toDMS(Number(pos.lat), true) : '—'
  const lngDMS = pos.lng ? toDMS(Number(pos.lng), false) : '—'

  const panel = {
    background: '#060e08',
    border: '1px solid ' + G_EDGE,
    borderRadius: '3px',
    padding: '7px 8px',
  }

  const hdr = {
    display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px',
  }

  const hdrLabel = {
    fontSize: '9px', fontWeight: '800', color: G,
    letterSpacing: '0.13em', textTransform: 'uppercase',
    textShadow: '0 0 6px rgba(0,255,136,0.55)',
  }

  const rowLabel = { fontSize: '9px', color: TEXT_D }
  const rowVal = {
    fontSize: '9px', fontWeight: '700', color: G,
    textShadow: '0 0 5px rgba(0,255,136,0.45)',
  }

  return (
    <div className="map-popup-enter" style={{
      width: '290px',
      background: '#060e08',
      border: '1px solid ' + G_EDGE,
      borderRadius: '5px',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      boxShadow: '0 0 18px rgba(0,255,136,0.10)',
    }}>

      {/* Title bar */}
      <div style={{
        background: G_FAINT,
        borderBottom: '1px solid ' + G_EDGE,
        padding: '7px 12px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '12px', fontWeight: '900', color: G,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          textShadow: '0 0 10px rgba(0,255,136,0.65)',
        }}>
          {pos.nama_pos} ({pos.pos_id})
        </div>
      </div>

      {/* 2x2 Grid */}
      <div style={{
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '5px',
      }}>

        {/* Panel 1 - LOKASI */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ color: G }} dangerouslySetInnerHTML={{ __html: Icons.location }} />
            <span style={hdrLabel}>LOKASI</span>
          </div>
          <div style={{ fontSize: '9px', color: TEXT, lineHeight: 1.55 }}>
            {(pos.lokasi_desa && pos.lokasi_desa !== '—' ? pos.lokasi_desa + ', ' : '')}
            {pos.kabupaten || 'Kab. Nunukan'}
          </div>
          {pos.lat && pos.lng && (
            <div style={{
              marginTop: '4px',
              fontFamily: 'monospace',
              fontSize: '8px',
              color: G_DIM,
              lineHeight: 1.55,
            }}>
              {latDMS}<br />{lngDMS}
            </div>
          )}
        </div>

        {/* Panel 2 - KEKUATAN PERSONEL */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ color: G }} dangerouslySetInnerHTML={{ __html: Icons.person }} />
            <span style={hdrLabel}>KEKUATAN</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <div>
              <div style={{
                fontSize: '22px', fontWeight: '900', color: G, lineHeight: 1,
                textShadow: '0 0 12px rgba(0,255,136,0.7)',
              }}>
                {total}
              </div>
              <div style={{ fontSize: '8px', color: TEXT_D, marginTop: '1px' }}>Pax</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <StrengthBar pct={pct} />
              <span style={{ fontSize: '8px', color: G_DIM }}>{pct}%</span>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid ' + G_FAINT,
            paddingTop: '4px',
            fontSize: '8px',
            color: TEXT_D,
          }}>
            Danpos:{' '}
            <span style={{ color: TEXT }}>
              {(pos.komandan_pos && pos.komandan_pos !== '—' ? pos.komandan_pos : '—')}
            </span>
          </div>
        </div>

        {/* Panel 3 - STATUS */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ color: G }} dangerouslySetInnerHTML={{ __html: Icons.shield }} />
            <span style={hdrLabel}>STATUS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Keamanan</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: activeK > 0 ? '#ff3333' : G,
                textShadow: activeK > 0 ? '0 0 5px rgba(255,51,51,0.5)' : '0 0 5px rgba(0,255,136,0.45)',
              }}>
                {activeK > 0 ? 'WASPADA' : 'AMAN'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Ancaman</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: (pos.kerawanan_utama && pos.kerawanan_utama !== '—' && pos.kerawanan_utama !== '' ? '#ffaa00' : G),
                textShadow: '0 0 5px rgba(0,255,136,0.45)',
              }}>
                {(pos.kerawanan_utama && pos.kerawanan_utama !== '—' && pos.kerawanan_utama !== '' ? pos.kerawanan_utama.slice(0, 12).toUpperCase() : 'NIHIL')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Bangunan</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: (pos.kondisi_bangunan && pos.kondisi_bangunan !== '—' && pos.kondisi_bangunan !== '' ? G : 'rgba(0,255,136,0.45)'),
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {(pos.kondisi_bangunan && pos.kondisi_bangunan !== '—' && pos.kondisi_bangunan !== '' ? pos.kondisi_bangunan.slice(0, 10).toUpperCase() : '—')}
              </span>
            </div>
          </div>
        </div>

        {/* Panel 4 - KOMUNIKASI */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ color: G }} dangerouslySetInnerHTML={{ __html: Icons.radio }} />
            <span style={hdrLabel}>KOMUNIKASI</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Sinyal GSM</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: (pos.jaringan_gsm && pos.jaringan_gsm !== '—' && pos.jaringan_gsm !== '' ? G : 'rgba(0,255,136,0.45)'),
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {(pos.jaringan_gsm && pos.jaringan_gsm !== '—' && pos.jaringan_gsm !== '' ? pos.jaringan_gsm.slice(0, 12).toUpperCase() : '—')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Listrik</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: (pos.sumber_listrik && pos.sumber_listrik !== '—' && pos.sumber_listrik !== '' ? G : 'rgba(0,255,136,0.45)'),
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {(pos.sumber_listrik && pos.sumber_listrik !== '—' && pos.sumber_listrik !== '' ? pos.sumber_listrik.slice(0, 12).toUpperCase() : '—')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Air</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: (pos.sumber_air && pos.sumber_air !== '—' && pos.sumber_air !== '' ? G : 'rgba(0,255,136,0.45)'),
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {(pos.sumber_air && pos.sumber_air !== '—' && pos.sumber_air !== '' ? pos.sumber_air.slice(0, 12).toUpperCase() : '—')}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Button */}
      <div style={{ padding: '0 6px 6px' }}>
        <button
          onClick={() => onDetailClick && onDetailClick(pos.pos_id)}
          className="map-detail-btn"
          style={{
            width: '100%',
            padding: '6px 0',
            background: G_FAINT,
            border: '1px solid ' + G_EDGE,
            borderRadius: '3px',
            color: G,
            fontSize: '9px',
            fontWeight: '800',
            letterSpacing: '0.14em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            textShadow: '0 0 6px rgba(0,255,136,0.5)',
            transition: 'background 150ms, box-shadow 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,255,136,0.18)'
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,136,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = G_FAINT
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          LIHAT DETAIL POS
        </button>
      </div>

    </div>
  )
}

/**
 * Popup marker Kerawanan — HUD style
 * Enhanced: CSS tokens compatible, danger pulse animation
 */
export function KerawananPopup({ item }) {
  const isAktif = item.status?.toLowerCase() === 'aktif'
  const C = KERAWANAN_COLOR_MAP[item.kategori] || '#ff3333'
  const C_DIM = C + '88'
  const C_FAINT = C + '18'
  const C_EDGE = C + '44'
  const TEXT = 'rgba(200,220,210,0.80)'
  const TEXT_D = 'rgba(200,220,210,0.45)'

  const panel = {
    background: '#0b0d10',
    border: '1px solid ' + C_EDGE,
    borderRadius: '3px',
    padding: '7px 8px',
  }

  return (
    <div className="map-popup-enter" style={{
      width: '260px',
      background: '#060810',
      border: '1px solid ' + C_EDGE,
      borderRadius: '5px',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      boxShadow: '0 0 18px ' + C + '22',
    }}>

      {/* Title bar */}
      <div style={{
        background: C + '0d',
        borderBottom: '1px solid ' + C_EDGE,
        padding: '7px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          fontSize: '11px', fontWeight: '900', color: C,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          textShadow: '0 0 10px ' + C + '88',
        }}>
          {item.kategori || 'Kerawanan'}
        </div>
        <div className={isAktif ? 'map-marker-pulse-danger' : ''} style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '2px 7px',
          background: isAktif ? 'rgba(255,51,51,0.12)' : 'rgba(0,255,136,0.08)',
          border: '1px solid ' + (isAktif ? 'rgba(255,51,51,0.35)' : 'rgba(0,255,136,0.25)'),
          borderRadius: '3px',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: isAktif ? '#ff3333' : '#00ff88',
            boxShadow: isAktif ? '0 0 5px rgba(255,51,51,0.8)' : '0 0 5px rgba(0,255,136,0.8)',
          }} />
          <span style={{
            fontSize: '8px', fontWeight: '800', letterSpacing: '0.12em',
            color: isAktif ? '#ff5555' : '#00ff88',
            textTransform: 'uppercase',
          }}>
            {isAktif ? 'AKTIF' : 'DITANGANI'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>

        {/* Deskripsi */}
        {item.deskripsi && (
          <div style={{ ...panel }}>
            <div style={{
              fontSize: '9px', fontWeight: '700', color: C_DIM,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '5px',
            }}>
              KETERANGAN
            </div>
            <p style={{
              fontSize: '11px', color: TEXT,
              lineHeight: 1.55, margin: 0,
            }}>
              {item.deskripsi}
            </p>
          </div>
        )}

        {/* Info grid */}
        <div style={{ ...panel, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <InfoRow label="Tanggal" value={item.tanggal ? formatDate(item.tanggal) : '—'} textColor={TEXT} labelColor={TEXT_D} />
          <InfoRow label="Pos" value={item.pos_id || '—'} textColor={C} labelColor={TEXT_D} />
          {item.pelaku && <InfoRow label="Pelaku" value={item.pelaku} textColor={TEXT} labelColor={TEXT_D} />}
        </div>

        {/* Tindak lanjut */}
        {item.tindak_lanjut && (
          <div style={{ ...panel }}>
            <div style={{
              fontSize: '9px', fontWeight: '700', color: C_DIM,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              TINDAK LANJUT
            </div>
            <p style={{ fontSize: '10px', color: TEXT_D, lineHeight: 1.5, margin: 0 }}>
              {item.tindak_lanjut}
            </p>
          </div>
        )}

      </div>

    </div>
  )
}

function InfoRow({ label, value, textColor, labelColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <span style={{ fontSize: '8px', color: labelColor || 'rgba(200,220,210,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
      <span style={{ fontSize: '10px', fontWeight: '700', color: textColor || 'rgba(200,220,210,0.8)' }}>
        {value}
      </span>
    </div>
  )
}
