<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
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
export default {
  name: 'LoginDialog',
  methods: {
    login() {
      this.$refs.dismiss.click()
    }
  }
}
</script>

<style scoped lang="scss">
</style>