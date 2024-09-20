<script setup>
import { ref, watch } from 'vue'
import Fingers from '../lib/fingers.js'
import { objectFlip } from '../lib/utilities.js'

defineExpose({ close, show })
const keySet = defineModel({ type: Object })


const dialog = ref(null)


// current state

const cValues = {
  primary: ref('a'), shift: ref('A'),
  altGr: ref('á'), shiftAltGr: ref('Á'),
}
const cFinger = ref(Fingers.LEFT_INDEX)
const isStartOfFinger = ref(false)  // start position of finger

const wasStartOfFinger = ref(false)
let lastStartOfFinger, cId

for (const [oKey, cValue] of Object.entries(cValues))
    watch(cValue, newValue => {
      if (cId === undefined) return  // ignore on show
      const code = keySetCode(newValue)
      if (code === undefined) return
      keySet.value.keys[cId][oKey] = code
    })

watch(cFinger, newValue => {
  if (cId === undefined) return  // ignore on show
  keySet.value.keys[cId].finger = newValue
})

watch(isStartOfFinger, isStart => {
  if (cId === undefined) return  // ignore on show
  keySet.value.fingerStart[cFinger.value] = isStart? cId : lastStartOfFinger
})


const codeFor = { esc: 27, backspace: 8, tab: 9, del: 127, capslock: 20,
    enter: 13, lshift: 16, rshift: -16, ctrl: 17, win: -91, alt: 18, space: 32,
    nbsp: 160, altgr: -18, menu: -93 }

const reprFor = objectFlip(codeFor)

function inputRepr(code) {
  if (code === undefined) return
  return reprFor[code] ?? String.fromCharCode(code)
}

const keySetCode = repr =>
    (repr.length === 1)? repr.charCodeAt() : codeFor[repr]


const closeOnClickout = event =>
    event.composedPath().includes(dialog.value)? null : close()

function show(index) {
  if (dialog.value.open) close()
  const key = keySet.value.keys[index]
  for (const oKey in cValues)
      cValues[oKey].value = inputRepr(key[oKey])
  cFinger.value = key.finger
  lastStartOfFinger = keySet.value.fingerStart[key.finger]
  isStartOfFinger.value = wasStartOfFinger.value =
      lastStartOfFinger == index
  setTimeout(() => {  // AFTER ref values have been set
    cId = key.id  // activate watchers
    document.addEventListener('click', closeOnClickout)
  })
  dialog.value.show()
}

function close() {
  cId = undefined
  dialog.value.close()
  document.removeEventListener('click', closeOnClickout)
}

const capsToTitle = caps =>
    caps.replace('_', ' ').replace(/(?<=\w)./g, c => c.toLowerCase())
</script>

<template>
  <dialog ref="dialog" @cancel="close">
    <div>
      <label>Primary:
        <input type="text" v-model="cValues.primary.value" />
      </label>
      <label>Shift:
        <input type="text" v-model="cValues.shift.value" />
      </label>
      <label>Alt Gr:
        <input type="text" v-model="cValues.altGr.value" />
      </label>
      <label>Shift + Alt Gr:
        <input type="text" v-model="cValues.shiftAltGr.value" />
      </label>
    </div>
    <label>Finger for Pressing Key:
      <select v-model="cFinger">
        <option v-for="[finger, index] of Object.entries(Fingers)"
            :value="index">
          {{ capsToTitle(finger) }}
        </option>
      </select>
    </label>
    <label>
      <input type="checkbox" v-model="isStartOfFinger"
          :disabled="wasStartOfFinger" />
      Is Starting Position of Finger
    </label>
  </dialog>
</template>

<style scoped>
dialog {
  /* TODO? delete --huge-radius */
  border-radius: var(--large-radius);
  &::before /* shadow */ { box-shadow: var(--shadow); }
}

label { display: block; }

select { overflow: auto; }
</style>
