<template>
  <Feed :fetching-fn="fetchReddit" />
</template>

<script>
import Feed from "@/components/Feed.vue";
import { postService } from "@/services/postService.js";

export default {
  name: "RedditView",
  components: { Feed },
  props: { redditId: { type: String, required: true } },
  data() {
    return { fetchReddit: postService.getAllReddit(this.redditId) };
  },
};
</script>