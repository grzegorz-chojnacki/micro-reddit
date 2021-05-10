import { createRouter, createWebHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'
import MainView from '@/views/MainView.vue'
import PostView from '@/views/PostView.vue'
import RedditView from '@/views/RedditView.vue'

const routes = [
  {
    path: '/',
    props: { isHome: false },
    component: MainView
  },
  {
    path: '/home',
    props: { isHome: true },
    component: MainView
  },
  {
    path: '/account',
    component: AccountView
  },
  {
    path: '/r/:redditId',
    props: true,
    component: RedditView
  },
  {
    path: '/r/:redditId/p/:postId',
    props: true,
    component: PostView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
