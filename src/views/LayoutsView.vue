<script setup>
import { computed, ref, toRaw, watch } from 'vue'

import DropButton from '../components/DropButton.vue'
import ImportDialog from '../components/ImportDialog.vue'
import Jumbotron from '../components/Jumbotron.vue'
import LayoutEditor from '../components/LayoutEditor.vue'
import Select from '../components/Select.vue'

import useLayoutsStore from '@/stores/layouts'

import { downloadJson, processEventHandler } from '../lib/browser'
import { kbtype } from '../lib/constants'
import layoutList from '../lib/layout-list'
import { shortTitle } from '../lib/title'
import { isLetterCode } from '../lib/utilities'

const layoutsStore = useLayoutsStore()
const keySets = layoutsStore.keySets
const current = ref(0)
const preset = ref('')
const importDialog = ref(null)
const clipboardDouble = ref('')
const isLayoutPreset = computed
  (() => preset.value.split('.').pop() === 'kla-layout')

function prev() {
  const len = keySets.length
  current.value = (current.value + len - 1) % len
}

function next() {
  const len = keySets.length
  current.value = (current.value + 1) % len
}

function keepOnlyFingering(keySet) {
  keySet = structuredClone(toRaw(keySet))
  keySet.label = keySet.author = keySet.authorUrl = keySet.moreInfoUrl
      = keySet.moreInfoText = undefined
  keySet.keys.forEach(key =>
    key.primary = key.shift = key.altGr = key.shiftAltGr = undefined
  )
  return keySet
}

const copyJson = processEventHandler(async (_, fingering=false) => {
  let keySet = keySets[current.value]
  if (fingering) keySet = keepOnlyFingering(keySet)
  const keySetJson = JSON.stringify(keySet, null, 4)
  navigator.clipboard.writeText(keySetJson)
  clipboardDouble.value = keySetJson
})

const copyAllJson = processEventHandler(async () => {
  const keySetsJson = JSON.stringify
    ({ name: '' /* TODO */, layouts: keySets }, null, 4)
  navigator.clipboard.writeText(keySetsJson)
  clipboardDouble.value = keySetsJson
})

function filteredAssign(filterValue, targetKey, sourceKey) {
  let labels = ['primary', 'shift', 'altGr', 'shiftAltGr']
  switch (filterValue) {
    case 'nonLetters':
      labels = labels.filter(label =>
        !isLetterCode(targetKey[label]) && !isLetterCode(sourceKey[label])
      ); break
    case 'altGr':
      labels = ['altGr', 'shiftAltGr']; break
  }
  labels.forEach(label => targetKey[label] = sourceKey[label])
}

function updateKeySet(type, object, filterValue='all') {
  const i = current.value
  switch (type) {
    case 'keySet': case 'kla-layout':
      if (filterValue === 'all') { keySets[i] = object; break }
      keySets[i].keys.forEach
        ((key, index) => filteredAssign(filterValue, key, object.keys[index]))
      break
    case 'fingering': case 'kla-fingering':
      keySets[i].fingerStart = object.fingerStart
      keySets[i].keys.forEach
        ((key, index) => Object.assign(key, object.keys[index]))
      break
    case 'keySets': case 'kla-set':
      Object.assign(keySets, object.layouts); break
  }
}

function onPaste(type, object, json, filterValue='all') {
  clipboardDouble.value = json
  updateKeySet(type, object, filterValue)
  importDialog.value.close()
}

function exportJson(_, fingering=false) {
  let keySet = keySets[current.value]
  const filename = `${keySet.keyboardType.trim()}.${keySet.label.trim()}`
      .toLowerCase().replace(/\s/g, '-')
      + '.kla-' + (fingering? 'fingering' : 'layout')
  if (fingering) keySet = keepOnlyFingering(keySet)
  downloadJson(keySet, filename)
}

const exportAllJson = () => downloadJson
  ({ name: '' /* TODO */, layouts: keySets }, 'layouts.kla-set')

function isNotSameTypeOfFingering({ value }) {
  const [presetKeyboardType, ...rest] = value.split('.')
  const presetType = rest.pop()
  if (presetType !== 'kla-fingering') return false
  return presetKeyboardType !== keySets[current.value].keyboardType
}

const loadPreset = processEventHandler(async (_, filterValue='all') => {
  const type = preset.value.split('.').pop()
  const object = await layoutsStore.fetchKeySet(preset.value)
  updateKeySet(type, object, filterValue)
})

let last = 1
watch(current, (_, prevVal) => last = prevVal)
</script>

