<script setup>
import { onMounted, ref } from 'vue'
import { transitionDurationOf } from '../lib/browser.js'

const menu = ref(null)
const isFadeOut = ref(false)

onMounted(() => fadeOutOnClick('a, button, .btn, input'))

function fadeOut(event, fadeOutTime) {
  isFadeOut.value = true
  setTimeout(() => event.target.blur(), 1)
  setTimeout(() => isFadeOut.value = false, fadeOutTime)
}

function fadeOutOnClick(selector) {
  const items = menu.value.querySelectorAll(selector)
  const fadeOutLag = 35  // hand-picked value
  const fadeOutTime = transitionDurationOf(menu.value) + fadeOutLag
  items?.forEach(item =>
      item.addEventListener('click', event => fadeOut(event, fadeOutTime))
  )
}
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
  padding: var(--thin-padding) 0;
  text-align: left;
  background-color: var(--black-blue);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: 2;
  transition-duration: var(--transition-duration);
  visibility: hidden;
  opacity: 0;
  & > * {
    display: block;
    padding:
        calc(var(--thin-padding) * 0.6)
        var(--wide-padding);
    color: white;
  }
  & > :hover,
  & > :focus {
    text-decoration: none;
    color: white;
    background-color: var(--dark-blue);
  }
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
</style>
