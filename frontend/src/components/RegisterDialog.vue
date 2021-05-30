<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registration</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form @submit.prevent="" class="modal-body">
          <div class="mb-3">
            <label for="usernameRegister" class="form-label">Username</label>
            <input v-model="username" type="username" class="form-control" id="usernameRegister">
          </div>
          <div class="mb-3">
            <label for="emailRegister" class="form-label">Email</label>
            <input v-model="email" type="email" class="form-control" id="emailRegister">
          </div>
          <div class="mb-3">
            <label for="passwordRegister" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="passwordRegister">
          </div>
        </form>

        <div class="modal-footer">
          <button ref="dismiss" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="register">
            Register
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginService } from '@/services/loginService.js'

export default {
  name: 'RegisterDialog',
  data() {
    return {
      username: '',
      password: '',
      email: '',
    }
  },
  methods: {
    register() {
      loginService.register(this.username, this.password, this.email)
      this.$refs.dismiss.click()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
