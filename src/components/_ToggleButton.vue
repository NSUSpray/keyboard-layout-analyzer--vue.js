<script setup>
defineProps({ title: String })
</script>

<template>
  <button type="button" class="toggle-button" :title="title" @click="e => e.target.focus()">
    <slot /><span class="caret" />
  </button>
</template>

<style scoped>
.toggle-button { cursor: default; }
.toggle-button:not(:first-child) {
  padding: calc(var(--narrow-padding) * 0.8);
}

.caret {
  display: inline-block;
  margin: 0;
  border: solid 4px transparent;
  border-top-color: #FFF;
}
.toggle-button:first-child .caret {
  margin-left: var(--margin);
  margin-right: calc(var(--thin-margin) * -2);
}
</style>
