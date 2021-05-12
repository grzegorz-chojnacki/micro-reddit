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

    <footer class="card-footer">
      <span class="material-icons">face</span>
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

<style scoped>
  section { margin: 1em 0 }
</style>