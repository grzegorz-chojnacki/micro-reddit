<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form @submit.prevent="" class="modal-body">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input v-model="username" type="username" class="form-control" id="username">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="password">
          </div>
        </form>

        <div class="modal-footer">
          <button ref="dismiss" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="login">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginService } from '@/services/loginService.js'

export default {
  name: 'LoginDialog',
  data() {
    return {
      username: 'flutherhole',
      password: 'flutherhole',
    }
  },
  methods: {
    login() {
      loginService.login(this.username, this.password)
      this.$refs.dismiss.click()
    }
  }
}
</script>

<style scoped lang="scss">
</style>