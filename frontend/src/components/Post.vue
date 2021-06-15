<template>
  <section class="card">
    <header class="card-header">
      <h5 class="card-title">
        <router-link
          :to="{
            name: 'post',
            params: { redditId: post.reddit.id, postId: post.id },
          }">
          {{ post.name }}
        </router-link>
      </h5>
      <h6 class="card-subtitle">
        <span class="post-author">
          Posted by <strong>{{ post.user?.username }}</strong> at
        </span>
        <router-link
          :to="{ name: 'reddit', params: { redditId: post.reddit.id } }">
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
        <img :src="post.image" :alt="post.name">
      </div>

      <p v-if="post.text" class="card-text">
        {{ post.text }}
      </p>
    </div>

    <footer class="card-footer">
      <VoteGroup :score="post.score" :voted="post.voted" @vote="onVote" />

      <router-link
        class="btn mx-3"
        :to="`/r/${post.reddit.id}/p/${post.id}#comments`">
        Comments
      </router-link>
    </footer>
  </section>
</template>

<script>
import VoteGroup from "@/components/VoteGroup.vue";

export default {
  name: "Post",
  components: { VoteGroup },
  props: { post: { type: Object, required: true } },
  methods: {
    embedYoutube(url) {
      return url.replace("watch?v=", "embed/");
    },
    onVote(state) {
      console.log(state);
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