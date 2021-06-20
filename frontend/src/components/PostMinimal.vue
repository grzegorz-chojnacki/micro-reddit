<template>
  <li class="list-group-item py-3">
    <header>
      <div class="d-flex justify-content-between">
        <h5>
          <router-link
            class="text-reset"
            :to="{
              name: 'post',
              params: { redditName: post.reddit.name, postId: post.id },
            }">
            {{ post.title }}
          </router-link>
        </h5>

        <button v-if="modView" class="btn btn-sm" @click="deletePost">
          <span class="material-icons">block</span>
        </button>
      </div>

      <h6>
        <span class="post-author">
          Posted by <strong>{{ post.user?.username }}</strong> at
        </span>
        <router-link
          class="text-reset"
          :to="{ name: 'reddit', params: { redditName: post.reddit.name } }">
          {{ post.reddit.name }}
        </router-link>
      </h6>
      <span class="post-score"> with score of {{ post.score }}</span>
    </header>
  </li>
</template>

<script>
import { postService } from "@/services/postService.js";
import { userService } from "@/services/userService.js";

export default {
  name: "Post",
  props: { post: { type: Object, required: true } },
  emits: ["delete", "vote"],
  data() {
    return {
      score: this.post.score,
      modView: userService.isMod(this.post.reddit.name)
    };
  },
  watch: {
    post() {
      this.score = this.post.score;
      this.voted = this.post.voted;
    }
  },
  methods: {
    async onVote(state) {
      const { score } = await postService.vote(this.post.reddit.name, this.post.id, state);
      this.score = score;
      this.voted = state;
      this.$emit("vote", { score });
    },
    async deletePost() {
      await postService.delete(this.post.reddit.name, this.post.id);
      this.$emit("delete", this.post.id);
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/variables";

.post-author, .post-score {
  opacity: $hazy;
}
</style>