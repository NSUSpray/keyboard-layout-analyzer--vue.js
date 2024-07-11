const fingers = {
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

const hands = {
  none: [fingers.none],
  left: [
    fingers.leftPinky,
    fingers.leftRing,
    fingers.leftMiddle,
    fingers.leftIndex,
    fingers.leftThumb,
  ],
  right: [
    fingers.rightThumb,
    fingers.rightIndex,
    fingers.rightMiddle,
    fingers.rightRing,
    fingers.rightPinky,
  ],
  both: [fingers.bothThumbs],
}

const handOf = finger => Object.entries(hands)
    .find(([hand, fingers]) => fingers.includes(finger))?.[0]

const isThumb = finger =>
    [fingers.leftThumb, fingers.rightThumb].includes(finger)

export const sameFingerGroup = (finger1, finger2) =>
    ![finger1, finger2].includes(fingers.none)
    && handOf(finger1) === handOf(finger2)
    && isThumb(finger1) === isThumb(finger2)

export default fingers
