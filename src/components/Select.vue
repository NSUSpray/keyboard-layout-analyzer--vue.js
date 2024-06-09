<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: Object, 
  isOptionDisabled: { type: Function, default: () => false },
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
      <option v-if="typeof value === 'string'" :value="key"
          :disabled="isOptionDisabled({ value: key, label: value })">
        {{ value }}
      </option>
      <optgroup v-else :label="key" :set="groupLabel = key">
        <option v-for="(value, key) in value" :key="key" :value="key"
            :disabled="isOptionDisabled({ groupLabel, value: key, label: value })">
          {{ value }}
        </option>
      </optgroup>
    </template>
  </select>
</template>
