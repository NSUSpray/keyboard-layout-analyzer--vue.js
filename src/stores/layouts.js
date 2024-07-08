import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import defaultKeyMaps from '../lib/default-key-maps'
import { defaultKeySets } from '../lib/default-key-sets'

const keySetToKeyMap = keySet => defaultKeyMaps[keySet.keyboardType]
const keySetToLayout = keySet => ({ keySet, keyMap: keySetToKeyMap(keySet) })

async function fetchKeySet(presetName) {
  let object = defaultKeySets[presetName]
  if (object)
    object = structuredClone(object)
  else try {
    const response = await fetch('/presets/' + presetName)
    if (!response.ok) throw new Error('Network response was not OK')
    object = await response.json()
  } catch (error) {
    console.error('There has been a problem with preset fetching:', error)
  }
  if (object?.layouts)
    for (const [index, maybeName] of object.layouts.entries())
      if (typeof maybeName === 'string')  // it’s name
        object.layouts[index] = await fetchKeySet(maybeName + '.kla-layout')
  return object
}

const useLayoutsStore = defineStore('layouts', () => {
  const keySets = ref([])
  const keyMaps = computed(() => keySets.value.map(keySetToKeyMap))
  const layouts = computed(() => keySets.value.map(keySetToLayout))
  const setLayouts = async () =>
    keySets.value = (await fetchKeySet('default.kla-set')).layouts
  return { fetchKeySet, keyMaps, keySets, layouts, setLayouts }
})

export default useLayoutsStore
