<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Update {{ data?.name }}'s metadata
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
      <button type="button" class="btn btn-primary" @click="update">
        Update
      </button>
    </div>
  </div>
</template>

<script>
import { redditService } from "@/services/redditService.js";
import { markRaw } from "vue";

export default markRaw({
  name: "MetadataDialog",
  emits: ["close"],
  props: {
    data: {
      type: Object,
      default: () => ({ id: null, name: "", description: "" })
    }
  },
  data() {
    return {
      name: "",
      description: "",
    };
  },
  watch: {
    data() {
      this.description = this.data?.description || "";
    }
  },
  methods: {
    async update() {
      await redditService.update({ ...this.data, description: this.description });
      this.$emit("close");
      this.$refs.dismiss.click();
    },
  },
});
</script>
