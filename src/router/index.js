import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AIPhoto from '../views/AIPhoto.vue'
import AskAdvice from '../views/AskAdvice.vue'
import StripeSuccess from '../views/StripeSuccess.vue'
import StripeCancel from '../views/StripeCancel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ai-photo',
    name: 'AIPhoto',
    component: AIPhoto
  },
  {
    path: '/ask-advice',
    name: 'AskAdvice',
    component: AskAdvice
  },
  {
    path: '/success',
    name: 'StripeSuccess',
    component: StripeSuccess
  },
  {
    path: '/cancel',
    name: 'StripeCancel',
    component: StripeCancel
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

export default router
