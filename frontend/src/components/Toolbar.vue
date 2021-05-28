<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'main' }">
        Reddit
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNav" aria-controls="navbarNav"
        aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-sm-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'reddit-list' }">
              Explore
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <span class="nav-link" data-bs-toggle="modal" data-bs-target="#registerDialog">
              Register
            </span>
          </li>
          <li class="nav-item">
            <span v-if="!isAuthenticated" class="nav-link" data-bs-toggle="modal" data-bs-target="#loginDialog">
              Login
            </span>
            <span v-else class="nav-link" @click="logout">Logout</span>
          </li>
        </ul>

        <form class="d-flex" @submit.prevent="onSubmit">
          <input class="form-control me-2" type="search" v-model="search"
            placeholder="Reddit name" aria-label="Search"/>
          <button class="btn btn-primary" :disabled="search === ''"
            type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
  <LoginDialog id="loginDialog"/>
  <RegisterDialog id="registerDialog"/>
</template>

<script>
import LoginDialog from '@/components/LoginDialog.vue'
import RegisterDialog from '@/components/RegisterDialog.vue'
import { loginService } from '@/services/loginService'

export default {
  components: { LoginDialog, RegisterDialog },
  name: "Toolbar",
  data(){ return { search: '', isAuthenticated: false }},
  created() {
    loginService.isAuthenticated.subscribe(status => {
      this.isAuthenticated = status;
    });
  },
  methods: {
    onSubmit() {
      this.$router.push({ name: 'reddit-list', query: { q: this.search }})
      this.search = ''
    },
    logout() { loginService.logout(); }
  }
};
</script>

<style scoped>
span.nav-link { cursor: pointer }
</style>
