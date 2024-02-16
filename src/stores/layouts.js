import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { defaultKeySets } from '../lib/keyset'
import defaultKeyMaps from '../lib/new_default_keymaps'

const keySetToLayout = keySet =>
  ({ keySet, keyMap: defaultKeyMaps[keySet.keyboardType] })

export const useLayoutStore = defineStore('layouts', () => {
  const layouts = ref(
    defaultKeySets.map(keySetToLayout)
  )
  const keySets = computed(
    () => layouts.value.map(l => l.keySet)
  )
  /*const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }*/

  return { layouts, keySets/*, doubleCount, increment*/ }
})
