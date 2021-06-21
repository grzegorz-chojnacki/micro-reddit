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
        <label for="title" class="form-label">Title</label>
        <input
          id="title"
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
          :class="invalidControlClass(invalidYoutubeLink)">
        <div class="invalid-feedback">
          This YouTube link seems to be invalid
        </div>
      </div>

      <div class="mb-3">
        <label for="link" class="form-label">Link</label>
        <input
          id="link"
          v-model="link"
          type="text"
          :class="invalidControlClass(link && !isWebLink(link))">
      </div>

      <div class="mb-3">
        <label for="content" class="form-label">Text content</label>
        <textarea
          id="content"
          v-model="content"
          class="form-control"
          rows="3" />
      </div>

      <div>
        <input
          ref="imageInput"
          type="file"
          class="form-control-file"
          accept="image/*"
          @change="loadImage">
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
import { getYoutubeVideoId, testYoutubeVideoId, invalidControlClass, isWebLink } from "@/common.js";
import { markRaw } from "vue";

export default markRaw({
  name: "PostDialog",
  emits: ["close"],
  props: { data: { type: Object, default: () => ({}) }},
  data() {
    return {
      invalidControlClass, isWebLink,
      invalidYoutubeLink: false,
      title: "",
      content: "",
      video: "",
      link: "",
      image: null
    };
  },
  watch: {
    video() {
      this.invalidYoutubeLink = false;
    }
  },
  computed: {
    isInvalid() {
      return !this.title;
    }
  },
  methods: {
    async create() {
      if (this.video) {
        try {
          const id = getYoutubeVideoId(this.video);
          await testYoutubeVideoId(id);
        } catch (e) {
          this.invalidYoutubeLink = true;
          return;
        }
      }

      const post = {
        title: this.title,
        content: this.content,
        video: this.video,
        link: this.link,
        image: this.image,
      };

      const postId = await postService.add(this.data.name, post);

      this.title = "";
      this.content = "";
      this.video = "";
      this.link = "";
      this.image = this.$refs.imageInput.value = null;

      this.$refs.dismiss.click();
      this.$router.push({
        name: "post",
        params: { redditName: this.data.name, postId }
      });
    },
    loadImage({ target: { files } }) {
      if (files.length === 1) {
        const reader = new FileReader();
        reader.onload = ({ target: { result }}) => (this.image = result);

        reader.readAsDataURL(files[0]);
      }
    }
  },
});
</script>
