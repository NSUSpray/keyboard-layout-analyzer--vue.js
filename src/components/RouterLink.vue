<script setup>
import { RouterLink } from 'vue-router'
import { useSlots } from 'vue'

defineProps({
  to: String,
  title: String,
  icon: String,
})

const iconTitle = useSlots().default?.()[0].children
</script>

<template>
  <RouterLink :to :title>
    <span class="icon" :title="iconTitle">{{ icon }}</span>
    <span class="label"><slot>{{ title }}</slot></span>
  </RouterLink>
</template>

<style scoped>
.label { display: none; }

@media (min-width: 1024px) {
  .icon::after { content: ' '; }
  .label { display: initial; }
}
</style>
