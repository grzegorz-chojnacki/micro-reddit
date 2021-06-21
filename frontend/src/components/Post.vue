<template>
  <component
    :is="component"
    :post="post"
    :mod-view="modView"
    :is-authenticated="isAuthenticated"
    @delete="onDelete"
    @vote="onVote" />

  <section v-if="withComments" id="comments">
    <div v-if="isAuthenticated" class="mb-3">
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
      :comment="comment"
      :mod-view="isMod"
      :admin-view="isAdmin"
      @ban="banUser"
      @delete="deleteComment" />
  </section>
</template>

<script>
import Comment from "@/components/Comment.vue";
import PostCard from "@/components/PostCard.vue";
import { postService } from "@/services/postService.js";
import { userService } from "@/services/userService.js";
import { io } from "socket.io-client";
import { getYoutubeVideoId, baseURL } from "@/common.js";

const urlMapper = url => url.match(/^http.*/) ? url : `${baseURL}/s/${url}`;

export default {
  name: "Post",
  components: { Comment },
  props: {
    post: { type: Object, required: true },
    withComments: { type: Boolean, default: false },
    component: { type: Object, default: PostCard },
  },
  emits: ["delete", "ban", "vote"],
  data() {
    return {
      imageUrl: this.post.image ? urlMapper(this.post.image) : "",
      score: this.post.score,
      voted: this.post.voted,
      subscription: null,
      textarea: "",
      comments: [],
      socket: null,
      isAuthenticated: false,
      modView: userService.isMod(this.post.reddit.name),
    };
  },
  watch: {
    post() {
      this.score = this.post.score;
      this.voted = this.post.voted;
      this.modView = userService.isMod(this.post.reddit.name);
    }
  },
  created() {
    this.subscription = userService.user.subscribe(async user => {
      this.isAuthenticated = user !== null;

      this.isMod = userService.isMod(this.redditName);
      this.isAdmin = user?.admin || false;

      this.socket && this.socket.disconnect();
      this.initializeSocket();
    });
  },
  unmounted() {
    this.cleanup();
  },
  methods: {
    embedYoutube(url) {
      return `https://www.youtube.com/embed/${getYoutubeVideoId(url)}`;
    },
    async onVote(state) {
      const { score } = await postService.vote(this.post.reddit.name, this.post.id, state);
      this.$emit("vote", { score, state });
    },
    async onDelete() {
      await postService.delete(this.post.reddit.name, this.post.id);
      this.$emit("delete", this.post.id);
    },
    saveComment() {
      this.socket.emit("comment", this.textarea);
      this.textarea = "";
    },
    deleteComment(id) {
      this.socket.emit("deleteComment", id);
    },
    banUser(user) {
      this.socket.emit("banUser", {
        redditName: this.post.reddit.name,
        postId: this.post.id,
        userId: user.id
      });
    },
    initializeSocket() {
      this.socket = io.connect(`${baseURL}`, { withCredentials: true });

      this.socket.on("connect", () => {
        this.socket.emit("post", this.post.id);

        if (this.withComments) {
          this.socket.emit("comments");
        }
      });

      if (this.withComments) {
        this.socket.on("comments", comments => (this.comments = comments));
        this.socket.on("comment", comment => (this.comments = [comment, ...this.comments]));
        this.socket.on("deleteComment", id => (this.comments = this.comments.filter(comment => comment.id !== id)));
      }

      this.socket.on("banUser", userId => {
        if (userService.user.value.id === userId) {
          this.cleanup();
          this.$router.push({ name: "main" });
          window.location.reload();
        } else if (userId === this.post.user.id) {
          this.$emit("ban", this.post.id);
        } else {
          this.comments = this.comments.filter(comment => comment.user.id !== userId);
        }
      });

      this.socket.on("deletePost", () => this.$emit("delete", this.post.id));
    },
    cleanup() {
      this.subscription && this.subscription.unsubscribe();
      this.socket && this.socket.disconnect();
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/variables";

$maxHeight: 500px;

section {
  margin: 1em 0;
}

.img-container {
  overflow: hidden;
  max-height: $maxHeight;

  img {
    box-shadow: 0 0 1em black;
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}

.post-author { opacity: $hazy }

.yt-player {
  width: 100%;
  height: $maxHeight;
}
</style>