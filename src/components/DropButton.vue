<script setup>
import { useAttrs } from 'vue'
import DropButtonMenu from './_DropButtonMenu.vue'
import ToggleButton from './_ToggleButton.vue'

const props = defineProps({
  disabled: Boolean,
  disabledSeparate: Boolean,
  title: String,
  value: String,
  v_shortkey: String,
})
const shortkey = props.v_shortkey
    && JSON.parse(props.v_shortkey.replaceAll('\'', '"'))

const attrs = useAttrs()
const selfToggle = !attrs?.onClick
</script>

<template>
  <!--
    Works correctly only with two separated V-IFs inside DIVs
    (no v-else, no <template>). Otherwise, any click event will bubble up.
  -->
  <div v-if="selfToggle" class="button-group">
    <ToggleButton :disabled="disabled" :title="title">{{ value }}
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </div>
  <div v-if="!selfToggle" class="button-group"><!-- separate toggle -->
    <button type="button" :disabled="disabled" :title="title"
        @click="attrs.onClick" v-shortkey="shortkey">{{ value }}</button>
    <ToggleButton :disabled="disabled || disabledSeparate">
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </div>
</template>

<style scoped>
.button-group {
  display: inline-block;
  position: relative;
}
</style>
