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

const indexPattern = /^\d\d$/
const scanCodePattern = /^(E0 )?[0-9A-F]{2}$/i
const centersPattern = /^\d(\.\d+)?( \d(\.\d+)?)?(;\d(\.\d+)?( \d(\.\d+)?)?)?$/

const escapeLineFeeds = rows => rows.map(row => row.map(elem =>
  (typeof elem === 'string')? elem.replaceAll('\n', '\0') : elem
))

const dropUntilPattern = (xs, regex) => dropUntil(xs, x => regex.test(x))

function scanCodeFrom(scanCodeString) {
  const extraAndBase = scanCodeString.split(' ')
  const hasExtra = extraAndBase.length === 2
  scanCodeString = extraAndBase.slice(-1)
  return (hasExtra? -1 : 1) * parseInt(scanCodeString, 16)
}

const centersFrom = centersString =>
  centersString.split(';').map(
    cs => cs.split(' ').map(xy => (parseFloat(xy) + 0.5) * normKeySize)
  )

function readKeyDataFrom(labels) {
  let result = { index: NaN, scanCode: NaN, centers: [[]] }
  labels = labels[0].split('\0')  // ‘de-escape’

  labels = dropUntilPattern(labels, indexPattern)
  if (!labels.length /* no index */) return result
  result.index = parseInt(labels[0])

  const labelsStartingFromScanCode =
    dropUntilPattern(labels.slice(1), scanCodePattern)
  if (labelsStartingFromScanCode.length /* has scan code */) {
    result.scanCode = scanCodeFrom(labelsStartingFromScanCode[0])
    labels = labelsStartingFromScanCode
  }

  const labelsStartingFromCenters = dropUntilPattern(labels.slice(1), centersPattern)
  if (labelsStartingFromCenters.length /* has centers */)
    result.centers = centersFrom(labelsStartingFromCenters[0])

  return result
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

function makeCentersObj(centers, posAndSize) {
  centers = centers.map(
    ([x, y]) => [x ?? posAndSize.w / 2, y ?? posAndSize.h / 2]
  )
  const centersObj = {}
  for (const [j, center] of centers.entries())
    for (const [i, xy] of ['x', 'y'].entries())
      centersObj['c' + xy + (j? j + 1 : '')] = posAndSize[xy] + center[i]
  return centersObj
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
  const keys = Serial.deserialize(escapeLineFeeds(rows)).keys
  let index, scanCode, centers,
    posAndSize, scanCodeObj, centersObj, row,
    bBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  for (const key of keys) {
    ({ index, scanCode, centers } = readKeyDataFrom(key.labels))
    posAndSize = posAndSizeOf(key)
    scanCodeObj = isNaN(scanCode)? {} : { scan: scanCode }
    centersObj = makeCentersObj(centers, posAndSize)
    row = Math.floor(key.y)
    keyMap[index] = { ...posAndSize, ...scanCodeObj, ...centersObj, row }
    bBox = adjustBoundingBox(posAndSize, bBox)
  }
  keyMap.width = bBox.maxX - bBox.minX + paddingX
  keyMap.height = bBox.maxY - bBox.minY + paddingY
  return [kbtype, keyMap]
}

const defaultKeyMaps = objectMap(kleToKla, kleKeyMaps)

export default defaultKeyMaps
