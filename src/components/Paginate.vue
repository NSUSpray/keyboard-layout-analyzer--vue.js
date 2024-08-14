<script setup>
import { computed, watch } from 'vue'

const choosen = defineModel({ type: Number })

const props = defineProps({
  labels: Array,
  maxWidth: Number,  // visual units approximately equal to dot’s width
})

let previous = 1
watch(choosen, (_, prevVal) => previous = prevVal)

const switchers = '←→⭯'
const maxLabelLength = computed
    (() => (props.maxWidth - 2 * switchers.length) / props.labels.length)

const visualLengthOf = text => text
    .replaceAll(/[WMЩЮЖМШ]/g, '...')
    .replaceAll(/[^ijlI. ᴱˢ]/g, '..')
    .length

const squeezers = [
  // trash
  t => t.replaceAll(/[^\wа-яёˢᴱᴹ -]/gi, '').replaceAll(/-/g, ' '),
  // vowels
  t => t.replaceAll(/(?<=[\wА-ЯЁа-яё])[aeiouyаеёийоуыэюя]/g, ''),
  // abbreviation
  t => t.replaceAll(/([A-Za-zА-ЯЁа-яё][a-zа-яё])[a-zа-яё]+/g, '$1.'),
  // dots
  t => t.replaceAll(/\./g, ''),
  // lower
  t => t.replaceAll(/(?<=[\wА-ЯЁа-яё])[a-zа-яё]/g, '')
      .replaceAll(/(?<=[\wА-ЯЁа-яё])[A-ZА-ЯЁ]/g, a => a.toLowerCase())
      .replaceAll(/ /g, ''),
  // digits
  t => t.replaceAll(/(\d)\d+/g, '$1'),
]

function squeeze(title, maxLen, stage=0) {
  if (visualLengthOf(title) <= maxLen) return title
  const squeezed = squeezers[stage]?.(title)
  return squeezed?
      squeeze(squeezed.trim(), maxLen, stage + 1)
      : squeeze(title, maxLen, 1)
}

function left() {
  const len = props.labels.length
  choosen.value = (choosen.value + len - 1) % len
}

function right() {
  const len = props.labels.length
  choosen.value = (choosen.value + 1) % len
}
</script>

<template>
  <form class="button-group">
    <template v-for="(label, index) of labels" :key="label">
      <label class="btn small" tabindex="0"
          :set="shortLabel = squeeze(label, maxLabelLength)"
          :title="shortLabel===label? undefined : label">
        <input type="radio" v-model="choosen" :value="index">
        {{ shortLabel || label.slice(0, 6) + '…' }}
      </label>
    </template>
    <button type="button" class="small" title="Previous layout"
        @click="left" v-shortkey="['arrowleft']">🡠</button>
    <button type="button" class="small" title="Next layout"
        @click="right" v-shortkey="['arrowright']">🡢</button>
    <button type="button" class="small" title="Toggle recent layouts"
        @click="choosen = previous" v-shortkey="['space']">⭯</button>
  </form>
</template>

<style scoped>
form {
  flex-wrap: nowrap;
  padding: var(--padding) 0;
  justify-content: center;
  & * {
    border: none !important;
    background-color: var(--dark-blue);
    transition: none;
  }
  & :hover,
  & :focus
      { background-color: var(--bblue); }
}

input { display: none; }

label {
  flex-basis: max-content;
  min-width: 2.2em;
  white-space: nowrap;
  &:has(:checked) {
    color: var(--black-blue);
    background-color: var(--wwhite-blue);
    cursor: default;
  }
}
</style>
