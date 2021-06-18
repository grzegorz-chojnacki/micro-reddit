<template>
  <main v-if="post">
    <Post :post="post" />
    <section id="comments">
      <Comment
        v-for="comment of comments"
        :key="comment.id"
        class="my-2"
        :comment="comment" />
    </section>
  </main>
  <div v-else>
    <LoadingIndicator />
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import Comment from "@/components/Comment.vue";
import { postService } from "@/services/postService";
import { userService } from "@/services/userService";
import { baseURL } from "@/common";
import { io } from "socket.io-client";

export default {
  name: "PostView",
  components: { Post, Comment, LoadingIndicator },
  props: {
    redditName: { type: String, required: true },
    postId: { type: String, required: true },
  },
  data() {
    return {
      comments: [],
      socket: null,
      post: null,
      isAuthenticated: false
    };
  },
  created() {
    userService.isAuthenticated.subscribe(status => this.isAuthenticated = status);
  },
  mounted() {
    this.fetchPost();
    this.initializeSocket();
  },
  unmounted() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    fetchPost() {
      postService.get(this.redditName, this.postId).then(post => (this.post = post));
    },

    initializeSocket() {
      this.socket = io.connect(`${baseURL}`, { withCredentials: true });

      this.socket.on("connect", () => {
        this.socket.emit("room", this.postId);
      });

      this.socket.on("comments", (comments) => {
        this.comments = comments;
      });
    },
  },
};
</script>