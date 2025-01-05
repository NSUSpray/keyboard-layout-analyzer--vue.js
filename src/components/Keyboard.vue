<script setup>
import { computed } from 'vue'
import { addStyle } from '../lib/browser.js'
import { label } from '../lib/default-key-sets'
import Fingers from '../lib/fingers.js'
import { filterByKey, objectKeyByValue } from '../lib/utilities.js'

defineEmits(['click'])
const props = defineProps({ layout: Object })

const keySet = computed(() => props.layout.keySet)

const editorSize = computed(() => {
  const keyMap = props.layout.keyMap
  const width = Math.max(keyMap.width, 754)
  const x = (keyMap.width - width) / 2
  return {
    width: width,
    viewBox: `${x} 0 ${width} ${keyMap.height}`
  }
})

const keyMapKeys = computed(() =>
  filterByKey(props.layout.keyMap, oKey => oKey >= '0' && oKey <= '99')
)

const transform = key =>
    (key.a? `rotate(${key.a} ${key.rx} ${key.ry}) ` : '')
        + `translate(${key.x}, ${key.y})`

const isBothCases = (bottom, top) =>
    typeof top === 'string' && typeof bottom === 'string'
    && (top.toLowerCase() === bottom || bottom.toUpperCase() === top)

function getKeyData(index) {
  let { primary, shift, altGr, shiftAltGr, finger, state } =
      keySet.value.keys[index]
  ;[primary, shift, altGr, shiftAltGr] = [primary, shift, altGr, shiftAltGr]
      .map(code => code && label(code))
  const top = shift ?? primary
  let bottom = shift && primary
  if (isBothCases(bottom, top))
      bottom = undefined
  if (isBothCases(altGr, shiftAltGr))
      altGr = shiftAltGr, shiftAltGr = undefined
  const fingerClass = objectKeyByValue(Fingers, f => f === finger)
  return { top, bottom, altGr, shiftAltGr, fingerClass, state }
}

const points = key => key.coords
    .map(([x, y]) => (x - key.x + 0.5) + ',' + (y - key.y + 0.5))
    .join(' ')

const isFingerStart = index => Object
    .values(keySet.value.fingerStart)
    .includes(Number(index))

const centersOf = key => Object
    .keys(key)
    .filter(k => /^cx(\d*)?$/.test(k))
    .map(k => ({
      cx: key[k] - key.x,
      cy: key[k.replace('x', 'y')] - key.y
    }))

function addKeyFillStyles() {
  const makeRule =
      keyClass => `.${keyClass} > :not(g) { fill: var(--${keyClass}); }`
  const style = Object.keys(Fingers).map(makeRule).join('\n')
  addStyle(style)
}

addKeyFillStyles()
</script>

<template>
  <svg v-bind="editorSize">
    <g v-for="(key, index) of keyMapKeys" :key="index"
        :set="keyData = getKeyData(index)"
        :class="[keyData.fingerClass, keyData.state]"
        :transform="transform(key)"
        @click="$emit('click', index)">
      <filter v-if="keyData.state === 'active'" id="inset-shadow">
        <!-- Shadow blur -->
          <feGaussianBlur stdDeviation='5' result='offset-blur' />
        <!-- Invert drop shadow to make an inset shadow -->
          <feComposite operator='out' in='SourceGraphic' in2='offset-blur'
              result='inverse' />
        <!-- Cut color inside shadow -->
          <feFlood result='color' />
          <feComposite operator='in' in='color' in2='inverse' result='shadow' />
        <!-- Placing shadow over element -->
          <feComposite operator='over' in='shadow' in2='SourceGraphic' />
      </filter>
      <polygon v-if="key.coords" :points="points(key)" />
      <rect v-else :width="key.w" :height="key.h" />
      <template v-if="isFingerStart(index)">
        <circle v-for="center of centersOf(key)" :key="center"
            v-bind="center" r="4" />
      </template>
      <g transform="translate(6, 15)" :set="right =
          { transform: `translate(${key.w - 12})`, 'text-anchor': 'end' }">
        <text>{{ keyData.top }}</text>
        <text v-bind="right">{{ keyData.shiftAltGr }}</text>
        <g :transform="`translate(0, ${key.h - 21})`">
          <text>{{ keyData.bottom }}</text>
          <text v-bind="right">{{ keyData.altGr }}</text>
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
svg { max-width: 100%; }

svg > g { cursor: pointer; }

rect,
polygon {
  stroke: var(--black-blue);
  stroke-width: 1.25;
  :hover > & {
    stroke: var(--dark-gray);
    filter: brightness(93%) saturate(250%);
  }
  .active > & {
    filter: url(#inset-shadow);
    pointer-events: none;
  }
}

circle {
  stroke: oklch(0% 0% 0 / 0.2);
  stroke-width: 1.5;
  filter: brightness(93%) saturate(250%);
}

text { pointer-events: none; }



@media print {

  rect,
  polygon
      { fill: none !important; }

}
</style>
