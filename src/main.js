import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import shortkey from 'vue-three-shortkey'

import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)

{
  app.use(shortkey, { prevent: ['input[type="text"]', 'textarea'] })
  const skdir = app.directive('shortkey')
  const beforeMount = skdir.beforeMount
  const updated = skdir.updated
  const unmounted = skdir.unmounted

  function toShortkey(el, binding) {
    if (!binding.value) return
    el.addEventListener('shortkey', el.click)
    el._title = el.title
    if (!el.title) el.title += el.innerText
    const keys = binding.value
        .map(k => k.replace('arrowleft', '🡠').replace('arrowright', '🡢'))
        .map(k => k[0].toUpperCase() + k.substr(1))
        .join('+')
    el.title += ` (${keys})`
  }

  function unShortkey(el, binding) {
    if (!binding.value) return
    el.title = el._title
    el.removeEventListener('shortkey', el.click)
  }

  app.directive('shortkey', {
    beforeMount: (el, binding, vnode) => {
      beforeMount(el, binding, vnode)
      toShortkey(el, binding)
    },
    updated: (el, binding, vnode) => {
      unShortkey(el, binding)
      updated(el, binding, vnode)
      toShortkey(el, binding)
    },
    unmounted: (el, binding) => {
      unmounted(el, binding)
      unShortkey(el, binding)
    }
  })
}

app.mount('#app')
