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
          v-model="passwordOld"
          type="text"
          class="form-control"
          autocomplete="passwordOld">
      </div>

      <div class="mb-3">
        <label for="passwordNew" class="form-label">New password</label>
        <input
          id="passwordNew"
          v-model="passwordNew"
          type="text"
          class="form-control"
          autocomplete="passwordNew">
      </div>

      <div class="mb-3">
        <label for="passwordRetype" class="form-label">Retype password</label>
        <input
          id="passwordRetype"
          v-model="passwordRetype"
          type="passwordRetype"
          class="form-control"
          autocomplete="current-passwordRetype">
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
import { markRaw } from "vue";

export default markRaw({
  name: "PasswordDialog",
  emits: ["close"],
  data() {
    return {
      passwordOld: "",
      passwordNew: "",
      passwordRetype: "",
    };
  },
  computed: {
    isInvalid() {
      return !(this.passwordNew && this.passwordRetype);
    }
  },
  methods: {
    setPassword() {
      userService.setPassword(this.passwordOld, this.passwordNew);
      this.$refs.dismiss.click();
    },
  },
});
</script>
