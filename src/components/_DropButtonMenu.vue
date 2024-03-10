<script setup>
import { onMounted, ref } from 'vue'

const menu = ref(null)

</script>

<template>
  <div ref="menu" class="drop-button-menu"><slot /></div>
</template>

<style>
.drop-button-menu {
  position: absolute;
  left: 0;
  top: calc(100% + var(--thin-padding) * 0.6);
  width: max-content;
  z-index: 1;
  padding: var(--thin-padding) 0;
  border-radius: var(--radius);
  text-align: left;
  background-color: var(--black-blue);
  box-shadow: var(--shadow);
  visibility: hidden;
  transition: 0.25s;
  opacity: 0;
}
.button-group:last-child .drop-button-menu {
  left: auto;
  right: 0;
}
:is(:hover, :focus):not([disabled]) > .drop-button-menu:not(:has(.in-process)),
    .drop-button-menu:is(:hover, :has(:focus)):not(:has(.in-process)) {
  visibility: initial;
  opacity: 1;
}

.drop-button-menu > * {
  display: block;
  padding:
    calc(var(--thin-padding) * 0.6)
    var(--wide-padding);
  color: white;
}
.drop-button-menu > :is(:hover, :focus) {
  text-decoration: none;
  color: white;
  background-color: var(--dark-blue);
}
</style>
