import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { MAP_CONFIG, SATELLITE_TILE } from '../../constants/mapConfig'
import { createPosIcon, createKerawananIcon } from './mapIcons'
import { PosPopup, KerawananPopup } from './PosPopup'
import { useApp } from '../../context/AppContext'

/**
 * Helper: fly to pos saat selectedPosId berubah
 */
function MapController({ selectedPosId, posList }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedPosId || !posList) return
    const pos = posList.find(p => p.pos_id === selectedPosId)
    if (pos && pos.lat && pos.lng) {
      map.flyTo([Number(pos.lat), Number(pos.lng)], 12, { duration: 1.2 })
    }
  }, [selectedPosId, posList, map])
  return null
}

// Kategori kerawanan -> key mapLayers
const KATEGORI_TO_LAYER = {
  // Kategori resmi baru
  'Narkoba': 'narkoba',
  'Kriminal': 'kriminal',
  'Logging': 'logging',
  'Trading': 'trading',
  'Trafficking': 'trafficking',
  'Border': 'border',
  'PMI NP': 'pmInp',
  // Alias nama lama di sheet -> kategori baru
  'Human Trafficking': 'trafficking',
  'Illegal Logging': 'logging',
  'Ilegal Logging': 'logging',
  'Penyelundupan': 'trading',
  'Imigran Gelap': 'pmInp',
  'Penjarahan Laut': 'kriminal',
  'Ketergantungan': 'trading',
  'Isolasi Wilayah': 'trading',
}

// Legend data
const LEGEND_ITEMS = [
  { key: 'pos', label: 'Pos', color: 'var(--accent-primary)' },
  { key: 'narkoba', label: 'Narkoba', color: '#ff3333' },
  { key: 'kriminal', label: 'Kriminal', color: '#ff8800' },
  { key: 'logging', label: 'Logging', color: '#88cc00' },
  { key: 'trading', label: 'Trading', color: '#ffcc00' },
  { key: 'trafficking', label: 'Trafficking', color: '#ff66cc' },
  { key: 'border', label: 'Border', color: '#4488ff' },
  { key: 'pmInp', label: 'PMI NP', color: '#cc88ff' },
]

/**
 * Komponen peta utama Pamtas
 * Enhanced: CSS tokens, smooth fly-to, legend, keyboard a11y
 */
