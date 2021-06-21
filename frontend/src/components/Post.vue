<template>
  <section class="card">
    <header class="card-header">
      <div class="d-flex justify-content-between">
        <h5 class="card-title">
          <router-link
            class="text-reset"
            :to="{
              name: 'post',
              params: { redditName: post.reddit.name, postId: post.id },
            }">
            {{ post.title }}
          </router-link>
        </h5>

        <button v-if="modView" class="btn btn-sm" @click="deletePost">
          <span class="material-icons">block</span>
        </button>
      </div>

      <h6 class="card-subtitle">
        <span class="post-author">
          Posted by <strong>{{ post.user?.username }}</strong> at
        </span>
        <router-link
          class="text-reset"
          :to="{ name: 'reddit', params: { redditName: post.reddit.name } }">
          {{ post.reddit.name }}
        </router-link>
      </h6>
    </header>

    <div class="card-body">
      <!-- <iframe
        v-if="post.video"
        :src="embedYoutube(post.video)"
        class="yt-player"
        type="text/html"
        frameborder="0" /> -->

      <div v-if="post.image" class="img-container rounded-2 bg-dark mb-3">
        <img :src="imageUrl" :alt="post.title">
      </div>

      <p v-if="post.link" class="card-text">
        <a :href="post.link">
          {{ post.link }}
        </a>
      </p>

      <p v-if="post.content" class="card-text">
        {{ post.content }}
      </p>
    </div>

    <footer class="card-footer">
      <VoteGroup :score="score" :voted="voted" @vote="onVote" />

      <router-link
        class="btn mx-3"
        :to="`/r/${post.reddit.name}/p/${post.id}#comments`">
        Comments
      </router-link>
    </footer>
  </section>

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
import VoteGroup from "@/components/VoteGroup.vue";
import Comment from "@/components/Comment.vue";
import { postService } from "@/services/postService.js";
import { userService } from "@/services/userService.js";
import { io } from "socket.io-client";
import { getYoutubeVideoId, baseURL } from "@/common.js";

const urlMapper = url => url.match(/^http.*/) ? url : `${baseURL}/s/${url}`;

export default {
  name: "Post",
  components: { VoteGroup, Comment },
  props: {
    post: { type: Object, required: true },
    withComments: { type: Boolean, default: false }
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
      this.score = score;
      this.voted = state;
      this.$emit("vote", { score });
    },
    async deletePost() {
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