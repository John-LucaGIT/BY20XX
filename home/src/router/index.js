import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'BY20XX',
    title: 'BY20XX',
    component: HomeView,
    query: {
      user: null
    },
    meta: {
      title: 'BY20XX',
      metaTags: [
        {
          title: 'BY20XX',
          name: 'description',
          content: 'Create, share and edit goals for free, no sign-up needed.'
        },
      ]
    }
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
