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
            <span class="nav-link" @click="register">
              Register
            </span>
          </li>
          <li class="nav-item">
            <span
              v-if="!isAuthenticated" class="nav-link" @click="login">
              Login
            </span>
            <span v-else class="nav-link" @click="logout">Logout</span>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <span class="nav-link material-icons add" @click="addReddit">
              add
            </span>
          </li>
        </ul>

        <form class="d-flex" @submit.prevent="onSubmit">
          <ul v-if="isAuthenticated" class="navbar-nav me-auto mb-2 mb-sm-0">
            <li class="nav-item">
              <router-link id="username" class="nav-link" :to="{ name: 'account' }">
                {{ (user.username.length > 16) ? "Account" : user.username }}
              </router-link>
            </li>
          </ul>

          <input
            v-model="search"
            class="form-control me-2"
            type="search"
            placeholder="Reddit name"
            aria-label="Search">
          <button
            class="btn btn-dark text-light"
            type="submit"
            :disabled="search === ''">
            <span class="material-icons search">search</span>
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import LoginDialog from "@/components/dialogs/LoginDialog.vue";
import RegisterDialog from "@/components/dialogs/RegisterDialog.vue";
import RedditDialog from "@/components/dialogs/RedditDialog.vue";
import { userService } from "@/services/userService";
import { dialogService } from "@/services/dialogService";

export default {
  name: "Toolbar",
  data() {
    return {
      search: "",
      isAuthenticated: false,
      user: {}
    };
  },
  created() {
    userService.isAuthenticated.subscribe(status => this.isAuthenticated = status);
    userService.user.subscribe(user => this.user = user);
  },
  methods: {
    onSubmit() {
      this.$router.push({ name: "reddit-list", query: { q: this.search } });
      this.search = "";
    },
    login() {
      dialogService.open(LoginDialog);
    },
    register() {
      dialogService.open(RegisterDialog);
    },
    addReddit() {
      dialogService.open(RedditDialog);
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

button.btn {
  display: inline-flex;
  align-items: center;
}
</style>