export function PamtasMap({
  posList = [],
  kerawananList = [],
  showKerawanan = true,
  height = '100%',
}) {
  const navigate = useNavigate()
  const { selectedPosId, setSelectedPosId, mapLayer, mapLayers } = useApp()
  const [showLegend, setShowLegend] = useState(true)

  // Filter pos yang punya koordinat valid
  const validPos = posList.filter(p => p.lat && p.lng && !isNaN(Number(p.lat)))

  // Buat lookup pos_id -> koordinat untuk fallback marker
  const posCoordMap = posList.reduce((acc, p) => {
    if (p.lat && p.lng && !isNaN(Number(p.lat)) && Number(p.lat) !== 0) {
      acc[p.pos_id] = { lat: Number(p.lat), lng: Number(p.lng) }
    }
    return acc
  }, {})

  // Resolusi koordinat kerawanan: pakai lat/lng item, fallback ke koordinat pos
  const resolveCoord = (k) => {
    const lat = Number(k.lat)
    const lng = Number(k.lng)
    if (k.lat && k.lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng }
    }
    return posCoordMap[k.pos_id] || null
  }

  // Filter kerawanan berdasarkan mapLayers
  const visibleKerawanan = kerawananList
    .filter(k => {
      if (!showKerawanan) return false
      const layerKey = KATEGORI_TO_LAYER[k.kategori]
      if (!layerKey || !mapLayers[layerKey]) return false
      return resolveCoord(k) !== null
    })
    .map(k => ({ ...k, _coord: resolveCoord(k) }))

  return (
    <div style={{ height, width: '100%' }} className="relative">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Tile layer */}
        {mapLayer === 'satellite' ? (
          <TileLayer
            url={SATELLITE_TILE.url}
            attribution={SATELLITE_TILE.attribution}
          />
        ) : (
          <TileLayer
            url={MAP_CONFIG.tileUrl}
            attribution={MAP_CONFIG.attribution}
          />
        )}

        {/* Controller: fly to selected pos */}
        <MapController selectedPosId={selectedPosId} posList={validPos} />

        {/* Pos markers */}
        {mapLayers.pos && (
          <LayerGroup>
            {validPos.map((pos) => {
              const isSelected = pos.pos_id === selectedPosId
              const isKotis = pos.pos_id === 'KT'
              const posActiveKerawanan = kerawananList.filter(
                k => k.pos_id === pos.pos_id && k.status?.toLowerCase() === 'aktif'
              ).length
              return (
                <Marker
                  key={pos.pos_id}
                  position={[Number(pos.lat), Number(pos.lng)]}
                  icon={createPosIcon(pos.pos_id, isSelected, isKotis)}
                  eventHandlers={{
                    click: () => setSelectedPosId(pos.pos_id),
                  }}
                  zIndexOffset={isKotis ? 2000 : isSelected ? 1000 : 0}
                >
                  <Popup maxWidth={300} className="military-popup">
                    <PosPopup
                      pos={pos}
                      onDetailClick={(id) => navigate(`/pos/${id}`)}
                      activeKerawanan={posActiveKerawanan}
                    />
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        )}

        {/* Kerawanan markers */}
        {showKerawanan && (
          <LayerGroup>
            {visibleKerawanan.map((item, i) => (
              <Marker
                key={item.id || i}
                position={[item._coord.lat, item._coord.lng]}
                icon={createKerawananIcon(item.kategori, item.status?.toLowerCase() === 'aktif')}
                zIndexOffset={500}
              >
                <Popup maxWidth={220} className="military-popup">
                  <KerawananPopup item={item} />
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        )}
      </MapContainer>

      {/* Layer toggle controls - bottom left */}
      <div className="absolute bottom-4 left-2 z-[2000] pointer-events-auto flex flex-col gap-2" style={{ isolation: 'isolate' }}>
        <MapLayerControls />
      </div>

      {/* Legend - bottom right */}
      <div className="absolute bottom-4 right-2 z-[2000]" style={{ isolation: 'isolate' }}>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="map-layer-btn mb-1"
          style={{
            background: showLegend ? 'var(--map-control-active-bg)' : 'var(--map-control-bg)',
            border: showLegend ? '1px solid var(--map-control-active-border)' : '1px solid var(--border-subtle)',
            color: showLegend ? 'var(--accent-primary)' : 'var(--text-tertiary)',
          }}
          aria-expanded={showLegend}
          aria-controls="map-legend"
          aria-label={showLegend ? 'Sembunyikan legenda' : 'Tampilkan legenda'}
        >
          LEGEND
        </button>
        {showLegend && (
          <div
            id="map-legend"
            className="map-legend animate-fade-in"
            style={{
              background: 'var(--map-control-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              backdropFilter: 'blur(8px)',
              padding: '8px 10px',
              minWidth: '100px',
            }}
            role="region"
            aria-label="Legenda peta"
          >
            {LEGEND_ITEMS.filter(item => {
              if (item.key === 'pos') return mapLayers.pos
              return mapLayers[item.key]
            }).map(item => (
              <div key={item.key} className="flex items-center gap-2 py-1" style={{ fontSize: '9px' }}>
                <span
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }}
                />
                <span style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Kontrol tile layer - CSS tokens styling
 * Enhanced: keyboard accessibility with aria-pressed
 */
export function MapLayerControls() {
  const { mapLayer, setMapLayer } = useApp()

  return (
    <div className="flex flex-col gap-1" role="group" aria-label="Tipe tampilan peta">
      {[
        { key: 'street', label: 'PETA' },
        { key: 'satellite', label: 'SATELIT' },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={(e) => { e.stopPropagation(); setMapLayer(key) }}
          className={`map-layer-btn ${mapLayer === key ? 'map-layer-btn-active' : 'map-layer-btn-inactive'}`}
          aria-pressed={mapLayer === key}
          aria-label={`Tampilkan ${label === 'PETA' ? 'peta jalan' : 'citra satelit'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
