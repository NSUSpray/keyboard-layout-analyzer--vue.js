<script setup>
import { computed, ref, toRaw, watch } from 'vue'

import DropButton from '../components/DropButton.vue'
import ImportDialog from '../components/ImportDialog.vue'
import Jumbotron from '../components/Jumbotron.vue'
import Keyboard from '../components/Keyboard.vue'
import KeyDialog from '../components/KeyDialog.vue'
import Paginate from '../components/Paginate.vue'
import Select from '../components/Select.vue'

import useLayoutsStore from '@/stores/layouts.js'

import { downloadJson, withMarkedTarget } from '../lib/browser.js'
import defaultKeyMaps from '../lib/default-key-maps.js'
import * as Kb from '../lib/keyboard.js'
import presetOptions from '../lib/preset-options.js'
import { objectKeyByValue } from '../lib/utilities.js'


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

const keyDialog = ref(null)
const importDialog = ref(null)
const clipboardDouble = ref('')

watch(vIndex, () => {
  keyDialog.value.close()
  if (isNotSameTypeOfFingering(preset.value)) preset.value = ''
})


function showKeyDialog(index) {
  const isLeftSideKey = vMap.value[index].cx < vMap.value.width / 2
  const position = isLeftSideKey? 'right' : 'left'
  keyDialog.value.show(index, position)
}

async function onChangeType(event) {
  const targetType = event.target.value
  const defaultPreset = targetType + '.classical.kla-fingering'
  const defaultSet = await layoutsStore.fetchKeySet(defaultPreset)
  keySets[vIndex.value] = Kb.convertType
      (toRaw(vSet.value), vMap.value, targetType, defaultSet)
}

function paginateLabel(keySet, index) {
  const label = Kb.forceLabel(keySet, index)
  const suffix = Kb.typeSuffixes[keySet.keyboardType] ?? ''
  return label + suffix
}

const copyJson = withMarkedTarget(async (_, fingering=false) => {
  keyDialog.value.close()
  let keySet = vSet.value
  if (fingering) keySet = Kb.keepOnlyFingering(toRaw(keySet))
  const keySetJson = JSON.stringify(keySet, null, 4)
  navigator.clipboard.writeText(keySetJson)
  clipboardDouble.value = keySetJson
})

const copyAllJson = withMarkedTarget(async () => {
  keyDialog.value.close()
  const keySetsJson = JSON.stringify
      ({ name: '' /* TODO */, layouts: keySets }, null, 4)
  navigator.clipboard.writeText(keySetsJson)
  clipboardDouble.value = keySetsJson
})

const assignByScanCode = (srcKeyMap, filterValue) => (srcKey, index) => {
  const scan = srcKeyMap[index].scan
  const targetIndex = objectKeyByValue(vMap.value, k => k.scan === scan)
  if (targetIndex >= 0)
      Kb.filteredAssign(filterValue, vSet.value.keys[targetIndex], srcKey)
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
    default:
      throw new Error('Unknown object type')
  }
}

function onPaste(type, object, json, filterValue='all') {
  clipboardDouble.value = json
  updateKeySet(type, object, filterValue)
  importDialog.value.close()
}

function exportJson(_, fingering=false) {
  keyDialog.value.close()
  let keySet = vSet.value
  const filename = `${vType.value}.${keySet.label}`
      .toLowerCase().replace(/\s/g, '-')
      + '.kla-' + (fingering? 'fingering' : 'layout')
  if (fingering) keySet = Kb.keepOnlyFingering(toRaw(keySet))
  downloadJson(keySet, filename)
}

function exportAllJson() {
  keyDialog.value.close()
  downloadJson({ name: '' /* TODO */, layouts: keySets }, 'layouts.kla-set')
}

function isNotSameTypeOfFingering(value) {
  const [presetKeyboardType, ...rest] = value.split('.')
  const presetType = rest.pop()
  if (presetType !== 'kla-fingering') return false
  return presetKeyboardType !== vType.value
}

