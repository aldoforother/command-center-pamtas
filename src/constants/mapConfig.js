// Default map config untuk wilayah Latihan Yonkav 8/NSW
// Jawa Timur - daerah latihan

export const MAP_CONFIG = {
  center: [-8.295, 112.700],
  zoom: 13,
  minZoom: 6,
  maxZoom: 17,
  // Dark tile — CartoDB Dark Matter
  tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  tileAttribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
}

export const SATELLITE_TILE = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution: '© Esri',
}

// Tile alternatif dark
export const DARK_TILES = {
  carto:    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  cartomid: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  osm:      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}
