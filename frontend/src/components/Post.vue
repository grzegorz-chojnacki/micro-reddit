<template>
  <section class="card">
    <header class="card-header">
      <h5 class="card-title">
        <router-link
          :to="{
            name: 'post',
            params: { redditId: post.reddit.id, postId: post.id },
          }"
        >
          {{ post.name }}
        </router-link>
      </h5>
      <h6 class="card-subtitle">
        <router-link
          :to="{ name: 'reddit', params: { redditId: post.reddit.id } }"
        >
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
        frameborder="0"
      />

      <div class="img-container rounded-2 bg-dark">
        <img
          v-if="post.image"
          :src="post.image"
          :alt="post.name"
        >
      </div>

      <p class="card-text mt-3">
        {{ post.text }}
      </p>
    </div>

    <footer class="card-footer">
      <div
        class="btn-group btn-group-sm"
        role="group"
      >
        <input
          :id="post.id + 'upvote'"
          type="radio"
          class="btn-check"
          autocomplete="off"
          :name="post.id"
          :checked="post.voted === 1"
        >
        <label
          class="btn btn-outline-dark"
          :for="post.id + 'upvote'"
        >
          <span class="material-icons add">add</span>
        </label>

        <input
          :id="post.id + 'score'"
          type="radio"
          class="btn-check"
          disabled
          :name="post.id"
        >
        <label
          class="btn btn-outline-dark score"
          :for="post.id + 'score'"
        >
          <span class="vote">{{ post.score }}</span>
        </label>

        <input
          :id="post.id + 'downvote'"
          type="radio"
          class="btn-check"
          autocomplete="off"
          :name="post.id"
          :checked="post.voted === -1"
        >
        <label
          class="btn btn-outline-dark"
          :for="post.id + 'downvote'"
        >
          <span class="material-icons remove">remove</span>
        </label>
      </div>

      <router-link
        class="btn mx-3"
        :to="`/r/${post.reddit.id}/p/${post.id}#comments`"
      >
        Comments
      </router-link>
    </footer>
  </section>
</template>

<script>
export default {
  name: "Post",
  props: { post: { type: Object, required: true } },
  methods: {
    embedYoutube(url) {
      return url.replace("watch?v=", "embed/");
    },
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

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0 0.5em;
}

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