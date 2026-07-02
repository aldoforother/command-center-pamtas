import { readFileSync, writeFileSync } from 'fs'

const path = 'src/components/map/mapIcons.js'
let c = readFileSync(path, 'utf8')

// Fix 1: rename parameter
c = c.replace(
  'export function createPosIcon(posNum, isSelected = false, isKotis = false)',
  'export function createPosIcon(posId, isSelected = false, isKotis = false)'
)

// Fix 2: font-size line - remove posNum reference
c = c.replace(
  "font-size:${posNum > 9 ? '8px' : '10px'};",
  "font-size:${String(posId).length > 3 ? '7px' : String(posId).length > 2 ? '8px' : '10px'};"
)

// Fix 3: label value - remove isNaN check
c = c.replace(
  '>${isNaN(posNum) ? \'?\' : posNum}</span>`',
  '>${String(posId ?? \'?\')}</span>`'
)

writeFileSync(path, c, 'utf8')
console.log('mapIcons.js fixed OK')
console.log('Verify posNum references left:', (c.match(/posNum/g) || []).length)
