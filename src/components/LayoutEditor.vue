<script setup>
import { onMounted } from 'vue'

import { fingerClassOf } from '../lib/constants'
import { label } from '../lib/default-key-sets'
import { objectFilter } from '../lib/utilities'
import useLayoutStore from '@/stores/layouts'

const props = defineProps({ name: Number })
const layout = useLayoutStore().layouts[props.name]
const keyMap = layout.keyMap
const setKeys = layout.keySet.keys
const keyMapKeys = objectFilter(([key, _]) => key >= '0' && key <= '99', keyMap)

const editorSize = (() => {
  const width = Math.max(keyMap.width, 754)
  const x = (keyMap.width - width) / 2
  return {
    width: width,
    viewBox: `${ x } 0 ${ width } ${ keyMap.height }`
  }
})()

const transform = key =>
    (key.a? `rotate(${ key.a } ${ key.rx } ${ key.ry }) ` : '')
        + `translate(${ key.x }, ${ key.y })`

function keyData(index) {
  let { primary, shift, altGr, shiftAltGr, finger } = setKeys[index]
  ;[primary, shift, altGr, shiftAltGr] = [primary, shift, altGr, shiftAltGr]
      .map(code => code && label(code))
  return {
    top: shift ?? primary,
    bottom: shift && primary,
    altGr, shiftAltGr,
    fingerClass: fingerClassOf[finger],
  }
}

const points = key => key.coords
    .map(([x, y]) => (x - key.x + 0.5) + ',' + (y - key.y + 0.5))
    .join(' ')

const isFingerStart = index => Object
    .values(layout.keySet.fingerStart)
    .includes(Number(index))

const centersOf = key => Object
    .keys(key)
    .filter(k => /^cx(\d*)?$/.test(k))
    .map(k => ({
      cx: key[k] - key.x,
      cy: key[k.replace('x', 'y')] - key.y
    }))

onMounted(() => {
  for (const keyClass of Object.values(fingerClassOf))
    for (const key of document.getElementsByClassName(keyClass))
      key.style.fill = `var(--${keyClass})`
})
</script>

<template>
  <svg v-bind="editorSize">
    <g v-for="(key, index) of keyMapKeys"
        :transform="transform(key)"
        :set="{ top, bottom, altGr, shiftAltGr, fingerClass } = keyData(index)">
      <polygon v-if="key.coords" :class="fingerClass" :points="points(key)" />
      <rect v-else :class="fingerClass" :width="key.w" :height="key.h" />
      <circle v-if="isFingerStart(index)" v-for="center of centersOf(key)"
          :class="fingerClass" v-bind="center" r="4" />
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
svg { max-width: 100%; }

svg > g { cursor: pointer; }

rect, polygon {
  stroke: var(--black-blue);
  stroke-width: 1.25;
}
:hover > :is(rect, polygon) {
  stroke: var(--dark-gray);
  filter: brightness(93%) saturate(250%);
}

circle {
  stroke: oklch(0% 0% 0 / 0.2);
  stroke-width: 1.5;
  filter: brightness(93%) saturate(250%);
}

text { pointer-events: none; }



@media print {

  rect, polygon { fill: none !important; }

}
</style>
