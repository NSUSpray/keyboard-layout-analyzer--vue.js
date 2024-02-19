<script setup>
import { onMounted } from 'vue'

import { useLayoutStore } from '@/stores/layouts'
import { label } from '../lib/keysets'

const props = defineProps({ name: Number })
const layout = useLayoutStore().layouts[props.name]
const keyMap = layout.keyMap
const setKeys = layout.keySet.keys

const mapKeys = Object.keys(keyMap)
    .filter(id => id >= '0' && id <= '99')
    .map(id => keyMap[id])

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

function keyData(id) {
  let { primary, shift, altGr, shiftAltGr, finger } = setKeys[id];
  [primary, shift, altGr, shiftAltGr] = [primary, shift, altGr, shiftAltGr]
      .map(code => code && label(code))
  return {
    top: shift ?? primary,
    bottom: shift && primary,
    altGr, shiftAltGr,
    fingerClass: fingerClass[finger],
  }
}

onMounted(() => {
  for (const keyClass of Object.values(fingerClass))
    for (const key of document.getElementsByClassName(keyClass))
      key.style.fill = `var(--${keyClass})`
})
</script>

<template>
  <svg :viewBox="`0 0 ${keyMap.width} ${keyMap.height}`">
    <g v-for="key, id of mapKeys"
        :transform="`translate(${ key.x }, ${ key.y })`"
        :set="{ top, bottom, altGr, shilftAltGr, fingerClass } = keyData(id)">
      <rect :class="fingerClass" :width="key.w" :height="key.h" />
      <g transform="translate(6, 15)">
        <text>{{ top }}</text>
        <text class="alt-gr">{{ shiftAltGr }}</text>
        <g transform="translate(0, 29)">
          <text>{{ bottom }}</text>
          <text class="alt-gr">{{ altGr }}</text>
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
svg { width: 100%; }

rect {
  stroke: var(--black-blue);
  stroke-width: 1.25;
  cursor: pointer;
}
rect:hover {
  stroke: var(--dark-gray);
  filter: brightness(93%) saturate(250%);
}

text { pointer-events: none }
text.alt-gr {
  text-anchor: end;
  transform: translateX(38px);
}



@media print {

  rect { fill: none !important; }

}
</style>
