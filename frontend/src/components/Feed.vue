<template>
  <div>
    <h2 v-if="query" class="my-3">
      <router-link :to="{ name: 'reddit' }" class="text-reset">
        <span class="material-icons clear">clear</span>
      </router-link>
      Results for "{{ queryStr }}":
    </h2>

    <section>
      <Post v-for="post of posts" :key="post.id" :post="post" @delete="onDelete" />
    </section>

    <footer><LoadingIndicator :done="sourceExhausted" /></footer>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { userService } from "@/services/userService.js";
import { Range, atPageBottom } from "@/common.js";

export default {
  name: "Feed",
  components: { Post, LoadingIndicator },
  props: { fetchingFn: { type: Function, required: true } },
  data() {
    return {
      page: 0,
      query: this.$route.query.q || "",
      posts: [],
      sourceExhausted: false,
    };
  },
  computed: {
    queryStr() {
      return this.query
        ? this.query.replace(/(.*);(.*)/, (_, search) => search)
        : "";
    }
  },
  watch: {
    fetchingFn() {
      this.query = this.$route.query.q || "";
      this.page = 0;
      this.posts = [];
      this.sourceExhausted = false;
      this.fetchNext();
    },
  },
  created() {
    this.fetchNext();
    window.onscroll = atPageBottom(() => this.fetchNext());
    userService.isAuthenticated.subscribe(() => {
      this.refetch();
    });
  },
  methods: {
    fetchNext() {
      this.fetchingFn(this.page, this.query).then((posts) => {
        this.sourceExhausted = posts.length === 0;
        if (!this.sourceExhausted) {
          this.posts = this.posts.concat(posts);
          this.page++;
        }
      });
    },
    async refetch() {
      const pages = Range(this.page).map(page => this.fetchingFn(page, this.query));
      this.posts = (await Promise.all(pages)).flat();
    },
    clearQuery() {
      this.$router.push({ name: "reddit-list" });
    },
    onDelete(postId) {
      this.posts = this.posts.filter(post => post.id !== postId);
    },
  },
};
</script>
