<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Update {{ name }}'s metadata
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close" />
        </div>

        <form class="modal-body" @submit.prevent="">
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
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
          <button type="button" class="btn btn-primary" @click="update">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { redditService } from "@/services/redditService.js";

export default {
  name: "MetadataDialog",
  data() {
    return {
      name: "",
      text: "",
    };
  },
  methods: {
    async update() {
      const redditId = this.$route.params.redditId;
      await redditService.update(redditId, this.text);

      this.$router.go({ name: "reddit", params: { redditId } });
      this.$refs.dismiss.click();
    },
  },
};
</script>

<style scoped lang="scss">
</style>
