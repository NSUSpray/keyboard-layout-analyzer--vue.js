<script setup>
import { onMounted, ref } from 'vue'

import { defaultImportFilter, importFilters } from '../lib/constants'
import { layoutSchema, setSchema } from '../lib/schemas'
import { transitionDurationOf } from '../lib/utilities'

const emit = defineEmits(['keySet'])
defineExpose({ close, show })

const dialog = ref(null)
const importButton = ref(null)
const textarea = ref(null)

const confirm = ref(false)
const filter = ref(defaultImportFilter)
const isClosed = ref(true)

let transitionDuration

const focus = (element, timeout) =>
  setTimeout(() => element.value.focus(), timeout ?? 0)

function show(textareaValue) {
  textarea.value.value = textareaValue
  confirm.value = false
  filter.value = defaultImportFilter
  dialog.value.showModal()
  textarea.value.scrollTop = 0
  isClosed.value = false
  focus(textareaValue? importButton : textarea, transitionDuration)
}

function verifyAndEmit() {
  const json = textarea.value.value
  let object, result
  try { object = JSON.parse(json) }
    catch { return console.log('parse fail') }
  result = layoutSchema.safeParse(object)
  if (result.success)
    return emit('keySet', result.data, json)
  result = setSchema.safeParse(object)
  if (result.success) {
    if (confirm.value)
      emit('keySet', result.data.layouts, json)
    return confirm.value = !confirm.value
  }
  console.log('schema fail')
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

onMounted(() => transitionDuration = transitionDurationOf(dialog.value))
</script>

<template>
  <dialog ref="dialog" @cancel="close" :class="{ closed: isClosed }">
    <h3>Import Layouts</h3>
    <button @click="close" title="Close" v-shortkey="['Esc']">×</button>

    <div>
      <textarea ref="textarea" @focus="textarea.select" @paste="onPaste" />
      <p>Paste the text of a previously copied or exported layout/fingering/set
          in the textbox above and press ‘Import’ to load.</p>
    </div>

    <form>
      <fieldset v-show="!confirm">
        <label>Filter</label>
        <div class="controls">
          <label v-for="(label, value) in importFilters">
            <input type="radio" name="filter" :value="value" v-model="filter">{{ label }}
          </label>
        </div>
      </fieldset>
      <fieldset id="buttons">
        <div class="controls">
          <button type="button" ref="importButton"
              :class="{ warning: confirm }"
              @blur="confirm = false" @click="verifyAndEmit">{{
            confirm? 'Import in Place of All Current' : 'Import'
          }}</button>
          <button type="button" @click="close">Cancel</button>
        </div>
      </fieldset>
    </form>
  </dialog>
</template>

<style scoped>
dialog {
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
}
dialog::backdrop { background-color: transparent; }
dialog.closed {
  bottom: 178vh;
  opacity: 0;
}

dialog > * {
  margin: 0;
  padding: var(--padding);
}

dialog > :is(h3 + button, h3) { line-height: 1em; }

h3 + button {
  position: absolute;
  top: var(--padding);
  right: var(--padding);
  width: 1em;
  padding: 0;
  font-size: 1.75rem; /* FIXME */
  color: var(--dark-dark-blue);
  background-color: transparent !important;
}
h3 + button:is(:hover, :focus) { color: var(--black-blue); }

fieldset { margin: 0; }
#buttons { flex-grow: 1; justify-content: flex-end; }

form {
  border-top: solid 1px var(--light-gray);
  background-color: var(--wwhite-blue);
}

textarea {
  min-width: 100%;
  max-width: 100%;
  height: 8em;
}
</style>
