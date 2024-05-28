<script setup>
import { useAttrs } from 'vue'
import ToggleButton from './_ToggleButton.vue'
import DropButtonMenu from './_DropButtonMenu.vue'

const props = defineProps({
  value: String,
  title: String,
  v_shortkey: String,
  disabled: Boolean,
  disabledSeparate: Boolean,
})

const attrs = useAttrs()
const selfToggle = !attrs?.onClick
const shortkey = props.v_shortkey
  && JSON.parse(props.v_shortkey.replaceAll('\'', '"'))
</script>

<template>
  <!--
    Works correctly only with two separated V-IFs inside DIVs
    (no v-else, no <template>). Otherwise, any click event will bubble up.
  -->
  <div v-if="selfToggle" class="button-group">
    <ToggleButton :title="title" :disabled="disabled">{{ value }}
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </div>
  <div v-if="!selfToggle" class="button-group"><!-- separate toggle -->
    <button type="button" @click="attrs.onClick" v-shortkey="shortkey"
        :title="title" :disabled="disabled">{{ value }}</button>
    <ToggleButton :disabled="disabled || disabledSeparate">
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </div>
</template>

<style scoped>
.button-group {
  position: relative;
  display: inline-block;
}
</style>
