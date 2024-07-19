<script setup>
import { useSlots } from 'vue'

defineProps({
  header: String,
  runButton: Boolean,
})

const lead = useSlots().default?.()[0].children
</script>

<template>
  <div class="jumbotron">
    <h1 v-if="header">{{ header }}</h1>
    <button type="button" v-if="runButton" class="large"
        title="See which layout is best"
        v-shortkey="['ctrl', 'enter']">Run</button>
    <h3 v-if="lead"><slot /></h3>
  </div>
</template>

<style scoped>
.jumbotron {
  display: grid;
  grid-template: auto auto / auto max-content;
  align-items: start;
  gap: var(--margin);
  margin: var(--wide-margin) 0;
  & > * { margin: 0; }
}

h3 {
  grid-row-start: 2;
  font-weight: normal;
}

button {
  grid-row-end: span 2;
  box-shadow: var(--shallow-shadow);
  &:hover,
  &:focus
      { box-shadow: none; }
}

@media (min-width: 1024px) {
  h3 {
    line-height: 2.1rem;
    font-size: 1.5rem;
  }
}
</style>
