<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Change username
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="username" class="form-label">New username</label>
        <input
          id="username"
          ref="username"
          v-model="username"
          type="text"
          class="form-control"
          autocomplete="username">
        <div class="invalid-feedback">
          Username already taken
        </div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          ref="password"
          v-model="password"
          type="password"
          class="form-control"
          autocomplete="current-password">
        <div class="invalid-feedback">
          Password is invalid
        </div>
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="setUsername">
        Change
      </button>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { markForm } from "@/common.js";
import { markRaw } from "vue";

export default markRaw({
  name: "UsernameDialog",
  emits: ["close"],
  props: { data: { type: Object, default: () => {}}},
  data() {
    return {
      username: "",
      password: "",
    };
  },
  watch: {
    data() {
      this.username = this.data?.username || "";
    }
  },
  computed: {
    isInvalid() {
      return !(this.username && this.password);
    }
  },
  methods: {
    async setUsername() {
      const errors = await userService.patch(this.password, { username: this.username });
      if (markForm(this.$refs, errors)) {
        this.username = "";
        this.password = "";
        this.$refs.dismiss.click();
      }
    },
  },
});
</script>
