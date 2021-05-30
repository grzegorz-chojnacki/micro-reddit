<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'main' }">
        Reddit
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-sm-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'reddit-list' }">
              Explore
            </router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <span
              class="nav-link"
              data-bs-toggle="modal"
              data-bs-target="#registerDialog">
              Register
            </span>
          </li>
          <li class="nav-item">
            <span
              v-if="!isAuthenticated"
              class="nav-link"
              data-bs-toggle="modal"
              data-bs-target="#loginDialog">
              Login
            </span>
            <span v-else class="nav-link" @click="logout">Logout</span>
          </li>
          <li class="nav-item">
            <span
              class="nav-link material-icons add"
              data-bs-toggle="modal"
              data-bs-target="#redditDialog">
              add
            </span>
          </li>
        </ul>

        <span v-if="isAuthenticated" id="username" class="navbar-text">
          {{ user.username }}
        </span>

        <form class="d-flex" @submit.prevent="onSubmit">
          <input
            v-model="search"
            class="form-control me-2"
            type="search"
            placeholder="Reddit name"
            aria-label="Search">
          <button
            class="btn btn-primary"
            :disabled="search === ''"
            type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  </nav>

  <LoginDialog id="loginDialog" />
  <RegisterDialog id="registerDialog" />
  <RedditDialog id="redditDialog" />
</template>

<script>
import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import RegisterDialog from "@/components/dialogs/RegisterDialog.vue";
import RedditDialog from "@/components/dialogs/RedditDialog.vue";
import { userService } from "@/services/userService";

export default {
  name: "Toolbar",
  components: { LoginDialog, RegisterDialog, RedditDialog },
  data() {
    return { search: "", isAuthenticated: false, user: {} };
  },
  created() {
    userService.isAuthenticated.subscribe((status) => {
      this.isAuthenticated = status;
    });
    userService.user.subscribe((user) => {
      this.user = user;
    });
  },
  methods: {
    onSubmit() {
      this.$router.push({ name: "reddit-list", query: { q: this.search } });
      this.search = "";
    },
    logout() {
      userService.logout();
    },
  },
};
</script>

<style scoped>
span.nav-link {
  cursor: pointer;
}

#username {
  margin-right: 1em;
}
</style>
