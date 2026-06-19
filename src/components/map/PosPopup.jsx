import { formatDate } from '../../utils/formatDate'

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

/** Bar kekuatan personel — 5 segmen vertikal */
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

/**
 * Popup marker Pos — desain HUD military 2×2 grid
 * Warna seragam hijau untuk semua pos
 */
export function PosPopup({ pos, onDetailClick }) {
  const G      = '#00ff88'
  const G_DIM  = 'rgba(0,255,136,0.55)'
  const G_FAINT= 'rgba(0,255,136,0.12)'
  const G_EDGE = 'rgba(0,255,136,0.30)'
  const TEXT   = 'rgba(200,220,210,0.80)'
  const TEXT_D = 'rgba(200,220,210,0.45)'

  const total  = Number(pos.jumlah_personel) || 0
  const maxRef = pos.pos_id === 'KT' ? 350 : 26
  const pct    = Math.min(100, Math.round((total / maxRef) * 100))

  const latDMS = pos.lat ? toDMS(Number(pos.lat), true)  : '—'
  const lngDMS = pos.lng ? toDMS(Number(pos.lng), false) : '—'

  const panel = {
    background: '#0b160d',
    border: `1px solid ${G_EDGE}`,
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
  const rowVal   = {
    fontSize: '9px', fontWeight: '700', color: G,
    textShadow: '0 0 5px rgba(0,255,136,0.45)',
  }

  return (
    <div style={{
      width: '290px',
      background: '#060e08',
      border: `1px solid ${G_EDGE}`,
      borderRadius: '5px',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
      boxShadow: '0 0 18px rgba(0,255,136,0.10)',
    }}>

      {/* ── Title bar ── */}
      <div style={{
        background: 'rgba(0,255,136,0.06)',
        borderBottom: `1px solid ${G_EDGE}`,
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

      {/* ── 2×2 Grid ── */}
      <div style={{
        padding: '6px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '5px',
      }}>

        {/* Panel 1 — LOKASI */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ fontSize: '11px' }}>🗺️</span>
            <span style={hdrLabel}>LOKASI</span>
          </div>
          <div style={{ fontSize: '9px', color: TEXT, lineHeight: 1.55 }}>
            {pos.lokasi_desa && pos.lokasi_desa !== '—'
              ? pos.lokasi_desa + ', '
              : ''}
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

        {/* Panel 2 — KEKUATAN PERSONEL */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ fontSize: '11px' }}>👥</span>
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
            borderTop: `1px solid ${G_FAINT}`,
            paddingTop: '4px',
            fontSize: '8px',
            color: TEXT_D,
          }}>
            Danpos:{' '}
            <span style={{ color: TEXT }}>
              {pos.komandan_pos && pos.komandan_pos !== '—'
                ? pos.komandan_pos
                : '—'}
            </span>
          </div>
        </div>

        {/* Panel 3 — STATUS */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ fontSize: '11px' }}>🛡️</span>
            <span style={hdrLabel}>STATUS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Keamanan</span>
              <span style={rowVal}>AMAN</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Ancaman</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: pos.kerawanan_utama && pos.kerawanan_utama !== '—' && pos.kerawanan_utama !== ''
                  ? '#ffaa00' : G,
                textShadow: '0 0 5px rgba(0,255,136,0.45)',
              }}>
                {pos.kerawanan_utama && pos.kerawanan_utama !== '—' && pos.kerawanan_utama !== ''
                  ? pos.kerawanan_utama.slice(0, 12).toUpperCase()
                  : 'NIHIL'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Bangunan</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: pos.kondisi_bangunan && pos.kondisi_bangunan !== '—' && pos.kondisi_bangunan !== ''
                  ? G : 'rgba(0,255,136,0.45)',
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {pos.kondisi_bangunan && pos.kondisi_bangunan !== '—' && pos.kondisi_bangunan !== ''
                  ? pos.kondisi_bangunan.slice(0, 10).toUpperCase()
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Panel 4 — KOMUNIKASI */}
        <div style={panel}>
          <div style={hdr}>
            <span style={{ fontSize: '11px' }}>📻</span>
            <span style={hdrLabel}>KOMUNIKASI</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Sinyal GSM</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: pos.jaringan_gsm && pos.jaringan_gsm !== '—' && pos.jaringan_gsm !== ''
                  ? G : 'rgba(0,255,136,0.45)',
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {pos.jaringan_gsm && pos.jaringan_gsm !== '—' && pos.jaringan_gsm !== ''
                  ? pos.jaringan_gsm.slice(0, 12).toUpperCase()
                  : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Listrik</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: pos.sumber_listrik && pos.sumber_listrik !== '—' && pos.sumber_listrik !== ''
                  ? G : 'rgba(0,255,136,0.45)',
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {pos.sumber_listrik && pos.sumber_listrik !== '—' && pos.sumber_listrik !== ''
                  ? pos.sumber_listrik.slice(0, 12).toUpperCase()
                  : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={rowLabel}>Air</span>
              <span style={{
                fontSize: '9px', fontWeight: '700',
                color: pos.sumber_air && pos.sumber_air !== '—' && pos.sumber_air !== ''
                  ? G : 'rgba(0,255,136,0.45)',
                textShadow: '0 0 5px rgba(0,255,136,0.3)',
              }}>
                {pos.sumber_air && pos.sumber_air !== '—' && pos.sumber_air !== ''
                  ? pos.sumber_air.slice(0, 12).toUpperCase()
                  : '—'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Button ── */}
      <div style={{ padding: '0 6px 6px' }}>
        <button
          onClick={() => onDetailClick && onDetailClick(pos.pos_id)}
          style={{
            width: '100%',
            padding: '6px 0',
            background: G_FAINT,
            border: `1px solid ${G_EDGE}`,
            borderRadius: '3px',
            color: G,
            fontSize: '9px',
            fontWeight: '800',
            letterSpacing: '0.14em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            textShadow: '0 0 6px rgba(0,255,136,0.5)',
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,255,136,0.18)'
            e.currentTarget.style.boxShadow  = '0 0 10px rgba(0,255,136,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = G_FAINT
            e.currentTarget.style.boxShadow  = 'none'
          }}
        >
          ▶ LIHAT DETAIL POS
        </button>
      </div>

    </div>
  )
}

