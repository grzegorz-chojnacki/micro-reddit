<template>
  <main>
    <aside v-if="reddit">
      <RedditMeta :reddit="reddit" @subscription="setSubscribe" />
    </aside>

    <section>
      <RedditToolbar v-if="reddit" :reddit="reddit" />
      <Feed :fetching-fn="fetchReddit" />
    </section>
  </main>
</template>

<script>
import RedditMeta from "@/components/RedditMeta.vue";
import RedditToolbar from "@/components/RedditToolbar.vue";
import Feed from "@/components/Feed.vue";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "RedditView",
  components: {
    RedditMeta,
    RedditToolbar,
    Feed,
  },
  props: { redditId: { type: String, required: true } },
  data() {
    return {
      fetchReddit: postService.getAllReddit(this.redditId),
      reddit: null,
    };
  },
  created() {
    redditService.reddit.subscribe((reddit) => (this.reddit = reddit));
  },
  async mounted() {
    await redditService.get(this.redditId);
  },
  methods: {
    setSubscribe(state) {
      redditService.setSubscribe(this.reddit.id, state);
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template: "feed";
  gap: 1em;

  @media screen and (min-width: 800px) {
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
