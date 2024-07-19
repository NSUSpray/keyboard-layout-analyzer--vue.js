/**
 * Drop the initial elements of a given array until an element matching a given
 * predicate is found.
 * @param {Array} array Processed array.
 * @param {Function} predicate Condition which you want to drop array elements.
 * @return {Array}
 */
export function dropUntil(array, predicate) {
  const index = array.findIndex(predicate)
  return (index === -1)? [] : array.slice(index)
}

/**
 * Take the initial elements of a given array until an element not matching a
 * given predicate is found.
 * @param {Array} array Processed array.
 * @param {Function} predicate Condition which you want to take array elements.
 * @return {Array}
 */
export function takeWhile(array, predicate) {
  const index = array.findIndex(x => !predicate(x))
  return (index === -1)? array : array.slice(0, index)
}


const objectM = (method, func, obj) =>
    Object.fromEntries(Object.entries(obj)[method](func))

/**
 * Apply the function to all values of a given object.
 * @param {Function} func Function to apply.
 * @param {Object} obj Processed object.
 * @return {Object} New mapped object.
 */
export const objectMap = (func, obj) => objectM('map', func, obj)

/**
 * Filter the object where a given predicate function returns ‘true’.
 * @param {Function} func Predicate.
 * @param {Object} obj Processed object.
 * @return {Object} New filtered object.
 */
export const objectFilter = (func, obj) => objectM('filter', func, obj)

/**
 * @param {Object} obj Object to find a key by a given value.
 * @param {Function} predicate
 * @return {String} Found key.
 */
export const objectKeyByValue = (obj, predicate) =>
    Object.entries(obj).find(([_, value]) => predicate(value))?.[0]


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

/**
 * Check that the character code matches the alphabetic character.
 * @param {Number} charCode Character code.
 * @return {Boolean} True if it’s a letter character, otherwise false.
 */
export function isLetterCode(charCode) {
  const char = String.fromCharCode(charCode)
  return char.toUpperCase() !== char.toLowerCase()
}
