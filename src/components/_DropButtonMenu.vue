<script setup>
import { useSlots } from 'vue'

const items = useSlots().default?.()[0].children

items?.forEach(item => {
  item.props ??= {}
  item.props.tabindex = 0
})
</script>

<template>
  <div class="drop-button-menu"><slot /></div>
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
:is(:hover, :focus):not([disabled]) > .drop-button-menu,
    .drop-button-menu:hover,
    .drop-button-menu:has(:focus) {
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
