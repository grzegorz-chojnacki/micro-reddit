<template>
  <main v-if="post !== null">
    <Post :post="post"/>
    <section id="comments">
    </section>
  </main>
  <div v-else>
    <div class="d-flex justify-content-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import Post from '@/components/Post.vue'

import { postService } from '@/services/postService'

export default {
  name: 'PostView',
  props: { redditId: String, postId: String },
  components: { Post },
  data() {
    return { postService, post: null }
  },
  created() { this.fetchPost() },
  methods: {
    fetchPost() {
      this.postService
        .get(this.redditId, this.postId)
        .then(post => this.post = post)
    }
  }
}
</script>