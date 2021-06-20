<template>
  <main class="with-aside">
    <aside>
      <TopReddits title="users" :fetching-fn="redditService.getTopByUsers" />
      <TopReddits title="posts" :fetching-fn="redditService.getTopByPosts" />
    </aside>

    <section>
      <HomeToolbar @sort="onSort" />
      <Feed :fetching-fn="fetchHome" />
    </section>
  </main>
</template>

<script>
import Feed from "@/components/Feed.vue";
import TopReddits from "@/components/TopReddits.vue";
import HomeToolbar from "@/components/HomeToolbar.vue";
import { userService } from "@/services/userService.js";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "HomeView",
  components: { Feed, TopReddits, HomeToolbar },
  data() {
    return {
      redditService,
      subscription: null,
      fetchHome: postService.getHome(),
    };
  },
  created() {
    this.subscription = userService.isAuthenticated.subscribe(authenticated => {
      if (!authenticated) {
        this.$router.push({ name: "main" });
      }
    });
  },
  unmounted() {
    this.subscription.unsubscribe();
  },
  methods: {
    onSort(type) {
      this.fetchHome = postService.getHome(type);
    }
  }
};
</script>