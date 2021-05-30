import { createRouter, createWebHistory } from "vue-router";
import AccountView from "@/views/AccountView.vue";
import MainView from "@/views/MainView.vue";
import HomeView from "@/views/HomeView.vue";
import PostView from "@/views/PostView.vue";
import RedditView from "@/views/RedditView.vue";
import RedditListView from "@/views/RedditListView.vue";
import { userService } from "@/services/userService";

let isAuthenticated = false;
userService.isAuthenticated.subscribe(status => isAuthenticated = status);

const isAuthenticatedGuard = (to, from, next) => isAuthenticated ? next() : next({ name: "main" });

const routes = [
  {
    path: "/",
    name: "main",
    component: MainView
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    beforeEnter: isAuthenticatedGuard
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
    beforeEnter: isAuthenticatedGuard
  },
  {
    path: "/r",
    name: "reddit-list",
    component: RedditListView
  },
  {
    path: "/r/:redditId",
    name: "reddit",
    props: true,
    component: RedditView
  },
  {
    path: "/r/:redditId/p/:postId",
    name: "post",
    props: true,
    component: PostView
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ el: to.hash }), 300);
      });
    } else {
      return { x: 0, y: 0 };
    }
  },
});

export default router;
