<template>
  <div>
    <div class="modal-header">
      <h5 class="modal-title">
        Change email
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close" />
    </div>

    <form class="modal-body" @submit.prevent="">
      <div class="mb-3">
        <label for="email" class="form-label">New email address</label>
        <input
          id="email"
          ref="email"
          v-model="email"
          type="text"
          :class="invalidControlClass(email && !testEmail(email))"
          autocomplete="email">
        <div class="invalid-feedback">
          Email is not valid
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
      <button type="button" class="btn btn-primary" :disabled="isInvalid" @click="setEmail">
        Change
      </button>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/userService.js";
import { testEmail, markForm, invalidControlClass } from "@/common.js";

import { markRaw } from "vue";

export default markRaw({
  name: "EmailDialog",
  emits: ["close"],
  props: { data: { type: Object, default: () => {}}},
  data() {
    return {
      invalidControlClass, testEmail,
      email: "",
      password: "",
    };
  },
  watch: {
    data() {
      this.email = this.data?.email || "";
    }
  },
  computed: {
    isInvalid() {
      return !(testEmail(this.email) && this.password);
    }
  },
  methods: {
    async setEmail() {
      const errors = await userService.patch(this.password, { email: this.email });
      if (markForm(this.$refs, errors)) {
        this.email = "";
        this.password = "";
        this.$refs.dismiss.click();
      }
    },
  },
});
</script>
