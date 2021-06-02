<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
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
              v-model="name"
              type="text"
              class="form-control">
          </div>

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
          <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="create">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { redditService } from "@/services/redditService.js";

export default {
  name: "RegisterDialog",
  data() {
    return {
      name: "",
      text: "",
    };
  },
  computed: {
    isInvalid() {
      return !this.name;
    }
  },
  methods: {
    async create() {
      const redditId = await redditService.add(this.name, this.text);
      this.$refs.dismiss.click();
      this.$router.go({ name: "reddit", params: { redditId } });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
