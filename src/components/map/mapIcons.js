import { divIcon } from 'leaflet'
import { KERAWANAN_COLOR_MAP } from '../../constants/kerawananCategories'

/**
 * Pos marker — HUD style dengan pulse ring effect
 * Enhanced: CSS tokens compatible, smoother animations
 */
export function createPosIcon(posId, isSelected = false, isKotis = false) {
  const color = isSelected ? '#00ff88' : isKotis ? '#ffd700' : '#00cc6a'
  const size = isSelected ? 36 : 30

  // Label: bintang untuk KOTIS, angka untuk pos biasa
  const label = isKotis
    ? `<span style="transform:rotate(45deg); color:#ffd700; font-weight:900; font-size:14px; line-height:1; text-shadow:0 0 8px rgba(255,215,0,0.9);">★</span>`
    : `<span style="
        transform:rotate(45deg);
        color:${color};
        font-weight:700;
        font-size:${String(posId).length > 3 ? '7px' : String(posId).length > 2 ? '8px' : '10px'};
        line-height:1;
        font-family:'JetBrains Mono','Courier New',monospace;
        text-shadow: 0 0 6px rgba(0,255,136,0.8);
      ">${String(posId ?? '?')}</span>`

  const html = `
    <div style="position:relative; width:${size}px; height:${size}px;">
      ${isSelected ? `
        <div style="
          position:absolute; inset:-8px;
          border-radius:50%;
          border: 1px solid ${color}80;
          animation: posRing1 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:-16px;
          border-radius:50%;
          border: 1px solid ${color}40;
          animation: posRing2 2s ease-out infinite 0.5s;
        "></div>
      ` : `
        <div style="
          position:absolute; inset:-6px;
          border-radius:50%;
          border: 1px solid ${color}4d;
          animation: posRing1 3s ease-out infinite;
        "></div>
      `}
      <div style="
        width:${size}px; height:${size}px;
        background: radial-gradient(circle at 35% 35%, ${isKotis ? 'rgba(255,215,0,0.25)' : 'rgba(0,255,136,0.25)'}, ${isKotis ? 'rgba(60,40,0,0.95)' : 'rgba(0,60,30,0.95)'});
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 1.5px solid ${color};
        box-shadow: 0 0 ${isSelected ? 16 : 8}px ${color}${isSelected ? '99' : '4d'},
                    inset 0 0 8px ${color}1a;
        display:flex; align-items:center; justify-content:center;
      ">
        ${label}
      </div>
    </div>
    <style>
      @keyframes posRing1 {
        0%   { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.8); opacity: 0; }
      }
      @keyframes posRing2 {
        0%   { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `

  return divIcon({
    html,
    className: '',
    iconSize: [size + 32, size + 32],
    iconAnchor: [size / 2 + 16, size + 16],
    popupAnchor: [0, -(size + 16)],
  })
}

/**
 * Kerawanan marker — circle shape, warna per kategori
 * Enhanced: CSS tokens compatible, danger pulse animation
 */
export function createKerawananIcon(kategori, isActive = true) {
  // Warna per kategori — menggunakan KERAWANAN_COLOR_MAP
  const color = KERAWANAN_COLOR_MAP[kategori] || '#ff3333'
  const size = 26

  // Icon per kategori — SVG icons sebagai pengganti emoji
  const iconSvg = {
    'Narkoba':    `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 2v7.31M10 9.31a4 4 0 1 0 0 8M14 9.31a4 4 0 1 1 0 8M7 22v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3"/></svg>`,
    'Kriminal':   `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    'Logging':    `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-7M12 15l-3-3M12 15l3-3"/><path d="M9 8l3-3 3 3"/><path d="M5 22h14"/></svg>`,
    'Trading':    `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    'Trafficking': `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    'Border':     `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    'PMI NP':     `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
  }
  const icon = iconSvg[kategori] || iconSvg['Kriminal']

  const html = `
    <div style="position:relative; width:${size}px; height:${size}px;">
      ${isActive ? `
        <div style="
          position:absolute; inset:-6px;
          border-radius:50%;
          border: 1px solid ${color}88;
          animation: krawRing 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:-12px;
          border-radius:50%;
          border: 1px solid ${color}44;
          animation: krawRing 1.8s ease-out infinite 0.6s;
        "></div>
      ` : ''}
      <div style="
        width:${size}px; height:${size}px;
        background: radial-gradient(circle at 35% 35%, ${color}33, rgba(10,5,5,0.92));
        border-radius: 50%;
        border: 1.5px solid ${color};
        box-shadow: 0 0 10px ${color}66, inset 0 0 6px ${color}1a;
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="color:${color}; line-height:1;">${icon}</span>
      </div>
    </div>
    <style>
      @keyframes krawRing {
        0%   { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `

  return divIcon({
    html,
    className: '',
    iconSize: [size + 24, size + 24],
    iconAnchor: [size / 2 + 12, size / 2 + 12],
    popupAnchor: [0, -(size / 2 + 14)],
  })
}

/**
 * Binter marker
 * Enhanced: SVG icon instead of emoji
 */
export function createBinterIcon() {
  const html = `
    <div style="
      width:20px; height:20px;
      background: radial-gradient(circle at 35% 35%, rgba(68,136,255,0.3), rgba(20,40,120,0.9));
      border-radius:50%;
      border: 1.5px solid #4488ff;
      box-shadow: 0 0 8px rgba(68,136,255,0.5);
      display:flex; align-items:center; justify-content:center;
    ">
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#4488ff" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </div>
  `
  return divIcon({
    html,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  })
}
