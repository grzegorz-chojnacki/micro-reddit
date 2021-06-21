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

        <button v-if="modView" class="btn btn-sm" @click="$emit('delete', post.id)">
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
import { markRaw } from "vue";

export default markRaw({
  name: "PostMinimal",
  props: {
    post: { type: Object, required: true },
    modView: { type: Boolean, default: false },
  },
  emits: ["delete"],
});
</script>

<style scoped lang="scss">
@import "@/variables";

.post-author, .post-score {
  opacity: $hazy;
}
</style>