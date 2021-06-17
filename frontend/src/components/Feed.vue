<template>
  <div>
    <section>
      <Post v-for="post of posts" :key="post.id" :post="post" />
    </section>

    <footer><LoadingIndicator :done="sourceExhausted" /></footer>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { userService } from "@/services/userService.js";
import { Range } from "@/common.js";

const offset = 100;

export default {
  name: "Feed",
  components: { Post, LoadingIndicator },
  props: {
    fetchingFn: { type: Function, required: true },
    query: { type: String, default: "" },
  },
  data() {
    return {
      page: 0,
      posts: [],
      sourceExhausted: false,
    };
  },
  watch: {
    query() {
      this.page = 0;
      this.posts = [];
      this.sourceExhausted = false;
      this.fetchNext();
    }
  },
  created() {
    this.fetchNext();
    window.onscroll = () => {
      const scrollHeight = window.pageYOffset + window.innerHeight;
      const fullHeight = document.documentElement.offsetHeight;

      if (scrollHeight >= fullHeight - offset) {
        this.fetchNext();
      }
    };
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
  },
};
</script>
