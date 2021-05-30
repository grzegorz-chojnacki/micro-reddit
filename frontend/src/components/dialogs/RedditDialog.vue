<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create reddit</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form @submit.prevent="" class="modal-body">
          <div class="mb-3">
            <label for="nameReddit" class="form-label">Name</label>
            <input v-model="name" type="text" class="form-control" id="nameReddit">
          </div>

          <div class="mb-3">
            <label for="emailRegister" class="form-label">Description</label>
            <textarea v-model="text" class="form-control" id="emailRegister" rows="3"/>
          </div>
        </form>

        <div class="modal-footer">
          <button ref="dismiss" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="create">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { userService } from '@/services/userService.js'

export default {
  name: 'RegisterDialog',
  data() {
    return {
      name: '',
      text: '',
    }
  },
  methods: {
    create() {
      // userService.create(this.name, this.password, this.text)
      this.$refs.dismiss.click()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
