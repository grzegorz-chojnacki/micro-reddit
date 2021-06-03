<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Add a moderator to {{ data?.name }}
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="usernameMod" class="form-label">Username</label>
        <input
          id="usernameMod"
          v-model="username"
          type="text"
          class="form-control"
          autocomplete="nope">
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="add">
        Add
      </button>
    </div>
  </div>
</template>

<script>
import { redditService } from "@/services/redditService.js";
import { markRaw } from "vue";

export default markRaw({
  name: "ModeratorDialog",
  emits: ["close"],
  props: {
    data: {
      type: Object,
      default: () => ({ id: null, name: "", text: ""})
    }
  },
  data() {
    return { username: "" };
  },
  computed: {
    isInvalid() {
      return !this.username;
    }
  },
  methods: {
    add() {
      redditService.addMod(this.data.id , this.username);
      this.$refs.dismiss.click();
    },
  },
});
</script>
