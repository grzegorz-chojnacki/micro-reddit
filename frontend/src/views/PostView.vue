<template>
  <main v-if="post">
    <Post
      :post="post"
      :with-comments="true"
      @delete="returnToReddit"
      @vote="onVote(post, $event)"
      @ban="onBan" />
  </main>

  <div v-else>
    <LoadingIndicator />
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService.js";

export default {
  name: "PostView",
  components: { Post, LoadingIndicator },
  props: {
    redditName: { type: String, required: true },
    postId: { type: String, required: true },
  },
  data() {
    return {
      post: null,
      subscription: null
    };
  },
  created() {
    try {
      this.subscription = userService.user.subscribe(async () => {
        this.post = await this.fetchPost();
      });
    } catch (e) {
      this.returnToReddit();
    }
  },
  unmounted() {
    this.subscription && this.subscription.unsubscribe();
  },
  methods: {
    returnToReddit() {
      this.$router.push({ name: "reddit", params: { redditName: this.redditName }});
    },
    onBan() {
      this.returnToReddit();
    },
    onVote(post, { score, state }) {
      post.score = score;
      post.voted = state;
    },
    async fetchPost() {
      return await postService.get(this.redditName, this.postId);
    },
  },
};
</script>