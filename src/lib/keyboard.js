import { isLetterCode } from './utilities'

export const kbtype = {
  standard: 'ANSI',
  european: 'ISO',
  european_ss: 'ISO split-space',
  matrix: 'Matrix',
  ergodox: 'Ergodox',
  // custom: 'Custom',
}

/*export const key = {
  BACKSPACE: 8,
  CAPSLOCK: 20,
  LSHIFT: 16,
  RSHIFT: -16,
  CTRL: 17,
  WIN: -91,
  LALT: 18,
  RALT: -18,
  MENU: -93,
}*/

export const fingers = {
  none: -1,
  leftPinky: 1,
  leftRing: 2,
  leftMiddle: 3,
  leftIndex: 4,
  leftThumb: 5,
  rightThumb: 6,
  rightIndex: 7,
  rightMiddle: 8,
  rightRing: 9,
  rightPinky: 10,
  bothThumbs: 11,
}

export function keepOnlyFingering(keySet) {
  keySet = structuredClone(keySet)
  keySet.label = keySet.author = keySet.authorUrl = keySet.moreInfoUrl
      = keySet.moreInfoText = undefined
  keySet.keys.forEach(key =>
    key.primary = key.shift = key.altGr = key.shiftAltGr = undefined
  )
  return keySet
}

export function filteredAssign(filterValue, targetKey, sourceKey) {
  let labels = ['primary', 'shift', 'altGr', 'shiftAltGr']
  switch (filterValue) {
    case 'nonLetters':
      labels = labels.filter(label =>
        !isLetterCode(targetKey[label]) && !isLetterCode(sourceKey[label])
      ); break
    case 'altGr':
      labels = ['altGr', 'shiftAltGr']; break
  }
  labels.forEach(label => targetKey[label] = sourceKey[label])
}
