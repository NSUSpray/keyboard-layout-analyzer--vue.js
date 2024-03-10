<script setup>
import { onMounted, ref } from 'vue'

const menu = ref(null)

function getFadeOutTime() {
  const menuStyle = getComputedStyle(menu.value)
  const transitionDuration =
    parseFloat(menuStyle.getPropertyValue('transition-duration')) * 1000
  const fadeOutLag = 35  // hand-picked value
  return transitionDuration + fadeOutLag
}

function fadeOut(event, fadeOutTime, fadeOutClass='fade-out') {
  menu.value.classList.add(fadeOutClass)
  setTimeout(() => event.target.blur(), 1)
  setTimeout(() => menu.value.classList.remove(fadeOutClass), fadeOutTime)
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