/**
 * Popup marker Kerawanan — tidak diubah
 */
export function KerawananPopup({ item }) {
  const isAktif = item.status === 'aktif'
  return (
    <div style={{ minWidth: '180px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: isAktif ? '#ff3333' : '#00ff88',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isAktif ? '#ff5555' : '#00ff88',
        }}>
          {item.kategori || 'Kerawanan'}
        </span>
      </div>

      {item.deskripsi && (
        <p style={{
          fontSize: '11px', color: 'rgba(200,214,229,0.75)',
          lineHeight: 1.5, margin: '0 0 8px 0',
        }}>
          {item.deskripsi}
        </p>
      )}

      <div style={{
        borderTop: '1px solid rgba(0,255,136,0.12)',
        paddingTop: '8px',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {item.tanggal && <KPopupRow label="Tanggal" value={formatDate(item.tanggal)} />}
        <KPopupRow
          label="Status"
          value={isAktif ? '● Aktif' : '✓ Selesai'}
          valueColor={isAktif ? '#ff5555' : '#00ff88'}
        />
        {item.pos_id && <KPopupRow label="Pos" value={item.pos_id} />}
      </div>
    </div>
  )
}

function KPopupRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '10px', color: 'rgba(200,214,229,0.4)' }}>{label}</span>
      <span style={{ fontSize: '10px', color: valueColor || 'rgba(200,214,229,0.75)', fontWeight: '500' }}>
        {value}
      </span>
    </div>
  )
}
