<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Update {{ reddit.name }}'s metadata
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close" />
        </div>

        <form class="modal-body" @submit.prevent="">
          <div class="mb-3">
            <label for="descriptionMetadata" class="form-label">Description</label>
            <textarea
              id="descriptionMetadata"
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
  props: {
    reddit: {
      type: Object,
      default: () => ({ id: null, name: "", text: ""})
    }
  },
  data() {
    return {
      name: "",
      text: "",
    };
  },
  watch: {
    reddit() {
      this.text = this.reddit?.text || "";
    }
  },
  methods: {
    async update() {
      this.$refs.dismiss.click();
      await redditService.update({
        ...this.reddit,
        text: this.text
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
