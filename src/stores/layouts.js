import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import defaultKeyMaps from '../lib/default-key-maps'
import { defaultKeySets } from '../lib/default-key-sets'

const keySetToLayout = keySet =>
  ({ keySet, keyMap: defaultKeyMaps[keySet.keyboardType] })

const useLayoutStore = defineStore('layouts', () => {
  const layouts = ref(defaultKeySets.map(keySetToLayout))
  const keySets = computed(() => layouts.value.map(layout => layout.keySet))
  return { layouts, keySets }
})

export default useLayoutStore
