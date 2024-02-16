import 'https://code.jquery.com/jquery-3.7.1.min.js'

/**
 * @param {Object} keySets Key sets.
 * @param {Number} index Index.
 * @return {String} Shortened title.
 */
export function shortTitle(keySets, index) {
  const label = makeTitle(keySets, index)
  const maxPagLength = 118
  const numSwitchers = 3
  const maxLabelLength =
      (maxPagLength - 2*numSwitchers) / keySets.length
  let l = label
  for (
      let i = 1;
      l.replaceAll(/[WMЩЮЖМШ]/g, '...')
          .replaceAll(/[^ijlI. ᴱˢ]/g, '..').length > maxLabelLength;
      ++i
  ) {
    switch (i) {
      case 1:  // trash
        l = l.replaceAll(/[^\wа-яё -]/gi, '').replaceAll(/-/g, ' ')
        break
      case 2:  // type
        l = l.replace(/(.*) split[ -]space$/, '$1ˢˢ')
            .replace(/^Ergodox (.*)/, '$1ᴱ')
            .replace(/(.*) Matrix$/, '$1ᴹ')
        break
      case 3:  // vowels
        l = l.replaceAll(/(?=[\wА-ЯЁа-яё])[aeiouyаеёийоуыэюя]/g, '')
        break
      case 4:  // abbreviation
        l = l.replaceAll(/([A-Za-zА-ЯЁа-яё][a-zа-яё])[a-zа-яё]+/g, '$1.')
        break
      case 5:  // dots
        l = l.replaceAll(/\./g, ''); break
      case 6:  // lower
        l = l.replaceAll(/(?=[\wА-ЯЁа-яё])[a-zа-яё]/g, '')
            .replaceAll(/(?=[\wА-ЯЁа-яё])[A-ZА-ЯЁ]/g, a => a.toLowerCase())
            .replaceAll(/ /g, '')
        break
      case 7:  // digits
        l = l.replaceAll(/(\d)\d+/g, '$1'); break
      default:
        i = 3; break
    }
    l = l.trim()
  }
  return (l == '')? label.slice(0, 6) + '…' : l
}

/**
 * @param {String} wrapperSelector Wrapper selector.
 * @return {Function} Function that recalc. first & last elems inside wrapper.
 */
export function rowFirstLast(wrapperSelector) {
  return () => rowFirstLastUpdate(wrapperSelector)
}

/*export function chainCalls(...args) {
  if (args.length > 0 && typeof args[0] === 'function') {
    return args[0](() => chainCalls.apply(null, args.slice(1)))
  }
}*/

/**
 * @param {Object} keySets Key sets.
 * @param {Number} index Index.
 * @return {String} Label with keyboard type.
 */
function makeTitle(keySets, index) {
  let label = forceLabel(keySets, index)
  switch (keySets[index].keyboardType) {
    case 'european_ss':
      label += ' split-space'; break
    case 'ergodox':
      label = 'Ergodox ' + label; break
    case 'matrix':
      label += ' Matrix'; break
  }
  return label
}

/**
 * Make label if it doesn't exist.
 * @param {Array} keySets Key sets.
 * @param {Number} index Uses in default value if no letter group is found.
 * @return {String} Label.
 */
function forceLabel(keySets, index) {
  const keys = keySets[index].keys
  let label = keySets[index].label.trim()
  if (label === '') {
    let id = letterKeyGroupFirstId(keys, true)
    if (id === undefined)
      id = letterKeyGroupFirstId(keys)
    const maxGrLen = 6
    let char
    for (let ii = id; ii < id + maxGrLen; ++ii) {
      char = String.fromCharCode(keys.find(key => key.id === ii).primary)
      if (char.toUpperCase() === char) break
      label += char
    }
    label = (label === '')? 'Layout ' + index : label.toUpperCase()
  }
  return label
}

/**
 * Find first sequence of letters: e. g. QWERTY or AOEUID for Dvorak.
 * @param {Array} keys Keys.
 * @param {Boolean} strict Strict.
 * @return {Number} Index of first element of sequence.
 */
function letterKeyGroupFirstId(keys, strict=false) {
  let id
  return keys.find(first => {
    const minGrLen = 4
    id = first.id
    return (!strict || first.finger === KB.finger.LEFT_PINKY)
        && (
          keys.filter(next =>
            next.id >= first.id && next.id < first.id + minGrLen
                && String.fromCharCode(next.primary).toUpperCase()
                    !== String.fromCharCode(next.primary)
          )
        ).length === minGrLen
  }) && id
}

/**
 * Call the function anytime needed, by default on loading and resizing window.
 * https://copyprogramming.com/howto/is-it-possible-to-target-the-first-and-the-last-element-per-row-in-a-flex-layout
 * @param {String} wrapperSelector Wrapper selector.
 */
function rowFirstLastUpdate(wrapperSelector) {
  const rowFirstClass = 'row-first'
  const rowLastClass = 'row-last'
  $(document).ready(() => $(wrapperSelector).each(function() {
    const $children = $(this).children()
    const addClass = (i, cls) => $children.eq(i).addClass(cls)
    const removeClass = cls => $(this).children('.' + cls).removeClass(cls)

    removeClass(rowFirstClass)
    removeClass(rowLastClass)
    addClass(0, rowFirstClass)
    addClass($children.length - 1, rowLastClass)
    
    $children.each(i => {
      if (!i) return
      const rect = i => $children.eq(i)[0].getBoundingClientRect()
      // if (rect(i - 1).right <= rect(i).left) return
      if (rect(i - 1).bottom > rect(i).top) return
      addClass(i - 1, rowLastClass)
      addClass(i, rowFirstClass)
    })
  }))
}
