<template>
  <section class="card">
    <header class="card-header">
      <div class="d-flex justify-content-between">
        <h5 class="card-title">
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

      <h6 class="card-subtitle">
        <span class="post-author">
          Posted by <strong>{{ post.user?.username }}</strong> at
        </span>
        <router-link
          class="text-reset"
          :to="{ name: 'reddit', params: { redditName: post.reddit.name } }">
          {{ post.reddit.name }}
        </router-link>
      </h6>
    </header>

    <div class="card-body">
      <iframe
        v-if="post.video"
        :src="embedYoutube(post.video)"
        class="yt-player"
        type="text/html"
        frameborder="0" />

      <div v-if="post.image" class="img-container rounded-2 bg-dark mb-3">
        <img :src="imageUrl" :alt="post.title">
      </div>

      <p v-if="post.link" class="card-text">
        <a :href="post.link">
          {{ post.link }}
        </a>
      </p>

      <p v-if="post.content" class="card-text">
        {{ post.content }}
      </p>
    </div>

    <footer class="card-footer">
      <VoteGroup :score="post.score" :voted="post.voted" @vote="$emit('vote', $event)" />

      <router-link
        class="btn mx-3"
        :to="`/r/${post.reddit.name}/p/${post.id}#comments`">
        Comments
      </router-link>
    </footer>
  </section>
</template>

<script>
import VoteGroup from "@/components/VoteGroup.vue";
import { getYoutubeVideoId, baseURL } from "@/common.js";
import { markRaw } from "vue";

const urlMapper = url => url.match(/^http.*/) ? url : `${baseURL}/s/${url}`;

export default markRaw({
  name: "PostCard",
  components: { VoteGroup },
  props: {
    post: { type: Object, required: true },
    isAuthenticated: { type: Boolean, default: false },
    modView: { type: Boolean, default: false },
  },
  emits: ["delete", "ban", "vote"],
  data() {
    return {
      imageUrl: this.post.image ? urlMapper(this.post.image) : "",
    };
  },
  methods: {
    embedYoutube(url) {
      return `https://www.youtube.com/embed/${getYoutubeVideoId(url)}`;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/variables";

$maxHeight: 500px;

section {
  margin: 1em 0;
}

.img-container {
  overflow: hidden;
  max-height: $maxHeight;

  img {
    box-shadow: 0 0 1em black;
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}

.post-author { opacity: $hazy }

.yt-player {
  width: 100%;
  height: $maxHeight;
}
</style>