<template>
  <main v-if="post !== null">
    <Post :post="post"/>
    <section id="comments">
      <Comment class="my-2"
        v-for="comment of comments" :comment="comment" :key="comment.id"/>
    </section>
  </main>
  <div v-else><LoadingIndicator/></div>
</template>

<script>
import Post from '@/components/Post.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import Comment from '@/components/Comment.vue'

import { postService } from '@/services/postService'
import { baseURL } from '@/common'
import { io } from "socket.io-client";

export default {
  name: 'PostView',
  props: { redditId: String, postId: String },
  components: { Post, Comment, LoadingIndicator },
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
      this.socket = io.connect(`${baseURL}`)

      this.socket.on('connect', () => {
        this.socket.emit("room", this.postId);
      })

      this.socket.on('comments', comments => {
        this.comments = comments;
      })
    }
  }
}
</script>