import { createRouter, createWebHistory } from 'vue-router'
import LayoutsView from '../views/LayoutsView.vue'
import AnalyzerView from '../views/AnalyzerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layouts',
      component: LayoutsView
    },
    {
      path: '/analyzer',
      name: 'analyzer',
      component: AnalyzerView
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('../views/ResultsView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) { return { top: 0 } }
})

export default router
