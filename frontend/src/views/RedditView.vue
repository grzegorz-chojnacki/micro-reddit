<template>
  <main>
    <aside v-if="reddit">
      <RedditMeta :reddit="reddit" />
    </aside>

    <section>
      <Feed :fetching-fn="fetchReddit" />
    </section>
  </main>
</template>

<script>
import RedditMeta from "@/components/RedditMeta.vue";
import Feed from "@/components/Feed.vue";
import { postService } from "@/services/postService.js";
import { redditService } from "@/services/redditService.js";

export default {
  name: "RedditView",
  components: { RedditMeta, Feed },
  props: { redditId: { type: String, required: true } },
  data() {
    return {
      fetchReddit: postService.getAllReddit(this.redditId),
      reddit: null
    };
  },
  created() {
    redditService.reddit.subscribe(reddit => this.reddit = reddit);
  },
  async mounted() {
    await redditService.get(this.redditId);
  },
};
</script>

<style lang="scss" scoped>
main {
  display: grid;
  grid-template: "feed aside";
  grid-template-columns: auto 250px;
  gap: 1em;

  aside {
    display: none;
    @media screen and (min-width: 800px) {
      display: initial;
      grid-area: aside;
    }
  }

  section {
    grid-area: feed;
  }
}
</style>
