<script setup>
import { onMounted, ref } from 'vue'
import { transitionDurationOf } from '../lib/utilities'

const menu = ref(null)
const isFadeOut = ref(false)

function getFadeOutTime() {
  const fadeOutLag = 35  // hand-picked value
  return transitionDurationOf(menu.value) + fadeOutLag
}

function fadeOut(event, fadeOutTime) {
  isFadeOut.value = true
  setTimeout(() => event.target.blur(), 1)
  setTimeout(() => isFadeOut.value = false, fadeOutTime)
}

function fadeOutOnClick(selector) {
  const items = menu.value.querySelectorAll(selector)
  const fadeOutTime = getFadeOutTime()
  items?.forEach(item =>
    item.addEventListener('click', event => fadeOut(event, fadeOutTime))
  )
}

onMounted(() => fadeOutOnClick('a, button, .btn, input'))
</script>

<template>
  <div ref="menu" class="drop-button-menu" :class="{ 'fade-out': isFadeOut }">
    <slot />
  </div>
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
  transition-duration: var(--transition-duration);
  opacity: 0;
}
.button-group:last-child .drop-button-menu {
  left: auto;
  right: 0;
}
:is(:hover, :focus):not([disabled]) > .drop-button-menu:not(.fade-out),
    .drop-button-menu:is(:hover, :has(:focus)):not(.fade-out) {
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
