<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Registration
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="usernameRegister" class="form-label">Username</label>
        <input
          id="usernameRegister"
          ref="username"
          v-model="username"
          type="username"
          class="form-control">
        <div class="invalid-feedback">
          This username is already taken.
        </div>
      </div>
      <div class="mb-3">
        <label for="emailRegister" class="form-label">Email</label>
        <input
          id="emailRegister"
          ref="email"
          v-model="email"
          type="email"
          class="form-control"
          autocomplete="email">
        <div class="invalid-feedback">
          Email is not valid
        </div>
      </div>
      <div class="mb-3">
        <label for="passwordRegister" class="form-label">Password</label>
        <input
          id="passwordRegister"
          ref="password"
          v-model="password"
          type="password"
          class="form-control"
          autocomplete="new-password">
        <div class="invalid-feedback">
          Passwords didn't match
        </div>
      </div>
      <div class="mb-3">
        <label for="passwordRetypeRegister" class="form-label">Confirm password</label>
        <input
          id="passwordRetypeRegister"
          ref="passwordRetype"
          v-model="passwordRetype"
          type="password"
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="close">
        Register
      </button>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { markRaw } from "vue";

export default markRaw({
  name: "RedditDialog",
  emits: ["close"],
  data() {
    return {
      username: "",
      password: "",
      passwordRetype: "",
      email: "",
    };
  },
  computed: {
    isInvalid() {
      return !(this.username && this.password && this.passwordRetype && this.email);
    }
  },
  methods: {
    close() {
      this.$emit("close", 1);
    },

    async register() {
      for (const input in this.$refs) {
        this.$refs[input].classList.remove("is-invalid");
      }

      if (this.password !== this.passwordRetype) {
        this.$refs.password.classList.add("is-invalid");
        this.password = this.passwordRetype = "";
        return;
      }

      const errors = await userService.register(this.username, this.password, this.email);
      if (errors) {
        for (const input of errors) {
          this.$refs[input].classList.add("is-invalid");
        }
      } else {
        for (const input in this.$refs) {
          this.$refs[input].value = "";
        }
        this.$refs.dismiss.click();
      }
    },
  }
});
</script>
