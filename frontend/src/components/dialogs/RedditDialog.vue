<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Create reddit
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="nameReddit" class="form-label">Name</label>
        <input
          id="nameReddit"
          ref="name"
          v-model="name"
          autocomplete="off"
          type="text"
          class="form-control">
        <div class="invalid-feedback">
          This reddit already exists
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Generated URL</label>
        <input
          id="redditUrl"
          :value="`r/${urlified}`"
          disabled
          type="text"
          class="form-control">
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="description"
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
import { redditService } from "@/services/redditService.js";
import { markRaw } from "vue";
import { urlify, markForm } from "@/common.js";

export default markRaw({
  name: "RedditDialog",
  emits: ["close"],
  data() {
    return {
      name: "",
      description: "",
    };
  },
  computed: {
    isInvalid() {
      return !this.name;
    },
    urlified() {
      return urlify(this.name);
    }
  },
  methods: {
    async create() {
      const { name, errors } = await redditService.add(this.urlified, this.description);
      if (markForm(this.$refs, errors)) {
        this.name = "",
        this.description = "",
        this.$refs.dismiss.click();
        this.$router.push({ name: "reddit", params: { redditName: name } });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
#redditUrl {
  font-family: monospace;
}
</style>
