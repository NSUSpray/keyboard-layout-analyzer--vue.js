<script setup>
import { ref } from 'vue'
import { importFilters, defaultImportFilter } from '../lib/constants'
import { transitionDurationOf } from '../lib/utilities'

defineEmits(['import'])
defineExpose({ cancel, show })

const dialog = ref(null)
const importButton = ref(null)
const textarea = ref(null)

const isClosed = ref(true)
const filter = ref(defaultImportFilter)

function show(importText) {
  textarea.value.value = importText
  filter.value = defaultImportFilter
  dialog.value.showModal()
  isClosed.value = false
  ;(importText? importButton : textarea).value.focus()
}

function cancel(event) {
  isClosed.value = true
  const transitionDuration = transitionDurationOf(dialog.value)
  setTimeout(() => dialog.value.close(), transitionDuration)
  event.preventDefault()
}
</script>

<template>
  <dialog ref="dialog" @cancel="cancel" :class="{ closed: isClosed }">
    <h3>Import Layouts</h3>
    <button @click="cancel" title="Close" v-shortkey="['Esc']">×</button>

    <div>
      <textarea ref="textarea" @focus="textarea.select" />
      <p>Paste the text of a previously copied or exported layout/fingering/set
          in the textbox above and press ‘Import’ to load.</p>
    </div>

    <form>
      <fieldset>
        <label>Filter</label>
        <div class="controls">
          <label v-for="(label, value) in importFilters">
            <input type="radio" name="filter" :value="value" v-model="filter">{{ label }}
          </label>
        </div>
      </fieldset>
      <fieldset>
        <div class="controls">
          <button type="button" ref="importButton"
              @click="$emit('import', textarea.value, filter)">Import</button>
          <button type="button" @click="cancel">Cancel</button>
        </div>
      </fieldset>
    </form>
  </dialog>
</template>

<style scoped>
dialog {
  bottom: 0;
  max-width: min(100% - var(--content-margin) * 2, 560px);
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
  font-size: 1.75rem;
  color: var(--dark-dark-blue);
  background-color: transparent !important;
}
h3 + button:is(:hover, :focus) { color: var(--black-blue); }

fieldset { margin: 0; }

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
