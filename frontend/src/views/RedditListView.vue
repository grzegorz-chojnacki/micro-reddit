<template>
  <main>
    <h2 v-if="query" class="my-3">
      <router-link :to="{ name: 'reddit-list' }" class="text-reset">
        <span class="material-icons clear">clear</span>
      </router-link>
      Results for "{{ query }}":
    </h2>

    <Reddit
      v-for="reddit of reddits"
      :key="reddit.name"
      class="my-2"
      :reddit="reddit"
      @subscription="setSubscribe" />
  </main>

  <footer><LoadingIndicator :done="sourceExhausted" /></footer>
</template>

<script>
import Reddit from "@/components/Reddit.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { redditService } from "@/services/redditService";
import { atPageBottom } from "@/common";

export default {
  name: "RedditListView",
  components: { Reddit, LoadingIndicator },
  data() {
    return {
      page: 0,
      query: "",
      reddits: [],
      sourceExhausted: false,
    };
  },
  watch: {
    $route() {
      this.query = this.$route.query.q || "";
      this.reddits = [];
      this.page = 0;
      this.fetchNext();
    },
  },
  mounted() {
    this.fetchNext();
    window.onscroll = atPageBottom(() => this.fetchNext());
  },
  methods: {
    setSubscribe({ redditName, state }) {
      redditService.setSubscribe(redditName, state)
        .then(state => {
          const reddit = this.reddits.find(reddit => reddit.name === redditName);
          reddit.subscribed = state;
        });
    },
    fetchNext() {
      redditService.getAll(this.page, this.query).then((reddits) => {
        this.reddits = this.reddits.concat(reddits);
        this.sourceExhausted = reddits.length < 10;

        if (!this.sourceExhausted) {
          this.page++;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h2 > button {
  display: inline-flex;
  align-items: center;
  padding: 0.5em;
}
</style>