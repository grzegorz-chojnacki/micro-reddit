<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Change password
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="passwordOld" class="form-label">Current password</label>
        <input
          id="passwordOld"
          ref="password"
          v-model="passwordOld"
          type="password"
          class="form-control"
          autocomplete="current-password">
        <div class="invalid-feedback">
          Password is not valid
        </div>
      </div>

      <div class="mb-3">
        <label for="passwordNew" class="form-label">New password</label>
        <input
          id="passwordNew"
          ref="passwordNew"
          v-model="passwordNew"
          type="password"
          class="form-control"
          autocomplete="new-password">
      </div>

      <div class="mb-3">
        <label for="passwordRetype" class="form-label">Retype password</label>
        <input
          id="passwordRetype"
          ref="passwordRetype"
          v-model="passwordRetype"
          type="password"
          :class="invalidControlClass(passwordRetype && passwordNew !== passwordRetype)"
          autocomplete="new-password">
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="setPassword">
        Change
      </button>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { markForm, invalidControlClass } from "@/common.js";
import { markRaw } from "vue";

export default markRaw({
  name: "PasswordDialog",
  emits: ["close"],
  data() {
    return {
      invalidControlClass,
      passwordOld: "",
      passwordNew: "",
      passwordRetype: "",
    };
  },
  computed: {
    isInvalid() {
      return !(this.passwordOld && this.passwordNew && this.passwordNew === this.passwordRetype);
    }
  },
  methods: {
    async setPassword() {
      const errors = await userService.patch(this.passwordOld, { password: this.passwordNew });
      if (markForm(this.$refs, errors)) {
        this.passwordOld = "";
        this.passwordNew = "";
        this.passwordRetype = "";
        this.$refs.dismiss.click();
      }
    },
  },
});
</script>
