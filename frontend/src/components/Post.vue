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
      <img v-if="post.image" :src="post.image" class="card-img-top" :alt="post.name">
      <p class="card-text">{{ post.text }}</p>
    </div>

    <footer class="card-footer" >
      <div class="btn-group btn-group-sm" role="group">
        <input type="radio" class="btn-check" autocomplete="off"
          :name="post.id"
          :id="post.id + 'upvote'"
          :checked="post.voted === 1">
        <label class="btn btn-outline-primary" :for="post.id + 'upvote'">
          <span class="material-icons add">add</span>
        </label>

        <input type="radio" class="btn-check" autocomplete="off"
          :name="post.id"
          :id="post.id + 'downvote'"
          :checked="post.voted === -1">
        <label class="btn btn-outline-primary" :for="post.id + 'downvote'">
          <span class="material-icons remove">remove</span>
        </label>
      </div>

      <span class="vote">{{ post.score }}</span>
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

  .material-icons, .btn-outline-primary { line-height: initial }

  .checked {
    &.add { color: red }
    &.remove { color: blue }
  }
</style>