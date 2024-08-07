<script setup>
import { ref } from 'vue'
import DropButtonMenu from './_DropButtonMenu.vue'
import ToggleButton from './_ToggleButton.vue'

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
</script>

<template>
  <!--
    Works correctly only with two separated V-IFs inside DIVs
    (no v-else, no <template>). Otherwise, any click event will bubble up.
  -->
  <div v-if="!onClick" class="button-group">
    <ToggleButton ref="main" :disabled="disabled" :title="title">{{ value }}
      <DropButtonMenu><slot /></DropButtonMenu>
    </ToggleButton>
  </div>
  <div v-if="onClick" class="button-group"><!-- separate toggle -->
    <button type="button" ref="main" :disabled="disabled" :title="title"
        @click="onClick" v-shortkey="shortkey">{{ value }}</button>
    <ToggleButton :disabled="disabled">
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
