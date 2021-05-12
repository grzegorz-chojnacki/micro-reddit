import { createRouter, createWebHistory } from 'vue-router'
import AccountView from '@/views/AccountView.vue'
import MainView from '@/views/MainView.vue'
import PostView from '@/views/PostView.vue'
import RedditView from '@/views/RedditView.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    props: { isHome: false },
    component: MainView
  },
  {
    path: '/home',
    name: 'home',
    props: { isHome: true },
    component: MainView
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView
  },
  {
    path: '/r/:redditId',
    name: 'reddit',
    props: true,
    component: RedditView
  },
  {
    path: '/r/:redditId/p/:postId',
    name: 'post',
    props: true,
    component: PostView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
