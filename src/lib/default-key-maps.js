import { Serial } from '@ijprest/kle-serial'
import bbox from '@turf/bbox'
import { polygon, multiPolygon } from '@turf/helpers'
import { getCoords } from '@turf/invariant'
import union from '@turf/union'

import kleKeyMaps from './kle-key-maps'
import { dropUntil, objectMap } from './utilities'

// in pixels
const normKeySize = 50
const shift = 0.5
const paddingX = 4
const paddingY = 2

function scanCodeFrom(scanCodeString) {
  const extraAndBase = scanCodeString.split(' ')
  const hasExtra = extraAndBase.length === 2
  scanCodeString = extraAndBase.slice(-1)
  return (hasExtra? -1 : 1) * parseInt(scanCodeString, 16)
}

function findIndexAndScanCode(labels) {
  labels = dropUntil(labels, /^\d\d$/)
  if (!labels.length) return [NaN, NaN]
  const index = parseInt(labels[0])
  const scanCodeString =
    labels.slice(1).find(x => /^(E0 )?[0-9A-F]{2}$/i.test(x))
  if (!scanCodeString) return [index, NaN]
  const scanCode = scanCodeFrom(scanCodeString)
  return [index, scanCode]
}

function posAndSizeOf
    ({ x, y, width: w, height: h, x2, y2, width2: w2, height2: h2, stepped }) {
  let coordsObject = {}
  if (!stepped) {
    const rect = (x, y, w, h) =>
      polygon([[[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]])
    const r1 = rect(x, y, w, h), r2 = rect(x + x2, y + y2, w2, h2)
    const poly = union(r1, r2)
    const coords = getCoords(poly)[0].slice(0, -1)
    if (coords.length !== 4) {  // not rectangle
      let maxX, maxY
      ;[x, y, maxX, maxY] = bbox(poly)
      ;[w, h] = [maxX - x, maxY - y]
      coordsObject = { coords: coords.map(xy => xy.map(i => i * normKeySize)) }
    }
  }
  ;[x, y, w, h] = [x, y, w, h].map(i => i * normKeySize)
  return { x: x + shift, y: y + shift, w, h, ...coordsObject }
}

function sized(keyMap) {
  function sizeBy([xy, wh]) {
    const values = Object.values(keyMap)
    return Math.max(...values.map(key => key[xy] + key[wh]))
      - Math.min(...values.map(key => key[xy]))
  }
  return { ...keyMap,
    width: sizeBy('xw') + paddingX,
    height: sizeBy('yh') + paddingY }
}

function kleToKla([kbtype, rows]) {
  const keyMap = {}
  const keys = Serial.deserialize(rows).keys
  let indexAndScanCode, index, scanCode
  for (const key of keys) {
    indexAndScanCode = findIndexAndScanCode(key.labels)
    ;[index, scanCode] = indexAndScanCode
    keyMap[index] = posAndSizeOf(key)
    if (!isNaN(scanCode)) keyMap[index].scanCode = scanCode
  }
  console.log(sized(keyMap).width, sized(keyMap).height)
  return [kbtype, sized(keyMap)]
}

const defaultKeyMaps = objectMap(kleToKla, kleKeyMaps)

export default defaultKeyMaps
