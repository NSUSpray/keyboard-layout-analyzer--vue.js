import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import defaultKeyMaps from '../lib/default-key-maps'
import { defaultKeySets } from '../lib/default-key-sets'

const keySetToLayout = keySet =>
  ({ keySet, keyMap: defaultKeyMaps[keySet.keyboardType] })

const useLayoutsStore = defineStore('layouts', () => {
  const keySets = ref(defaultKeySets)
  const layouts = computed(() => keySets.value.map(keySetToLayout))
  return { keySets, layouts }
})

export default useLayoutsStore
