import { driveToThumbnail, driveToDirectUrl, isDriveUrl } from '../../utils/driveUrl'

/**
 * PhotoGallery - Galeri foto dari Google Drive
 * Mendukung array URL string atau array {url, caption}
 *
 * Uses CSS tokens for theming consistency.
 */
export function PhotoGallery({ urls = [], photos = [] }) {
  // Normalise: terima baik array string (urls) maupun array objek (photos)
  const items = [
    ...urls.map(u => (typeof u === 'string' ? { url: u, caption: '' } : u)),
    ...photos.map(p => (typeof p === 'string' ? { url: p, caption: '' } : p)),
  ].filter(p => p?.url)

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((item, i) => (
        <PhotoItem key={i} item={item} />
      ))}
    </div>
  )
}

function PhotoItem({ item }) {
  const thumbUrl = isDriveUrl(item.url) ? driveToThumbnail(item.url, 400) : item.url
  const fullUrl  = isDriveUrl(item.url) ? driveToDirectUrl(item.url)      : item.url

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden rounded-sm group transition-all"
      style={{
        background: 'var(--accent-muted)',
        border: '1px solid var(--border-subtle)',
        aspectRatio: '16/9',
      }}
    >
      {/* Corner brackets */}
      <span
        className="absolute top-0 left-0 w-3 h-3 z-10 pointer-events-none"
        style={{
          borderTop: '1px solid var(--accent-primary)',
          borderLeft: '1px solid var(--accent-primary)',
          opacity: 0.5,
        }}
      />
      <span
        className="absolute bottom-0 right-0 w-3 h-3 z-10 pointer-events-none"
        style={{
          borderBottom: '1px solid var(--accent-primary)',
          borderRight: '1px solid var(--accent-primary)',
          opacity: 0.5,
        }}
      />

      <img
        src={thumbUrl}
        alt={item.caption || 'Foto dokumentasi'}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        onError={e => { e.target.parentElement.style.display = 'none' }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--accent-muted)' }}
      >
        <span
          className="text-xs tracking-widest uppercase font-bold"
          style={{ color: 'var(--accent-primary)' }}
        >
          Buka →
        </span>
      </div>

      {item.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[9px] truncate"
          style={{
            background: 'var(--surface-primary)',
            color: 'var(--text-secondary)',
          }}
        >
          {item.caption}
        </div>
      )}
    </a>
  )
}
