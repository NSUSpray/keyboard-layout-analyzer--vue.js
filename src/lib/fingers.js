import { addStyle } from './browser.js'

const Fingers = {
  LEFT_PINKY: 1,
  LEFT_RING: 2,
  LEFT_MIDDLE: 3,
  LEFT_INDEX: 4,
  LEFT_THUMB: 5,
  RIGHT_THUMB: 6,
  RIGHT_INDEX: 7,
  RIGHT_MIDDLE: 8,
  RIGHT_RING: 9,
  RIGHT_PINKY: 10,
}

const hands = {
  left: [
    Fingers.LEFT_PINKY,
    Fingers.LEFT_RING,
    Fingers.LEFT_MIDDLE,
    Fingers.LEFT_INDEX,
    Fingers.LEFT_THUMB,
  ],
  right: [
    Fingers.RIGHT_THUMB,
    Fingers.RIGHT_INDEX,
    Fingers.RIGHT_MIDDLE,
    Fingers.RIGHT_RING,
    Fingers.RIGHT_PINKY,
  ],
}

const handOf = finger => Object.entries(hands)
    .find(([hand, fingers]) => fingers.includes(finger))?.[0]

const isThumb = finger =>
    [Fingers.LEFT_THUMB, Fingers.RIGHT_THUMB].includes(finger)

export const sameFingerGroup = (finger1, finger2) =>
    handOf(finger1) === handOf(finger2)
    && isThumb(finger1) === isThumb(finger2)

/**
 * Add color style of given CSS property for each finger.
 * @param {String} selector - CSS selector with “{finger}” placeholder.
 * @param {String} property - Property to colorize (border-color, fill etc.).
 */
export function colorizeByFinger(selector, property) {
  const makeRule = finger =>
      `${selector.replaceAll('{finger}', finger)}`
          + `{ ${property}: var(--${finger}); }`
  const style = Object.keys(Fingers).map(makeRule).join('\n')
  addStyle(style)
}

export default Fingers
