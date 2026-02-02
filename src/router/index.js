import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProfileReview from '../views/ProfileReview.vue'
import AskAdvice from '../views/AskAdvice.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile-review',
    name: 'ProfileReview',
    component: ProfileReview
  },
  {
    path: '/ask-advice',
    name: 'AskAdvice',
    component: AskAdvice
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
