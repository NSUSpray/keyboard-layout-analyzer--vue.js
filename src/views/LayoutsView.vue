<script setup>
import { ref, watch } from 'vue'

import DropButton from '../components/DropButton.vue'
import Jumbotron from '../components/Jumbotron.vue'
import LayoutEditor from '../components/LayoutEditor.vue'
import Select from '../components/Select.vue'

import useLayoutStore from '@/stores/layouts'

import { kbtype } from '../lib/constants'
import layoutList from '../lib/layout-list'
import { shortTitle } from '../lib/utilities'


const keySets = useLayoutStore().keySets
const current = ref(0)
const preset = ref('')

function prev() {
  const len = keySets.length
  current.value = (current.value + len - 1) % len
}
function next() {
  const len = keySets.length
  current.value = (current.value + 1) % len
}


let last = 1
watch(current, (_, prevVal) => last = prevVal)
</script>

<template>
  <Jumbotron header="Layouts" run-button>
    <strong>Click</strong> or <strong>Drag</strong> the keys on the keyboard below
  </Jumbotron>

  <form id="editor">
    <fieldset id="keyboard">
      <template v-for="(keySet, index) of keySets" :key="keySet.tag">
        <LayoutEditor v-show="index === current" :name="index" />
      </template>
    </fieldset>
    <fieldset>
      <label>Name</label>
      <div class="controls">
        <input id="name" v-model="keySets[current].label" />
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
        <DropButton @click="" value="Copy" title="Copy this layout to clipboard"
            v_shortkey="['ctrl', 'c']">
          <a title="Copy finger zones and positions">Copy Fingering</a>
          <a title="Copy the whole set">Copy All Layouts</a>
        </DropButton>
        <button type="button" @click="" title="Load some layout/fingering/set here"
            v-shortkey="['ctrl', 'v']">Paste</button>
        <DropButton @click="" value="Export" title="Save this layout to file">
          <a title="Save finger zones and positions">Export Fingering</a>
          <a title="Save the whole set to single file">Export All Layouts</a>
        </DropButton>
      </div>
    </fieldset>
    <fieldset>
      <div class="controls">
        <Select id="presets" :options="layoutList" v-model="preset">Select Preset</Select>
        <DropButton @click="" value="Load"
            title="Load preset in place of current layout or whole set"
            v_shortkey="['enter']" :disabled="!preset">
          <a>Load Non-Letters</a>
          <a>Load ‘Alt Gr’ Layer</a>
        </DropButton>
      </div>
    </fieldset>
  </form>
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
}
#keyboard > * { z-index: -1; }
#keyboard:hover > * { z-index: 0; }
#smog {
  position: absolute;
  top: var(--keyboard-height);
  width: 100%;
  height: 202px;
  background: radial-gradient(closest-side, var(--light-gray) 20%, transparent);
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
}
#layout-switch input { display: none; }
#layout-switch > * {
  border: none !important;
  background-color: var(--dark-blue);
  transition: none;
}
#layout-switch > :is(:hover, :focus) {
  background-color: var(--bblue);
}
#layout-switch label:has(:checked) {
  color: var(--black-blue);
  background-color: var(--wwhite-blue);
  cursor: default;
}

#layout-switch label {
  flex-basis: max-content;
  min-width: 2.2em;
  white-space: nowrap;
}
</style>
