import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { useToast } from '../ui/Toast'
import { demografiService } from '../../services/demografi.service'

/**
 * GeoDemoKonsos — Tab Geo-Demo-Konsos di PosDetailPage.
 *
 * Menampilkan tiga aspek: Kondisi Geografi, Kondisi Demografi, Kondisi Sosial.
 * Setiap aspek bisa diedit secara inline jika posId tersedia.
 * Field teks bebas (geografi, demografi_notes, konsos_notes) disimpan ke Supabase
 * via demografiService.upsert() — membutuhkan kolom tersebut sudah ada di tabel.
 *
 * SQL migration (jalankan sekali di Supabase SQL Editor):
 *   ALTER TABLE demografi
 *     ADD COLUMN IF NOT EXISTS geografi        TEXT,
 *     ADD COLUMN IF NOT EXISTS demografi_notes TEXT,
 *     ADD COLUMN IF NOT EXISTS konsos_notes    TEXT;
 */
export function GeoDemoKonsos({ demografi, pos, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const [editAspek, setEditAspek] = useState(null) // 'geografi' | 'demografi_notes' | 'konsos_notes'
  const [saving,    setSaving]    = useState(false)

  if (loading) return <LoadingSpinner text="Memuat data..." />
  if (!demografi && !pos) return <EmptyState title="Data belum tersedia" />

  const penduduk = demografi?.total_penduduk || 0
  const kk       = demografi?.total_kk       || 0
  const rataKK   = kk > 0 ? (penduduk / kk).toFixed(1) : null

  let klasifikasiDemo = '—'
  if (penduduk > 0 && kk > 0) {
    if (penduduk < 500)       klasifikasiDemo = 'Wilayah Jarang Penduduk'
    else if (penduduk < 2000) klasifikasiDemo = 'Wilayah Penduduk Sedang'
    else                      klasifikasiDemo = 'Wilayah Padat Penduduk'
  }
  const hasDemoData = penduduk > 0 || kk > 0

  const handleSaveAspek = async (field, value) => {
    if (!posId) { showToast('posId tidak tersedia', 'error'); return }
    setSaving(true)
    try {
      await demografiService.upsert(posId, { [field]: value.trim() || null })
      showToast('Berhasil disimpan', 'success')
      setEditAspek(null)
      onRefresh && onRefresh()
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 fade-in">

      {/* ── 1. Kondisi Geografi ─────────────────────────── */}
      <Section
        icon="◬"
        label="Kondisi Geografi"
        color="rgba(0,255,136,0.25)"
        glow="rgba(0,255,136,0.15)"
        field="geografi"
        canEdit={!!posId}
        isEditing={editAspek === 'geografi'}
        onEdit={() => setEditAspek('geografi')}
        onCancelEdit={() => setEditAspek(null)}
      >
        {editAspek === 'geografi' ? (
          <AspekEditForm
            field="geografi"
            initial={demografi?.geografi || ''}
            placeholder="Deskripsikan kondisi geografi wilayah tugas pos ini: topografi, batas wilayah, aksesibilitas, dll."
            onSave={handleSaveAspek}
            onCancel={() => setEditAspek(null)}
            saving={saving}
          />
        ) : demografi?.geografi ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.geografi}
          </p>
        ) : (
          <div className="space-y-2">
            {pos?.kabupaten   && <InfoRow label="Kabupaten"    value={pos.kabupaten} />}
            {pos?.kecamatan   && <InfoRow label="Kecamatan"    value={pos.kecamatan} />}
            {pos?.lokasi_desa && <InfoRow label="Desa / Lokasi" value={pos.lokasi_desa} />}
            {pos?.provinsi    && <InfoRow label="Provinsi"     value={pos.provinsi} />}
            {pos?.lat && pos?.lng && (
              <InfoRow label="Koordinat" value={`${pos.lat}°N, ${pos.lng}°E`} mono />
            )}
            {pos?.jumlah_patok && (
              <InfoRow label="Jumlah Patok" value={`${pos.jumlah_patok} patok`} />
            )}
            {!pos?.kabupaten && !pos?.lokasi_desa && (
              <EmptyHint text="Data geografi belum diisi." />
            )}
          </div>
        )}
      </Section>

      {/* ── 2. Kondisi Demografi ────────────────────────── */}
      <Section
        icon="◈"
        label="Kondisi Demografi"
        color="rgba(68,136,255,0.25)"
        glow="rgba(68,136,255,0.15)"
        field="demografi_notes"
        canEdit={!!posId}
        isEditing={editAspek === 'demografi_notes'}
        onEdit={() => setEditAspek('demografi_notes')}
        onCancelEdit={() => setEditAspek(null)}
      >
        {editAspek === 'demografi_notes' ? (
          <AspekEditForm
            field="demografi_notes"
            initial={demografi?.demografi_notes || ''}
            placeholder="Deskripsikan kondisi demografi: komposisi penduduk, pola migrasi, pertumbuhan penduduk, karakteristik warga perbatasan, dll."
            onSave={handleSaveAspek}
            onCancel={() => setEditAspek(null)}
            saving={saving}
          />
        ) : demografi?.demografi_notes ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.demografi_notes}
          </p>
        ) : hasDemoData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Total Penduduk" value={penduduk.toLocaleString('id-ID')} unit="jiwa" color="#4488ff" />
              <StatBox label="Kepala Keluarga" value={kk.toLocaleString('id-ID')}      unit="KK"   color="#4488ff" />
            </div>
            <div className="space-y-1 pt-1 border-t border-[rgba(68,136,255,0.08)]">
              {rataKK && <InfoRow label="Rata-rata Jiwa/KK" value={`${rataKK} jiwa`} />}
              <InfoRow label="Klasifikasi" value={klasifikasiDemo} />
            </div>
            {posId && (
              <EmptyHint text="Tambahkan narasi kondisi demografi untuk menggantikan data otomatis ini." />
            )}
          </div>
        ) : (
          <EmptyHint text="Data demografi belum diisi. Isi melalui tab Demografi." />
        )}
      </Section>

      {/* ── 3. Kondisi Sosial (Konsos) ──────────────────── */}
      <Section
        icon="◉"
        label="Kondisi Sosial (Konsos)"
        color="rgba(187,136,255,0.25)"
        glow="rgba(187,136,255,0.15)"
        field="konsos_notes"
        canEdit={!!posId}
        isEditing={editAspek === 'konsos_notes'}
        onEdit={() => setEditAspek('konsos_notes')}
        onCancelEdit={() => setEditAspek(null)}
      >
        {editAspek === 'konsos_notes' ? (
          <AspekEditForm
            field="konsos_notes"
            initial={demografi?.konsos_notes || ''}
            placeholder="Deskripsikan kondisi sosial: adat istiadat, agama dominan, mata pencaharian, tingkat pendidikan, isu sosial, hubungan lintas batas, dll."
            onSave={handleSaveAspek}
            onCancel={() => setEditAspek(null)}
            saving={saving}
          />
        ) : demografi?.konsos_notes ? (
          <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
            {demografi.konsos_notes}
          </p>
        ) : hasDemoData ? (
          <div className="space-y-2">
            <p className="text-[rgba(200,214,229,0.5)] text-[11px] leading-relaxed">
              Berdasarkan data demografi, wilayah ini memiliki{' '}
              <span className="text-[rgba(200,214,229,0.8)] font-medium">
                {penduduk.toLocaleString('id-ID')} jiwa
              </span>{' '}
              dalam{' '}
              <span className="text-[rgba(200,214,229,0.8)] font-medium">
                {kk.toLocaleString('id-ID')} kepala keluarga
              </span>
              {rataKK && (
                <>, rata-rata <span className="text-[rgba(200,214,229,0.8)] font-medium">{rataKK} jiwa per KK</span></>
              )}.
            </p>
            {posId && (
              <EmptyHint text="Tambahkan narasi kondisi sosial untuk melengkapi data ini." />
            )}
          </div>
        ) : (
          <EmptyHint text="Data kondisi sosial belum diisi." />
        )}
      </Section>

    </div>
  )
}

