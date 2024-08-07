<script setup>
import { onMounted, ref } from 'vue'
import DropButton from '../components/DropButton.vue'
import { fingeringSchema, layoutSchema, setSchema } from '../lib/schemas.js'
import { transitionDurationOf } from '../lib/browser.js'

const emit = defineEmits(['import'])
defineExpose({ close, show })
const props = defineProps({ keyboardType: String })


const dialog = ref(null)
const confirmButton = ref(null)
const importButton = ref(null)
const textarea = ref(null)

const confirm = ref(false)
const isClosed = ref(true)
const error = ref(null)

let transitionDuration
onMounted(() => transitionDuration = transitionDurationOf(dialog.value))


const focus = (element, timeout=0) =>
    setTimeout(() => element.value.focus(), timeout)

function show(textareaValue) {
  textarea.value.value = textareaValue
  confirm.value = false
  error.value = null
  dialog.value.showModal()
  textarea.value.scrollTop = 0
  isClosed.value = false
  focus(textareaValue? importButton : textarea, transitionDuration)
}


function verifyAndEmit(filterValue='all') {
  const json = textarea.value.value
  let object, result

  try { object = JSON.parse(json) }
  catch { return error.value = 'Invalid layout string' }

  result = layoutSchema.safeParse(object)
  if (result.success)
      return emit('import', 'keySet', result.data, json, filterValue)

  if (filterValue !== 'all') return

  result = fingeringSchema.safeParse(object)
  if (result.success) {
    if (result.data.keyboardType !== props.keyboardType)
        return error.value = 'Fingering keyboard type must match target'
    return emit('import', 'fingering', result.data, json)
  }

  result = setSchema.safeParse(object)
  if (result.success) {
    confirm.value = !confirm.value
    return confirm.value?
        focus(confirmButton) : emit('import', 'keySets', result.data, json)
  }

  error.value = 'Layout does not satisfy any possible schema'
}


function close(event) {
  isClosed.value = true
  setTimeout(() => dialog.value.close(), transitionDuration)
  event?.preventDefault()
}

function onPaste() {
  const ta = textarea.value
  const empty = ta.value === ''
  const selectedAll =
      ta.selectionStart === 0 && ta.selectionEnd === ta.textLength
  if (empty || selectedAll) focus(importButton)
}
</script>

<template>
  <dialog ref="dialog" :class="{ closed: isClosed }" @cancel="close">
    <h3>Import Layouts</h3>
    <button type="button" title="Close" @click="close"
        v-shortkey="['Esc']">×</button>

    <div>
      <div class="textarea-n-status">
        <textarea ref="textarea" :class="{ danger: error }"
            @focus="textarea.select(); error = null" @paste="onPaste" />
        <div class="status">{{ error }}</div>
      </div>
      <p>Paste the text of a previously copied or exported layout/fingering/set
          in the textbox above and press ‘Import’ to load.</p>
    </div>

    <div class="controls">
      <button v-if="confirm" ref="confirmButton" class="warning"
          @blur="confirm = false" @click="verifyAndEmit()">
        Import in Place of All Current
      </button>
      <DropButton v-else ref="importButton" :disabled="error"
          value="Import" @click="verifyAndEmit()">
        <a @click="verifyAndEmit('nonLetters')">Import Non-Letters</a>
        <a @click="verifyAndEmit('altGr')">Import ‘Alt Gr’ Layer</a>
      </DropButton>
      <button type="button" @click="close">Cancel</button>
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  overflow: visible;
  bottom: 0;
  --width: min(100% - var(--content-margin) * 2, 560px);
  min-width: var(--width); max-width: var(--width);
  padding: 0;
  border-radius: var(--radius);
  box-shadow:
      var(--sharp-shadow),
      0 0 0 100vw var(--light-gray-translucent);
  transition: opacity linear, bottom ease-out;
  transition-duration: var(--slow-transition-duration);
  &::backdrop { background-color: transparent; }
  &.closed {
    bottom: 178vh;
    opacity: 0;
  }
}
dialog > * {
  margin: 0;
  padding: var(--padding);
  &:is(h3 + button, h3) { line-height: 1em; }
  &:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }
  &:last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
}

.textarea-n-status { position: relative; }

h3 + button {
  position: absolute;
  top: var(--padding);
  right: var(--padding);
  width: 1em;
  padding: 0;
  font-size: 1.75rem; /* FIXME */
  color: var(--dark-dark-blue);
  background-color: transparent !important;
  &:hover,
  &:focus
      { color: var(--black-blue); }
}

.controls {
  justify-content: flex-end;
  border-top: solid 1px var(--light-gray);
  background-color: var(--wwhite-blue);
}

.status {
  position: absolute;
  visibility: hidden;
  right: 0; bottom: 0;
  padding: 0 var(--thin-padding);
  color: white;
  background-color: var(--white-blue);
  border: solid 2px transparent;
  border-radius: var(--radius) 0;
  transition: background-color linear;
  transition-duration: var(--fast-transition-duration);
  pointer-events: none;
}
.danger + .status {
  visibility: visible;
  background-color: var(--danger-color);
}
.danger:hover + .status
    { background-color: var(--danger-hover-color); }

textarea {
  min-width: 100%;
  max-width: 100%;
  height: 8em;
}
</style>
