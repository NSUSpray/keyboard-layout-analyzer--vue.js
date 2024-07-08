import defaultSet from './default.kla-set.json'
import qwerty from './standard.qwerty.kla-layout.json'
import azerty from './european.azerty.kla-layout.json'
import simplifiedDvorak from './standard.simplifiedDvorak.kla-layout.json'
import programmerDvorak from './standard.programmerDvorak.kla-layout.json'
import colemak from './standard.colemak.kla-layout.json'
import colemakDh from './european.colemak_dh.kla-layout.json'
  import standard from './standard.classical.kla-fingering.json'
  import european from './european.classical.kla-fingering.json'
  import european_ss from './european_ss.classical.kla-fingering.json'
  import matrix from './matrix.classical.kla-fingering.json'
  import ergodox from './ergodox.classical.kla-fingering.json'

export const defaultKeySets = {
  'default.kla-set': defaultSet,
  'standard.qwerty.kla-layout': qwerty,
  'european.azerty.kla-layout': azerty,
  'standard.simplifiedDvorak.kla-layout': simplifiedDvorak,
  'standard.programmerDvorak.kla-layout': programmerDvorak,
  'standard.colemak.kla-layout': colemak,
  'european.colemak_dh.kla-layout': colemakDh,
    'standard.classical.kla-fingering': standard,
    'european.classical.kla-fingering': european,
    'european_ss.classical.kla-fingering': european_ss,
    'matrix.classical.kla-fingering': matrix,
    'ergodox.classical.kla-fingering': ergodox,
}

export function label(code) {
  const labels = { 8: '⌫', 9: '⭾ Tab', 13: '↩', 16: 'LShift', '-16': 'RShift',
      17: 'Ctrl', 18: 'Alt', '-18': 'Alt Gr', 20: '⮸', 27: 'Esc', 32: 'Space',
      '-91': 'Win', '-93': '▤', 127: '⌦', 160: '⍽' }
  return labels[code] ?? String.fromCharCode(code)
}