/* ── AspekEditForm ──────────────────────────────────────────── */
function AspekEditForm({ field, initial, placeholder, onSave, onCancel, saving }) {
  const [value, setValue] = useState(initial)
  return (
    <div className="space-y-2">
      <textarea
        className="hud-input w-full resize-none text-xs leading-relaxed"
        rows={6}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      <p className="text-[9px]" style={{ color: 'rgba(200,214,229,0.3)' }}>
        Kosongkan untuk menghapus narasi dan kembali ke tampilan otomatis.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="hud-btn hud-btn-danger flex-1 text-[10px]"
          disabled={saving}
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => onSave(field, value)}
          className="hud-btn flex-1 text-[10px]"
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 border border-[#00ff88] border-t-transparent rounded-full animate-spin" />
              Menyimpan…
            </span>
          ) : 'Simpan'}
        </button>
      </div>
    </div>
  )
}

/* ── Section wrapper ─────────────────────────────────────────── */
function Section({ icon, label, color, glow, field, canEdit, isEditing, onEdit, onCancelEdit, children }) {
  return (
    <div className="hud-panel relative overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: '2px' }}>
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none rounded-sm"
        style={{ background: `radial-gradient(ellipse at top left, ${glow}, transparent)` }} />
      <div className="hud-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color }}>{icon}</span>
          <span className="hud-title">{label}</span>
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={onEdit}
            className="text-[9px] px-2 py-0.5 rounded-sm transition-colors flex-shrink-0"
            style={{
              color: 'rgba(0,255,136,0.4)',
              border: '1px solid rgba(0,255,136,0.15)',
              background: 'rgba(0,255,136,0.04)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(0,255,136,0.8)'
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(0,255,136,0.4)'
              e.currentTarget.style.borderColor = 'rgba(0,255,136,0.15)'
            }}
          >
            ✎ Edit
          </button>
        )}
        {canEdit && isEditing && (
          <button
            onClick={onCancelEdit}
            className="text-[9px] px-2 py-0.5 rounded-sm transition-colors flex-shrink-0"
            style={{ color: 'rgba(200,214,229,0.3)', border: '1px solid rgba(200,214,229,0.1)' }}
          >
            ✕ Batal
          </button>
        )}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

/* ── Helper sub-components ─────────────────────────────────── */
function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-32"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</span>
      <span className={`text-[11px] font-medium text-[rgba(200,214,229,0.75)] ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </span>
    </div>
  )
}

function StatBox({ label, value, unit, color }) {
  return (
    <div className="px-3 py-2 rounded-sm text-center"
      style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="text-[8px] uppercase tracking-wider mb-0.5"
        style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</p>
      <p className="font-mono font-bold text-base leading-none"
        style={{ color, textShadow: `0 0 10px ${color}55` }}>{value}</p>
      {unit && <p className="text-[8px] mt-0.5" style={{ color: 'rgba(200,214,229,0.3)' }}>{unit}</p>}
    </div>
  )
}

function EmptyHint({ text }) {
  return (
    <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">{text}</p>
  )
}
