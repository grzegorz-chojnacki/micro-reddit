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
          :class="invalidControlClass(email && !testEmail(email))"
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
      </div>
      <div class="mb-3">
        <label for="passwordRetypeRegister" class="form-label">Confirm password</label>
        <input
          id="passwordRetypeRegister"
          ref="passwordRetype"
          v-model="passwordRetype"
          type="password"
          :class="invalidControlClass(password !== passwordRetype)"
          autocomplete="nope">
        <div class="invalid-feedback">
          Passwords doesn't match
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="register">
        Register
      </button>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { testEmail, markForm, invalidControlClass } from "@/common.js";
import { markRaw } from "vue";

export default markRaw({
  name: "RedditDialog",
  emits: ["close"],
  data() {
    return {
      invalidControlClass,
      testEmail,
      username: "",
      password: "",
      passwordRetype: "",
      email: "",
    };
  },
  computed: {
    isInvalid() {
      return !(this.username
        && this.password
        && this.password === this.passwordRetype
        && this.testEmail(this.email));
    },
    retypePasswordClass() {
      return "form-control " +
        (this.password !== this.passwordRetype ? "is-invalid" : "");
    }
  },
  methods: {
    async register() {
      const errors = await userService.register(this.username, this.password, this.email);
      if (markForm(this.$refs, errors)) {
        this.username = "";
        this.password = "";
        this.passwordRetype = "";
        this.email = "";
        this.$refs.dismiss.click();
      }
    },
  }
});
</script>
