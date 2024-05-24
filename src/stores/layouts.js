import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import defaultKeyMaps from '../lib/default-key-maps'
import { defaultKeySets } from '../lib/default-key-sets'

const keySetToLayout = keySet =>
  ({ keySet, keyMap: defaultKeyMaps[keySet.keyboardType] })

async function fetchKeySet(presetName) {
  let object = defaultKeySets[presetName]
  if (object)
    object = structuredClone(object)
  else {
    const response = await fetch('/layouts/' + presetName)
    object = await response.json()
  }
  if (object.layouts)
    for (const [index, maybeName] of object.layouts.entries())
      if (typeof maybeName === 'string')  // it’s name
        object.layouts[index] = await fetchKeySet(maybeName + '.kla-layout')
  return object
}

const useLayoutsStore = defineStore('layouts', () => {
  const keySets = ref([])
  const layouts = computed(() => keySets.value.map(keySetToLayout))
  const setLayouts = async () =>
    keySets.value = (await fetchKeySet('default.kla-set')).layouts
  return { fetchKeySet, keySets, layouts, setLayouts }
})

export default useLayoutsStore
