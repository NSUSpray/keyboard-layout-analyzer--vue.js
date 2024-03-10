<script setup>
import { onBeforeMount, onMounted, onUpdated, onUnmounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import RouterLink from './components/RouterLink.vue'

import { rowFirstLast, setDummyHrefAttribute } from './lib/utilities.js'


const rowFirstLastUpdate = rowFirstLast('form, fieldset, footer')

onBeforeMount(() => {
  window.addEventListener('resize', rowFirstLastUpdate)
  document.addEventListener('DOMContentLoaded', setDummyHrefAttribute)
})

onMounted(() => setInterval(rowFirstLastUpdate, 3000))
onUpdated(rowFirstLastUpdate)

onUnmounted(() => {
  window.removeEventListener('resize', rowFirstLastUpdate)
  document.removeEventListener('DOMContentLoaded', setDummyHrefAttribute)
})

watch(useRoute(), rowFirstLastUpdate)
</script>

<template>
  <header>
    <h1>
      <img alt="KLA logo" src="@/assets/kb-q-10.png" width="32" height="32" />
      Keyboard Layout Analyzer
    </h1>
    <nav>
      <RouterLink to="/" title="Open layout editor" v-shortkey="['alt', '1']" icon="⌨">
        Layouts
      </RouterLink>
      <RouterLink to="/analyzer"
          title="Open analyzer preferences" v-shortkey="['alt', '2']" icon="🛠">
        Analyzer
      </RouterLink>
      <RouterLink to="/results"
          title="Open analysis results" v-shortkey="['alt', '3']" icon="🏆">
        Results
      </RouterLink>
    </nav>
    <nav>
      <RouterLink to="/about" icon="🛈">About</RouterLink>
    </nav>  
  </header>

  <main><RouterView /></main>
  
  <footer>
    <section>
      <h4>Original application and other forks</h4>
      <ul>
        <li><a href='http://patorjk.com/keyboard-layout-analyzer/'>Original KLA</a>
            by PAT or JK</li>
        <li><a href='https://stevep99.github.io/keyboard-layout-analyzer/'>Parent KLA</a>
            by SteveP</li>
        <li><a href='https://klanext.keyboard-design.com/'>KLAnext</a>
            by Den &amp; Ian</li>
      </ul>
    </section>
    <section>
      <h4>Resources and feedback</h4>
      <ul>
        <li><a href='https://keyboard-design.com/internet-letter-layout-db.html'>
              Keyboard Layout Database</a></li>
        <li><a href='https://github.com/NSUSpray/keyboard-layout-analyzer/issues'>
              Report a bug</a>
            | <a href='https://github.com/NSUSpray/keyboard-layout-analyzer'>
              GitHub repo</a></li>
        <li><a href='https://vk.com/nsu.spray'>Spray’s social</a></li>
      </ul>
    </section>
  </footer>
</template>

<style scoped>
header {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2;
  font-size: var(--header-font-size);
  background-color: var(--dark-dark-blue);
}

header * { color: white; }

header h1 { display: none; }

header nav { display: flex; }
header nav:last-of-type {
  margin-left: auto;
  margin-top: auto;
}

header nav a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--header-height);
  height: var(--header-height);
  padding: var(--padding);
  border: solid 0 transparent;
  border-top-width: var(--nav-active-anchor-border-width);
}
header nav a.router-link-active { border-color: white; }
header nav a:hover { background-color: var(--blue); }
header nav a:focus { background-color: var(--dark-blue); }
header nav a:is(:hover, :focus) { text-decoration: none; }

main { margin: 0 var(--content-margin); }

footer {
  padding-bottom: calc(var(--wide-padding) * 1.5);
  line-height: 1.4rem;
  color: var(--gray);
}
footer:has(.row-first:not(.row-last)) {
  text-align: center;
}

footer > :not(.row-first) {
  border-left: 1px solid var(--light-light-gray);
}

footer section {
  display: inline-block;
  margin: var(--margin) 0;
  padding: 0 var(--padding);
  text-align: initial;
}

footer section > * {
  margin: var(--narrow-margin) 0;
}
footer section > :first-child { margin-top: 0; }
footer section > :last-child { margin-bottom: 0; }

footer h4 {
  font-size: calc(16rem / 15);
  font-weight: 400;
}



@media (max-width: 1024px) and (orientation: landscape) {

  header {
    flex-direction: column;
    left: 0;
    width: initial;
    height: 100%;
  }

  header nav { flex-direction: column; }

  header nav a {
    border-width: 0;
    border-right-width: var(--nav-active-anchor-border-width);
  }

}



@media print {

  header, footer { display: none; }

}



@media (min-width: 1024px) {

  header {
    height: var(--header-height);
    top: 0;
    bottom: initial;
    padding: 0 var(--content-margin);
  }

  header > :first-child { padding-left: 0; }

  header h1 {
    display: flex;
    align-items: flex-end;
    margin: 0;
    padding:
      calc(var(--padding) * 0.8)
      var(--wide-padding);
    font-size: calc(var(--header-font-size) * 4/3);
    font-weight: 700;
    line-height: initial;
  }

  header h1 img {
    margin: 0;
    margin-right: var(--narrow-margin);
  }

  header nav a {
    width: auto;
    border-width: 0;
    border-bottom-width: var(--nav-active-anchor-border-width);
  }

  main { padding: var(--narrow-padding) 0; }
  
}
</style>
