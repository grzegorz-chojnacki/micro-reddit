<template>
  <main class="with-aside">
    <aside v-if="reddit">
      <RedditMeta :reddit="reddit" @subscription="setSubscribe" @update="refetch" />
      <TopReddits title="users" :fetching-fn="redditService.getTopByUsers" />
      <TopReddits title="posts" :fetching-fn="redditService.getTopByPosts" />
    </aside>

    <section>
      <RedditToolbar v-if="reddit" :reddit="reddit" />
      <Feed :fetching-fn="fetchReddit" />
    </section>
  </main>
</template>

<script>
import RedditMeta from "@/components/RedditMeta.vue";
import TopReddits from "@/components/TopReddits.vue";
import RedditToolbar from "@/components/RedditToolbar.vue";
import Feed from "@/components/Feed.vue";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "RedditView",
  components: {
    RedditMeta,
    TopReddits,
    RedditToolbar,
    Feed,
  },
  props: { redditName: { type: String, required: true } },
  data() {
    return {
      fetchReddit: postService.getAllReddit(this.redditName),
      redditService,
      reddit: null,
    };
  },
  watch: {
    $route() {
      this.refetch();
    }
  },
  async created() {
    this.reddit = await redditService.get(this.redditName);
  },
  methods: {
    async refetch() {
      const redditName = this.$route.params.redditName;
      if (redditName) {
        this.reddit = await redditService.get(redditName);
        this.fetchReddit = postService.getAllReddit(redditName);
      }
    },
    async setSubscribe(state) {
      this.reddit.subscribed = await redditService.setSubscribe(this.reddit.name, state);
    },
  }
};
</script>
