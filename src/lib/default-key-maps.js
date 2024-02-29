import { Serial } from '@ijprest/kle-serial'
import bbox from '@turf/bbox'
import { polygon } from '@turf/helpers'
import { getCoords } from '@turf/invariant'
import union from '@turf/union'

import kleKeyMaps from './kle-key-maps'
import { dropUntil, objectMap, rotate } from './utilities'

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

function posAndSizeOf({
  x, y, width: w, height: h,
  x2, y2, width2: w2, height2: h2,
  rotation_angle: a, rotation_x: rx, rotation_y: ry,
  stepped
}) {
  const rotationObj = a? { a, rx: rx * normKeySize, ry: ry * normKeySize } : {}
  let coordsObj = {}
  if (!stepped) {
    const rect = (x, y, w, h) =>
      polygon([[[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]])
    const r1 = rect(x, y, w, h), r2 = rect(x + x2, y + y2, w2, h2)
    const poly = union(r1, r2)
    const coords = getCoords(poly)[0].slice(0, -1)
    if (coords.length !== 4) {  // not rectangle
      let xw, yh
      ;[x, y, xw, yh] = bbox(poly)
      ;[w, h] = [xw - x, yh - y]
      coordsObj = { coords: coords.map(xy => xy.map(i => i * normKeySize)) }
    }
  }
  ;[x, y, w, h] = [x, y, w, h].map(i => i * normKeySize)
  return { x: x + shift, y: y + shift, w, h, ...rotationObj, ...coordsObj }
}

function adjustBoundingBox(
  { x, y, w, h, a, rx, ry, coords }, { minX, minY, maxX, maxY }
) {
  let xw, yh
  if (a) {
    coords ??= [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]
    coords = coords.map(coord => rotate(coord, a, [rx, ry]))
    const poly = polygon([coords])
    ;[x, y, xw, yh] = bbox(poly)
  } else [xw, yh] = [x + w, y + h]
  return {
    minX: Math.min(minX, x),
    minY: Math.min(minY, y),
    maxX: Math.max(maxX, xw),
    maxY: Math.max(maxY, yh)
  }
}

function kleToKla([kbtype, rows]) {
  const keyMap = {}
  const keys = Serial.deserialize(rows).keys
  let index, scanCode, posAndSize,
    bBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  for (const key of keys) {
    ;[index, scanCode] = findIndexAndScanCode(key.labels)
    posAndSize = posAndSizeOf(key)
    keyMap[index] = posAndSize
    if (!isNaN(scanCode)) keyMap[index].scan = scanCode
    bBox = adjustBoundingBox(posAndSize, bBox)
  }
  keyMap.width = bBox.maxX - bBox.minX + paddingX
  keyMap.height = bBox.maxY - bBox.minY + paddingY
  return [kbtype, keyMap]
}

const defaultKeyMaps = objectMap(kleToKla, kleKeyMaps)

export default defaultKeyMaps
