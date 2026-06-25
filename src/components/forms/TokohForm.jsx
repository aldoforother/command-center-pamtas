import { useState, useEffect } from 'react'
import { isDriveUrl, driveToThumbnail } from '../../utils/driveUrl'

// Kategori yang dikirim ke DB — 6 kategori
const TOKOH_CATEGORIES_FORM = [
  { value: 'TOMAS',   label: 'TOMAS (Tokoh Masyarakat)' },
  { value: 'TODAT',   label: 'TODAT (Tokoh Adat)' },
  { value: 'TOGA',    label: 'TOGA (Tokoh Agama)' },
  { value: 'PEMDA',   label: 'PEMDA (Pemerintah Daerah)' },
  { value: 'PEMUDA',  label: 'PEMUDA (Tokoh Pemuda)' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

// Auto-infer kategori dari jabatan
const JABATAN_KATEGORI_MAP = [
  { keywords: ['kades', 'kepala desa', 'lurah', 'camat', 'bupati', 'rt ', 'rw ', 'ketua rt', 'ketua rw', 'kepala kampung', 'kepala adat desa', 'sekdes', 'sekretaris desa', 'kepala dusun'], kategori: 'PEMDA' },
  { keywords: ['kepala adat', 'ketua adat', 'pemangku adat', 'temenggung', 'penghulu adat', 'datuk', 'tetua adat', 'tokoh adat', 'todat'], kategori: 'TODAT' },
  { keywords: ['ustaz', 'ustadz', 'kyai', 'kiai', 'pendeta', 'pastor', 'imam', 'majelis', 'ulama', 'da\'i', 'dai', 'rohaniawan', 'tokoh agama', 'toga'], kategori: 'TOGA' },
  { keywords: ['karang taruna', 'ketua pemuda', 'tokoh pemuda', 'ketua ormas', 'pemuda', 'aktivis'], kategori: 'PEMUDA' },
  { keywords: ['ketua rt', 'ketua rw', 'tokoh masyarakat', 'tomas', 'warga', 'pengusaha', 'petani', 'nelayan', 'pedagang'], kategori: 'TOMAS' },
]

function inferKategoriFromJabatan(jabatan) {
  if (!jabatan) return null
  const lower = jabatan.toLowerCase()
  for (const rule of JABATAN_KATEGORI_MAP) {
    if (rule.keywords.some(kw => lower.includes(kw))) return rule.kategori
  }
  return null
}

export function TokohForm({ initialData, posId, posNama, onSave, onCancel }) {
  const [form, setForm] = useState({
    nama:      initialData?.nama      || '',
    kategori:  initialData?.kategori  || 'TOMAS',
    jabatan:   initialData?.jabatan   || '',
    alamat:    initialData?.alamat    || '',
    no_telp:   initialData?.no_telp   || '',
    catatan:   initialData?.catatan   || '',
    foto_url:  initialData?.foto_url  || '',
  })
  const [saving, setSaving] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [inferredKategori, setInferredKategori] = useState(null)

  const set = (key) => (e) => {
    setFieldError('')
    const val = e.target.value
    setForm(f => ({ ...f, [key]: val }))
    // Auto-infer kategori dari jabatan (hanya jika user belum mengubah kategori secara manual)
    if (key === 'jabatan') {
      const inferred = inferKategoriFromJabatan(val)
      setInferredKategori(inferred)
    }
  }

  // Terapkan inferred kategori hanya jika user tidak sedang mengedit kategori secara aktif
  useEffect(() => {
    if (inferredKategori && !initialData) {
      setForm(f => ({ ...f, kategori: inferredKategori }))
    }
  }, [inferredKategori]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama.trim()) {
      setFieldError('Nama tidak boleh kosong')
      return
    }
    setSaving(true)
    setFieldError('')
    try {
      await onSave(form)
    } catch (err) {
      setFieldError(err.message || 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  // Preview foto — hanya tampil jika ada URL valid
  const fotoPreviewUrl = form.foto_url
    ? (isDriveUrl(form.foto_url) ? driveToThumbnail(form.foto_url, 200) : form.foto_url)
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Info pos — read-only context */}
      {(posId || posNama) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm"
          style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.12)' }}>
          <span className="hud-label">Pos</span>
          <span className="font-mono text-xs font-bold text-[rgba(0,255,136,0.7)]">
            {posNama || posId}
          </span>
          {posNama && posId && posNama !== posId && (
            <span className="text-[9px] text-[rgba(200,214,229,0.3)] font-mono">({posId})</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Nama Lengkap *" colSpan={2}>
          <input
            className="hud-input"
            value={form.nama}
            onChange={set('nama')}
            placeholder="Nama tokoh"
            required
          />
        </FormField>

        <FormField label="Kategori">
          <select className="hud-select" value={form.kategori} onChange={e => {
            setInferredKategori(null) // user override — stop auto-infer
            setForm(f => ({ ...f, kategori: e.target.value }))
          }}>
            {TOKOH_CATEGORIES_FORM.map(k => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
          {inferredKategori && (
            <p className="text-[9px] mt-1" style={{ color: 'rgba(0,255,136,0.5)' }}>
              ⚡ Terdeteksi otomatis dari jabatan · klik dropdown untuk ganti
            </p>
          )}
        </FormField>

        <FormField label="Jabatan">
          <input
            className="hud-input"
            value={form.jabatan}
            onChange={set('jabatan')}
            placeholder="Jabatan / posisi"
          />
        </FormField>

        <FormField label="Alamat" colSpan={2}>
          <input
            className="hud-input"
            value={form.alamat}
            onChange={set('alamat')}
            placeholder="Alamat lengkap"
          />
        </FormField>

        <FormField label="No. Telepon" colSpan={2}>
          <input
            className="hud-input"
            value={form.no_telp}
            onChange={set('no_telp')}
            placeholder="08xx-xxxx-xxxx"
            type="tel"
          />
        </FormField>

        {/* Foto URL — Google Drive link */}
        <FormField label="Foto (Google Drive)" colSpan={2}>
          <input
            className="hud-input"
            value={form.foto_url}
            onChange={set('foto_url')}
            placeholder="https://drive.google.com/file/d/..."
            type="url"
          />
          {fotoPreviewUrl && (
            <div className="mt-2 relative overflow-hidden rounded-sm"
              style={{ aspectRatio: '3/2', maxWidth: 160, border: '1px solid rgba(0,255,136,0.2)' }}>
              <img
                src={fotoPreviewUrl}
                alt="Preview foto"
                className="w-full h-full object-cover opacity-80"
                onError={e => { e.target.parentElement.style.display = 'none' }}
              />
            </div>
          )}
          <p className="text-[9px] mt-1" style={{ color: 'rgba(200,214,229,0.3)' }}>
            Google Drive: klik kanan → "Dapatkan link" → akses publik → salin URL
          </p>
        </FormField>

        <FormField label="Catatan" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={3}
            value={form.catatan}
            onChange={set('catatan')}
            placeholder="Catatan tambahan (opsional)"
          />
        </FormField>
      </div>

      {fieldError && <FormError message={fieldError} />}

      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  )
}

/* ── Shared helpers ─────────────────────────────────────── */
export function FormField({ label, children, colSpan }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <label className="block hud-label mb-1">{label}</label>
      {children}
    </div>
  )
}

export function FormError({ message }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-sm"
      style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)' }}>
      <span className="text-[#ff4444] text-xs flex-shrink-0">✕</span>
      <span className="text-[10px] text-[rgba(255,100,100,0.9)]">{message}</span>
    </div>
  )
}

export function FormActions({ onCancel, saving, submitLabel = 'Simpan' }) {
  return (
    <div className="flex gap-2 pt-2 border-t border-[rgba(0,255,136,0.1)]">
      <button
        type="button"
        onClick={onCancel}
        className="hud-btn hud-btn-danger flex-1"
        disabled={saving}
      >
        Batal
      </button>
      <button
        type="submit"
        className="hud-btn flex-1"
        disabled={saving}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 border border-[#00ff88] border-t-transparent rounded-full animate-spin" />
            Menyimpan…
          </span>
        ) : submitLabel}
      </button>
    </div>
  )
}

