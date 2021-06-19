<template>
  <main v-if="post">
    <Post :post="post" @delete="$router.go(-1)" />
    <section id="comments">
      <div>
        <label class="mt-2" for="comment">Add comment</label>
        <textarea
          id="comment"
          v-model="textarea"
          name="comment"
          class="form-control" />
        <button
          class="mt-2 btn btn-outline-secondary btn-sm"
          type="button"
          :disabled="!textarea"
          @click="saveComment">
          Save
        </button>
      </div>

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
      textarea: "",
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
    saveComment() {
      this.socket.emit("comment", this.textarea);
      this.textarea = "";
    },
    fetchPost() {
      postService.get(this.redditName, this.postId).then(post => (this.post = post));
    },
    initializeSocket() {
      this.socket = io.connect(`${baseURL}`, { withCredentials: true });

      this.socket.on("connect", () => {
        this.socket.emit("room", this.postId);
      });

      this.socket.on("comment", comment => {
        this.comments = [comment, ...this.comments];
      });

      this.socket.on("comments", comments => {
        this.comments = comments;
      });
    },
  },
};
</script>