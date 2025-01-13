<script setup>
import { computed, ref, watch } from 'vue'
import Fingers from '../lib/fingers.js'
import { objectFlip } from '../lib/utilities.js'

defineExpose({ close, show })
const keySet = defineModel({ type: Object })


const dialog = ref(null)


// current state

const cValues = {
  primary: { label: 'Primary' },
  shift: { label: 'Shift' },
  altGr: { label: 'Alt Gr' },
  shiftAltGr: { label: 'Shift + Alt Gr' },
}
for (const cValue of Object.values(cValues)) {
  cValue.ref = ref('')
  cValue.code = computed
      (() => keySetCode(cValue.ref.value))
  cValue.isValid = computed
      (() => cValue.ref.value === '' || cValue.code.value !== undefined)
}
const cFinger = ref(Fingers.LEFT_INDEX)
const isStartOfFinger = ref(false)  // start position of finger
let cPosition

const wasStartOfFinger = ref(false)
let lastStartOfFinger, cId

for (const [oKey, cValue] of Object.entries(cValues))
    watch(cValue.ref, () => {
      if (cId === undefined) return  // ignore on show
      if (!cValue.isValid.value) return
      keySet.value.keys[cId][oKey] = cValue.code.value
    })

watch(cFinger, newValue => {
  if (cId === undefined) return  // ignore on show
  keySet.value.keys[cId].finger = newValue
  lastStartOfFinger = keySet.value.fingerStart[newValue]
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
  if (code === undefined) return ''
  return reprFor[code] ?? String.fromCharCode(code)
}

const keySetCode = repr =>
    (repr.length === 1)? repr.charCodeAt() : codeFor[repr]


const closeOnClickout = event =>
    event.composedPath().includes(dialog.value)? null : close()

function show(index, position) {
  close()
  const key = keySet.value.keys[index]
  for (const oKey in cValues)
      cValues[oKey].ref.value = inputRepr(key[oKey])
  cFinger.value = key.finger
  lastStartOfFinger = keySet.value.fingerStart[key.finger]
  isStartOfFinger.value = wasStartOfFinger.value =
      lastStartOfFinger == index
  cPosition = position
  setTimeout(() => {  // AFTER ref values have been set
    cId = key.id  // activate watchers
    keySet.value.keys[cId].state = 'active'
    document.addEventListener('click', closeOnClickout)
  })
  dialog.value.show()
}

function close() {
  if (!dialog.value.open) return
  dialog.value.close()
  document.removeEventListener('click', closeOnClickout)
  keySet.value.keys[cId].state = undefined
  cId = undefined
}

const capsToTitle = caps =>
    caps.replace('_', ' ').replace(/(?<=\w)./g, c => c.toLowerCase())
</script>

<template>
  <dialog ref="dialog" :class="cPosition" @cancel="close">
    <div>
      <label v-for="[key, cValue] of Object.entries(cValues)" :key>
        {{ cValue.label }}:
        <input type="text" v-model="cValue.ref.value"
            :class="{ danger: !cValue.isValid.value }" />
      </label>
    </div>
    <label>Finger for Pressing Key:
      <select v-model="cFinger" :disabled="isStartOfFinger">
        <option v-for="[finger, index] of Object.entries(Fingers)"
            :key="finger" :value="index">
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
  --border-radius: var(--large-radius);
  top: calc(100% + var(--narrow-margin) * 0.75);
  border-radius: var(--border-radius);
  &::before /* shadow */ { box-shadow: var(--shadow); }
}

label { display: block; }

select { overflow: auto; }



@media (min-width: 1024px) or (orientation: landscape) {

  dialog {
    top: calc(-2*var(--border-radius));
    --position-margin: calc(50% + 25px + var(--wide-margin));
    &.left { margin-right: var(--position-margin); }
    &.right { margin-left: var(--position-margin); }
  }

}
</style>
