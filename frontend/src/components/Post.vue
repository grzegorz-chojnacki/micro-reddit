<template>
  <section class="card">
    <header class="card-header">
      <h5 class="card-title">
        <router-link
          :to="{
            name: 'post',
            params: { redditName: post.reddit.name, postId: post.id },
          }">
          {{ post.title }}
        </router-link>
      </h5>
      <h6 class="card-subtitle">
        <span class="post-author">
          Posted by <strong>{{ post.user?.username }}</strong> at
        </span>
        <router-link
          :to="{ name: 'reddit', params: { redditName: post.reddit.name } }">
          {{ post.reddit.name }}
        </router-link>
      </h6>
    </header>

    <div class="card-body">
      <!-- <iframe
        v-if="post.video"
        :src="embedYoutube(post.video)"
        class="yt-player"
        type="text/html"
        frameborder="0" /> -->

      <div v-if="post.image" class="img-container rounded-2 bg-dark mb-3">
        <img :src="imageUrl" :alt="post.title">
      </div>

      <p v-if="post.content" class="card-text">
        {{ post.content }}
      </p>
    </div>

    <footer class="card-footer">
      <VoteGroup :score="score" :voted="voted" @vote="onVote" />

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
import { postService } from "@/services/postService.js";
import { getYoutubeVideoId, baseURL } from "@/common.js";

const urlMapper = url => url.match(/^http.*/) ? url : `${baseURL}/s/${url}`;

export default {
  name: "Post",
  components: { VoteGroup },
  props: { post: { type: Object, required: true } },
  data() {
    return {
      imageUrl: this.post.image ? urlMapper(this.post.image) : "",
      score: this.post.score,
      voted: this.post.voted,
    };
  },
  watch: {
    post() {
      this.score = this.post.score;
      this.voted = this.post.voted;
    }
  },
  methods: {
    embedYoutube(url) {
      return `https://www.youtube.com/embed/${getYoutubeVideoId(url)}`;
    },
    async onVote(state) {
      const { score } = await postService.vote(this.post.reddit.name, this.post.id, state);
      this.score = score;
      this.voted = state;
    }
  },
};
</script>

<style scoped lang="scss">
section {
  margin: 1em 0;
}

.img-container {
  overflow: hidden;
  max-height: 800px;

  img {
    box-shadow: 0 0 1em black;
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}

.post-author { opacity: 0.7 }

header > * {
  a {
    text-decoration: none;
    color: initial;
  }
}

.yt-player {
  width: 100%;
  height: 500px;
}
</style>