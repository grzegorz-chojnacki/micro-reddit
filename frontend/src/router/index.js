import { createRouter, createWebHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'
import MainView from '@/views/MainView.vue'
import PostView from '@/views/PostView.vue'
import RedditView from '@/views/RedditView.vue'

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/home',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/account',
    name: 'AccountView',
    component: AccountView
  },
  {
    path: '/r/:redditId',
    name: 'RedditView',
    component: RedditView
  },
  {
    path: '/r/:redditId/p/:postId',
    name: 'PostView',
    component: PostView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
