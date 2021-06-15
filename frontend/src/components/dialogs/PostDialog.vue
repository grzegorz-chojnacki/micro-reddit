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
          v-model="name"
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
        <label for="text" class="form-label">Text content</label>
        <textarea
          id="text"
          v-model="text"
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
      name: "",
      text: "",
      video: "",
    };
  },
  computed: {
    isInvalid() {
      return !this.name;
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
        name: this.name,
        text: this.text,
        video: this.video,
        image: "",
      };

      const postId = await postService.add(this.data.redditId, post);

      this.$refs.dismiss.click();
      this.$router.push({
        name: "post",
        params: { redditId: this.data.redditId, postId }
      });
    },
  },
});
</script>