<template>
  <Jumbotron header="Layouts" run-button>
    <strong>Click</strong> or <strong>Drag</strong> the keys on the keyboard below
  </Jumbotron>

  <form id="editor">
    <fieldset id="keyboard">
      <template v-for="(layout, index) of layoutsStore.layouts" :key="index">
        <LayoutEditor v-show="index === current" :layout="layout" />
      </template>
    </fieldset>
    <fieldset>
      <label>Name</label>
      <div class="controls">
        <input type="text" id="name" v-model="keySets[current].label" />
        <Select :options="kbtype" v-model="keySets[current].keyboardType"
            title="Change to convert keyboard type" />
      </div>
    </fieldset>
    <fieldset id="smog"></fieldset>
    <fieldset>
      <label>Author</label>
      <div class="controls" :set="moreInfoUrl = keySets[current].moreInfoUrl">
        {{ keySets[current].author }}
        <a v-if="moreInfoUrl" id="more-info" :href="moreInfoUrl"
            :title="keySets[current].moreInfoText">More Info</a>
      </div>
    </fieldset>
  </form>

  <form id="layout-switch" class="button-group">
    <template v-for="(keySet, index) of keySets" :key="keySet.tag">
      <label class="btn small" tabindex="0"
          :set="short_title = shortTitle(keySets, index)"
          :title="keySet.label===short_title? '' : keySet.label">
        <input type="radio" name="layout-switch" :id="keySet.tag" :value="index"
            v-model="current">
        {{ short_title }}
      </label>
    </template>
    <button type="button" class="small" @click="prev" title="Previous layout"
        v-shortkey="['arrowleft']">🡠</button>
    <button type="button" class="small" @click="next" title="Next layout"
        v-shortkey="['arrowright']">🡢</button>
    <button type="button" class="small" @click="current = last"
        title="Toggle recent layouts" v-shortkey="['space']">⭯</button>
  </form>
  <form></form>

  <form>
    <fieldset>
      <label>Load/Save Data</label>
      <div class="controls">
        <DropButton @click="copyJson" value="Copy"
            title="Copy this layout to clipboard" v_shortkey="['ctrl', 'c']">
          <a @click="copyJson($event, fingering=true)"
              title="Copy finger zones and positions">Copy Fingering</a>
          <a @click="copyAllJson" title="Copy the whole set">Copy All Layouts</a>
        </DropButton>
        <button type="button" @click="importDialog.show(clipboardDouble)"
            title="Load some layout/fingering/set here"
            v-shortkey="['ctrl', 'v']">Paste</button>
        <DropButton @click="exportJson" value="Export"
            title="Save this layout to file">
          <a @click="exportJson($event, fingering=true)"
              title="Save finger zones and positions">Export Fingering</a>
          <a @click="exportAllJson"
              title="Save the whole set to single file">Export All Layouts</a>
        </DropButton>
      </div>
    </fieldset>
    <fieldset>
      <div class="controls">
        <Select id="presets" :options="layoutList" v-model="preset"
            :isOptionDisabled="isNotSameTypeOfFingering">
          Select Preset</Select>
        <DropButton @click="loadPreset" value="Load"
            title="Load preset in place of current layout or whole set"
            v_shortkey="['enter']" :disabled="!preset">
          <a @click="isLayoutPreset && loadPreset($event, 'nonLetters')"
              :disabled="isLayoutPreset? null : true">Load Non-Letters</a>
          <a @click="isLayoutPreset && loadPreset($event, 'altGr')"
              :disabled="isLayoutPreset? null : true">Load ‘Alt Gr’ Layer</a>
        </DropButton>
      </div>
    </fieldset>
  </form>

  <ImportDialog ref="importDialog"
      :keyboardType="keySets[current].keyboardType" @import="onPaste" />
</template>

<style scoped>
#editor {
  --keyboard-height: min(var(--content-width) * 252 / 754, 252px);
  position: relative;
}

#keyboard {
  height: var(--keyboard-height);
  margin-left: auto;
  margin-right: auto;
  & > * { z-index: -1; }
  &:hover > * { z-index: 0; }
}
#smog {
  position: absolute;
  top: var(--keyboard-height);
  width: 100%;
  height: 202px;
  background:
    radial-gradient(closest-side, var(--light-gray) 20%, transparent);
  z-index: -1;
}

#name, #presets {
  flex-basis: 6em;
  min-width: 6em;
  flex-grow: 1;
}

#more-info { margin-left: var(--wide-margin); }

#layout-switch {
  flex-wrap: nowrap;
  padding: var(--padding) 0;
  justify-content: center;
  & input { display: none; }
  & > * {
    border: none !important;
    background-color: var(--dark-blue);
    transition: none;
  }
  & > :hover, & > :focus { background-color: var(--bblue); }
  & label {
    flex-basis: max-content;
    min-width: 2.2em;
    white-space: nowrap;
    &:has(:checked) {
      color: var(--black-blue);
      background-color: var(--wwhite-blue);
      cursor: default;
    }
  }
}
</style>
