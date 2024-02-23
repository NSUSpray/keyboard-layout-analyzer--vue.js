<script setup>
import { onMounted } from 'vue'

import { label } from '../lib/default-key-sets'
import { objectFilter } from '../lib/utilities'
import useLayoutStore from '@/stores/layouts'

const props = defineProps({ name: Number })
const layout = useLayoutStore().layouts[props.name]
const keyMap = layout.keyMap
const setKeys = layout.keySet.keys

const keyMapKeys = objectFilter(([key, _]) => key >= '0' && key <= '99', keyMap)

const fingerClass = {
  1: 'left-pinky',
  2: 'left-ring',
  3: 'left-middle',
  4: 'left-index',
  5: 'left-thumb',
  6: 'right-thumb',
  7: 'right-index',
  8: 'right-middle',
  9: 'right-ring',
  10: 'right-pinky',
}

function keyData(index) {
  let { primary, shift, altGr, shiftAltGr, finger } = setKeys[index];
  [primary, shift, altGr, shiftAltGr] = [primary, shift, altGr, shiftAltGr]
      .map(code => code && label(code))
  return {
    top: shift ?? primary,
    bottom: shift && primary,
    altGr, shiftAltGr,
    fingerClass: fingerClass[finger],
  }
}

function path(key) {
  const coords = key.coords.map(([x, y]) => [x - key.x + 0.5, y - key.y + 0.5])
  let result = 'M ' + coords[0].join(' ')
  result += coords.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')
  return result + ' Z'
}

onMounted(() => {
  for (const keyClass of Object.values(fingerClass))
    for (const key of document.getElementsByClassName(keyClass))
      key.style.fill = `var(--${keyClass})`
})
</script>

<template>
  <svg :viewBox="`0 0 ${ keyMap.width } ${ keyMap.height }`">
    <g v-for="(key, index) of keyMapKeys"
        :transform="`translate(${ key.x }, ${ key.y })`"
        :set="{ top, bottom, altGr, shiftAltGr, fingerClass } = keyData(index)">
      <path v-if="key.coords" :class="fingerClass" :d="path(key)" />
      <rect v-else :class="fingerClass" :width="key.w" :height="key.h" />
      <g transform="translate(6, 15)" :set="right =
          { transform: `translate(${ key.w - 12 })`, 'text-anchor': 'end' }">
        <text>{{ top }}</text>
        <text v-bind="right">{{ shiftAltGr }}</text>
        <g :transform="`translate(0, ${ key.h - 21 })`">
          <text>{{ bottom }}</text>
          <text v-bind="right">{{ altGr }}</text>
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
svg { width: 100%; }

rect, path {
  stroke: var(--black-blue);
  stroke-width: 1.25;
  cursor: pointer;
}
:is(rect, path):hover {
  stroke: var(--dark-gray);
  filter: brightness(93%) saturate(250%);
}

text { pointer-events: none }



@media print {

  rect, path { fill: none !important; }

}
</style>
