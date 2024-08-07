<script setup>
const props = defineProps({
  options: Object, 
  isOptionDisabled: { type: Function, default: () => false },
})

const selected = defineModel({ type: String })
</script>

<template>
  <select v-model="selected" required>
    <option value="" disabled hidden selected><slot /></option>
    <template v-for="(value, key) in options" :key>
      <option v-if="typeof value === 'string'" :value="key"
          :disabled="isOptionDisabled({ value: key, label: value })">
        {{ value }}
      </option>
      <optgroup v-else :label="key" :set="groupLabel = key">
        <option v-for="(value, key) in value" :key :value="key"
            :disabled="isOptionDisabled({ groupLabel, value: key, label: value })">
          {{ value }}
        </option>
      </optgroup>
    </template>
  </select>
</template>
