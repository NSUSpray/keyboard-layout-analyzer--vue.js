<script setup>
import { onMounted, ref } from 'vue'
import { transitionDurationOf } from '../lib/browser.js'

defineExpose({ focus: () => main.value.focus() })

const props = defineProps({
  disabled: Boolean,
  title: String,
  value: String,
  onClick: Function,
  v_shortkey: String,
})
const shortkey = props.v_shortkey
    && JSON.parse(props.v_shortkey.replaceAll('\'', '"'))

const main = ref(null)
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
  <!--
    Works correctly only with two separated V-IFs inside DIVs
    (no v-else, no <template>). Otherwise, any click event will bubble up.
  -->
  <div v-if="!onClick" class="button-group">
    <button type="button" ref="main" class="toggle" :disabled :title
        @click="e => e.target.focus()">
      {{ value }}
      <div ref="menu" class="menu" :class="{ 'fade-out': isFadeOut }">
        <slot />
      </div>
      <span class="caret" />
    </button>
  </div>
  <!-- separate toggle -->
  <div v-if="onClick" class="button-group">
    <button type="button" ref="main" :disabled :title
        @click="onClick" v-shortkey="shortkey">{{ value }}</button>
    <button type="button" class="toggle" :disabled
        @click="e => e.target.focus()">
      <div ref="menu" class="menu" :class="{ 'fade-out': isFadeOut }">
        <slot />
      </div>
      <span class="caret" />
    </button>
  </div>
</template>

<style scoped>
.button-group { position: relative; }

.toggle { cursor: default; }
.toggle:not(:first-child) {
  padding: calc(var(--narrow-padding) * 0.8);
}

.caret {
  display: inline-block;
  margin: 0;
  border: solid 4px transparent;
  border-top-color: #FFF;
}
.toggle:first-child .caret {
  margin-left: var(--margin);
  margin-right: calc(var(--thin-margin) * -2);
}

.menu {
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

.button-group:last-child .menu {
  left: auto;
  right: 0;
}

:is(:hover, :focus):not([disabled]) > .menu:not(.fade-out),
    .menu:is(:hover, :has(:focus)):not(.fade-out) {
  visibility: initial;
  opacity: 1;
}
</style>
