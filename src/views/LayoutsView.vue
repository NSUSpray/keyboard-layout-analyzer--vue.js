<script setup>
import { computed, ref, toRaw, watch } from 'vue'

import DropButton from '../components/DropButton.vue'
import ImportDialog from '../components/ImportDialog.vue'
import Jumbotron from '../components/Jumbotron.vue'
import LayoutEditor from '../components/LayoutEditor.vue'
import Select from '../components/Select.vue'

import useLayoutsStore from '@/stores/layouts'

import { downloadJson, processEventHandler } from '../lib/browser'
import defaultKeyMaps from '../lib/default-key-maps'
import { filteredAssign, kbtype, keepOnlyFingering } from '../lib/keyboard'
import layoutList from '../lib/layout-list'
import { shortTitle } from '../lib/title'
import { objectKeyByValue } from '../lib/utilities'


const layoutsStore = useLayoutsStore()
const keySets = layoutsStore.keySets

// visible layout
const vIndex = ref(0)
const vSet = computed(() => keySets[vIndex.value])
const vMap = computed(() => layoutsStore.keyMaps[vIndex.value])
const vType = computed(() => vSet.value.keyboardType)

const preset = ref('')
const isLayoutPreset = computed
  (() => preset.value.split('.').pop() === 'kla-layout')

const importDialog = ref(null)
const clipboardDouble = ref('')


function prev() {
  const len = keySets.length
  vIndex.value = (vIndex.value + len - 1) % len
}

function next() {
  const len = keySets.length
  vIndex.value = (vIndex.value + 1) % len
}

const copyJson = processEventHandler(async (_, fingering=false) => {
  let keySet = vSet.value
  if (fingering) keySet = keepOnlyFingering(toRaw(keySet))
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

const assignByScanCode = (srcKeyMap, filterValue) => (srcKey, index) => {
  const scan = srcKeyMap[index].scan
  const targetIndex = objectKeyByValue(vMap.value, k => k.scan === scan)
  if (targetIndex >= 0)
    filteredAssign(filterValue, vSet.value.keys[targetIndex], srcKey)
}

function updateKeySet(type, src, filterValue='all') {
  const i = vIndex.value
  switch (type) {
    case 'keySet': case 'kla-layout':
      if (filterValue === 'all') return keySets[i] = src
      const srcKeyMap = defaultKeyMaps[src.keyboardType]
      const assigner = assignByScanCode(srcKeyMap, filterValue)
      return src.keys.forEach(assigner)
    case 'fingering': case 'kla-fingering':
      keySets[i].fingerStart = src.fingerStart
      keySets[i].keys.forEach
        ((key, index) => Object.assign(key, src.keys[index]))
      break
    case 'keySets': case 'kla-set':
      Object.assign(keySets, src.layouts); break
  }
}

function onPaste(type, object, json, filterValue='all') {
  clipboardDouble.value = json
  updateKeySet(type, object, filterValue)
  importDialog.value.close()
}

function exportJson(_, fingering=false) {
  let keySet = vSet.value
  const filename = `${vType.value.trim()}.${keySet.label.trim()}`
      .toLowerCase().replace(/\s/g, '-')
      + '.kla-' + (fingering? 'fingering' : 'layout')
  if (fingering) keySet = keepOnlyFingering(toRaw(keySet))
  downloadJson(keySet, filename)
}

const exportAllJson = () => downloadJson
  ({ name: '' /* TODO */, layouts: keySets }, 'layouts.kla-set')

function isNotSameTypeOfFingering(value) {
  const [presetKeyboardType, ...rest] = value.split('.')
  const presetType = rest.pop()
  if (presetType !== 'kla-fingering') return false
  return presetKeyboardType !== vType.value
}

const loadPreset = processEventHandler(async (_, filterValue='all') => {
  const type = preset.value.split('.').pop()
  const object = await layoutsStore.fetchKeySet(preset.value)
  updateKeySet(type, object, filterValue)
})


let lastIndex = 1
watch(vIndex, (_, prevVal) => {
  lastIndex = prevVal
  if (isNotSameTypeOfFingering(preset.value)) preset.value = ''
})
</script>

<template>
  <Jumbotron header="Layouts" run-button>
    <strong>Click</strong> or <strong>Drag</strong> the keys on the keyboard below
  </Jumbotron>

  <form id="editor">
    <fieldset id="keyboard">
      <template v-for="(layout, index) of layoutsStore.layouts" :key="index">
        <LayoutEditor v-show="index === vIndex" :layout="layout" />
      </template>
    </fieldset>
    <fieldset>
      <label>Name</label>
      <div class="controls">
        <input type="text" id="name" v-model="vSet.label" />
        <Select :options="kbtype" v-model="vType"
            title="Change to convert keyboard type" />
      </div>
    </fieldset>
    <fieldset id="smog"></fieldset>
    <fieldset>
      <label>Author</label>
      <div class="controls" :set="moreInfoUrl = vSet.moreInfoUrl">
        {{ vSet.author }}
        <a v-if="moreInfoUrl" id="more-info" :href="moreInfoUrl"
            :title="vSet.moreInfoText">More Info</a>
      </div>
    </fieldset>
  </form>

  <form id="layout-switch" class="button-group">
    <template v-for="(keySet, index) of keySets" :key="keySet.tag">
      <label class="btn small" tabindex="0"
          :set="short_title = shortTitle(keySets, index)"
          :title="keySet.label===short_title? '' : keySet.label">
        <input type="radio" name="layout-switch" :id="keySet.tag" :value="index"
            v-model="vIndex">
        {{ short_title }}
      </label>
    </template>
    <button type="button" class="small" @click="prev" title="Previous layout"
        v-shortkey="['arrowleft']">🡠</button>
    <button type="button" class="small" @click="next" title="Next layout"
        v-shortkey="['arrowright']">🡢</button>
    <button type="button" class="small" @click="vIndex = lastIndex"
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
            :isOptionDisabled="opt => isNotSameTypeOfFingering(opt.value)">
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

  <ImportDialog ref="importDialog" :keyboardType="vType" @import="onPaste" />
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
