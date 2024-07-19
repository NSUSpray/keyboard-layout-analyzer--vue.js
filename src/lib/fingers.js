const Fingers = {
  NONE: -1,
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
  BOTH_THUMBS: 11,
}

const hands = {
  none: [Fingers.NONE],
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
  both: [Fingers.BOTH_THUMBS],
}

const handOf = finger => Object.entries(hands)
    .find(([hand, fingers]) => fingers.includes(finger))?.[0]

const isThumb = finger =>
    [Fingers.LEFT_THUMB, Fingers.RIGHT_THUMB].includes(finger)

export const sameFingerGroup = (finger1, finger2) =>
    ![finger1, finger2].includes(Fingers.NONE)
    && handOf(finger1) === handOf(finger2)
    && isThumb(finger1) === isThumb(finger2)

export default Fingers
