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

// defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const selfToggle = !attrs?.onClick
const separateToggle = !selfToggle
const shortkey = props.v_shortkey
  && JSON.parse(props.v_shortkey.replaceAll('\'', '"'))
</script>

<template>
  <span v-if="selfToggle" class="button-group">
    <ToggleButton :title="title" :disabled="disabled">{{ value }}
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </span>
  <span v-if="separateToggle" class="button-group">
    <button type="button" @click="attrs.onClick" v-shortkey="shortkey" :title="title" :disabled="disabled">
      {{ value }}
    </button>
    <ToggleButton :disabled="disabled || disabledSeparate">
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </span>
</template>

<style scoped>
.button-group {
  position: relative;
  display: inline-block;
}
</style>
