<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: Object, 
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get() { return props.modelValue },
  set(selected) { emit('update:modelValue', selected) }
})
</script>

<template>
  <select required v-model="selected">
    <option value="" disabled selected hidden><slot /></option>
    <template v-for="(value, key) in options" :key="key">
      <option v-if="typeof value === 'string'" :value="key">
        {{ value }}
      </option>
      <optgroup v-else :label="key">
        <option v-for="(value, key) in value" :key="key" :value="key">
          {{ value }}
        </option>
      </optgroup>
    </template>
  </select>
</template>
