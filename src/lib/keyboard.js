import defaultKeyMaps from './default-key-maps.js'
import Fingers, { sameFingerGroup } from './fingers.js'
import { isLetterCode, takeWhile } from './utilities.js'

export const keyMapTypes = {
  standard: 'ANSI',
  european: 'ISO',
  european_ss: 'ISO split-space',
  matrix: 'Matrix',
  ergodox: 'Ergodox',
  // custom: 'Custom',
}

/*export const Keys = {
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
    default:
      // keep labels unchanged
  }
  labels.forEach(label => targetKey[label] = sourceKey[label])
}



const translateId = (map1, map2) => id1 => isNaN(map1[id1].scan)? undefined
    : Object.keys(map2)
        .find(id2 => isFinite(id2) && map2[id2].scan === map1[id1].scan)

const fingerStartCanBeArrange = (map1, map2) =>
    (id1, id2, finger2, defaultFinger2) =>
        id1 !== undefined
        && map1[id1].row === map2[id2].row
        && sameFingerGroup(finger2, defaultFinger2)

// Keep finger and arrange finger start if present.
// Set the keySet fingers, that in the reference start from id1, onto id2.
const arrangeFingerStart = keySet => (refFingerStart, id1, id2) =>
    Object.keys(refFingerStart)
        .filter(finger => refFingerStart[finger] == id1)
        .forEach(id1Finger => keySet.fingerStart[id1Finger] = id2)

const idsFrom = keyMap => Object.keys(keyMap).map(Number).filter(isFinite)

/**
 * Convert layout of a given key set and key map to the target type.
 * @param {Object} set1 Original key set.
 * @param {Object} map1 Original key map.
 * @param {String} type2 Target keyboard type.
 * @param {Object} defaultSet2 Source of default key data.
 * @return Result of conversion: key set with the target type.
 */
export function convertType(set1, map1, type2, defaultSet2) {
  // workpieces
  const set2 = structuredClone(set1)
      set2.keyboardType = type2
      set2.fingerStart = defaultSet2.fingerStart
      set2.keys = []
  const map2 = defaultKeyMaps[type2]
  // helpers
  const translate21 = translateId(map2, map1)
  const canBeArrange21 = fingerStartCanBeArrange(map1, map2)
  const arrange21 = arrangeFingerStart(set2)
  // for all keys of the target key map
  var id1, srcSet, key2, defaultFinger2
  for (const id2 of idsFrom(map2)) {
    id1 = translate21(id2)
    srcSet = (id1 !== undefined)? set1 : defaultSet2
    key2 = structuredClone(srcSet.keys[id1 ?? id2]); key2.id = id2
    // process the fingering
    defaultFinger2 = defaultSet2.keys[id2].finger
    if (canBeArrange21(id1, id2, key2.finger, defaultFinger2))
        arrange21(srcSet.fingerStart, id1, id2)
        // it already has a suitable finger
    else
        key2.finger = defaultFinger2
    set2.keys.push(key2)
  }
  return set2
}



/**
 * Find the first letter sequence: e. g. QWERTY, or AOEUID for Dvorak.
 * @param {Array} keys Keys.
 * @param {Number} startFinger Start finger.
 * @param {Number} minGroupLen Minimal length of the key group.
 * @return {Number} Index of the first key of the found sequence.
 */
function firstOfLetterKeyGroup(keys, startFinger, minGroupLen=4) {
  const satisfiesStartFinger = key =>
      !startFinger || key.finger === startFinger
  function startsGroup(key) {
    const slice = keys.slice(key.id, key.id + minGroupLen)
    return slice.length === minGroupLen
        && slice.every(key => isLetterCode(key.primary))
  }
  return keys.filter(satisfiesStartFinger).find(startsGroup)?.id
}

/**
 * Make label if it doesn’t exist.
 * @param {Object} keySet Key set.
 * @param {Number} index Index of layout in key set.
 * @param {Number} maxGroupLen Maximal length of the generated label.
 * @return {String} Label.
 */
export function forceLabel({ label, keys }, index, maxGroupLen=6) {
  label = label.trim()
  if (label) return label
  const firstKeyIndex =
      firstOfLetterKeyGroup(keys, Fingers.LEFT_PINKY)
      ?? firstOfLetterKeyGroup(keys)
  if (!firstKeyIndex) return 'Layout ' + index
  const primaryCodeSlice = keys
      .slice(firstKeyIndex, firstKeyIndex + maxGroupLen)
      .map(key => key.primary)
  return takeWhile(primaryCodeSlice, isLetterCode)
      .map(String.fromCharCode)
      .join()
      .toUpperCase()
}

export const typeSuffixes = { european_ss: 'ˢˢ', matrix: 'ᴹ', ergodox: 'ᴱ' }
