/**
 * Drop the initial elements of a given array until an element matching a given
 * predicate is found.
 * @param {Array} array - Processed array.
 * @param {Function} predicate
 * - Condition which you want to drop array elements.
 * @return {Array}
 */
export function dropUntil(array, predicate) {
  const index = array.findIndex(predicate)
  return (index === -1)? [] : array.slice(index)
}

/**
 * Take the initial elements of a given array until an element not matching a
 * given predicate is found.
 * @param {Array} array - Processed array.
 * @param {Function} predicate - Condition which you want to take array elements.
 * @return {Array}
 */
export function takeWhile(array, predicate) {
  const index = array.findIndex(x => !predicate(x))
  return (index === -1)? array : array.slice(0, index)
}


const objectM = (obj, method, func) =>
    Object.fromEntries(Object.entries(obj)[method](func))

/**
 * Apply the function to all values of a given object.
 * @param {Object} obj - Processed object.
 * @param {Function} func - Function to apply of type
 * OldValueType -> NewValueType.
 * @return {Object} New mapped object.
 */
export const mapValues = (obj, func) =>
    objectM(obj, 'map', ([oKey, value]) => [oKey, func(value)])

/**
 * Flip keys and values of a given object: { a: 1 } → { "1": "a" }
 * @param {Object} obj - Processed object.
 * @return {Object} Flipped object.
 */
export const objectFlip = obj =>
    objectM(obj, 'map', ([key, value]) => [value, key])

/**
 * Filter the object where a given predicate function returns “true”.
 * @param {Object} obj - Processed object.
 * @param {Function} predicate - Function of type ObjectKeyType -> Boolean.
 * @return {Object} New filtered object.
 */
export const filterByKey = (obj, predicate) =>
    objectM(obj, 'filter', ([oKey, value]) => predicate(oKey))

/**
 * @param {Object} obj - Object to find a key by a given value.
 * @param {Function} predicate
 * @return {String} Found key.
 */
export const objectKeyByValue = (obj, predicate) =>
    Object.entries(obj).find(([_, value]) => predicate(value))?.[0]


/**
 * Rotate the point around a given pivot by a given angle.
 * @param {Array[Number]} point - Point coordinates.
 * @param {Number} theta - Rotate angle in degrees.
 * @param {Array[Number]} pivot - Pivot point coordinates.
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

/**
 * Check that the character code matches the alphabetic character.
 * @param {Number} charCode - Character code.
 * @return {Boolean} True if it’s a letter character, otherwise false.
 */
export function isLetterCode(charCode) {
  const char = String.fromCharCode(charCode)
  return char.toUpperCase() !== char.toLowerCase()
}
