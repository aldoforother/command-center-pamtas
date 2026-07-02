import { readFileSync, writeFileSync } from 'fs'

// Fix PamtasMap.jsx — hapus parseInt, pakai pos.pos_id langsung
const mapPath = 'src/components/map/PamtasMap.jsx'
let map = readFileSync(mapPath, 'utf8')

map = map.replace(
  "const posNum = parseInt(pos.pos_id.replace('POS-', ''), 10)",
  "// pos_id dipakai langsung sebagai label marker"
)
map = map.replace(
  'icon={createPosIcon(posNum, isSelected, isKotis)}',
  'icon={createPosIcon(pos.pos_id, isSelected, isKotis)}'
)

writeFileSync(mapPath, map, 'utf8')
console.log('PamtasMap.jsx fixed OK')
console.log('posNum refs left:', (map.match(/posNum/g) || []).length)

// Fix PanduanPage.jsx — tambah wrapper scroll
const panduanPath = 'src/pages/PanduanPage.jsx'
let panduan = readFileSync(panduanPath, 'utf8')

panduan = panduan.replace(
  '<div className="p-4 space-y-4 fade-in max-w-4xl">',
  '<div className="h-full overflow-y-auto">\n    <div className="p-4 space-y-4 fade-in max-w-4xl">'
)

// Cari closing tag terakhir dari komponen utama dan tambah </div>
// Ganti return statement closing
panduan = panduan.replace(
  /(<\/div>\s*\)\s*\}\s*\n\n\/\* ── Komponen bantu)/,
  '    </div>\n  </div>\n  )\n}\n\n/* ── Komponen bantu'
)

writeFileSync(panduanPath, panduan, 'utf8')
console.log('PanduanPage.jsx fixed OK')
