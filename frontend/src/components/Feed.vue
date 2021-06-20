<template>
  <div class="my-3">
    <h2 v-if="query">
      <router-link :to="{ name: 'reddit' }" class="text-reset">
        <span class="material-icons clear">clear</span>
      </router-link>
      Results for "{{ queryStr }}":
    </h2>

    <div class="form-check form-switch ms-1">
      <input
        id="postComponent"
        v-model="showCards"
        type="checkbox"
        class="form-check-input">
      <label class="form-check-label" for="postComponent">Display cards</label>
    </div>


    <section>
      <template v-if="showCards">
        <Post
          v-for="post of posts"
          :key="post.id"
          :post="post"
          @vote="post.score = $event.score"
          @delete="onDelete" />
      </template>
      <template v-else>
        <ul class="list-group list-group-flush">
          <PostMinimal
            v-for="post of posts"
            :key="post.id"
            :post="post"
            @vote="post.score = $event.score"
            @delete="onDelete" />
        </ul>
      </template>
    </section>

    <footer><LoadingIndicator :done="sourceExhausted" /></footer>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import PostMinimal from "@/components/PostMinimal.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { userService } from "@/services/userService.js";
import { Range, atPageBottom } from "@/common.js";

export default {
  name: "Feed",
  components: { Post, PostMinimal, LoadingIndicator },
  props: {
    fetchingFn: { type: Function, required: true },
    deletedPost: { type: Object, default: () => ({ id: null })}
  },
  data() {
    return {
      showCards: true,
      subscription: null,
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
    deletedPost() {
      console.log(this.deletedPost);
      if (this.deletedPost.id) {
        this.posts = this.posts.filter(post => post.id !== this.deletedPost.id);
      }
    },
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
    this.subscription = userService.isAuthenticated.subscribe(() => this.refetch());
  },
  unmounted() {
    this.subscription.unsubscribe();
  },
  methods: {
    fetchNext() {
      this.fetchingFn(this.page, this.query).then((posts) => {
        this.sourceExhausted = posts.length < 10;
        if (posts.length > 0) {
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
