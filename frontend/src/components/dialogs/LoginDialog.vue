<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Login
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="usernameLogin" class="form-label">Username</label>
        <input
          id="usernameLogin"
          v-model="username"
          type="text"
          class="form-control"
          autocomplete="username">
      </div>
      <div class="mb-3">
        <label for="passwordLogin" class="form-label">Password</label>
        <input
          id="passwordLogin"
          v-model="password"
          type="password"
          class="form-control"
          autocomplete="current-password">
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="login">
        Login
      </button>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { markRaw } from "vue";

export default markRaw({
  name: "LoginDialog",
  emits: ["close"],
  data() {
    return {
      username: "flutherhole",
      password: "flutherhole",
    };
  },
  computed: {
    isInvalid() {
      return !(this.username && this.password);
    }
  },
  methods: {
    login() {
      userService.login(this.username, this.password);
      this.$refs.dismiss.click();
    },
  },
});
</script>
