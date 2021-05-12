<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top bg-dark">
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
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'home' }">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link">Login</a>
          </li>
        </ul>

        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Reddit name"
            aria-label="Search"
          />
          <button class="btn btn-primary" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Toolbar",
  props: {},
};
</script>

<style scoped>
</style>
