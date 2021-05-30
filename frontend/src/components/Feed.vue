<template>
  <div>
    <aside />

    <main>
      <Post
        v-for="post of posts"
        :key="post.id"
        :post="post" />
    </main>

    <footer><LoadingIndicator :done="sourceExhausted" /></footer>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

export default {
  name: "Feed",
  components: { Post, LoadingIndicator },
  props: { fetchingFn: { type: Function, required: true } },
  data() {
    return {
      page: 0,
      query: "",
      posts: [],
      sourceExhausted: false,
    };
  },
  created() {
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
    fetchNext() {
      this.fetchingFn(this.page, this.query).then((posts) => {
        this.posts = this.posts.concat(posts);
        this.page++;
        this.sourceExhausted = posts.length === 0;
      });
    },
  },
};
</script>
