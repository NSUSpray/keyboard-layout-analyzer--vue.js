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
 * Make label if it doesn’t exist.
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

/**
 * Drop the initial elements of a given array until an element matching a
 * given regular expression is found.
 * @param {Array[String]} xs Processed array of strings.
 * @param {RegExp} regex Expression which you want to drop array elements.
 * @return {Array[String]} New filtered array.
 */
export function dropUntil(xs, regex) {
  const i = xs.findIndex(x => regex.test(x))
  return (i === -1)? [] : xs.slice(i)
}

const objectM = (method, f, obj) =>
  Object.fromEntries(Object.entries(obj)[method](f))

/**
 * Apply the function to all values of a given object.
 * @param {Function} f Function to apply.
 * @param {Object} obj Processed object.
 * @return {Object} New mapped object.
 */
export function objectMap(f, obj) { return objectM('map', f, obj) }

/**
 * Filter the object where a given predicate function returns ‘true’.
 * @param {Function} f Predicate.
 * @param {Object} obj Processed object.
 * @return {Object} New filtered object.
 */
export function objectFilter(f, obj) { return objectM('filter', f, obj) }

/**
 * Rotate the point around a given pivot by a given angle.
 * @param {Array[Number]} point Point coordinates.
 * @param {Number} theta Rotate angle in degrees.
 * @param {Array[Number]} pivot Pivot point coordinates.
 * @return {Array[Number]} Rotated point coordinates.
 */
export function rotate(point, theta, pivot) {
  theta *= Math.PI / 180
  const sin = Math.sin(theta)
  const cos = Math.cos(theta)
  const dx = point[0] - pivot[0]
  const dy = point[1] - pivot[1]
  return [
    pivot[0] + dx * cos - dy * sin,
    pivot[1] + dx * sin + dy * cos
  ]
}
