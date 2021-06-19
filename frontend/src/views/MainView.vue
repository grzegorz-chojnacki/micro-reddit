<template>
  <main>
    <aside>
      <TopReddits title="users" :fetching-fn="redditService.getTopByUsers" />
      <TopReddits title="posts" :fetching-fn="redditService.getTopByPosts" />
    </aside>

    <Feed :fetching-fn="fetchMain" />
  </main>
</template>

<script>
import Feed from "@/components/Feed.vue";
import TopReddits from "@/components/TopReddits.vue";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "MainView",
  components: { Feed, TopReddits },
  data() {
    return { fetchMain: postService.getAll, redditService };
  },
};
</script>
