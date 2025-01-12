<script setup>
import Fingers, { colorizeByFinger } from '../lib/fingers.js'

const selected = defineModel({ type: Number })
defineProps({ disabled: Boolean })

const capsToTitle = caps =>
    caps.replace('_', ' ').replace(/(?<=\w)./g, c => c.toLowerCase())

const fingerLetter = fingerString => fingerString.match(/(?<=_)./)[0]

colorizeByFinger('option.{finger}', 'background-color')
</script>

<template>
  <select size="2" v-model="selected" :disabled>
    <option v-for="[finger, index] of Object.entries(Fingers)" :key="finger"
        :title="capsToTitle(finger)" :value="index" :class="finger">
      {{ fingerLetter(finger) }}
    </option>
  </select>
</template>

<style scoped>
select {
  --option-size: calc(1em + 2 * var(--thin-padding));
  --group-gap: var(--thin-margin);
  overflow: auto;
  width: calc(10 * var(--option-size) + var(--group-gap));
  height: calc(var(--option-size) + 0.53ex);
  padding: 0;
  border: none;
  cursor: default;
  &[disabled] { pointer-events: none; }
}

option {
  display: inline-flex;
  width: var(--option-size);
  height: var(--option-size);
  justify-content: center;
  align-items: center;
  color: var(--black-blue);
  border: solid 2px transparent;
  border-radius: var(--radius);
  cursor: pointer;
  :not(.LEFT_THUMB) + & {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &:has(+ :not(.RIGHT_THUMB)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.LEFT_THUMB,
  &.RIGHT_THUMB
      { vertical-align: sub; }
  &.LEFT_THUMB { border-color: var(--white-blue); }
  &.RIGHT_THUMB { margin-left: var(--group-gap); }
  &:hover { filter: brightness(93%) saturate(250%); }
  &:checked {
    font-weight: 900;
    border-color: var(--dark-blue) !important;
  }
}
</style>
