<template>
  <section class="card">
    <header class="card-header">
      <h5 class="card-title">
        <router-link :to="{
            name: 'post',
            params: { redditId: post.reddit.id, postId: post.id }}">
          {{ post.name }}
        </router-link>
      </h5>
      <h6 class="card-subtitle">
        <router-link
            :to="{ name: 'reddit', params: { redditId: post.reddit.id }}">
          {{ post.name }}
        </router-link>
      </h6>
    </header>

    <div class="card-body">
      <iframe v-if="post.video" :src="post.video" class="yt-player"
        type="text/html" frameborder="0">
      </iframe>
      <img v-if="post.image" :src="post.image" class="card-img-top" :alt="post.name">
      <p class="card-text">{{ post.text }}</p>
    </div>

    <footer class="card-footer" >
      <div class="btn-group btn-group-sm" role="group">
        <input type="radio" class="btn-check" autocomplete="off"
          :name="post.id"
          :id="post.id + 'upvote'"
          :checked="post.voted === 1">
        <label class="btn btn-outline-dark" :for="post.id + 'upvote'">
          <span class="material-icons add">add</span>
        </label>

        <input type="radio" class="btn-check" disabled
          :name="post.id"
          :id="post.id + 'score'">
        <label class="btn btn-outline-dark score" :for="post.id + 'score'">
          <span class="vote">{{ post.score }}</span>
        </label>

        <input type="radio" class="btn-check" autocomplete="off"
          :name="post.id"
          :id="post.id + 'downvote'"
          :checked="post.voted === -1">
        <label class="btn btn-outline-dark" :for="post.id + 'downvote'">
          <span class="material-icons remove">remove</span>
        </label>
      </div>

    </footer>
  </section>
</template>

<script>
export default {
  name: 'Post',
  props: {
    post: Object
  }
}
</script>

<style scoped lang="scss">
  section { margin: 1em 0 }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0 0.5em;
  }

  .yt-player {
    width: 100%;
    height: 500px;
  }
</style>