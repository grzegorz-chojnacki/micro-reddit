<template>
  <main>
    <h2 v-if="query" class="my-3">
      <button class="btn" @click="clearQuery">
        <span class="material-icons clear">clear</span>
      </button>
      Results for "{{ query }}":
    </h2>

    <Reddit
      v-for="reddit of reddits"
      :key="reddit.id"
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
      this.reset();
    },
  },
  mounted() {
    this.fetchNext();
    window.onscroll = () => {
      const scrollHeight = window.pageYOffset + window.innerHeight;
      const fullHeight = document.documentElement.offsetHeight;

      if (scrollHeight >= fullHeight) {
        this.fetchNext();
      }
    };
  },
  methods: {
    reset() {
      this.reddits = [];
      this.page = 0;
      this.fetchNext();
    },
    setSubscribe({ redditId, state }) {
      redditService.setSubscribe(redditId, state)
        .then(state => {
          const reddit = this.reddits.find(reddit => reddit.id === redditId);
          reddit.subscribed = state;
        });
    },
    clearQuery() {
      this.$router.push({ name: "reddit-list" });
    },
    fetchNext() {
      this.query = this.$route.query.q || "";
      redditService.getAll(this.page, this.query).then((reddits) => {
        this.reddits = this.reddits.concat(reddits);
        this.page++;
        this.sourceExhausted = reddits.length === 0;
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