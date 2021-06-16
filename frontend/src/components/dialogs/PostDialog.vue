<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Create post
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="namePost" class="form-label">Title</label>
        <input
          id="namePost"
          v-model="title"
          type="text"
          class="form-control">
      </div>

      <div class="mb-3">
        <label for="video" class="form-label">Youtube URL</label>
        <input
          id="video"
          v-model="video"
          type="text"
          class="form-control">
      </div>

      <div class="mb-3">
        <label for="content" class="form-label">Text content</label>
        <textarea
          id="content"
          v-model="content"
          class="form-control"
          rows="3" />
      </div>
    </form>

    <div class="modal-footer">
      <button
        ref="dismiss"
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal">
        Close
      </button>
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="create">
        Create
      </button>
    </div>
  </div>
</template>

<script>
import { postService } from "@/services/postService.js";
import { getYoutubeVideoId, testYoutubeVideoId } from "@/common.js";
import { markRaw } from "vue";

export default markRaw({
  name: "PostDialog",
  emits: ["close"],
  props: { data: { type: Object, default: () => ({}) }},
  data() {
    return {
      title: "",
      content: "",
      video: "",
    };
  },
  computed: {
    isInvalid() {
      return !this.title;
    }
  },
  methods: {
    async create() {
      try {
        const id = getYoutubeVideoId(this.video);
        await testYoutubeVideoId(id);
      } catch (e) {
        console.error(e);
      }

      const post = {
        title: this.title,
        content: this.content,
        video: this.video,
        image: "",
      };

      const postId = await postService.add(this.data.name, post);

      this.$refs.dismiss.click();
      this.$router.push({
        name: "post",
        params: { redditName: this.data.name, postId }
      });
    },
  },
});
</script>
