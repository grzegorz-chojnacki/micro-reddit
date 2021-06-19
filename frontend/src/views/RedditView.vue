<template>
  <main>
    <aside v-if="reddit">
      <RedditMeta :reddit="reddit" @subscription="setSubscribe" />
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
  created() {
    redditService.reddit.subscribe((reddit) => (this.reddit = reddit));
  },
  async mounted() {
    await redditService.get(this.redditName);
  },
  methods: {
    setSubscribe(state) {
      redditService.setSubscribe(this.reddit.name, state);
    },
  }
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template: "feed";
  gap: 1em;

  @media screen and (min-width: 875px) {
    grid-template: "feed aside";
    grid-template-columns: auto 300px;
    aside {
      grid-area: aside;
    }
  }

  section {
    grid-area: feed;
  }
}
</style>
