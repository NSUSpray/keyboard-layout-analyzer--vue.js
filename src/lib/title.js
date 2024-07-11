import fingers from './fingers'
import { takeWhile, isLetterCode } from './utilities'

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
 * @param {Number} maxGroupLen Maximal length of the generated label.
 * @return {String} Label.
 */
function forceLabel({ label, keys, index }, maxGroupLen=6) {
  label = label.trim()
  if (label) return label
  const firstKeyIndex =
      firstOfLetterKeyGroup(keys, fingers.leftPinky)
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


const maxPaginateLength = 118
const switchers = '←→⭯'
const keyboardTypeToSuffix = { european_ss: 'ˢˢ', ergodox: 'ᴱ', matrix: 'ᴹ' }

const visualLengthOf = text => text
    .replaceAll(/[WMЩЮЖМШ]/g, '...')
    .replaceAll(/[^ijlI. ᴱˢ]/g, '..').length

function compress(text, level) {
  switch (level) {
    case 1:  // trash
      return text.replaceAll(/[^\wа-яёˢᴱᴹ -]/gi, '').replaceAll(/-/g, ' ')
    case 2:  // vowels
      return text.replaceAll(/(?<=[\wА-ЯЁа-яё])[aeiouyаеёийоуыэюя]/g, '')
    case 3:  // abbreviation
      return text.replaceAll(/([A-Za-zА-ЯЁа-яё][a-zа-яё])[a-zа-яё]+/g, '$1.')
    case 4:  // dots
      return text.replaceAll(/\./g, '')
    case 5:  // lower
      return text.replaceAll(/(?<=[\wА-ЯЁа-яё])[a-zа-яё]/g, '')
          .replaceAll(/(?<=[\wА-ЯЁа-яё])[A-ZА-ЯЁ]/g, a => a.toLowerCase())
          .replaceAll(/ /g, '')
    case 6:  // digits
      return text.replaceAll(/(\d)\d+/g, '$1')
  }
}

/**
 * @param {Array} keySets Key sets.
 * @param {Number} index Key set index.
 * @return {String} Shortened title.
 */
export function shortTitle(keySets, index) {
  const keySet = keySets[index]
  const label = forceLabel({ ...keySet, index })
  const maxTitleLength =
      (maxPaginateLength - 2*switchers.length) / keySets.length
  let title = label + (keyboardTypeToSuffix[keySet.keyboardType] ?? '')
  let compressed
  for (let level = 1; visualLengthOf(title) > maxTitleLength; ++level) {
    compressed = compress(title, level)
    if (compressed) title = compressed.trim()
    else level = 2
  }
  return title || label.slice(0, 6) + '…'
}
