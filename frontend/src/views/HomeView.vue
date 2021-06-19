<template>
  <main class="with-aside">
    <aside>
      <TopReddits title="users" :fetching-fn="redditService.getTopByUsers" />
      <TopReddits title="posts" :fetching-fn="redditService.getTopByPosts" />
    </aside>

    <Feed :fetching-fn="fetchHome" />
  </main>
</template>

<script>
import Feed from "@/components/Feed.vue";
import TopReddits from "@/components/TopReddits.vue";
import { userService } from "@/services/userService.js";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "HomeView",
  components: { Feed, TopReddits },
  data() {
    return { fetchHome: postService.getHome, redditService };
  },
  created() {
    userService.isAuthenticated.subscribe(authenticated => {
      if (!authenticated) {
        this.$router.push({ name: "main" });
      }
    });
  }
};
</script>