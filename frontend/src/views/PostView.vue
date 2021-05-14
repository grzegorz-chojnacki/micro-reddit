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
import { api } from '@/common'
import { io } from "socket.io-client";

export default {
  name: 'PostView',
  props: { redditId: String, postId: String },
  components: { Post },
  data() {
    return {
      postService,
      comments: [],
      socket: null,
      post: null
    }
  },
  mounted() {
    this.fetchPost()
    this.initializeSocket()
  },
  unmounted() {
    if (this.socket) { this.socket.disconnect() }
  },
  methods: {
    fetchPost() {
      this.postService
        .get(this.redditId, this.postId)
        .then(post => this.post = post)
    },

    initializeSocket() {
      this.socket = io.connect(`${api}`)

      this.socket.on('connect', () => {
        this.socket.emit("room", '1222');
      })

      this.socket.on('message', msg => {
        console.log(msg)
      })
    }
  }
}
</script>