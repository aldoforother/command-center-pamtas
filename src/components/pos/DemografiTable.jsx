import { useState } from 'react'
import { formatNumber, calcPercent } from '../../utils/formatDate'
import { AgamaChart } from '../dashboard/KerawananChart'
import { AGAMA_LIST, IBADAH_LIST } from '../../constants/kerawananCategories'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useToast } from '../ui/Toast'
import { demografiService } from '../../services/demografi.service'

const NUM_FIELDS = ['total_penduduk','total_kk','islam','kristen','katolik','hindu','buddha','konghucu','lainnya','masjid','gereja','pura','vihara']

export function DemografiTable({ demografi, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [saving,   setSaving]   = useState(false)

  if (loading) return <LoadingSpinner text="Memuat data demografi..." />

  // Aggregate array → satu objek ringkasan
  const demo = Array.isArray(demografi)
    ? demografi.length > 0
      ? demografi.reduce((acc, row) => {
          NUM_FIELDS.forEach(f => { acc[f] = (Number(acc[f]||0)) + (Number(row[f]||0)) })
          return acc
        }, { ...demografi[0] })
      : null
    : (demografi || null)

  const handleSave = async (payload) => {
    if (!posId) { showToast('posId tidak tersedia', 'error'); return }
    setSaving(true)
    try {
      await demografiService.upsert(posId, payload)
      showToast('Data demografi berhasil disimpan', 'success')
      setEditOpen(false)
      onRefresh && onRefresh()
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (editOpen) {
    return (
      <DemografiEditForm
        initial={demo}
        onSave={handleSave}
        onCancel={() => setEditOpen(false)}
        saving={saving}
      />
    )
  }

  if (!demo) return (
    <div className="space-y-3">
      <p className="text-[rgba(200,214,229,0.3)] text-xs tracking-wider text-center py-6 uppercase">
        Data demografi belum tersedia
      </p>
      {posId && (
        <div className="flex justify-center">
          <button className="hud-btn text-[10px]" onClick={() => setEditOpen(true)}>
            + Isi Data Demografi
          </button>
        </div>
      )}
    </div>
  )

  const total = Number(demo.total_penduduk || 0)

  return (
    <div className="space-y-4 fade-in">

      {/* ── Toolbar ────────────────────────────────────────── */}
      {posId && (
        <div className="flex justify-end">
          <button
            className="text-[10px] px-3 py-1.5 rounded-sm transition-all duration-150 flex items-center gap-1.5"
            style={{
              background: 'rgba(68,136,255,0.08)',
              border: '1px solid rgba(68,136,255,0.3)',
              color: 'rgba(68,136,255,0.8)',
            }}
            onClick={() => setEditOpen(true)}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(68,136,255,0.15)'
              e.currentTarget.style.color = '#4488ff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(68,136,255,0.08)'
              e.currentTarget.style.color = 'rgba(68,136,255,0.8)'
            }}
          >
            ✎ Edit Data Demografi
          </button>
        </div>
      )}

      {/* ── Ringkasan populasi ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard label="Total Penduduk" value={formatNumber(total)}              unit="Jiwa" color="#00ff88" />
        <MetricCard label="Kepala Keluarga" value={formatNumber(demo.total_kk)}     unit="KK"   color="#4488ff" />
      </div>

      {/* ── Distribusi agama ───────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◈ Distribusi Agama</span>
        </div>
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgamaChart demografi={demo} />
          <div className="space-y-2">
            {AGAMA_LIST.map(({ key, label }) => {
              const val = Number(demo[key] || 0)
              const pct = calcPercent(val, total)
              if (val === 0) return null
              return (
                <div key={key}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[rgba(200,214,229,0.6)]">{label}</span>
                    <span className="font-mono text-[rgba(200,214,229,0.5)]">
                      {formatNumber(val)} <span className="text-[rgba(0,255,136,0.6)]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="hud-bar-track">
                    <div className="hud-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Tempat ibadah ──────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◫ Tempat Ibadah</span>
        </div>
        <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {IBADAH_LIST.map(({ key, label }) => (
            <div key={key} className="text-center py-3 px-2 rounded-sm"
              style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.12)' }}>
              <p className="font-mono text-xl font-bold text-[#00ff88]"
                style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
                {demo[key] || 0}
              </p>
              <p className="text-[9px] text-[rgba(200,214,229,0.4)] mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ── Edit Form ─────────────────────────────────────────────── */
function DemografiEditForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    total_penduduk: initial?.total_penduduk || '',
    total_kk:       initial?.total_kk       || '',
    islam:          initial?.islam           || '',
    kristen:        initial?.kristen         || '',
    katolik:        initial?.katolik         || '',
    hindu:          initial?.hindu           || '',
    buddha:         initial?.buddha          || '',
    konghucu:       initial?.konghucu        || '',
    lainnya:        initial?.lainnya         || '',
    masjid:         initial?.masjid          || '',
    gereja:         initial?.gereja          || '',
    pura:           initial?.pura            || '',
    vihara:         initial?.vihara          || '',
  })
  const [err, setErr] = useState('')

  const set = (key) => (e) => {
    setErr('')
    const v = e.target.value
    // Hanya angka, boleh kosong
    if (v !== '' && !/^\d+$/.test(v)) return
    setForm(f => ({ ...f, [key]: v }))
  }

  // Validasi cross-field: jumlah agama ≤ total_penduduk
  const total   = Number(form.total_penduduk || 0)
  const sumAgama = ['islam','kristen','katolik','hindu','buddha','konghucu','lainnya']
    .reduce((s, k) => s + Number(form[k] || 0), 0)
  const agamaWarning = total > 0 && sumAgama > total
    ? `Jumlah agama (${sumAgama.toLocaleString('id-ID')}) melebihi total penduduk (${total.toLocaleString('id-ID')})`
    : null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (agamaWarning) { setErr(agamaWarning); return }
    // Konversi semua field ke angka (0 jika kosong)
    const payload = Object.fromEntries(
      NUM_FIELDS.map(k => [k, Number(form[k] || 0)])
    )
    onSave(payload)
  }

  const fieldRows = [
    { section: 'POPULASI', fields: [
      { key: 'total_penduduk', label: 'Total Penduduk', unit: 'jiwa' },
      { key: 'total_kk',       label: 'Kepala Keluarga', unit: 'KK' },
    ]},
    { section: 'AGAMA', fields: AGAMA_LIST.map(a => ({ key: a.key, label: a.label, unit: 'jiwa' })) },
    { section: 'TEMPAT IBADAH', fields: IBADAH_LIST.map(i => ({ key: i.key, label: i.label, unit: 'unit' })) },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <span className="hud-label">Edit Data Demografi</span>
        <button type="button" onClick={onCancel}
          className="text-[rgba(200,214,229,0.3)] hover:text-[rgba(200,214,229,0.6)] text-lg leading-none transition-colors">
          ×
        </button>
      </div>

      {fieldRows.map(({ section, fields }) => (
        <div key={section} className="rounded-sm overflow-hidden"
          style={{ border: '1px solid rgba(0,255,136,0.12)' }}>
          <div className="px-3 py-1.5"
            style={{ background: 'rgba(0,255,136,0.04)', borderBottom: '1px solid rgba(0,255,136,0.08)' }}>
            <span className="text-[8px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'rgba(0,255,136,0.6)' }}>{section}</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {fields.map(({ key, label, unit }) => (
              <div key={key}>
                <label className="block hud-label mb-1">{label}</label>
                <div className="flex items-center gap-1">
                  <input
                    className="hud-input flex-1"
                    inputMode="numeric"
                    pattern="\d*"
                    value={form[key]}
                    onChange={set(key)}
                    placeholder="0"
                  />
                  <span className="text-[9px] text-[rgba(200,214,229,0.3)] flex-shrink-0">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Live validation hint */}
      {agamaWarning && (
        <div className="px-3 py-2 rounded-sm text-[10px]"
          style={{ background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.2)', color: 'rgba(255,170,0,0.8)' }}>
          ⚠ {agamaWarning}
        </div>
      )}

      {err && (
        <div className="px-3 py-2 rounded-sm text-[10px]"
          style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)', color: 'rgba(255,100,100,0.9)' }}>
          ✕ {err}
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-[rgba(0,255,136,0.1)]">
        <button type="button" onClick={onCancel} className="hud-btn hud-btn-danger flex-1" disabled={saving}>
          Batal
        </button>
        <button type="submit" className="hud-btn flex-1" disabled={saving}>
          {saving ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 border border-[#00ff88] border-t-transparent rounded-full animate-spin" />
              Menyimpan…
            </span>
          ) : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

/* ── MetricCard ────────────────────────────────────────────── */
function MetricCard({ label, value, unit, color }) {
  return (
    <div className="relative rounded-sm px-4 py-3 overflow-hidden"
      style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
      <div className="absolute top-0 left-0 w-2 h-2"
        style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, opacity: 0.5 }} />
      <div className="absolute bottom-0 right-0 w-2 h-2"
        style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}`, opacity: 0.5 }} />
      <p className="text-[9px] tracking-[0.12em] uppercase mb-1" style={{ color: `${color}66` }}>{unit}</p>
      <p className="font-mono text-2xl font-bold leading-none mb-1"
        style={{ color, textShadow: `0 0 14px ${color}66` }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-[rgba(200,214,229,0.4)]">{label}</p>
    </div>
  )
}