const loadPreset = withMarkedTarget(async (_, filterValue='all') => {
  const type = preset.value.split('.').pop()
  const object = await layoutsStore.fetchKeySet(preset.value)
  updateKeySet(type, object, filterValue)
})
</script>

<template>
  <Jumbotron header="Layouts" run-button>
    <strong>Click</strong> or <strong>Drag</strong> the keys on the keyboard below
  </Jumbotron>

  <form id="editor">
    <fieldset id="keyboard">
      <template v-for="(layout, index) of layoutsStore.layouts" :key="index">
        <Keyboard v-show="index === vIndex" :layout @click="showKeyDialog" />
      </template>
      <div id="smog" />
      <KeyDialog ref="keyDialog" v-model="vSet" />
    </fieldset>
    <fieldset>
      <label>Name</label>
      <div class="controls">
        <input type="text" id="name" v-model.trim="vSet.label" />
        <Select v-model="vType" :options="Kb.keyMapTypes"
            title="Change to convert keyboard type" @change="onChangeType" />
      </div>
    </fieldset>
    <fieldset>
      <label>Author</label>
      <div class="controls" :set="moreInfoUrl = vSet.moreInfoUrl">
        {{ vSet.author }}
        <a v-if="moreInfoUrl" id="more-info" :href="moreInfoUrl"
            :title="vSet.moreInfoText">More Info</a>
      </div>
    </fieldset>
  </form>

  <Paginate :labels="keySets.map(paginateLabel)" v-model="vIndex"
      :max-width="118" />
  <form />

  <form>
    <fieldset>
      <label>Load/Save Data</label>
      <div class="controls">
        <DropButton value="Copy" title="Copy this layout to clipboard"
            @click="copyJson" v_shortkey="['ctrl', 'c']">
          <a title="Copy finger zones and positions"
              @click="copyJson($event, fingering=true)">Copy Fingering</a>
          <a title="Copy the whole set" @click="copyAllJson">Copy All Layouts</a>
        </DropButton>
        <button type="button" title="Load some layout/fingering/set here"
            @click="importDialog.show(vType, clipboardDouble)"
            v-shortkey="['ctrl', 'v']">Paste</button>
        <DropButton value="Export" title="Save this layout to file"
            @click="exportJson">
          <a title="Save finger zones and positions"
              @click="exportJson($event, fingering=true)">Export Fingering</a>
          <a title="Save the whole set to single file"
              @click="exportAllJson">Export All Layouts</a>
        </DropButton>
      </div>
    </fieldset>
    <fieldset>
      <div class="controls">
        <Select id="presets" :options="presetOptions" v-model="preset"
            :is-option-disabled="opt => isNotSameTypeOfFingering(opt.value)">
          Select Preset</Select>
        <DropButton :disabled="!preset" value="Load"
            title="Load preset in place of current layout or whole set"
            @click="loadPreset" v_shortkey="['enter']">
          <a :disabled="isLayoutPreset? null : true"
              @click="isLayoutPreset && loadPreset($event, 'nonLetters')">
            Load Non-Letters</a>
          <a :disabled="isLayoutPreset? null : true"
              @click="isLayoutPreset && loadPreset($event, 'altGr')">
            Load “Alt Gr” Layer</a>
        </DropButton>
      </div>
    </fieldset>
  </form>

  <ImportDialog ref="importDialog" @import="onPaste" />
</template>

<style scoped>
#editor {
  --keyboard-height: min(var(--content-width) * 252 / 754, 252px);
  position: relative;
}

#keyboard {
  position: relative;
  height: var(--keyboard-height);
  flex-grow: 0;
  margin-inline: auto;
  & > * { z-index: -1; }
  &:hover > * { z-index: 0; }
}
#smog {
  position: absolute;
  top: 100%;
  width: 100%;
  height: 202px;
  background:
      radial-gradient(closest-side, var(--light-gray) 20%, transparent);
  z-index: -1 !important;
}

#name,
#presets {
  flex-basis: 6em;
  min-width: 6em;
  flex-grow: 1;
}

#more-info { margin-left: var(--wide-margin); }
</style>
