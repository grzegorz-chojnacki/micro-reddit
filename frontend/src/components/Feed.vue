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
          :component="PostCard"
          @vote="onVote(post, $event)"
          @ban="onBan"
          @delete="onDelete" />
      </template>
      <template v-else>
        <ul class="list-group list-group-flush">
          <Post
            v-for="post of posts"
            :key="post.id"
            :post="post"
            :component="PostMinimal"
            @vote="onVote(post, $event)"
            @ban="onBan"
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
import PostCard from "@/components/PostCard.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { userService } from "@/services/userService.js";
import { Range, atPageBottom } from "@/common.js";

export default {
  name: "Feed",
  components: { Post, LoadingIndicator },
  props: { fetchingFn: { type: Function, required: true }},
  data() {
    return {
      PostCard, PostMinimal,
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
    },
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
    onBan(userId) {
      this.posts = this.posts.filter(post => post.user.id !== userId);
    },
    onVote(post, { score, state }) {
      post.score = score;
      post.voted = state;
    },
  },
};
</script>
