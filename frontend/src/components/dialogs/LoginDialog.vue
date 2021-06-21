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
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          ref="username"
          v-model="username"
          type="text"
          class="form-control"
          autocomplete="username">
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
          Username or password is invalid
        </div>
      </div>
      <span v-if="reminded">{{ reminded }}!</span>
    </form>

    <div class="modal-footer">
      <button
        class="btn btn-small text-primary"
        :disabled="!username"
        @click="remindPassword">
        Remind my password
      </button>
      <div class="d-flex gap-2">
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
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { markForm, invalidControlClass } from "@/common.js";
import { markRaw } from "vue";

export default markRaw({
  name: "LoginDialog",
  emits: ["close"],
  data() {
    return {
      invalidControlClass,
      username: "",
      password: "",
      reminded: ""
    };
  },
  computed: {
    isInvalid() {
      return !(this.username && this.password);
    }
  },
  methods: {
    async login() {
      try {
        await userService.login(this.username, this.password);
        markForm(this.$refs, []);
        this.username = "",
        this.password = "",
        this.reminded = "";
        this.$refs.dismiss.click();
      } catch (e) {
        markForm(this.$refs, ["password", "username"]);
      }
    },
    async remindPassword() {
      try {
        await userService.remindPassword(this.username);
        this.reminded = `Email sent to inbox of ${this.username}`;
      } catch (e) {
        this.reminded = `User ${this.username} doesn't exist`;
      }
    }
  },
});
</script>
