const normKeySize = 50

const defaultKeyMaps = {
  standard: {
    width: 15*normKeySize + 4,
    height: 5*normKeySize + 2,
    // pixelsPerCm: 26.315789,
    // split: false,
    // leftX: 0.5,
    // leftY: 0.5,
  },
}

const keyCount = [14, 14, 13, 12, 8]
const km = defaultKeyMaps.standard
let index = 0
let curY = 0.5

// special key sizes
const keyWidths = {
  '0,13': 100, // backspace
  '1,0': 75, // tab
  '1,13': 75, // backslash
  '2,0': 87.5, // caps
  '2,12': 112.5, // return
  '3,0': 112.5, // l.shift
  '3,11': 137.5, //r.shift
  '4,0': 62.5,
  '4,1': 62.5,
  '4,2': 62.5,
  '4,3': 312.5, // space
  '4,4': 62.5,
  '4,5': 62.5,
  '4,6': 62.5,
  '4,7': 62.5,
}

const setMountPoints = key => ({
  top: { x: key.cx, y: key.y },
  right: { x: key.x + key.w, y: key.cy },
  bottom: { x: key.cx, y: key.y + key.h },
  left: { x: key.x, y: key.cy },
})

for (let row = 0; row < 5; ++row) {
    let curX = 0.5
    for (let ii = 0; ii < keyCount[row]; ++ii) {
        km[index] = {
          x: curX,
          y: curY,
          w: keyWidths[row+","+ii] || normKeySize,
          h: normKeySize,
          // row: row,
          scan: index + (row === 3 && ii > 0? 2 : 1),
          // set the mount points - these are points where dialogs will attach to keys
          // all our keys are squares, so this is simple
          // mountPoint: setMountPoints(km[index]),
        }
        // km[index].cx = km[index].x + (km[index].w/2)
        // km[index].cy = km[index].y + (km[index].h/2)
        
        curX += km[index].w
        ++index
    }
    curY += normKeySize
}
km[0].scan = 0x29  // OEM_3: `~
km[27].scan = 0x2b  // OEM_5: \|
km[28].scan = 0x3a  // Caps Lock
km[40].scan = 0x1c  // Enter
km[53].scan = 0x1d  // Left Ctrl
km[54].scan = -0x5b  // Left Win
km[57].scan = -0x38  // Right Alt
km[58].scan = -0x5c  // Right Win
km[59].scan = -0x5d  // Menu
km[60].scan = -0x1d  // Right Ctrl

export default defaultKeyMaps
